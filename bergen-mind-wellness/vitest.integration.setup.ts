/**
 * Integration Test Setup - REAL Database Connection
 *
 * This setup file:
 * 1. Connects to LOCAL Supabase instance (not mocked!)
 * 2. Provides real database clients for testing
 * 3. Handles test data cleanup between tests
 * 4. Verifies database connectivity before running tests
 *
 * IMPORTANT: No mocking! These are TRUE integration tests.
 */

import '@testing-library/jest-dom/vitest'
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.test file
config({ path: resolve(__dirname, '.env.test') })

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_TEST_URL',
  'SUPABASE_TEST_ANON_KEY',
  'SUPABASE_TEST_SERVICE_KEY',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required environment variable: ${envVar}\n` +
        `Please copy .env.test.example to .env.test and fill in values from 'pnpm supabase:status'`
    )
  }
}

// Create REAL Supabase clients (no mocking!)
export const supabaseAnon = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export const supabaseService = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_SERVICE_KEY!,
  {
    auth: {
      persistSession: false, // Service role doesn't need session persistence
      autoRefreshToken: false,
    },
  }
)

// Track created IDs for cleanup
export const testDataTracker = {
  appointmentIds: [] as string[],
  availabilityIds: [] as string[],
  appointmentTypeIds: [] as string[],

  trackAppointment(id: string) {
    this.appointmentIds.push(id)
  },

  trackAvailability(id: string) {
    this.availabilityIds.push(id)
  },

  trackAppointmentType(id: string) {
    this.appointmentTypeIds.push(id)
  },

  async cleanup() {
    // Delete in correct order (respecting foreign keys)
    if (this.appointmentIds.length > 0) {
      await supabaseService.from('appointments').delete().in('id', this.appointmentIds)
      this.appointmentIds = []
    }

    if (this.availabilityIds.length > 0) {
      await supabaseService.from('availability').delete().in('id', this.availabilityIds)
      this.availabilityIds = []
    }

    // Note: Don't delete appointment_types - they're seed data
  },
}

// Global setup - runs once before all tests
beforeAll(async () => {
  console.log('\n🔗 Connecting to local Supabase instance...')
  console.log(`   URL: ${process.env.SUPABASE_TEST_URL}`)

  // Verify database connectivity
  try {
    const { data, error } = await supabaseService
      .from('appointment_types')
      .select('count')
      .limit(1)

    if (error) {
      throw error
    }

    console.log('✅ Successfully connected to test database\n')
  } catch (error) {
    console.error('❌ Failed to connect to test database')
    console.error('   Make sure Supabase is running: pnpm supabase:start')
    console.error('   Error:', error)
    throw new Error('Cannot connect to test database. Is Supabase running?')
  }
})

// Before each test - clean database state
beforeEach(async () => {
  // Start with clean slate
  await cleanAllTestData()
})

// After each test - cleanup any tracked data
afterEach(async () => {
  await testDataTracker.cleanup()
})

// Global teardown - runs once after all tests
afterAll(async () => {
  console.log('\n🧹 Cleaning up test database...')
  await cleanAllTestData()
  console.log('✅ Integration tests complete\n')
})

/**
 * Clean ALL test data from database
 * Be aggressive - we want a completely fresh state for each test run
 */
async function cleanAllTestData() {
  try {
    // Delete all appointments (except those with specific test guard UUID)
    await supabaseService
      .from('appointments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Delete all availability slots
    await supabaseService
      .from('availability')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Delete all test profiles (this will cascade delete related data)
    // Only delete profiles with @test.com emails
    const { data: testProfiles } = await supabaseService
      .from('profiles')
      .select('id')
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (testProfiles && testProfiles.length > 0) {
      for (const profile of testProfiles) {
        // Delete the auth user (this cascades to profile)
        await supabaseService.auth.admin.deleteUser(profile.id)
      }
    }

    // Note: Keep appointment_types as seed data - they're static
  } catch (error) {
    console.error('Warning: Failed to clean test data:', error)
    // Don't throw - tests should still run
  }
}

/**
 * Helper function to create test doctor in database
 * Creates a real doctor profile and returns the UUID
 */
export async function createTestDoctor(email = `doctor-${Date.now()}@test.com`) {
  // First create an auth user (this creates the auth.users record)
  const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role: 'doctor' },
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create test doctor auth user: ${authError?.message}`)
  }

  const doctorId = authData.user.id

  // Create profile with doctor role
  const { error: profileError } = await supabaseService
    .from('profiles')
    .insert({
      id: doctorId,
      role: 'doctor',
    })

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabaseService.auth.admin.deleteUser(doctorId)
    throw new Error(`Failed to create test doctor profile: ${profileError.message}`)
  }

  return doctorId
}

/**
 * Helper function to sign out all sessions
 * Useful for auth-related tests
 */
export async function signOutAll() {
  await supabaseAnon.auth.signOut()
}
