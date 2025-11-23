/**
 * Integration Test Helpers
 *
 * Shared utilities for all integration tests that connect to real Supabase database.
 * Provides factory functions, assertion helpers, cleanup utilities, and auth helpers.
 *
 * IMPORTANT: These helpers work with REAL database instances, not mocks!
 */

import { supabaseService, supabaseAnon, testDataTracker } from '../../../vitest.integration.setup'
import { describe, expect } from 'vitest'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface TestAppointmentType {
  id: string
  name: string
  display_name: string
  display_name_es: string
  duration_minutes: number
  price: number
  is_active: boolean
}

export interface TestDoctor {
  id: string
  email: string
  role: 'doctor'
}

export interface TestPatient {
  id: string
  email: string
  role: 'patient'
}

export interface TestAppointment {
  id: string
  doctor_id: string
  patient_id?: string
  appointment_type_id: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  patient_name: string
  patient_email: string
  patient_phone: string
  booking_token: string
}

export interface TestAvailability {
  id: string
  doctor_id: string
  day_of_week?: number // 0=Sunday, 6=Saturday
  specific_date?: string // YYYY-MM-DD
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  is_recurring: boolean
  is_blocked: boolean
}

// =====================================================
// FACTORY FUNCTIONS - Create Test Data
// =====================================================

/**
 * Create a test appointment type in the database
 * @param overrides - Optional fields to override defaults
 * @returns Created appointment type
 */
export async function createTestAppointmentType(
  overrides: Partial<TestAppointmentType> = {}
): Promise<TestAppointmentType> {
  const defaults = {
    name: `test-apt-type-${Date.now()}`,
    display_name: 'Test Appointment',
    display_name_es: 'Cita de Prueba',
    duration_minutes: 50,
    price: 150.0,
    is_active: true,
  }

  const { data, error } = await supabaseService
    .from('appointment_types')
    .insert({ ...defaults, ...overrides })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create test appointment type: ${error.message}`)
  }

  testDataTracker.trackAppointmentType(data.id)
  return data as TestAppointmentType
}

/**
 * Create a test doctor in the database with real auth user
 * @param email - Doctor email (defaults to random)
 * @returns Created doctor profile
 */
export async function createTestDoctor(
  email: string = `doctor-${Date.now()}@test.com`
): Promise<TestDoctor> {
  // Create auth user
  const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role: 'doctor' },
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create test doctor auth user: ${authError?.message}`)
  }

  const doctorId = authData.user.id

  // Create profile
  const { error: profileError } = await supabaseService
    .from('profiles')
    .insert({
      id: doctorId,
      role: 'doctor',
    })

  if (profileError) {
    await supabaseService.auth.admin.deleteUser(doctorId)
    throw new Error(`Failed to create test doctor profile: ${profileError.message}`)
  }

  return {
    id: doctorId,
    email,
    role: 'doctor',
  }
}

/**
 * Create a test patient in the database with real auth user
 * @param email - Patient email (defaults to random)
 * @returns Created patient profile
 */
export async function createTestPatient(
  email: string = `patient-${Date.now()}@test.com`
): Promise<TestPatient> {
  // Create auth user
  const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role: 'patient' },
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create test patient auth user: ${authError?.message}`)
  }

  const patientId = authData.user.id

  // Create profile
  const { error: profileError } = await supabaseService
    .from('profiles')
    .insert({
      id: patientId,
      role: 'patient',
    })

  if (profileError) {
    await supabaseService.auth.admin.deleteUser(patientId)
    throw new Error(`Failed to create test patient profile: ${profileError.message}`)
  }

  return {
    id: patientId,
    email,
    role: 'patient',
  }
}

/**
 * Create a complete test appointment with all relations
 * @param params - Appointment parameters
 * @returns Created appointment
 */
export async function createTestAppointment(params: {
  doctor_id: string
  appointment_type_id: string
  start_time: Date
  end_time: Date
  patient_id?: string
  patient_name?: string
  patient_email?: string
  patient_phone?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
}): Promise<TestAppointment> {
  const defaults = {
    patient_name: 'Test Patient',
    patient_email: 'patient@test.com',
    patient_phone: '+15551234567',
    status: 'confirmed' as const,
  }

  const appointmentData = {
    doctor_id: params.doctor_id,
    appointment_type_id: params.appointment_type_id,
    start_time: params.start_time.toISOString(),
    end_time: params.end_time.toISOString(),
    patient_id: params.patient_id,
    patient_name: params.patient_name || defaults.patient_name,
    patient_email: params.patient_email || defaults.patient_email,
    patient_phone: params.patient_phone || defaults.patient_phone,
    status: params.status || defaults.status,
    notes: params.notes,
  }

  const { data, error } = await supabaseService
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create test appointment: ${error.message}`)
  }

  testDataTracker.trackAppointment(data.id)
  return data as TestAppointment
}

/**
 * Create a test availability slot for a doctor
 * @param params - Availability parameters
 * @returns Created availability
 */
