/**
 * Appointment Availability Utilities
 *
 * Handles business logic for appointment scheduling including:
 * - Available time slot generation
 * - Availability checking
 * - Business hours validation
 */

import { addMinutes, format, isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns'

/**
 * Business configuration for appointment scheduling
 */
/**
 * Appointment scheduling configuration
 * NOTE: Business hours are now sourced from the availability_slots database table
 * This config only contains scheduling parameters
 */
export const APPOINTMENT_CONFIG = {
  // Appointment duration in minutes
  appointmentDuration: 60,

  // Buffer time between appointments (minutes)
  bufferTime: 15,

  // How many days in advance can appointments be booked
  advanceBookingDays: 90,

  // Minimum notice required (hours)
  // Reduced to 1 hour in test environment to allow E2E tests to book near-future appointments
  // Runtime check using Supabase URL (127.0.0.1 = local test environment)
  minimumNoticeHours: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1') ? 1 : 24,
} as const

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
}

export interface BusinessHours {
  start: string  // HH:mm format
  end: string    // HH:mm format
}

/**
 * Availability record from the availability_slots database table
 */
export interface AvailabilityRecord {
  id?: string
  doctor_id?: string
  day_of_week: number | null  // 1=Mon, 2=Tue, ..., 7=Sun
  specific_date: string | null  // YYYY-MM-DD format
  start_time: string  // HH:mm:ss or HH:mm format
  end_time: string    // HH:mm:ss or HH:mm format
  is_recurring: boolean
  is_blocked: boolean
  block_reason?: string | null
}

/**
 * Get day of week from Date object as string
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Get numeric day of week from Date object
 * Returns 1=Monday, 2=Tuesday, ..., 7=Sunday (matches database schema)
 */
function getNumericDayOfWeek(date: Date): number {
  const day = date.getDay()
  // Convert JavaScript's Sunday=0 to database's Monday=1, Sunday=7
  return day === 0 ? 7 : day
}

/**
 * Extract available time ranges from database availability records for a specific date
 * @param date - The date to get hours for
 * @param availabilityRecords - All availability records from the database
 * @returns Array of time ranges when the doctor is available (non-blocked)
 */
export function getAvailableHoursForDay(
  date: Date,
  availabilityRecords: AvailabilityRecord[]
): Array<{ start: string; end: string }> {
  const numericDay = getNumericDayOfWeek(date)
  const dateStr = format(date, 'yyyy-MM-dd')

  // Filter to matching, non-blocked records
  const matchingRecords = availabilityRecords.filter(record => {
    // Skip blocked records - these are used for filtering, not defining availability
    if (record.is_blocked) return false

    // Check if record matches the requested date
    if (record.is_recurring) {
      return record.day_of_week === numericDay
    } else {
      return record.specific_date === dateStr
    }
  })

  // Extract time ranges and normalize format (remove seconds if present)
  return matchingRecords.map(record => ({
    start: record.start_time.substring(0, 5),  // Convert "HH:mm:ss" to "HH:mm"
    end: record.end_time.substring(0, 5),
  }))
}

/**
 * Check if a given date falls within available hours
 * @param date - The date/time to check
 * @param availableHours - Array of time ranges when doctor is available
 * @returns true if the date falls within any available time range
 */
export function isWithinAvailableHours(
  date: Date,
  availableHours: Array<{ start: string; end: string }>
): boolean {
  const timeString = format(date, 'HH:mm')

  return availableHours.some(range => {
    return timeString >= range.start && timeString < range.end
  })
}

/**
 * Check if a date is within the allowed booking window
 */
export function isWithinBookingWindow(date: Date): boolean {
  const now = new Date()
  const minDate = addMinutes(now, APPOINTMENT_CONFIG.minimumNoticeHours * 60)
  const maxDate = addMinutes(now, APPOINTMENT_CONFIG.advanceBookingDays * 24 * 60)

  return isAfter(date, minDate) && isBefore(date, maxDate)
}

