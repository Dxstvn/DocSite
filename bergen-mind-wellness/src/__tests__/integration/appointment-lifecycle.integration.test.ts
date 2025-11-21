/**
 * REAL Integration Test: Appointment Lifecycle
 *
 * This test connects to a REAL local Supabase database and tests:
 * - Complete appointment booking flow (creation → confirmation → cancellation)
 * - Status transitions and validation
 * - Timestamp updates on status changes
 * - Booking token generation and usage
 * - Database-level constraints during lifecycle
 *
 * Prerequisites:
 * 1. Docker running
 * 2. Local Supabase started: pnpm supabase:start
 * 3. .env.test configured with local credentials
 *
 * Run: pnpm test:integration
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { supabaseService } from '../../../vitest.integration.setup'
import {
  createTestDoctor,
  createTestAppointmentType,
  createTestAppointment,
  expectNoError,
  expectData,
  expectValidUUID,
  expectRecentTimestamp,
  createTestPatient,
} from './helpers'

describe('Appointment Lifecycle - Real Database Integration', () => {
  let testDoctorId: string
  let testAppointmentTypeId: string

  beforeEach(async () => {
    // Create test doctor
    const doctor = await createTestDoctor()
    testDoctorId = doctor.id

    // Create test appointment type (using default unique name)
    const appointmentType = await createTestAppointmentType({
      display_name: 'Lifecycle Test Appointment',
      duration_minutes: 50,
    })
    testAppointmentTypeId = appointmentType.id
  })

  describe('Appointment Creation', () => {
    it('should create a pending appointment with all required fields', async () => {
      const startTime = new Date('2025-12-20T10:00:00Z')
      const endTime = new Date('2025-12-20T11:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        patient_name: 'John Doe',
        patient_email: 'john.doe@example.com',
        patient_phone: '+15551234567',
        status: 'pending',
      })

      // Verify appointment was created
      expectData(appointment)
      expectValidUUID(appointment.id)

      // Verify all fields
      expect(appointment.doctor_id).toBe(testDoctorId)
      expect(appointment.appointment_type_id).toBe(testAppointmentTypeId)
      // Compare timestamps as Date objects (PostgreSQL may return different format)
      expect(new Date(appointment.start_time).getTime()).toBe(startTime.getTime())
      expect(new Date(appointment.end_time).getTime()).toBe(endTime.getTime())
      expect(appointment.status).toBe('pending')
      expect(appointment.patient_name).toBe('John Doe')
      expect(appointment.patient_email).toBe('john.doe@example.com')
      expect(appointment.patient_phone).toBe('+15551234567')

      // Verify auto-generated fields
      expect(appointment.booking_token).toBeDefined()
      expect(appointment.booking_token.length).toBe(64) // 32 bytes as hex = 64 chars
      expectRecentTimestamp(appointment.created_at)
      expectRecentTimestamp(appointment.updated_at)
    })

    it('should create a confirmed appointment directly', async () => {
      const startTime = new Date('2025-12-20T14:00:00Z')
      const endTime = new Date('2025-12-20T15:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed', // Created as confirmed
      })

      expect(appointment.status).toBe('confirmed')
    })

    it('should create appointment with linked patient_id', async () => {
      const patient = await createTestPatient('patient-linked@test.com')
      const startTime = new Date('2025-12-20T16:00:00Z')
      const endTime = new Date('2025-12-20T17:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        patient_id: patient.id, // Link to real patient
        patient_name: 'Linked Patient',
        patient_email: 'patient-linked@test.com',
        patient_phone: '+15559876543',
      })

      expect(appointment.patient_id).toBe(patient.id)
    })

    it('should generate unique booking tokens for each appointment', async () => {
      const startTime1 = new Date('2025-12-21T10:00:00Z')
      const endTime1 = new Date('2025-12-21T11:00:00Z')

      const startTime2 = new Date('2025-12-21T14:00:00Z')
      const endTime2 = new Date('2025-12-21T15:00:00Z')

      const apt1 = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime1,
        end_time: endTime1,
      })

      const apt2 = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime2,
        end_time: endTime2,
      })

      // Verify tokens are different
      expect(apt1.booking_token).not.toBe(apt2.booking_token)

      // Verify tokens are long enough to be secure (64 chars for 32 bytes hex)
      expect(apt1.booking_token.length).toBe(64)
      expect(apt2.booking_token.length).toBe(64)
    })
  })

  describe('Appointment Confirmation', () => {
    it('should transition appointment from pending to confirmed', async () => {
      const startTime = new Date('2025-12-22T10:00:00Z')
      const endTime = new Date('2025-12-22T11:00:00Z')

      // Create pending appointment
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
      })

      expect(appointment.status).toBe('pending')
      const originalUpdatedAt = appointment.updated_at

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Confirm appointment
      const { data: updated, error } = await supabaseService
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointment.id)
        .select()
        .single()

      expectNoError(error)
      expectData(updated)
      expect(updated.status).toBe('confirmed')

      // Verify updated_at changed
      expect(updated.updated_at).not.toBe(originalUpdatedAt)
      expectRecentTimestamp(updated.updated_at)
    })

    it('should allow confirming using booking token', async () => {
      const startTime = new Date('2025-12-22T14:00:00Z')
      const endTime = new Date('2025-12-22T15:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
      })

      // Confirm using booking token (simulates public API access)
      const { data: updated, error } = await supabaseService
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('booking_token', appointment.booking_token)
        .select()
        .single()

      expectNoError(error)
      expect(updated!.status).toBe('confirmed')
    })
  })

  describe('Appointment Cancellation', () => {
    it('should transition appointment from confirmed to cancelled', async () => {
      const startTime = new Date('2025-12-23T10:00:00Z')
      const endTime = new Date('2025-12-23T11:00:00Z')

      // Create confirmed appointment
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed',
      })

      expect(appointment.status).toBe('confirmed')

      // Cancel appointment
      const { data: cancelled, error } = await supabaseService
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointment.id)
        .select()
        .single()

      expectNoError(error)
      expectData(cancelled)
      expect(cancelled.status).toBe('cancelled')
      expectRecentTimestamp(cancelled.updated_at)
    })

    it('should allow cancelling using booking token', async () => {
      const startTime = new Date('2025-12-23T14:00:00Z')
      const endTime = new Date('2025-12-23T15:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed',
      })

      // Cancel using booking token
      const { data: cancelled, error } = await supabaseService
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('booking_token', appointment.booking_token)
        .select()
        .single()

      expectNoError(error)
      expect(cancelled!.status).toBe('cancelled')
    })

    it('should transition from pending directly to cancelled', async () => {
      const startTime = new Date('2025-12-23T16:00:00Z')
      const endTime = new Date('2025-12-23T17:00:00Z')

      // Create pending appointment
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
      })

      // Cancel without confirming first
      const { data: cancelled, error } = await supabaseService
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointment.id)
        .select()
        .single()

      expectNoError(error)
      expect(cancelled!.status).toBe('cancelled')
    })
  })

  describe('Complete Lifecycle Flow', () => {
    it('should complete full appointment lifecycle: create → confirm → cancel', async () => {
      const startTime = new Date('2025-12-24T10:00:00Z')
      const endTime = new Date('2025-12-24T11:00:00Z')

      // Step 1: Create pending appointment
      const created = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        patient_name: 'Full Lifecycle Test',
        patient_email: 'lifecycle@test.com',
        patient_phone: '+15551112222',
        status: 'pending',
      })

      expect(created.status).toBe('pending')
      const createdAt = created.created_at

      // Step 2: Confirm appointment
      await new Promise((resolve) => setTimeout(resolve, 100))

      const { data: confirmed, error: confirmError } = await supabaseService
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', created.id)
        .select()
        .single()

      expectNoError(confirmError)
      expect(confirmed!.status).toBe('confirmed')
      expect(confirmed!.updated_at).not.toBe(createdAt)

      // Step 3: Cancel appointment
      await new Promise((resolve) => setTimeout(resolve, 100))

      const { data: cancelled, error: cancelError } = await supabaseService
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', created.id)
        .select()
        .single()

      expectNoError(cancelError)
      expect(cancelled!.status).toBe('cancelled')
      expect(cancelled!.updated_at).not.toBe(confirmed!.updated_at)

      // Verify timestamps progression
      const createdTime = new Date(created.created_at).getTime()
      const confirmedTime = new Date(confirmed!.updated_at).getTime()
      const cancelledTime = new Date(cancelled!.updated_at).getTime()

      expect(confirmedTime).toBeGreaterThan(createdTime)
      expect(cancelledTime).toBeGreaterThan(confirmedTime)
    })
  })

  describe('Invalid Status Transitions', () => {
    it('should reject invalid status values', async () => {
      const startTime = new Date('2025-12-25T10:00:00Z')
      const endTime = new Date('2025-12-25T11:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed',
      })

      // Try to set invalid status
      const { data, error } = await supabaseService
        .from('appointments')
        .update({ status: 'invalid-status' as any })
        .eq('id', appointment.id)
        .select()

      // Should fail with check constraint violation
      expect(error).toBeTruthy()
      expect(error!.code).toBe('23514') // Check constraint violation
    })
  })

  describe('Appointment Notes', () => {
    it('should allow adding notes to appointment', async () => {
      const startTime = new Date('2025-12-26T10:00:00Z')
      const endTime = new Date('2025-12-26T11:00:00Z')

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        notes: 'Initial booking notes',
      })

      expect(appointment.notes).toBe('Initial booking notes')

      // Update notes
      const { data: updated, error } = await supabaseService
        .from('appointments')
        .update({ notes: 'Updated notes after patient call' })
        .eq('id', appointment.id)
        .select()
        .single()

      expectNoError(error)
      expect(updated!.notes).toBe('Updated notes after patient call')
    })

    it('should allow very long notes (up to TEXT field limit)', async () => {
      const startTime = new Date('2025-12-26T14:00:00Z')
      const endTime = new Date('2025-12-26T15:00:00Z')

      const longNotes = 'A'.repeat(5000) // 5000 character note

      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime,
        end_time: endTime,
        notes: longNotes,
      })

      expect(appointment.notes).toBe(longNotes)
      expect(appointment.notes!.length).toBe(5000)
    })
  })
})
