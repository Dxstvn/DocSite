import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export interface AppointmentTypeResponse {
  id: string
  name: string
  display_name: string
  display_name_es: string | null
  duration_minutes: number
  sort_order: number
}

/**
 * GET /api/appointments/types
 *
 * Returns all active appointment types available for booking
 * No authentication required - public endpoint for booking form
 */
export async function GET() {
  try {
    // Create Supabase client
    const supabase = await createClient()

    // Fetch all active appointment types, ordered by sort_order
    const { data: appointmentTypes, error } = await supabase
      .from('appointment_types')
      .select('id, name, display_name, display_name_es, duration_minutes, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching appointment types:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointment types' },
        { status: 500 }
      )
    }

    // Return empty array if no types found (shouldn't happen in production)
    if (!appointmentTypes || appointmentTypes.length === 0) {
      return NextResponse.json(
        {
          data: [],
          message: 'No appointment types available at this time'
        },
        { status: 200 }
      )
    }

    // Return appointment types
    return NextResponse.json(
      {
        data: appointmentTypes,
        count: appointmentTypes.length
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes to reduce database queries
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )

  } catch (error) {
    console.error('Error in appointment types API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
