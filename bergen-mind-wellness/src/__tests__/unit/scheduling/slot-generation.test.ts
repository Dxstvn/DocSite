/**
 * Integration Tests: Time Slot Generation
 *
 * Tests that only available time slots appear in the calendar based on:
 * - Doctor availability windows
 * - Appointment type duration
 * - Existing bookings
 * - Buffer time between appointments
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { addMinutes, setHours, setMinutes, startOfDay, format } from 'date-fns'

// Helper to generate time slots
function generateTimeSlots(
  availabilityStart: Date,
  availabilityEnd: Date,
  appointmentDuration: number,
  bufferTime: number = 15,
  existingAppointments: Array<{ start: Date; end: Date }> = []
): Array<{ start: Date; end: Date; available: boolean }> {
  const slots: Array<{ start: Date; end: Date; available: boolean }> = []
  let currentSlotStart = availabilityStart

  while (currentSlotStart < availabilityEnd) {
    const slotEnd = addMinutes(currentSlotStart, appointmentDuration)

    // Check if slot extends beyond availability window
    if (slotEnd > availabilityEnd) {
      break
    }

    // Check for conflicts with existing appointments (including buffer)
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentWithBuffer = {
        start: addMinutes(appointment.start, -bufferTime),
        end: addMinutes(appointment.end, bufferTime),
      }

      return (
        currentSlotStart < appointmentWithBuffer.end &&
        slotEnd > appointmentWithBuffer.start
      )
    })

    slots.push({
      start: currentSlotStart,
      end: slotEnd,
      available: !hasConflict,
    })

    // Move to next slot (add buffer time between slots)
    currentSlotStart = addMinutes(slotEnd, bufferTime)
  }

  return slots
}

describe('Time Slot Generation Integration', () => {
  const testDate = startOfDay(new Date('2025-12-15T00:00:00Z'))

  beforeEach(() => {
    // Reset any test state
  })

  it('should generate 30-minute slots for 10am-6pm availability', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10) // 10:00 AM
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18) // 6:00 PM
    const duration = 30

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration)

    // 8 hours = 480 minutes
    // Each slot = 30 minutes appointment + 15 minutes buffer = 45 minutes
    // 480 / 45 = 10.67, so we expect 10 complete slots
    expect(slots.length).toBeGreaterThanOrEqual(10)
    expect(slots.length).toBeLessThanOrEqual(11)

    // First slot should start at 10:00 AM
    expect(format(slots[0].start, 'HH:mm')).toBe('10:00')

    // All slots should be marked as available (no conflicts)
    slots.forEach(slot => {
      expect(slot.available).toBe(true)
    })
  })

  it('should generate 45-minute slots for 10am-6pm availability', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 45

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration)

    // Each slot = 45 minutes appointment + 15 minutes buffer = 60 minutes
    // 8 hours = 8 slots exactly
    expect(slots.length).toBe(8)

    // Verify slot times
    expect(format(slots[0].start, 'HH:mm')).toBe('10:00')
    expect(format(slots[0].end, 'HH:mm')).toBe('10:45')
    expect(format(slots[1].start, 'HH:mm')).toBe('11:00') // 45min + 15min buffer
  })

  it('should generate 60-minute slots for 10am-6pm availability', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 60

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration)

    // Each slot = 60 minutes appointment + 15 minutes buffer = 75 minutes
    // 8 hours = 480 minutes / 75 = 6.4, so 6 complete slots
    expect(slots.length).toBe(6)

    // Verify slot times with buffer
    expect(format(slots[0].start, 'HH:mm')).toBe('10:00')
    expect(format(slots[0].end, 'HH:mm')).toBe('11:00')
    expect(format(slots[1].start, 'HH:mm')).toBe('11:15') // 60min + 15min buffer
  })

  it('should mark slots as unavailable when conflicting with existing appointments', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 30

    // Existing appointment at 11:00 AM - 11:30 AM
    const existingAppointments = [
      {
        start: setHours(setMinutes(testDate, 0), 11),
        end: setHours(setMinutes(testDate, 30), 11),
      },
    ]

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration, 15, existingAppointments)

    // Find slots around the conflict
    const slot10_00 = slots.find(s => format(s.start, 'HH:mm') === '10:00')
    const slot10_45 = slots.find(s => format(s.start, 'HH:mm') === '10:45')
    const slot11_00 = slots.find(s => format(s.start, 'HH:mm') === '11:00')
    const slot11_45 = slots.find(s => format(s.start, 'HH:mm') === '11:45')

    // Slot before conflict (but within buffer) should be unavailable
    expect(slot10_45?.available).toBe(false)

    // Conflicting slot should be unavailable
    expect(slot11_00?.available).toBe(false)

    // Slot after conflict (but within buffer) should be unavailable
    expect(slot11_45?.available).toBe(false)

    // Slot well before conflict should be available
    expect(slot10_00?.available).toBe(true)
  })

  it('should handle multiple existing appointments', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 30

    const existingAppointments = [
      {
        start: setHours(setMinutes(testDate, 0), 11), // 11:00-11:30
        end: setHours(setMinutes(testDate, 30), 11),
      },
      {
        start: setHours(setMinutes(testDate, 0), 14), // 2:00-2:30 PM
        end: setHours(setMinutes(testDate, 30), 14),
      },
    ]

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration, 15, existingAppointments)

    const availableSlots = slots.filter(s => s.available)
    const unavailableSlots = slots.filter(s => !s.available)

    // Should have both available and unavailable slots
    expect(availableSlots.length).toBeGreaterThan(0)
    expect(unavailableSlots.length).toBeGreaterThan(0)

    // Specific time slots should be unavailable
    const hasUnavailable11_00 = slots.some(s => format(s.start, 'HH:mm') === '11:00' && !s.available)
    const hasUnavailable14_00 = slots.some(s => format(s.start, 'HH:mm') === '14:00' && !s.available)

    expect(hasUnavailable11_00).toBe(true)
    expect(hasUnavailable14_00).toBe(true)
  })

  it('should not generate slots extending past availability window', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 30), 12) // Only 2.5 hours
    const duration = 60

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration)

    // Last slot start should not be after availability end minus duration
    const lastSlot = slots[slots.length - 1]
    expect(lastSlot.end <= availabilityEnd).toBe(true)

    // All slot end times should be within availability window
    slots.forEach(slot => {
      expect(slot.end <= availabilityEnd).toBe(true)
    })
  })

  it('should respect 15-minute buffer between consecutive appointments', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 30
    const bufferTime = 15

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration, bufferTime)

    // Check consecutive slots have buffer
    for (let i = 0; i < slots.length - 1; i++) {
      const currentSlotEnd = slots[i].end
      const nextSlotStart = slots[i + 1].start

      const minutesBetween = (nextSlotStart.getTime() - currentSlotEnd.getTime()) / (1000 * 60)
      expect(minutesBetween).toBe(bufferTime)
    }
  })

  it('should generate no slots when availability window is too short', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 15), 10) // Only 15 minutes
    const duration = 30 // Need 30 minutes

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration)

    expect(slots.length).toBe(0)
  })

  it('should handle back-to-back appointments with buffer enforcement', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)
    const duration = 30

    // Two back-to-back appointments with buffer already included
    const existingAppointments = [
      {
        start: setHours(setMinutes(testDate, 0), 11), // 11:00-11:30
        end: setHours(setMinutes(testDate, 30), 11),
      },
      {
        start: setHours(setMinutes(testDate, 45), 11), // 11:45-12:15 (15min buffer from previous)
        end: setHours(setMinutes(testDate, 15), 12),
      },
    ]

    const slots = generateTimeSlots(availabilityStart, availabilityEnd, duration, 15, existingAppointments)

    // The slot at 11:30 should be unavailable (within buffer of both appointments)
    const slot11_30 = slots.find(s => format(s.start, 'HH:mm') === '11:30')
    expect(slot11_30?.available).toBe(false)
  })

  it('should generate different slot counts for different durations', () => {
    const availabilityStart = setHours(setMinutes(testDate, 0), 10)
    const availabilityEnd = setHours(setMinutes(testDate, 0), 18)

    const slots30 = generateTimeSlots(availabilityStart, availabilityEnd, 30)
    const slots45 = generateTimeSlots(availabilityStart, availabilityEnd, 45)
    const slots60 = generateTimeSlots(availabilityStart, availabilityEnd, 60)

    // Longer duration = fewer slots
    expect(slots30.length).toBeGreaterThan(slots45.length)
    expect(slots45.length).toBeGreaterThan(slots60.length)
  })
})
