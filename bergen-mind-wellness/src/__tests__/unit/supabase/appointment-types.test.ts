/**
 * Integration Tests: Appointment Types Management
 *
 * Tests admin setting up different appointment types with varying durations
 * (30min, 45min, 60min) and verifying they're available for booking.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { AppointmentType } from '@/types/database'

const mockSupabaseUrl = 'https://test.supabase.co'
const mockSupabaseKey = 'test-key'

describe('Appointment Types Integration', () => {
  let supabase: ReturnType<typeof createClient>
  let createdTypes: string[] = []

  beforeEach(() => {
    supabase = createClient(mockSupabaseUrl, mockSupabaseKey)
    createdTypes = []
  })

  afterEach(async () => {
    // Cleanup
    if (createdTypes.length > 0) {
      await supabase
        .from('appointment_types')
        .delete()
        .in('id', createdTypes)
    }
  })

  it('should create a 30-minute follow-up appointment type', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'follow-up',
      display_name: 'Follow-up Appointment',
      display_name_es: 'Cita de Seguimiento',
      duration_minutes: 30,
      description: 'Brief follow-up visit',
      description_es: 'Visita de seguimiento breve',
      color: '#3b82f6',
      is_active: true,
      sort_order: 2,
    }

    const { data, error } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data.duration_minutes).toBe(30)
    expect(data.display_name).toBe('Follow-up Appointment')

    if (data) createdTypes.push(data.id)
  })

  it('should create a 45-minute medication management appointment type', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'medication-management',
      display_name: 'Medication Management',
      display_name_es: 'Gestión de Medicamentos',
      duration_minutes: 45,
      description: 'Medication review and adjustment',
      description_es: 'Revisión y ajuste de medicamentos',
      color: '#10b981',
      is_active: true,
      sort_order: 3,
    }

    const { data, error } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data.duration_minutes).toBe(45)

    if (data) createdTypes.push(data.id)
  })

  it('should create a 60-minute initial consultation appointment type', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'initial-consultation',
      display_name: 'Initial Consultation',
      display_name_es: 'Consulta Inicial',
      duration_minutes: 60,
      description: 'Comprehensive first visit',
      description_es: 'Primera visita completa',
      color: '#8b5cf6',
      is_active: true,
      sort_order: 1,
    }

    const { data, error } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data.duration_minutes).toBe(60)

    if (data) createdTypes.push(data.id)
  })

  it('should retrieve only active appointment types', async () => {
    // Create active type
    const activeType: Partial<AppointmentType> = {
      name: 'active-type',
      display_name: 'Active Type',
      duration_minutes: 30,
      is_active: true,
      sort_order: 1,
    }

    const { data: active } = await supabase
      .from('appointment_types')
      .insert(activeType)
      .select()
      .single()

    if (active) createdTypes.push(active.id)

    // Create inactive type
    const inactiveType: Partial<AppointmentType> = {
      name: 'inactive-type',
      display_name: 'Inactive Type',
      duration_minutes: 30,
      is_active: false,
      sort_order: 2,
    }

    const { data: inactive } = await supabase
      .from('appointment_types')
      .insert(inactiveType)
      .select()
      .single()

    if (inactive) createdTypes.push(inactive.id)

    // Query only active types
    const { data: activeTypes, error } = await supabase
      .from('appointment_types')
      .select('*')
      .eq('is_active', true)
      .in('id', createdTypes)

    expect(error).toBeNull()
    expect(activeTypes).toHaveLength(1)
    expect(activeTypes![0].name).toBe('active-type')
  })

  it('should order appointment types by sort_order', async () => {
    const types: Partial<AppointmentType>[] = [
      {
        name: 'type-third',
        display_name: 'Third Type',
        duration_minutes: 30,
        is_active: true,
        sort_order: 3,
      },
      {
        name: 'type-first',
        display_name: 'First Type',
        duration_minutes: 30,
        is_active: true,
        sort_order: 1,
      },
      {
        name: 'type-second',
        display_name: 'Second Type',
        duration_minutes: 30,
        is_active: true,
        sort_order: 2,
      },
    ]

    // Insert in random order
    for (const type of types) {
      const { data } = await supabase
        .from('appointment_types')
        .insert(type)
        .select()
        .single()

      if (data) createdTypes.push(data.id)
    }

    // Query with sorting
    const { data: sortedTypes, error } = await supabase
      .from('appointment_types')
      .select('*')
      .in('id', createdTypes)
      .order('sort_order', { ascending: true })

    expect(error).toBeNull()
    expect(sortedTypes).toHaveLength(3)
    expect(sortedTypes![0].name).toBe('type-first')
    expect(sortedTypes![1].name).toBe('type-second')
    expect(sortedTypes![2].name).toBe('type-third')
  })

  it('should update appointment type details', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'therapy-session',
      display_name: 'Therapy Session',
      duration_minutes: 50,
      is_active: true,
      sort_order: 1,
    }

    const { data: created } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    if (created) createdTypes.push(created.id)

    // Update duration to 60 minutes
    const { data: updated, error } = await supabase
      .from('appointment_types')
      .update({ duration_minutes: 60 })
      .eq('id', created!.id)
      .select()
      .single()

    expect(error).toBeNull()
    expect(updated.duration_minutes).toBe(60)
  })

  it('should deactivate an appointment type instead of deleting', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'old-type',
      display_name: 'Old Type',
      duration_minutes: 30,
      is_active: true,
      sort_order: 1,
    }

    const { data: created } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    if (created) createdTypes.push(created.id)

    // Deactivate instead of delete
    const { data: deactivated, error } = await supabase
      .from('appointment_types')
      .update({ is_active: false })
      .eq('id', created!.id)
      .select()
      .single()

    expect(error).toBeNull()
    expect(deactivated.is_active).toBe(false)

    // Type still exists but won't show in active queries
    const { data: activeTypes } = await supabase
      .from('appointment_types')
      .select('*')
      .eq('id', created!.id)
      .eq('is_active', true)

    expect(activeTypes).toHaveLength(0)
  })

  it('should support bilingual display names', async () => {
    const appointmentType: Partial<AppointmentType> = {
      name: 'consultation',
      display_name: 'Consultation',
      display_name_es: 'Consulta',
      description: 'Medical consultation',
      description_es: 'Consulta médica',
      duration_minutes: 45,
      is_active: true,
      sort_order: 1,
    }

    const { data, error } = await supabase
      .from('appointment_types')
      .insert(appointmentType)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data.display_name).toBe('Consultation')
    expect(data.display_name_es).toBe('Consulta')
    expect(data.description).toBe('Medical consultation')
    expect(data.description_es).toBe('Consulta médica')

    if (data) createdTypes.push(data.id)
  })

  it('should fetch appointment types via API endpoint format', async () => {
    // Create multiple types
    const types: Partial<AppointmentType>[] = [
      {
        name: 'type-1',
        display_name: 'Type 1',
        duration_minutes: 30,
        is_active: true,
        sort_order: 1,
      },
      {
        name: 'type-2',
        display_name: 'Type 2',
        duration_minutes: 45,
        is_active: true,
        sort_order: 2,
      },
    ]

    for (const type of types) {
      const { data } = await supabase
        .from('appointment_types')
        .insert(type)
        .select()
        .single()

      if (data) createdTypes.push(data.id)
    }

    // Simulate API endpoint query
    const { data: apiTypes, error } = await supabase
      .from('appointment_types')
      .select('id, name, display_name, display_name_es, duration_minutes, description, description_es, sort_order')
      .eq('is_active', true)
      .in('id', createdTypes)
      .order('sort_order', { ascending: true })

    expect(error).toBeNull()
    expect(apiTypes).toHaveLength(2)
    expect(apiTypes![0].duration_minutes).toBe(30)
    expect(apiTypes![1].duration_minutes).toBe(45)
  })
})
