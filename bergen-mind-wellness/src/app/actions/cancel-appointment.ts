'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendAppointmentCancellation } from '@/lib/email/send'
import { format } from 'date-fns'

/**
 * Server Action for cancelling appointments as admin
 *
 * Provides type-safe appointment cancellation with:
 * - Admin authentication check via RLS
 * - Optional cancellation reason tracking
 * - Database update with cancellation metadata
 * - Email notification to patient
 */

// Zod schema for cancel validation
const cancelSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  cancellationReason: z.string().optional(),
  locale: z.enum(['en', 'es']).optional().default('en'),
})

export type CancelInput = z.infer<typeof cancelSchema>

export type CancelState = {
  success: boolean
  error: string | null
  appointment?: {
    id: string
    status: string
  }
}

/**
 * Cancel Appointment Server Action (Admin Only)
 *
 * Admin-only action to cancel confirmed/pending appointments.
 * Sets cancellation metadata, sends email notification to patient,
 * and tracks optional cancellation reason.
 *
 * @param data - Cancel data including appointment ID and optional reason
 * @returns CancelState - Success/error state with updated appointment details
 */
export async function cancelAppointmentAsAdmin(
  data: CancelInput
): Promise<CancelState> {
  try {
    // Validate input with Zod
    const validationResult = cancelSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
      }
    }

    const validatedData = validationResult.data

    // Create Supabase client (uses auth context for RLS)
    const supabase = await createClient()

    // Check authentication and authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized. Please sign in as an administrator.',
      }
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return {
        success: false,
        error: 'Forbidden. Admin access required to cancel appointments.',
      }
    }

    // Fetch current appointment details
    const { data: currentAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        patient_name,
        patient_email,
        patient_locale,
        timezone,
        status,
        appointment_type:appointment_types(
          id,
          display_name,
          display_name_es,
          duration_minutes
        )
      `)
      .eq('id', validatedData.appointmentId)
      .single()

    if (fetchError || !currentAppointment) {
      console.error('Error fetching appointment:', fetchError)
      return {
        success: false,
        error: 'Appointment not found. It may have been deleted.',
      }
    }

    // Verify appointment is cancellable (not already cancelled)
    if (currentAppointment.status === 'cancelled') {
      return {
        success: false,
        error: 'This appointment is already cancelled.',
      }
    }

    // Update the appointment with cancellation metadata
    const { data: cancelledAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: 'doctor',
        cancellation_reason: validatedData.cancellationReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.appointmentId)
      .select()
      .single()

    if (updateError || !cancelledAppointment) {
      console.error('Error cancelling appointment:', updateError)
      return {
        success: false,
        error: 'Failed to cancel appointment. Please try again.',
      }
    }

    // Send cancellation email notification (don't fail cancellation if email fails)
    try {
      // Extract appointment type (Supabase returns array for joins, take first element)
      const appointmentType = Array.isArray(currentAppointment.appointment_type)
        ? currentAppointment.appointment_type[0]
        : currentAppointment.appointment_type

      const appointmentTypeName = currentAppointment.patient_locale === 'es'
        ? (appointmentType.display_name_es || appointmentType.display_name)
        : appointmentType.display_name

      await sendAppointmentCancellation({
        patientName: currentAppointment.patient_name,
        patientEmail: currentAppointment.patient_email,
        appointmentType: appointmentTypeName,
        appointmentDate: new Date(currentAppointment.start_time),
        appointmentTime: format(new Date(currentAppointment.start_time), 'h:mm a'),
        timezone: currentAppointment.timezone,
        cancelledBy: 'doctor',
        cancellationReason: validatedData.cancellationReason,
        locale: currentAppointment.patient_locale,
      })
    } catch (emailError) {
      // Log error but don't fail the cancellation
      console.error('Error sending cancellation email:', emailError)
    }

    // Return success response
    return {
      success: true,
      error: null,
      appointment: {
        id: cancelledAppointment.id,
        status: cancelledAppointment.status,
      },
    }

  } catch (error) {
    console.error('Error in cancelAppointmentAsAdmin Server Action:', error)
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.',
    }
  }
}
