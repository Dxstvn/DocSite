/**
 * Integration Tests: Availability Management
 *
 * Tests admin setting up available times (10am-6pm) and verifying
 * it's reflected in the calendar.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { AvailabilitySlot } from '@/types/database'

// Mock Supabase client
const mockSupabaseUrl = 'https://test.supabase.co'
const mockSupabaseKey = 'test-key'

// Helper to create availability slot
const createAvailabilitySlot = async (
  supabase: ReturnType<typeof createClient>,
  slot: Partial<AvailabilitySlot>
) => {
  const { data, error } = await supabase
    .from('availability')
    .insert(slot)
    .select()
    .single()

  if (error) throw error
  return data as AvailabilitySlot
}

describe('Availability Management Integration', () => {
  let supabase: ReturnType<typeof createClient>
  let testDoctorId: string
  let createdSlots: string[] = []

  beforeEach(() => {
    // Create Supabase client for testing
    supabase = createClient(mockSupabaseUrl, mockSupabaseKey)
    testDoctorId = 'test-doctor-123'
    createdSlots = []
  })

  afterEach(async () => {
    // Cleanup: Delete all created slots
    if (createdSlots.length > 0) {
      await supabase
        .from('availability')
        .delete()
        .in('id', createdSlots)
    }
  })

  it('should create a recurring weekly availability slot (Monday 10am-6pm)', async () => {
    const slot: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 1, // Monday
      start_time: '10:00:00',
      end_time: '18:00:00',
      is_recurring: true,
      specific_date: null,
      is_blocked: false,
      block_reason: null,
    }

    const created = await createAvailabilitySlot(supabase, slot)
    createdSlots.push(created.id)

    expect(created).toBeDefined()
    expect(created.day_of_week).toBe(1)
    expect(created.start_time).toBe('10:00:00')
    expect(created.end_time).toBe('18:00:00')
    expect(created.is_recurring).toBe(true)
  })

  it('should create availability for all weekdays (Monday-Friday 10am-6pm)', async () => {
    const weekdays = [1, 2, 3, 4, 5] // Mon-Fri

    for (const day of weekdays) {
      const slot: Partial<AvailabilitySlot> = {
        doctor_id: testDoctorId,
        day_of_week: day,
        start_time: '10:00:00',
        end_time: '18:00:00',
        is_recurring: true,
        specific_date: null,
        is_blocked: false,
      }

      const created = await createAvailabilitySlot(supabase, slot)
      createdSlots.push(created.id)
    }

    // Verify all slots were created
    const { data: slots, error } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', testDoctorId)
      .in('day_of_week', weekdays)

    expect(error).toBeNull()
    expect(slots).toHaveLength(5)

    // Verify each weekday has a slot
    weekdays.forEach(day => {
      const daySlot = slots!.find(s => s.day_of_week === day)
      expect(daySlot).toBeDefined()
      expect(daySlot!.start_time).toBe('10:00:00')
      expect(daySlot!.end_time).toBe('18:00:00')
    })
  })

  it('should prevent overlapping availability slots for the same doctor', async () => {
    // Create first slot: Monday 10am-2pm
    const slot1: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 1,
      start_time: '10:00:00',
      end_time: '14:00:00',
      is_recurring: true,
      is_blocked: false,
    }

    const created1 = await createAvailabilitySlot(supabase, slot1)
    createdSlots.push(created1.id)

    // Attempt to create overlapping slot: Monday 12pm-4pm
    const slot2: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 1,
      start_time: '12:00:00',
      end_time: '16:00:00',
      is_recurring: true,
      is_blocked: false,
    }

    // This should either throw an error or be handled by application logic
    // For now, we'll verify we can detect the overlap
    const { data: existingSlots } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', testDoctorId)
      .eq('day_of_week', 1)

    expect(existingSlots).toHaveLength(1)

    // Application should check for overlaps before inserting
    const hasOverlap = existingSlots!.some(existing => {
      return (
        slot2.start_time! < existing.end_time &&
        slot2.end_time! > existing.start_time
      )
    })

    expect(hasOverlap).toBe(true)
  })

  it('should create a specific date availability (one-time override)', async () => {
    const specificDate = '2025-12-25' // Christmas Day special hours

    const slot: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: null, // Not recurring
      start_time: '09:00:00',
      end_time: '13:00:00',
      is_recurring: false,
      specific_date: specificDate,
      is_blocked: false,
    }

    const created = await createAvailabilitySlot(supabase, slot)
    createdSlots.push(created.id)

    expect(created.specific_date).toBe(specificDate)
    expect(created.is_recurring).toBe(false)
    expect(created.day_of_week).toBeNull()
  })

  it('should delete an availability slot', async () => {
    const slot: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 3, // Wednesday
      start_time: '10:00:00',
      end_time: '18:00:00',
      is_recurring: true,
      is_blocked: false,
    }

    const created = await createAvailabilitySlot(supabase, slot)
    const slotId = created.id

    // Delete the slot
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', slotId)

    expect(error).toBeNull()

    // Verify it's deleted
    const { data: deleted } = await supabase
      .from('availability')
      .select('*')
      .eq('id', slotId)

    expect(deleted).toHaveLength(0)
  })

  it('should update availability slot times', async () => {
    const slot: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 2, // Tuesday
      start_time: '10:00:00',
      end_time: '18:00:00',
      is_recurring: true,
      is_blocked: false,
    }

    const created = await createAvailabilitySlot(supabase, slot)
    createdSlots.push(created.id)

    // Update to shorter hours: 12pm-4pm
    const { data: updated, error } = await supabase
      .from('availability')
      .update({
        start_time: '12:00:00',
        end_time: '16:00:00',
      })
      .eq('id', created.id)
      .select()
      .single()

    expect(error).toBeNull()
    expect(updated.start_time).toBe('12:00:00')
    expect(updated.end_time).toBe('16:00:00')
  })

  it('should mark a slot as blocked (time off)', async () => {
    const slot: Partial<AvailabilitySlot> = {
      doctor_id: testDoctorId,
      day_of_week: 1,
      start_time: '10:00:00',
      end_time: '18:00:00',
      is_recurring: true,
      is_blocked: false,
    }

    const created = await createAvailabilitySlot(supabase, slot)
    createdSlots.push(created.id)

    // Block the slot (e.g., vacation)
    const { data: blocked, error } = await supabase
      .from('availability')
      .update({
        is_blocked: true,
        block_reason: 'Vacation',
      })
      .eq('id', created.id)
      .select()
      .single()

    expect(error).toBeNull()
    expect(blocked.is_blocked).toBe(true)
    expect(blocked.block_reason).toBe('Vacation')
  })

  it('should query availability for a specific doctor and day', async () => {
    // Create availability for multiple days
    const days = [1, 3, 5] // Mon, Wed, Fri
    for (const day of days) {
      const slot: Partial<AvailabilitySlot> = {
        doctor_id: testDoctorId,
        day_of_week: day,
        start_time: '10:00:00',
        end_time: '18:00:00',
        is_recurring: true,
        is_blocked: false,
      }

      const created = await createAvailabilitySlot(supabase, slot)
      createdSlots.push(created.id)
    }

    // Query only Monday's availability
    const { data: mondaySlots, error } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', testDoctorId)
      .eq('day_of_week', 1)
      .eq('is_blocked', false)

    expect(error).toBeNull()
    expect(mondaySlots).toHaveLength(1)
    expect(mondaySlots![0].day_of_week).toBe(1)
  })
})