export async function createTestAvailability(params: {
  doctor_id: string
  is_recurring?: boolean
  day_of_week?: number // For recurring: 0=Sunday, 6=Saturday
  specific_date?: Date // For non-recurring
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  is_blocked?: boolean
  block_reason?: string
}): Promise<TestAvailability> {
  const availabilityData = {
    doctor_id: params.doctor_id,
    is_recurring: params.is_recurring ?? true,
    day_of_week: params.day_of_week,
    specific_date: params.specific_date ? params.specific_date.toISOString().split('T')[0] : undefined,
    start_time: params.start_time,
    end_time: params.end_time,
    is_blocked: params.is_blocked ?? false,
    block_reason: params.block_reason,
  }

  const { data, error } = await supabaseService
    .from('availability_slots')
    .insert(availabilityData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create test availability: ${error.message}`)
  }

  testDataTracker.trackAvailability(data.id)
  return data as TestAvailability
}

// =====================================================
// ASSERTION HELPERS - Verify Database Behavior
// =====================================================

/**
 * Assert that a PostgreSQL error has the expected error code
 * @param error - Error from Supabase query
 * @param expectedCode - Expected PostgreSQL error code (e.g., '23503' for foreign key violation)
 */
export function expectPostgresError(error: any, expectedCode: string) {
  expect(error).toBeTruthy()
  expect(error.code).toBe(expectedCode)
}

/**
 * Assert that an error is a foreign key violation (23503)
 * @param error - Error from Supabase query
 */
export function expectForeignKeyViolation(error: any) {
  expectPostgresError(error, '23503')
  expect(error.message).toContain('violates foreign key constraint')
}

/**
 * Assert that an error is a unique constraint violation (23505)
 * @param error - Error from Supabase query
 */
export function expectUniqueViolation(error: any) {
  expectPostgresError(error, '23505')
  expect(error.message).toContain('duplicate key')
}

/**
 * Assert that an error is a check constraint violation (23514)
 * @param error - Error from Supabase query
 */
export function expectCheckViolation(error: any) {
  expectPostgresError(error, '23514')
  expect(error.message).toContain('violates check constraint')
}

/**
 * Assert that an RLS policy blocked the query
 * @param error - Error from Supabase query
 */
export function expectRLSViolation(error: any) {
  expect(error).toBeTruthy()
  // RLS violations typically return as 403 or with specific error messages
  const isRLSError =
    error.code === '42501' || // Insufficient privilege
    error.message?.includes('row-level security') ||
    error.message?.includes('permission denied') ||
    error.statusCode === 403

  expect(isRLSError).toBe(true)
}

/**
 * Assert that no error occurred in a Supabase query
 * @param error - Error from Supabase query
 */
export function expectNoError(error: any) {
  if (error) {
    console.error('Unexpected error:', error)
  }
  expect(error).toBeNull()
}

/**
 * Assert that data was returned from a Supabase query
 * @param data - Data from Supabase query
 */
export function expectData<T>(data: T | null): asserts data is T {
  expect(data).not.toBeNull()
  expect(data).toBeDefined()
}

/**
 * Assert that a UUID is valid (real database-generated UUID)
 * @param uuid - UUID string to validate
 */
export function expectValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  expect(uuid).toMatch(uuidRegex)
}

/**
 * Assert that timestamps are recent (within the last minute)
 * Useful for verifying auto-generated database timestamps
 * @param timestamp - ISO timestamp string
 */
export function expectRecentTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = Date.now()
  const diff = now - date.getTime()

  // Should be within the last minute
  expect(diff).toBeGreaterThanOrEqual(0)
  expect(diff).toBeLessThan(60000) // 60 seconds
}

// =====================================================
// CLEANUP UTILITIES - Delete Test Data
// =====================================================

/**
 * Delete an appointment and its relations
 * @param appointmentId - ID of appointment to delete
 */
export async function cleanupAppointment(appointmentId: string) {
  const { error } = await supabaseService.from('appointments').delete().eq('id', appointmentId)

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, which is OK
    console.warn(`Warning: Failed to cleanup appointment ${appointmentId}:`, error)
  }
}

/**
 * Delete a doctor and all cascading data (appointments, availability)
 * @param doctorId - ID of doctor to delete
 */
export async function cleanupDoctor(doctorId: string) {
  // Delete auth user (this cascades to profile and all related data)
  const { error } = await supabaseService.auth.admin.deleteUser(doctorId)

  if (error) {
    console.warn(`Warning: Failed to cleanup doctor ${doctorId}:`, error)
  }
}

/**
 * Delete a patient and their appointments
 * @param patientId - ID of patient to delete
 */
export async function cleanupPatient(patientId: string) {
  // Delete auth user (this cascades to profile)
  const { error } = await supabaseService.auth.admin.deleteUser(patientId)

  if (error) {
    console.warn(`Warning: Failed to cleanup patient ${patientId}:`, error)
  }
}

/**
 * Delete an availability slot
 * @param availabilityId - ID of availability to delete
 */
export async function cleanupAvailability(availabilityId: string) {
  const { error } = await supabaseService.from('availability_slots').delete().eq('id', availabilityId)

  if (error && error.code !== 'PGRST116') {
    console.warn(`Warning: Failed to cleanup availability ${availabilityId}:`, error)
  }
}

/**
 * Delete an appointment type
 * Note: This may fail if appointments reference it (RESTRICT constraint)
 * @param appointmentTypeId - ID of appointment type to delete
 */
export async function cleanupAppointmentType(appointmentTypeId: string) {
  const { error } = await supabaseService.from('appointment_types').delete().eq('id', appointmentTypeId)

  if (error && error.code !== 'PGRST116') {
    console.warn(`Warning: Failed to cleanup appointment type ${appointmentTypeId}:`, error)
  }
}

// =====================================================
// AUTH HELPERS - Sign In/Out
// =====================================================

/**
 * Sign in as a doctor (using anon client for RLS testing)
 * @param email - Doctor email
 * @param password - Doctor password (defaults to 'password123')
 * @returns Session data
 */
export async function signInAsDoctor(email: string, password: string = 'password123') {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Failed to sign in as doctor: ${error.message}`)
  }

  return data
}

