import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { sendAppointmentCancellation } from '@/lib/email/send'
import { format } from 'date-fns'

export interface CancelAppointmentRequest {
  token?: string // Booking token for guest access
  reason?: string // Optional cancellation reason
}

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/appointments/[id]/cancel
 *
 * Cancels an existing appointment
 * - Can be accessed by patients using booking token (guest access)
 * - Can be accessed by authenticated admins
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body: CancelAppointmentRequest = await request.json()

    // Validate appointment ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid appointment ID format' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role to bypass RLS
    // (Security maintained via booking token validation below)
    const supabase = createServiceRoleClient()

    // Fetch appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_name,
        patient_email,
        patient_locale,
        start_time,
        end_time,
        timezone,
        status,
        booking_token,
        appointment_type_id,
        appointment_types (
          display_name,
          display_name_es
        )
      `)
      .eq('id', id)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Appointment is already cancelled' },
        { status: 400 }
      )
    }

    // Check if appointment is in the past
    const appointmentDate = new Date(appointment.start_time)
    const now = new Date()
    if (appointmentDate < now) {
      return NextResponse.json(
        { error: 'Cannot cancel past appointments' },
        { status: 400 }
      )
    }

    // Verify access - check if request has valid booking token
    let cancelledBy: 'patient' | 'doctor' = 'patient'

    // Check for booking token (guest access)
    if (body.token) {
      if (body.token !== appointment.booking_token) {
        return NextResponse.json(
          { error: 'Invalid booking token' },
          { status: 403 }
        )
      }
    } else {
      // Check for authenticated session (admin access)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized - booking token required' },
          { status: 401 }
        )
      }

      // If authenticated, assume it's doctor/admin cancelling
      cancelledBy = 'doctor'
    }

    // Update appointment status to cancelled
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancellation_reason: body.reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error cancelling appointment:', updateError)
      return NextResponse.json(
        { error: 'Failed to cancel appointment' },
        { status: 500 }
      )
    }

    // Send cancellation email
    try {
      const appointmentType = appointment.appointment_types as any
      const appointmentTypeName = appointment.patient_locale === 'es' && appointmentType?.display_name_es
        ? appointmentType.display_name_es
        : appointmentType?.display_name || 'Appointment'

      await sendAppointmentCancellation({
        patientName: appointment.patient_name,
        patientEmail: appointment.patient_email,
        appointmentType: appointmentTypeName,
        appointmentDate: new Date(appointment.start_time),
        appointmentTime: format(new Date(appointment.start_time), 'h:mm a'),
        timezone: appointment.timezone || 'America/New_York',
        cancelledBy,
        cancellationReason: body.reason,
        locale: appointment.patient_locale || 'en',
      })
    } catch (emailError) {
      // Log error but don't fail the cancellation
      console.error('Error sending cancellation email:', emailError)
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Appointment cancelled successfully',
        appointment: {
          id: appointment.id,
          status: 'cancelled',
          cancelledBy,
        },
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in cancel appointment API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
