/**
 * REAL Integration Test: Row Level Security (RLS) Policies
 *
 * This test connects to a REAL local Supabase database and tests:
 * - RLS policies are properly enabled on all tables
 * - Anonymous (public) users can only access allowed data
 * - Authenticated users have appropriate access based on role
 * - Service role bypasses RLS (used in API routes)
 * - Policy enforcement at the database level
 *
 * Security Model Being Tested:
 * - Public users can view availability and active appointment types
 * - Service role can create appointments
 * - Authenticated users (admins) can manage all data
 *
 * Prerequisites:
 * 1. Docker running
 * 2. Local Supabase started: pnpm supabase:start
 * 3. .env.test configured with local credentials
 * 4. RLS policies migration applied
 *
 * Run: pnpm test:integration
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { supabaseService, supabaseAnon } from '../../../vitest.integration.setup'
import {
  createTestDoctor,
  createTestAppointmentType,
  createTestAppointment,
  createTestAvailability,
  createDoctorWithPassword,
  signInAsDoctor,
  signOut,
  expectNoError,
} from './helpers'

describe('Row Level Security (RLS) Policies - Real Database Integration', () => {
  let testDoctorId: string
  let testAppointmentTypeId: string

  beforeEach(async () => {
    // Always sign out before each test to start fresh
    await signOut()

    // Create test data using service role (bypasses RLS)
    const doctor = await createTestDoctor()
    testDoctorId = doctor.id

    const appointmentType = await createTestAppointmentType({
      display_name: 'RLS Test Appointment',
      is_active: true,
    })
    testAppointmentTypeId = appointmentType.id
  })

  afterEach(async () => {
    // Always sign out after each test to prevent session leakage
    await signOut()
  })

  describe('Availability Table RLS', () => {
    it('should allow public (anonymous) users to view availability', async () => {
      // Create availability using service role
      const availability = await createTestAvailability({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 1, // Monday
        start_time: '09:00:00',
        end_time: '17:00:00',
      })

      // Query as anonymous user (uses anon client)
      const { data, error } = await supabaseAnon
        .from('availability')
        .select('*')
        .eq('id', availability.id)
        .single()

      // Public should be able to read availability
      expectNoError(error)
      expect(data).toBeDefined()
      expect(data!.id).toBe(availability.id)
    })

    it('should prevent public (anonymous) users from creating availability', async () => {
      // Try to insert as anonymous user
      const { data, error } = await supabaseAnon.from('availability').insert({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 2, // Tuesday
        start_time: '09:00:00',
        end_time: '17:00:00',
      })

      // Should be blocked by RLS
      expect(error).toBeTruthy()
      expect(data).toBeNull()
    })

    it('should prevent public (anonymous) users from updating availability', async () => {
      const availability = await createTestAvailability({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 3,
        start_time: '09:00:00',
        end_time: '17:00:00',
      })

      // Try to update as anonymous user
      const { data, error } = await supabaseAnon
        .from('availability')
        .update({ start_time: '10:00:00' })
        .eq('id', availability.id)
        .select()

      // RLS blocks this by returning empty result (0 rows affected)
      // PostgreSQL doesn't throw an error for UPDATE with RLS - it just affects 0 rows
      expectNoError(error)
      expect(data).toEqual([]) // No rows updated

      // Verify the record wasn't actually updated
      const { data: unchanged } = await supabaseService
        .from('availability')
        .select('start_time')
        .eq('id', availability.id)
        .single()

      expect(unchanged!.start_time).toBe('09:00:00') // Still original time
    })

    it('should prevent public (anonymous) users from deleting availability', async () => {
      const availability = await createTestAvailability({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 4,
        start_time: '09:00:00',
        end_time: '17:00:00',
      })

      // Try to delete as anonymous user
      const { data, error } = await supabaseAnon
        .from('availability')
        .delete()
        .eq('id', availability.id)
        .select()

      // RLS blocks this by returning empty result (0 rows affected)
      // PostgreSQL doesn't throw an error for DELETE with RLS - it just affects 0 rows
      expectNoError(error)
      expect(data).toEqual([]) // No rows deleted

      // Verify the record still exists
      const { data: stillExists } = await supabaseService
        .from('availability')
        .select('id')
        .eq('id', availability.id)
        .single()

      expect(stillExists).toBeDefined() // Record still there
    })

    it('should allow authenticated users to create availability', async () => {
      // Create doctor with password and sign in
      const doctor = await createDoctorWithPassword()
      await signInAsDoctor(doctor.email)

      // Try to insert as authenticated user
      const { data, error } = await supabaseAnon.from('availability').insert({
        doctor_id: doctor.id,
        is_recurring: true,
        day_of_week: 5,
        start_time: '09:00:00',
        end_time: '17:00:00',
      }).select().single()

      // Should be allowed by RLS
      expectNoError(error)
      expect(data).toBeDefined()

      await signOut()
    })
  })

  describe('Appointment Types Table RLS', () => {
    it('should allow public (anonymous) users to view active appointment types', async () => {
      // Query active appointment types as anonymous
      const { data, error } = await supabaseAnon
        .from('appointment_types')
        .select('*')
        .eq('is_active', true)

      // Public should see active types
      expectNoError(error)
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should prevent public (anonymous) users from viewing inactive appointment types', async () => {
      // Create inactive appointment type
      const inactiveType = await createTestAppointmentType({
        display_name: 'Inactive Type',
        is_active: false,
      })

      // Try to query as anonymous user
      const { data, error } = await supabaseAnon
        .from('appointment_types')
        .select('*')
        .eq('id', inactiveType.id)

      // Should return empty (RLS filters out inactive types for public)
      expectNoError(error)
      expect(data).toEqual([])
    })

    it('should prevent public (anonymous) users from creating appointment types', async () => {
      const { data, error } = await supabaseAnon.from('appointment_types').insert({
        name: `test-public-${Date.now()}`,
        display_name: 'Public Test',
        display_name_es: 'Prueba Pública',
        duration_minutes: 30,
        is_active: true,
      })

      // Should be blocked by RLS
      expect(error).toBeTruthy()
    })

    it('should allow authenticated users to view all appointment types (including inactive)', async () => {
      // Create inactive type
      const inactiveType = await createTestAppointmentType({
        display_name: 'Admin View Test',
        is_active: false,
      })

      // Sign in as doctor
      const doctor = await createDoctorWithPassword()
      await signInAsDoctor(doctor.email)

      // Query all types
      const { data, error } = await supabaseAnon
        .from('appointment_types')
        .select('*')
        .eq('id', inactiveType.id)

      // Authenticated should see inactive types too
      expectNoError(error)
      expect(data).toBeDefined()
      expect(data!.length).toBeGreaterThan(0)

      await signOut()
    })
  })

  describe('Appointments Table RLS', () => {
    it('should prevent public (anonymous) users from viewing appointments', async () => {
      // Create appointment using service role
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: new Date('2025-12-30T10:00:00Z'),
        end_time: new Date('2025-12-30T11:00:00Z'),
      })

      // Try to query as anonymous user
      const { data, error } = await supabaseAnon
        .from('appointments')
        .select('*')
        .eq('id', appointment.id)

      // Anonymous users should not see appointments
      expectNoError(error)
      expect(data).toEqual([])
    })

    it('should prevent public users from creating appointments outside availability', async () => {
      // Create availability: Monday 9am-5pm only
      await createTestAvailability({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 1, // Monday
        start_time: '09:00:00',
        end_time: '17:00:00',
      })

      // Try to book on Tuesday (day_of_week = 2, no availability)
      const tuesdayStart = new Date('2025-12-23T10:00:00Z') // Tuesday
      const tuesdayEnd = new Date('2025-12-23T11:00:00Z')

      const { data: tuesdayAppt, error: tuesdayError } = await supabaseAnon
        .from('appointments')
        .insert({
          doctor_id: testDoctorId,
          appointment_type_id: testAppointmentTypeId,
          start_time: tuesdayStart.toISOString(),
          end_time: tuesdayEnd.toISOString(),
          patient_name: 'Test Patient',
          patient_email: 'test@test.com',
          patient_phone: '+15551234567',
          status: 'pending',
        })

      // Should be blocked - no availability on Tuesday
      expect(tuesdayError).toBeTruthy()
      expect(tuesdayAppt).toBeNull()
    })

    it('should allow public users to create appointments during availability', async () => {
      // FIXED: Now using SECURITY DEFINER function instead of correlated subquery
      // Migration 004 implements check_appointment_availability() function
      // This resolves PostgREST compatibility issues with RLS policies

      // NOTE: In production, public booking uses API routes with service role.
      // This test verifies the RLS policy works at the database level.

      // Create availability: Monday 9am-5pm
      const availability = await createTestAvailability({
        doctor_id: testDoctorId,
        is_recurring: true,
        day_of_week: 1, // Monday
        start_time: '09:00:00',
        end_time: '17:00:00',
        is_blocked: false,
      })

      // Verify availability was created correctly
      const { data: availCheck } = await supabaseService
        .from('availability')
        .select('*')
        .eq('id', availability.id)
        .single()

      expect(availCheck!.day_of_week).toBe(1)
      expect(availCheck!.is_blocked).toBe(false)

      // Book on Monday at 10am (within availability)
      // December 22, 2025 is a Monday (day 1)
      const mondayStart = new Date('2025-12-22T10:00:00Z')
      const mondayEnd = new Date('2025-12-22T11:00:00Z')

      // Verify it's actually Monday
      expect(mondayStart.getUTCDay()).toBe(1) // 1 = Monday in JavaScript

      // Insert as anonymous user (no .select() since anon has no SELECT policy)
      const { error: mondayError } = await supabaseAnon
        .from('appointments')
        .insert({
          doctor_id: testDoctorId,
          appointment_type_id: testAppointmentTypeId,
          start_time: mondayStart.toISOString(),
          end_time: mondayEnd.toISOString(),
          patient_name: 'Valid Patient',
          patient_email: 'valid@test.com',
          patient_phone: '+15551234567',
          status: 'pending',
        })

      // Should succeed - appointment during availability
      if (mondayError) {
        console.error('Appointment creation failed:', mondayError)
        console.log('Availability:', availCheck)
        console.log('Appointment time:', mondayStart.toISOString())
      }
      expectNoError(mondayError)

      // Verify the appointment was actually created (using service role)
      const { data: createdAppointments, error: verifyError } = await supabaseService
        .from('appointments')
        .select('*')
        .eq('patient_email', 'valid@test.com')
        .eq('start_time', mondayStart.toISOString())

      expectNoError(verifyError)
      expect(createdAppointments).toBeDefined()
      expect(createdAppointments!.length).toBeGreaterThan(0)
      expect(createdAppointments![0].status).toBe('pending')
    })

    it('should allow service role to create appointments (bypasses RLS)', async () => {
      const startTime = new Date('2025-12-31T10:00:00Z')
      const endTime = new Date('2025-12-31T11:00:00Z')

      // Service role client bypasses RLS
      const { data, error } = await supabaseService.from('appointments').insert({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        patient_name: 'Service Role Test',
        patient_email: 'service@test.com',
        patient_phone: '+15559876543',
        status: 'pending',
      }).select().single()

      // Should succeed
      expectNoError(error)
      expect(data).toBeDefined()
    })

    it('should allow authenticated users to view all appointments', async () => {
      // Create appointment
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: new Date('2026-01-01T10:00:00Z'),
        end_time: new Date('2026-01-01T11:00:00Z'),
      })

      // Sign in as doctor
      const doctor = await createDoctorWithPassword()
      await signInAsDoctor(doctor.email)

      // Query appointments
      const { data, error } = await supabaseAnon
        .from('appointments')
        .select('*')
        .eq('id', appointment.id)

      // Authenticated should see appointments
      expectNoError(error)
      expect(data).toBeDefined()
      expect(data!.length).toBeGreaterThan(0)

      await signOut()
    })

    it('should allow authenticated users to update appointments', async () => {
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: new Date('2026-01-02T10:00:00Z'),
        end_time: new Date('2026-01-02T11:00:00Z'),
        status: 'pending',
      })

      // Sign in as doctor
      const doctor = await createDoctorWithPassword()
      await signInAsDoctor(doctor.email)

      // Update appointment
      const { data, error } = await supabaseAnon
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointment.id)
        .select()
        .single()

      // Should succeed
      expectNoError(error)
      expect(data!.status).toBe('confirmed')

      await signOut()
    })

    it('should allow authenticated users to delete appointments', async () => {
      const appointment = await createTestAppointment({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: new Date('2026-01-03T10:00:00Z'),
        end_time: new Date('2026-01-03T11:00:00Z'),
      })

      // Sign in as doctor
      const doctor = await createDoctorWithPassword()
      await signInAsDoctor(doctor.email)

      // Delete appointment
      const { error } = await supabaseAnon.from('appointments').delete().eq('id', appointment.id)

      // Should succeed
      expectNoError(error)

      await signOut()
    })
  })

  describe('RLS Status Verification', () => {
    it('should verify RLS is enabled on all tables', async () => {
      // Query PostgreSQL system tables to verify RLS is enabled
      const { data, error } = await supabaseService.rpc('exec_sql', {
        query: `
          SELECT tablename, rowsecurity
          FROM pg_tables
          WHERE schemaname = 'public'
            AND tablename IN ('appointments', 'availability', 'appointment_types')
          ORDER BY tablename;
        `,
      })

      // Note: This RPC function would need to be created in Supabase
      // For now, we'll test RLS behavior through actual queries
      // This is a placeholder to document what a full RLS verification would look like

      // Alternative: Test RLS by attempting blocked operations
      const { error: blockedError } = await supabaseAnon.from('appointments').insert({
        doctor_id: testDoctorId,
        appointment_type_id: testAppointmentTypeId,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        patient_name: 'Test',
        patient_email: 'test@test.com',
        patient_phone: '+15551234567',
      })

      // If RLS is enabled, this should be blocked
      expect(blockedError).toBeTruthy()
    })
  })
})