/**
 * Generate all possible time slots for a given date based on available hours
 * @param date - The date to generate slots for
 * @param availableHours - Time ranges when doctor is available (from database)
 * @param appointmentDuration - Duration of appointment in minutes (defaults to 60)
 * @returns Array of time slots within the available hours
 */
export function generateTimeSlots(
  date: Date,
  availableHours: Array<{ start: string; end: string }>,
  appointmentDuration: number = APPOINTMENT_CONFIG.appointmentDuration
): TimeSlot[] {
  // No availability = no slots
  if (availableHours.length === 0) {
    console.log(`[Availability] No available hours for ${format(date, 'yyyy-MM-dd')}`)
    return []
  }

  const slots: TimeSlot[] = []
  const dayStart = startOfDay(date)
  const slotDuration = appointmentDuration + APPOINTMENT_CONFIG.bufferTime

  // Generate slots for each availability range
  availableHours.forEach(range => {
    const startTime = parse(range.start, 'HH:mm', dayStart)
    const endTime = parse(range.end, 'HH:mm', dayStart)

    let currentTime = startTime

    // Generate slots within this time range
    while (isBefore(addMinutes(currentTime, appointmentDuration), endTime) ||
           addMinutes(currentTime, appointmentDuration).getTime() === endTime.getTime()) {
      const slotEnd = addMinutes(currentTime, appointmentDuration)

      slots.push({
        start: currentTime,
        end: slotEnd,
        available: true, // Will be checked against existing appointments and blocked slots
      })

      currentTime = addMinutes(currentTime, slotDuration)
    }
  })

  console.log(`[Availability] Generated ${slots.length} slots from ${availableHours.length} availability ranges`)

  return slots
}

/**
 * Check if a specific time slot conflicts with existing appointments
 */
export function hasTimeConflict(
  proposedStart: Date,
  proposedEnd: Date,
  existingAppointments: Array<{ start: Date; end: Date }>
): boolean {
  return existingAppointments.some(apt => {
    // Check if times overlap
    return (
      // Proposed start is during existing appointment
      (isAfter(proposedStart, apt.start) && isBefore(proposedStart, apt.end)) ||
      // Proposed end is during existing appointment
      (isAfter(proposedEnd, apt.start) && isBefore(proposedEnd, apt.end)) ||
      // Proposed appointment completely contains existing appointment
      (isBefore(proposedStart, apt.start) && isAfter(proposedEnd, apt.end)) ||
      // Times are exactly the same
      (proposedStart.getTime() === apt.start.getTime())
    )
  })
}

/**
 * Check if a specific time slot conflicts with blocked availability slots
 */
export function hasBlockedConflict(
  proposedStart: Date,
  proposedEnd: Date,
  blockedSlots: Array<{ start_time: string; end_time: string }>
): boolean {
  return blockedSlots.some(blocked => {
    // Parse the blocked slot times into Date objects on the proposed date
    // Database returns format "HH:mm:ss" (e.g., "14:00:00"), try both formats
    let blockedStart = parse(blocked.start_time, 'HH:mm:ss', startOfDay(proposedStart))
    let blockedEnd = parse(blocked.end_time, 'HH:mm:ss', startOfDay(proposedStart))

    // Fallback to HH:mm format if HH:mm:ss parsing fails
    if (isNaN(blockedStart.getTime())) {
      blockedStart = parse(blocked.start_time, 'HH:mm', startOfDay(proposedStart))
    }
    if (isNaN(blockedEnd.getTime())) {
      blockedEnd = parse(blocked.end_time, 'HH:mm', startOfDay(proposedStart))
    }

    // Check if times overlap (same logic as hasTimeConflict)
    return (
      // Proposed start is during blocked time
      (isAfter(proposedStart, blockedStart) && isBefore(proposedStart, blockedEnd)) ||
      // Proposed end is during blocked time
      (isAfter(proposedEnd, blockedStart) && isBefore(proposedEnd, blockedEnd)) ||
      // Proposed slot completely contains blocked time
      (isBefore(proposedStart, blockedStart) && isAfter(proposedEnd, blockedEnd)) ||
      // Times are exactly the same
      (proposedStart.getTime() === blockedStart.getTime())
    )
  })
}

