/**
 * Weekly Availability Grid - Slot State Calculator
 *
 * Computes the visual state of each 30-minute time slot in the weekly grid
 * based on availability records and existing appointments.
 */

import { addMinutes, format, isBefore, isWithinInterval, parse, startOfDay } from 'date-fns'

/**
 * Slot state for visual rendering
 */
export type SlotState = 'available' | 'blocked' | 'booked' | 'past'

/**
 * Availability record from database
 */
export interface AvailabilityRecord {
  id: string
  day_of_week: number | null // 1=Monday, 2=Tuesday, ..., 7=Sunday (matches database schema)
  specific_date: string | null // YYYY-MM-DD
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  is_recurring: boolean
  is_blocked: boolean
  block_reason: string | null
}

/**
 * Appointment record (simplified)
 */
export interface AppointmentRecord {
  start_time: string // ISO timestamp
  end_time: string // ISO timestamp
  patient_name?: string
}

/**
 * Time slot for weekly grid
 */
export interface WeeklySlot {
  date: Date // Full date + time for this slot
  startTime: string // HH:mm format (e.g., "09:00")
  endTime: string // HH:mm format (e.g., "09:30")
  duration: number // Slot duration in minutes (30, 45, or 60)
  state: SlotState
  appointment?: AppointmentRecord // If state === 'booked'
  blockReason?: string // If state === 'blocked'
}

/**
 * Default grid display hours for admin interface
 * This defines the visual range of the grid, allowing admins to add availability
 * anywhere within this range. Slots without availability records are marked as "blocked".
 */
const DEFAULT_GRID_HOURS = {
  start: '07:00',
  end: '21:00'
}

/**
 * Convert JavaScript day of week (0=Sunday) to database format (1=Monday, 7=Sunday)
 */
function getNumericDayOfWeek(date: Date): number {
  const day = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
  return day === 0 ? 7 : day // Convert Sunday from 0 to 7
}

/**
 * Calculate the time range to display in the admin grid based on existing availability
 * @param date - The date to check
 * @param availabilityRecords - Existing availability records
 * @returns Start and end time strings in HH:mm format
 */
function calculateGridRange(
  date: Date,
  availabilityRecords: AvailabilityRecord[]
): { start: string; end: string } {
  const dayOfWeek = getNumericDayOfWeek(date)
  const dateStr = format(date, 'yyyy-MM-dd')

  // Find records that apply to this day
  const applicableRecords = availabilityRecords.filter(record => {
    if (record.is_recurring) {
      return record.day_of_week === dayOfWeek
    } else {
      return record.specific_date === dateStr
    }
  })

  // If no records exist, use default grid hours
  if (applicableRecords.length === 0) {
    return DEFAULT_GRID_HOURS
  }

  // Find the earliest start and latest end from available (non-blocked) records
  const availableRecords = applicableRecords.filter(r => !r.is_blocked)

  if (availableRecords.length === 0) {
    return DEFAULT_GRID_HOURS
  }

  const startTimes = availableRecords.map(r => r.start_time.substring(0, 5))
  const endTimes = availableRecords.map(r => r.end_time.substring(0, 5))

  const earliestStart = startTimes.sort()[0]
  const latestEnd = endTimes.sort().reverse()[0]

  return {
    start: earliestStart,
    end: latestEnd
  }
}

/**
 * Generate time slots for a day based on appointment duration
 *
 * @param date - The date to generate slots for
 * @param duration - Appointment duration in minutes (30, 45, or 60)
 * @param availabilityRecords - Availability records to determine grid range (optional)
 * @returns Array of time slots with proper intervals (duration + 15 min buffer)
 *
 * Examples:
 * - 30-min appointments: 9:00, 9:45, 10:30, 11:15... (45-min intervals)
 * - 45-min appointments: 9:00, 10:00, 11:00... (60-min intervals)
 * - 60-min appointments: 9:00, 10:15, 11:30... (75-min intervals)
 *
 * The time range is calculated from availability records or defaults to 7am-9pm if no records exist.
 * This allows admins to add new availability within the displayed range.
 */
export function generateDaySlots(
  date: Date,
  duration: number = 30,
  availabilityRecords: AvailabilityRecord[] = []
): WeeklySlot[] {
  const slots: WeeklySlot[] = []
  const dayStart = startOfDay(date)

  const BUFFER_TIME = 15 // minutes
  const slotInterval = duration + BUFFER_TIME

  // Calculate grid range based on availability or use defaults
  const gridRange = calculateGridRange(date, availabilityRecords)

  let currentTime = parse(gridRange.start, 'HH:mm', dayStart)
  const endTime = parse(gridRange.end, 'HH:mm', dayStart)

  while (isBefore(currentTime, endTime)) {
    const slotEnd = addMinutes(currentTime, duration)

    // Only add slot if the entire appointment fits before end time
    if (isBefore(slotEnd, endTime) || slotEnd.getTime() === endTime.getTime()) {
      slots.push({
        date: currentTime,
        startTime: format(currentTime, 'HH:mm'),
        endTime: format(slotEnd, 'HH:mm'),
        duration,
        state: 'available', // Will be calculated later
      })
    }

    currentTime = addMinutes(currentTime, slotInterval)
  }

  return slots
}

/**
 * Check if a time slot falls within an availability record
 */