/**
 * Sign in as a patient (using anon client for RLS testing)
 * @param email - Patient email
 * @param password - Patient password (defaults to 'password123')
 * @returns Session data
 */
export async function signInAsPatient(email: string, password: string = 'password123') {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Failed to sign in as patient: ${error.message}`)
  }

  return data
}

/**
 * Sign in as an admin (using anon client for RLS testing)
 * @param email - Admin email
 * @param password - Admin password (defaults to 'password123')
 * @returns Session data
 */
export async function signInAsAdmin(email: string, password: string = 'password123') {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Failed to sign in as admin: ${error.message}`)
  }

  return data
}

/**
 * Sign out the current user (using anon client)
 */
export async function signOut() {
  const { error } = await supabaseAnon.auth.signOut()

  if (error) {
    console.warn('Warning: Failed to sign out:', error)
  }
}

/**
 * Create a doctor with a password (for sign-in testing)
 * @param email - Doctor email
 * @param password - Doctor password
 * @returns Created doctor
 */
export async function createDoctorWithPassword(
  email: string = `doctor-${Date.now()}@test.com`,
  password: string = 'password123'
): Promise<TestDoctor> {
  // Create auth user with password
  const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'doctor' },
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create doctor with password: ${authError?.message}`)
  }

  const doctorId = authData.user.id

  // Create profile
  const { error: profileError } = await supabaseService
    .from('profiles')
    .insert({
      id: doctorId,
      role: 'doctor',
    })

  if (profileError) {
    await supabaseService.auth.admin.deleteUser(doctorId)
    throw new Error(`Failed to create doctor profile: ${profileError.message}`)
  }

  return {
    id: doctorId,
    email,
    role: 'doctor',
  }
}

/**
 * Create a patient with a password (for sign-in testing)
 * @param email - Patient email
 * @param password - Patient password
 * @returns Created patient
 */
export async function createPatientWithPassword(
  email: string = `patient-${Date.now()}@test.com`,
  password: string = 'password123'
): Promise<TestPatient> {
  // Create auth user with password
  const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'patient' },
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create patient with password: ${authError?.message}`)
  }

  const patientId = authData.user.id

  // Create profile
  const { error: profileError } = await supabaseService
    .from('profiles')
    .insert({
      id: patientId,
      role: 'patient',
    })

  if (profileError) {
    await supabaseService.auth.admin.deleteUser(patientId)
    throw new Error(`Failed to create patient profile: ${profileError.message}`)
  }

  return {
    id: patientId,
    email,
    role: 'patient',
  }
}

// =====================================================
// QUERY HELPERS - Common Database Queries
// =====================================================

/**
 * Get all appointments for a doctor on a specific date
 * @param doctorId - Doctor ID
 * @param date - Date to query
 * @returns List of appointments
 */
export async function getAppointmentsForDate(doctorId: string, date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data, error } = await supabaseService
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .in('status', ['pending', 'confirmed'])

  expectNoError(error)
  return data || []
}

/**
 * Check if two appointments have overlapping time slots
 * @param apt1 - First appointment
 * @param apt2 - Second appointment
 * @returns True if appointments overlap
 */
export function appointmentsOverlap(
  apt1: { start_time: string; end_time: string },
  apt2: { start_time: string; end_time: string }
): boolean {
  const start1 = new Date(apt1.start_time).getTime()
  const end1 = new Date(apt1.end_time).getTime()
  const start2 = new Date(apt2.start_time).getTime()
  const end2 = new Date(apt2.end_time).getTime()

  return (
    (start2 >= start1 && start2 < end1) || // apt2 starts during apt1
    (end2 > start1 && end2 <= end1) || // apt2 ends during apt1
    (start2 <= start1 && end2 >= end1) // apt2 completely overlaps apt1
  )
}