/**
 * Filter time slots to only show available ones
 */
export function filterAvailableSlots(
  slots: TimeSlot[],
  existingAppointments: Array<{ start: Date; end: Date }>,
  blockedSlots: Array<{ start_time: string; end_time: string }> = []
): TimeSlot[] {
  return slots.map(slot => {
    const hasAppointmentConflict = hasTimeConflict(slot.start, slot.end, existingAppointments)
    const hasBlockConflict = hasBlockedConflict(slot.start, slot.end, blockedSlots)
    const withinWindow = isWithinBookingWindow(slot.start)

    // Log when a slot is blocked (for debugging)
    if (hasBlockConflict) {
      console.log(`[Availability] Slot ${format(slot.start, 'HH:mm')}-${format(slot.end, 'HH:mm')} blocked due to admin availability block`)
    }

    return {
      ...slot,
      available: !hasAppointmentConflict && !hasBlockConflict && withinWindow,
    }
  })
}

/**
 * Get all available appointment slots for a specific date
 * @param date - The date to get slots for
 * @param availabilityRecords - ALL availability records from database (both available and blocked)
 * @param existingAppointments - Existing appointments to check conflicts against
 * @param appointmentDuration - Duration of appointment in minutes (defaults to 60)
 */
export async function getAvailableSlotsForDate(
  date: Date,
  availabilityRecords: AvailabilityRecord[],
  existingAppointments: Array<{ start: Date; end: Date }>,
  appointmentDuration?: number
): Promise<TimeSlot[]> {
  // Extract available hours from non-blocked database records
  const availableHours = getAvailableHoursForDay(date, availabilityRecords)

  console.log(`[Availability] Found ${availableHours.length} availability ranges for ${format(date, 'yyyy-MM-dd')}:`, availableHours)

  // Generate all possible slots within available hours
  const allSlots = generateTimeSlots(date, availableHours, appointmentDuration)

  // Extract blocked slots for conflict checking
  const blockedSlots = availabilityRecords
    .filter(record => record.is_blocked)
    .map(record => ({
      start_time: record.start_time,
      end_time: record.end_time,
    }))

  console.log(`[Availability] Generated ${allSlots.length} total slots for ${format(date, 'yyyy-MM-dd')}`)
  console.log(`[Availability] Checking against ${existingAppointments.length} appointments and ${blockedSlots.length} blocked slots`)

  // Filter slots based on existing appointments and blocked slots (sets available: true/false)
  const slotsWithAvailability = filterAvailableSlots(allSlots, existingAppointments, blockedSlots)

  const availableCount = slotsWithAvailability.filter(s => s.available).length
  console.log(`[Availability] Result: ${availableCount} available slots, ${allSlots.length - availableCount} unavailable`)

  // Return ALL slots (both available and unavailable) so UI can show disabled states
  return slotsWithAvailability
}

/**
 * Validate that an appointment booking is allowed
 * @param startTime - The proposed appointment start time
 * @param availableHours - Available hours for the date (from database)
 * @returns Validation result with error message if invalid
 */
export function validateAppointmentBooking(
  startTime: Date,
  availableHours: Array<{ start: string; end: string }>
): { valid: boolean; error?: string } {
  // Check if within booking window
  if (!isWithinBookingWindow(startTime)) {
    return {
      valid: false,
      error: 'Appointment must be booked at least 24 hours in advance and no more than 90 days out',
    }
  }

  // Check if within available hours
  if (!isWithinAvailableHours(startTime, availableHours)) {
    return {
      valid: false,
      error: 'Appointment must be during available hours. Please check the schedule.',
    }
  }

  return { valid: true }
}
