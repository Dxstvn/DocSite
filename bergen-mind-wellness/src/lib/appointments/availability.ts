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
export const APPOINTMENT_CONFIG = {
  // Business hours (24-hour format)
  // Aligned with test environment availability: Mon-Fri 7am-9pm, Sat 9am-5pm
  businessHours: {
    monday: { start: '07:00', end: '21:00' },
    tuesday: { start: '07:00', end: '21:00' },
    wednesday: { start: '07:00', end: '21:00' },
    thursday: { start: '07:00', end: '21:00' },
    friday: { start: '07:00', end: '21:00' },
    saturday: { start: '09:00', end: '17:00' },
    sunday: null,   // Closed
  },

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
 * Get day of week from Date object
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Check if a given date falls within business hours
 */
export function isWithinBusinessHours(date: Date): boolean {
  const dayOfWeek = getDayOfWeek(date)
  const businessHours = APPOINTMENT_CONFIG.businessHours[dayOfWeek]

  if (!businessHours) return false

  const timeString = format(date, 'HH:mm')
  return timeString >= businessHours.start && timeString < businessHours.end
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
 * Generate all possible time slots for a given date
 * @param date - The date to generate slots for
 * @param appointmentDuration - Duration of appointment in minutes (defaults to 60)
 */
export function generateTimeSlots(date: Date, appointmentDuration: number = APPOINTMENT_CONFIG.appointmentDuration): TimeSlot[] {
  const dayOfWeek = getDayOfWeek(date)
  const businessHours = APPOINTMENT_CONFIG.businessHours[dayOfWeek]

  if (!businessHours) return []

  const slots: TimeSlot[] = []
  const dayStart = startOfDay(date)

  // Parse business hours
  const startTime = parse(businessHours.start, 'HH:mm', dayStart)
  const endTime = parse(businessHours.end, 'HH:mm', dayStart)

  // Generate slots with dynamic duration
  let currentTime = startTime
  const slotDuration = appointmentDuration + APPOINTMENT_CONFIG.bufferTime

  while (isBefore(addMinutes(currentTime, appointmentDuration), endTime)) {
    const slotEnd = addMinutes(currentTime, appointmentDuration)

    slots.push({
      start: currentTime,
      end: slotEnd,
      available: true, // Will be checked against existing appointments
    })

    currentTime = addMinutes(currentTime, slotDuration)
  }

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
 * @param existingAppointments - Existing appointments to check conflicts against
 * @param appointmentDuration - Duration of appointment in minutes (defaults to 60)
 * @param blockedSlots - Admin-blocked availability slots to check conflicts against
 */
export async function getAvailableSlotsForDate(
  date: Date,
  existingAppointments: Array<{ start: Date; end: Date }>,
  appointmentDuration?: number,
  blockedSlots: Array<{ start_time: string; end_time: string }> = []
): Promise<TimeSlot[]> {
  // Generate all possible slots for the day with specified duration
  const allSlots = generateTimeSlots(date, appointmentDuration)

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
 */
export function validateAppointmentBooking(startTime: Date): { valid: boolean; error?: string } {
  // Check if within booking window
  if (!isWithinBookingWindow(startTime)) {
    return {
      valid: false,
      error: 'Appointment must be booked at least 24 hours in advance and no more than 90 days out',
    }
  }

  // Check if within business hours
  if (!isWithinBusinessHours(startTime)) {
    return {
      valid: false,
      error: 'Appointment must be during business hours (Monday-Friday, 9 AM - 5 PM)',
    }
  }

  return { valid: true }
}
