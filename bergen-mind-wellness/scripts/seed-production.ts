/**
 * Production Database Seeding Script
 *
 * Seeds the production Supabase database with a test appointment for manual testing
 * Run with: npx tsx scripts/seed-production.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedProduction() {
  console.log('🌱 Seeding production database...')
  console.log(`📡 Connected to: ${supabaseUrl}`)

  try {
    // First, list all appointment types in production
    const { data: allTypes, error: listError } = await supabase
      .from('appointment_types')
      .select('id, name, display_name')

    if (listError) {
      console.error('❌ Error listing appointment types:', listError)
      process.exit(1)
    }

    console.log(`📋 Found ${allTypes?.length || 0} appointment types in production:`)
    allTypes?.forEach((type) => {
      console.log(`  - ${type.name} (${type.display_name})`)
    })

    // Get first available appointment type
    const { data: appointmentTypes, error: typeError} = await supabase
      .from('appointment_types')
      .select('id, name, display_name')
      .limit(1)
      .single()

    if (typeError || !appointmentTypes) {
      console.error('❌ Error: No appointment types found in production')
      console.error('Please ensure migrations have been applied to production')
      process.exit(1)
    }

    console.log(`✅ Using appointment type: ${appointmentTypes.name} (${appointmentTypes.display_name})`)

    // Insert Emily Rodriguez test appointment
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        doctor_id: '11111111-1111-1111-1111-111111111111',
        patient_name: 'Emily Rodriguez',
        patient_email: 'emily.rodriguez@example.com',
        patient_phone: '5551234567',
        patient_locale: 'en',
        start_time: '2025-11-20T09:30:00+00:00',
        end_time: '2025-11-20T10:30:00+00:00',
        timezone: 'America/New_York',
        status: 'pending',
        appointment_type_id: appointmentTypes.id,
        booking_token: 'token_emily_prod_001',
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error inserting appointment:', insertError)
      process.exit(1)
    }

    console.log('✅ Successfully inserted test appointment:')
    console.log({
      id: appointment.id,
      patient_name: appointment.patient_name,
      start_time: appointment.start_time,
      status: appointment.status,
    })

    console.log('\n🎉 Production database seeded successfully!')
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

seedProduction()
