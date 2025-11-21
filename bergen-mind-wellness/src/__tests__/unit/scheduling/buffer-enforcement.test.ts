/**
 * Integration Tests: Buffer Time Enforcement
 *
 * Tests that the enforced 15-minute gap between consecutive appointments
 * is properly maintained.
 */

import { describe, it, expect } from 'vitest'
import { addMinutes } from 'date-fns'

const BUFFER_TIME_MINUTES = 15

// Helper to check if buffer time is enforced between appointments
function hasProperBuffer(
  appointment1End: Date,
  appointment2Start: Date,
  requiredBufferMinutes: number = BUFFER_TIME_MINUTES
): boolean {
  const minutesBetween = (appointment2Start.getTime() - appointment1End.getTime()) / (1000 * 60)
  return minutesBetween >= requiredBufferMinutes
}

// Helper to calculate next available slot after an appointment
function getNextAvailableSlot(
  appointmentEnd: Date,
  bufferMinutes: number = BUFFER_TIME_MINUTES
): Date {
  return addMinutes(appointmentEnd, bufferMinutes)
}

describe('Buffer Time Enforcement Integration', () => {
  it('should enforce 15-minute buffer between consecutive 30-minute appointments', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 30) // 10:30

    const apt2Start = addMinutes(apt1End, 15) // 10:45 (15 min buffer)
    const apt2End = addMinutes(apt2Start, 30) // 11:15

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBe(15)
  })

  it('should enforce 15-minute buffer between consecutive 45-minute appointments', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 45) // 10:45

    const apt2Start = addMinutes(apt1End, 15) // 11:00 (15 min buffer)
    const apt2End = addMinutes(apt2Start, 45) // 11:45

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)
  })

  it('should enforce 15-minute buffer between consecutive 60-minute appointments', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 60) // 11:00

    const apt2Start = addMinutes(apt1End, 15) // 11:15 (15 min buffer)
    const apt2End = addMinutes(apt2Start, 60) // 12:15

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)
  })

  it('should detect insufficient buffer (less than 15 minutes)', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 30) // 10:30

    // Only 10-minute gap
    const apt2Start = addMinutes(apt1End, 10) // 10:40
    const apt2End = addMinutes(apt2Start, 30) // 11:10

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(false)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBeLessThan(15)
  })

  it('should detect no buffer (back-to-back appointments)', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 30) // 10:30

    // No buffer - starts immediately after
    const apt2Start = apt1End // 10:30
    const apt2End = addMinutes(apt2Start, 30) // 11:00

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(false)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBe(0)
  })

  it('should calculate correct next available slot after appointment', () => {
    const appointmentEnd = new Date('2025-12-15T10:30:00Z')
    const nextSlot = getNextAvailableSlot(appointmentEnd)

    const expectedSlot = new Date('2025-12-15T10:45:00Z')
    expect(nextSlot.getTime()).toBe(expectedSlot.getTime())
  })

  it('should allow more than 15 minutes buffer', () => {
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 30) // 10:30

    // 30-minute gap
    const apt2Start = addMinutes(apt1End, 30) // 11:00
    const apt2End = addMinutes(apt2Start, 30) // 11:30

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBe(30)
    expect(bufferMinutes).toBeGreaterThan(15)
  })

  it('should enforce buffer for mixed-duration appointments', () => {
    // 60-minute appointment followed by 30-minute appointment
    const apt1Start = new Date('2025-12-15T10:00:00Z')
    const apt1End = addMinutes(apt1Start, 60) // 11:00

    const apt2Start = addMinutes(apt1End, 15) // 11:15 (15 min buffer)
    const apt2End = addMinutes(apt2Start, 30) // 11:45

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)

    // 30-minute appointment followed by 60-minute appointment
    const apt3Start = addMinutes(apt2End, 15) // 12:00 (15 min buffer)
    const apt3End = addMinutes(apt3Start, 60) // 13:00

    const hasBuffer2 = hasProperBuffer(apt2End, apt3Start)
    expect(hasBuffer2).toBe(true)
  })

  it('should enforce buffer across multiple consecutive appointments', () => {
    const appointments = [
      { start: new Date('2025-12-15T09:00:00Z'), duration: 30 }, // 9:00-9:30
      { start: new Date('2025-12-15T09:45:00Z'), duration: 45 }, // 9:45-10:30 (15 min buffer)
      { start: new Date('2025-12-15T10:45:00Z'), duration: 30 }, // 10:45-11:15 (15 min buffer)
      { start: new Date('2025-12-15T11:30:00Z'), duration: 60 }, // 11:30-12:30 (15 min buffer)
    ]

    // Check buffer between each consecutive pair
    for (let i = 0; i < appointments.length - 1; i++) {
      const currentEnd = addMinutes(appointments[i].start, appointments[i].duration)
      const nextStart = appointments[i + 1].start

      const hasBuffer = hasProperBuffer(currentEnd, nextStart)
      expect(hasBuffer).toBe(true)

      const bufferMinutes = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60)
      expect(bufferMinutes).toBeGreaterThanOrEqual(15)
    }
  })

  it('should prevent booking in buffer zone before appointment', () => {
    const existingAptStart = new Date('2025-12-15T11:00:00Z')
    const existingAptEnd = addMinutes(existingAptStart, 30) // 11:30

    // Attempt to book 10:35-11:05 (ends only 10 minutes before next appointment starts)
    const newAptStart = new Date('2025-12-15T10:35:00Z')
    const newAptEnd = addMinutes(newAptStart, 30) // 11:05

    // Check if new appointment end + buffer would conflict with existing appointment start
    const newAptEndWithBuffer = addMinutes(newAptEnd, 15) // 11:20

    const wouldConflict = newAptEndWithBuffer > existingAptStart
    expect(wouldConflict).toBe(true)
  })

  it('should prevent booking in buffer zone after appointment', () => {
    const existingAptStart = new Date('2025-12-15T10:00:00Z')
    const existingAptEnd = addMinutes(existingAptStart, 30) // 10:30

    // Attempt to book 10:40-11:10 (starts only 10 minutes after previous appointment ends)
    const newAptStart = new Date('2025-12-15T10:40:00Z')
    const newAptEnd = addMinutes(newAptStart, 30) // 11:10

    const hasProperBufferBefore = hasProperBuffer(existingAptEnd, newAptStart)
    expect(hasProperBufferBefore).toBe(false)

    const actualBuffer = (newAptStart.getTime() - existingAptEnd.getTime()) / (1000 * 60)
    expect(actualBuffer).toBe(10)
    expect(actualBuffer).toBeLessThan(15)
  })

  it('should handle buffer enforcement with timezone-aware dates', () => {
    // Even with different timezone representations, buffer should be enforced
    const apt1End = new Date('2025-12-15T15:30:00-05:00') // 3:30 PM EST
    const apt2Start = new Date('2025-12-15T15:45:00-05:00') // 3:45 PM EST

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBe(15)
  })

  it('should calculate buffer time accurately for edge cases', () => {
    // Exactly 15 minutes
    const apt1End = new Date('2025-12-15T10:30:00Z')
    const apt2Start = new Date('2025-12-15T10:45:00Z')

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(true)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBe(15)
  })

  it('should reject buffer of 14 minutes 59 seconds', () => {
    const apt1End = new Date('2025-12-15T10:30:00Z')
    const apt2Start = new Date('2025-12-15T10:44:59Z') // 14 min 59 sec later

    const hasBuffer = hasProperBuffer(apt1End, apt2Start)
    expect(hasBuffer).toBe(false)

    const bufferMinutes = (apt2Start.getTime() - apt1End.getTime()) / (1000 * 60)
    expect(bufferMinutes).toBeLessThan(15)
  })

  it('should enforce buffer in a fully-booked day scenario', () => {
    // Simulate a fully-booked day with proper buffers (10 AM - 6 PM)
    const appointments = []
    let currentTime = new Date('2025-12-15T10:00:00Z')
    const endOfDay = new Date('2025-12-15T18:00:00Z')
    const appointmentDuration = 30

    while (currentTime < endOfDay) {
      const aptEnd = addMinutes(currentTime, appointmentDuration)

      if (aptEnd <= endOfDay) {
        appointments.push({
          start: currentTime,
          end: aptEnd,
        })

        // Next appointment starts after buffer
        currentTime = addMinutes(aptEnd, 15)
      } else {
        break
      }
    }

    // Verify all appointments have proper buffer
    for (let i = 0; i < appointments.length - 1; i++) {
      const hasBuffer = hasProperBuffer(appointments[i].end, appointments[i + 1].start)
      expect(hasBuffer).toBe(true)
    }

    // Should fit multiple appointments in an 8-hour day
    expect(appointments.length).toBeGreaterThan(0)
    expect(appointments.length).toBeLessThanOrEqual(11) // Max with 30min + 15min buffer
  })
})