function slotMatchesAvailability(
  slotDate: Date,
  slotStartTime: string,
  slotEndTime: string,
  availability: AvailabilityRecord
): boolean {
  // Check if this availability applies to this day
  if (availability.is_recurring) {
    // Recurring: Check day of week (convert JS format to database format)
    const dayOfWeek = getNumericDayOfWeek(slotDate) // 1=Monday, 7=Sunday
    if (availability.day_of_week !== dayOfWeek) {
      return false
    }
  } else {
    // Specific date: Check exact date match
    const dateStr = format(slotDate, 'yyyy-MM-dd')
    if (availability.specific_date !== dateStr) {
      return false
    }
  }

  // Check if slot time falls within availability time range
  // Convert time strings to comparable format (remove seconds)
  const availStart = availability.start_time.substring(0, 5) // "HH:MM"
  const availEnd = availability.end_time.substring(0, 5)

  // Slot matches if:
  // - slot starts at or after availability start
  // - slot ends at or before availability end
  return slotStartTime >= availStart && slotEndTime <= availEnd
}

/**
 * Check if a slot has an existing appointment
 *
 * @param slotDate - Start time of the slot
 * @param slotDuration - Duration of the slot in minutes
 * @param appointments - List of existing appointments
 * @returns The overlapping appointment, if any
 */
function slotHasAppointment(
  slotDate: Date,
  slotDuration: number,
  appointments: AppointmentRecord[]
): AppointmentRecord | undefined {
  const slotStart = slotDate
  const slotEnd = addMinutes(slotDate, slotDuration)

  return appointments.find((apt) => {
    const aptStart = new Date(apt.start_time)
    const aptEnd = new Date(apt.end_time)

    // Appointment overlaps slot if:
    // - appointment starts before slot ends AND
    // - appointment ends after slot starts
    return aptStart < slotEnd && aptEnd > slotStart
  })
}

/**
 * Calculate the state of a single time slot
 *
 * @param slotDate - Start time of the slot
 * @param slotStartTime - Formatted start time (HH:mm)
 * @param slotEndTime - Formatted end time (HH:mm)
 * @param slotDuration - Duration of the slot in minutes
 * @param availabilityRecords - Availability records from database
 * @param appointments - Existing appointments
 */
export function calculateSlotState(
  slotDate: Date,
  slotStartTime: string,
  slotEndTime: string,
  slotDuration: number,
  availabilityRecords: AvailabilityRecord[],
  appointments: AppointmentRecord[]
): { state: SlotState; appointment?: AppointmentRecord; blockReason?: string } {
  const now = new Date()

  // 1. Check if slot is in the past
  if (slotDate < now) {
    return { state: 'past' }
  }

  // 2. Check if slot has an existing appointment
  const appointment = slotHasAppointment(slotDate, slotDuration, appointments)
  if (appointment) {
    return { state: 'booked', appointment }
  }

  // 3. Find matching availability records
  const matchingRecords = availabilityRecords.filter((record) =>
    slotMatchesAvailability(slotDate, slotStartTime, slotEndTime, record)
  )

  // 4. Check if any matching record is blocked
  const blockedRecord = matchingRecords.find((record) => record.is_blocked)
  if (blockedRecord) {
    return {
      state: 'blocked',
      blockReason: blockedRecord.block_reason || 'Blocked'
    }
  }

  // 5. Check if any matching record is available (not blocked)
  const availableRecord = matchingRecords.find((record) => !record.is_blocked)
  if (availableRecord) {
    return { state: 'available' }
  }

  // 6. No availability record found = blocked by default (doctor not available)
  return { state: 'blocked', blockReason: 'No availability' }
}

/**
 * Generate weekly grid data with dynamic slot durations
 *
 * @param weekStart - Monday of the week
 * @param duration - Appointment duration in minutes (30, 45, or 60)
 * @param availabilityRecords - Availability records from database
 * @param appointments - Existing appointments
 * @returns 2D array of slots (days × slots per day)
 *
 * Number of slots per day varies by duration and actual availability ranges.
 * The grid displays times based on existing availability or defaults to 7am-9pm.
 */
export function generateWeeklyGrid(
  weekStart: Date,
  duration: number,
  availabilityRecords: AvailabilityRecord[],
  appointments: AppointmentRecord[]
): WeeklySlot[][] {
  const grid: WeeklySlot[][] = []

  // Generate for Monday-Saturday (6 days, skip Sunday)
  for (let dayOffset = 0; dayOffset < 6; dayOffset++) {
    const currentDate = addMinutes(weekStart, dayOffset * 24 * 60)

    // Generate day slots with dynamic range based on availability
    const daySlots = generateDaySlots(currentDate, duration, availabilityRecords)

    // Calculate state for each slot
    const slotsWithState = daySlots.map((slot) => {
      const { state, appointment, blockReason } = calculateSlotState(
        slot.date,
        slot.startTime,
        slot.endTime,
        slot.duration,
        availabilityRecords,
        appointments
      )

      return {
        ...slot,
        state,
        appointment,
        blockReason,
      }
    })

    grid.push(slotsWithState)
  }

  return grid
}

/**
 * Calculate statistics for the week
 *
 * Uses actual slot durations instead of assuming 30 minutes,
 * providing accurate time calculations for all appointment types.
 */
export function calculateWeeklyStats(grid: WeeklySlot[][]) {
  let availableSlots = 0
  let blockedSlots = 0
  let bookedSlots = 0
  let totalAvailableHours = 0

  grid.forEach((daySlots) => {
    daySlots.forEach((slot) => {
      if (slot.state === 'available') {
        availableSlots++
        totalAvailableHours += slot.duration / 60 // Convert minutes to hours
      } else if (slot.state === 'blocked') {
        blockedSlots++
      } else if (slot.state === 'booked') {
        bookedSlots++
      }
    })
  })

  return {
    availableSlots,
    blockedSlots,
    bookedSlots,
    totalAvailableHours,
  }
}

/**
 * Day names for header (Monday-Saturday)
 */
export const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

/**
 * Short day names for mobile (Mon-Sat)
 */
export const WEEKDAY_SHORT_NAMES = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const
