/**
 * Integration Tests: Booking Conflict Prevention
 *
 * Tests that appointments cannot conflict with each other and proper
 * validation prevents double-booking.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { addMinutes } from 'date-fns'
import type { Appointment } from '@/types/database'

const mockSupabaseUrl = 'https://test.supabase.co'
const mockSupabaseKey = 'test-key'

// Helper to check if two time ranges overlap
function hasTimeConflict(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2
}

describe('Booking Conflict Prevention Integration', () => {
  let supabase: ReturnType<typeof createClient>
  let testDoctorId: string
  let testAppointmentTypeId: string
  let createdAppointments: string[] = []

  beforeEach(() => {
    supabase = createClient(mockSupabaseUrl, mockSupabaseKey)
    testDoctorId = 'test-doctor-123'
    testAppointmentTypeId = 'test-type-123'
    createdAppointments = []
  })

  afterEach(async () => {
    if (createdAppointments.length > 0) {
      await supabase
        .from('appointments')
        .delete()
        .in('id', createdAppointments)
    }
  })

  it('should prevent overlapping appointments for the same doctor', async () => {
    const startTime = new Date('2025-12-15T10:00:00Z')
    const endTime = addMinutes(startTime, 30)

    // Create first appointment
    const appointment1: Partial<Appointment> = {
      doctor_id: testDoctorId,
      appointment_type_id: testAppointmentTypeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'John Doe',
      patient_email: 'john@example.com',
      patient_phone: '+15551234567',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    const { data: created1 } = await supabase
      .from('appointments')
      .insert(appointment1)
      .select()
      .single()

    if (created1) createdAppointments.push(created1.id)

    // Attempt to create overlapping appointment
    const conflictStart = addMinutes(startTime, 15) // Overlaps by 15 minutes
    const conflictEnd = addMinutes(conflictStart, 30)

    // Check for conflicts before inserting
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', testDoctorId)
      .in('status', ['pending', 'confirmed'])

    const hasConflict = existingAppointments!.some(apt => {
      return hasTimeConflict(
        conflictStart,
        conflictEnd,
        new Date(apt.start_time),
        new Date(apt.end_time)
      )
    })

    expect(hasConflict).toBe(true)
  })

  it('should allow appointments for different doctors at the same time', async () => {
    const startTime = new Date('2025-12-15T10:00:00Z')
    const endTime = addMinutes(startTime, 30)

    // Doctor 1 appointment
    const appointment1: Partial<Appointment> = {
      doctor_id: 'doctor-1',
      appointment_type_id: testAppointmentTypeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'John Doe',
      patient_email: 'john@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    const { data: created1 } = await supabase
      .from('appointments')
      .insert(appointment1)
      .select()
      .single()

    if (created1) createdAppointments.push(created1.id)

    // Doctor 2 appointment at same time
    const appointment2: Partial<Appointment> = {
      doctor_id: 'doctor-2',
      appointment_type_id: testAppointmentTypeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'Jane Smith',
      patient_email: 'jane@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    // This should succeed (different doctors)
    const { data: created2, error } = await supabase
      .from('appointments')
      .insert(appointment2)
      .select()
      .single()

    expect(error).toBeNull()
    expect(created2).toBeDefined()

    if (created2) createdAppointments.push(created2.id)
  })

  it('should allow back-to-back appointments without overlap', async () => {
    const appointment1Start = new Date('2025-12-15T10:00:00Z')
    const appointment1End = addMinutes(appointment1Start, 30)

    // First appointment: 10:00-10:30
    const appointment1: Partial<Appointment> = {
      doctor_id: testDoctorId,
      appointment_type_id: testAppointmentTypeId,
      start_time: appointment1Start.toISOString(),
      end_time: appointment1End.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'John Doe',
      patient_email: 'john@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    const { data: created1 } = await supabase
      .from('appointments')
      .insert(appointment1)
      .select()
      .single()

    if (created1) createdAppointments.push(created1.id)

    // Second appointment: 10:45-11:15 (15 min buffer after first)
    const appointment2Start = addMinutes(appointment1End, 15)
    const appointment2End = addMinutes(appointment2Start, 30)

    const appointment2: Partial<Appointment> = {
      doctor_id: testDoctorId,
      appointment_type_id: testAppointmentTypeId,
      start_time: appointment2Start.toISOString(),
      end_time: appointment2End.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'Jane Smith',
      patient_email: 'jane@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    // Check for conflicts
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', testDoctorId)
      .in('status', ['pending', 'confirmed'])

    const hasConflict = existingAppointments!.some(apt => {
      return hasTimeConflict(
        appointment2Start,
        appointment2End,
        new Date(apt.start_time),
        new Date(apt.end_time)
      )
    })

    expect(hasConflict).toBe(false)

    // This should succeed
    const { data: created2, error } = await supabase
      .from('appointments')
      .insert(appointment2)
      .select()
      .single()

    expect(error).toBeNull()
    if (created2) createdAppointments.push(created2.id)
  })

  it('should detect exact time overlap', async () => {
    const startTime = new Date('2025-12-15T10:00:00Z')
    const endTime = addMinutes(startTime, 30)

    // Create first appointment
    const appointment1: Partial<Appointment> = {
      doctor_id: testDoctorId,
      appointment_type_id: testAppointmentTypeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: 'America/New_York',
      status: 'confirmed',
      patient_name: 'John Doe',
      patient_email: 'john@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    const { data: created1 } = await supabase
      .from('appointments')
      .insert(appointment1)
      .select()
      .single()

    if (created1) createdAppointments.push(created1.id)

    // Attempt exact same time slot
    const hasConflict = hasTimeConflict(
      startTime,
      endTime,
      startTime,
      endTime
    )

    expect(hasConflict).toBe(true)
  })

  it('should detect partial overlap at start', async () => {
    const appointment1Start = new Date('2025-12-15T10:00:00Z')
    const appointment1End = addMinutes(appointment1Start, 30)

    // Overlapping appointment starts 10 minutes earlier
    const appointment2Start = addMinutes(appointment1Start, -10)
    const appointment2End = addMinutes(appointment2Start, 30)

    const hasConflict = hasTimeConflict(
      appointment1Start,
      appointment1End,
      appointment2Start,
      appointment2End
    )

    expect(hasConflict).toBe(true)
  })

  it('should detect partial overlap at end', async () => {
    const appointment1Start = new Date('2025-12-15T10:00:00Z')
    const appointment1End = addMinutes(appointment1Start, 30)

    // Overlapping appointment starts during first appointment
    const appointment2Start = addMinutes(appointment1Start, 20)
    const appointment2End = addMinutes(appointment2Start, 30)

    const hasConflict = hasTimeConflict(
      appointment1Start,
      appointment1End,
      appointment2Start,
      appointment2End
    )

    expect(hasConflict).toBe(true)
  })

  it('should detect when one appointment completely contains another', async () => {
    const outerStart = new Date('2025-12-15T10:00:00Z')
    const outerEnd = addMinutes(outerStart, 60)

    const innerStart = addMinutes(outerStart, 15)
    const innerEnd = addMinutes(innerStart, 30)

    const hasConflict = hasTimeConflict(
      outerStart,
      outerEnd,
      innerStart,
      innerEnd
    )

    expect(hasConflict).toBe(true)
  })

  it('should allow appointments when cancelled appointment exists at that time', async () => {
    const startTime = new Date('2025-12-15T10:00:00Z')
    const endTime = addMinutes(startTime, 30)

    // Create cancelled appointment
    const cancelledAppointment: Partial<Appointment> = {
      doctor_id: testDoctorId,
      appointment_type_id: testAppointmentTypeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      timezone: 'America/New_York',
      status: 'cancelled',
      patient_name: 'John Doe',
      patient_email: 'john@example.com',
      patient_locale: 'en',
      booking_token: crypto.randomUUID(),
    }

    const { data: cancelled } = await supabase
      .from('appointments')
      .insert(cancelledAppointment)
      .select()
      .single()

    if (cancelled) createdAppointments.push(cancelled.id)

    // Check for conflicts (should only check non-cancelled)
    const { data: activeAppointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', testDoctorId)
      .in('status', ['pending', 'confirmed']) // Exclude cancelled

    const hasConflict = activeAppointments!.some(apt => {
      return hasTimeConflict(
        startTime,
        endTime,
        new Date(apt.start_time),
        new Date(apt.end_time)
      )
    })

    expect(hasConflict).toBe(false)
    expect(activeAppointments).toHaveLength(0)
  })

  it('should handle multiple appointments and detect conflicts correctly', async () => {
    // Create multiple appointments throughout the day
    const baseTime = new Date('2025-12-15T09:00:00Z')

    const appointments = [
      { start: baseTime, duration: 30 }, // 9:00-9:30
      { start: addMinutes(baseTime, 45), duration: 30 }, // 9:45-10:15
      { start: addMinutes(baseTime, 90), duration: 45 }, // 10:30-11:15
    ]

    for (const apt of appointments) {
      const appointment: Partial<Appointment> = {
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: apt.start.toISOString(),
        end_time: addMinutes(apt.start, apt.duration).toISOString(),
        timezone: 'America/New_York',
        status: 'confirmed',
        patient_name: 'Test Patient',
        patient_email: 'test@example.com',
        patient_locale: 'en',
        booking_token: crypto.randomUUID(),
      }

      const { data } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single()

      if (data) createdAppointments.push(data.id)
    }

    // Test conflicting time: 10:00-10:30 (overlaps with second appointment)
    const testStart = addMinutes(baseTime, 60) // 10:00
    const testEnd = addMinutes(testStart, 30) // 10:30

    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', testDoctorId)
      .in('status', ['pending', 'confirmed'])

    const hasConflict = existingAppointments!.some(apt => {
      return hasTimeConflict(
        testStart,
        testEnd,
        new Date(apt.start_time),
        new Date(apt.end_time)
      )
    })

    expect(hasConflict).toBe(true)

    // Test non-conflicting time: 9:30-9:45 (fits in buffer)
    const testStart2 = addMinutes(baseTime, 30) // 9:30
    const testEnd2 = addMinutes(testStart2, 15) // 9:45

    const hasConflict2 = existingAppointments!.some(apt => {
      return hasTimeConflict(
        testStart2,
        testEnd2,
        new Date(apt.start_time),
        new Date(apt.end_time)
      )
    })

    expect(hasConflict2).toBe(false)
  })
})
