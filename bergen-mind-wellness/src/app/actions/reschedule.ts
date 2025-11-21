'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { validateAppointmentBooking, hasTimeConflict } from '@/lib/appointments/availability'
import { parseISO, format } from 'date-fns'
import { sendAppointmentReschedule } from '@/lib/email/send'

/**
 * Server Action for rescheduling appointments (Admin only)
 *
 * Provides type-safe appointment rescheduling with:
 * - Admin authentication check via RLS
 * - Conflict detection (excluding current appointment)
 * - Validation of new time slot
 * - Database update
 * - Email notification to patient
 */

// Zod schema for reschedule validation
const rescheduleSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  newStartTime: z.string(), // ISO datetime string
  newEndTime: z.string(),   // ISO datetime string
  locale: z.enum(['en', 'es']).optional().default('en'),
})

export type RescheduleInput = z.infer<typeof rescheduleSchema>

export type RescheduleState = {
  success: boolean
  error: string | null
  appointment?: {
    id: string
    startTime: string
    endTime: string
    status: string
  }
}

/**
 * Reschedule Appointment Server Action
 *
 * Admin-only action to reschedule confirmed/pending appointments.
 * Validates new time slot, checks for conflicts (excluding current appointment),
 * updates database, and sends email notification to patient.
 *
 * @param data - Reschedule data including appointment ID and new times
 * @returns RescheduleState - Success/error state with updated appointment details
 */
export async function rescheduleAppointment(
  data: RescheduleInput
): Promise<RescheduleState> {
  try {
    // Validate input with Zod
    const validationResult = rescheduleSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
      }
    }

    const validatedData = validationResult.data

    // Parse new start and end times
    let newStartDateTime: Date
    let newEndDateTime: Date

    try {
      newStartDateTime = parseISO(validatedData.newStartTime)
      newEndDateTime = parseISO(validatedData.newEndTime)

      if (isNaN(newStartDateTime.getTime()) || isNaN(newEndDateTime.getTime())) {
        throw new Error('Invalid date')
      }

      if (newEndDateTime <= newStartDateTime) {
        return {
          success: false,
          error: 'End time must be after start time.',
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid time format. Please select a valid time slot.',
      }
    }

    // Validate the new appointment time is allowed
    const validation = validateAppointmentBooking(newStartDateTime)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'This time slot is not available.',
      }
    }

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
        error: 'Forbidden. Admin access required to reschedule appointments.',
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
        doctor_id,
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

    // Verify appointment is reschedulable (not cancelled)
    if (currentAppointment.status === 'cancelled') {
      return {
        success: false,
        error: 'Cannot reschedule cancelled appointments. Please create a new booking.',
      }
    }

    // Check for conflicts with existing appointments
    // KEY: Exclude the current appointment being rescheduled
    // Proper overlap detection: existing appointment overlaps if:
    //   - it starts before new appointment ends AND
    //   - it ends after new appointment starts
    const { data: existingAppointments, error: conflictError } = await supabase
      .from('appointments')
      .select('id, start_time, end_time')
      .eq('doctor_id', currentAppointment.doctor_id)
      .in('status', ['pending', 'confirmed'])
      .neq('id', validatedData.appointmentId) // EXCLUDE current appointment
      .lt('start_time', newEndDateTime.toISOString())
      .gt('end_time', newStartDateTime.toISOString())

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError)
      return {
        success: false,
        error: 'Failed to check availability. Please try again.',
      }
    }

    // Check if there's a time conflict
    const appointments = (existingAppointments || []).map(apt => ({
      start: new Date(apt.start_time),
      end: new Date(apt.end_time),
    }))

    if (hasTimeConflict(newStartDateTime, newEndDateTime, appointments)) {
      return {
        success: false,
        error: 'This time slot is no longer available. Please select a different time.',
      }
    }

    // Update the appointment
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        start_time: newStartDateTime.toISOString(),
        end_time: newEndDateTime.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.appointmentId)
      .select()
      .single()

    if (updateError || !updatedAppointment) {
      console.error('Error updating appointment:', updateError)
      return {
        success: false,
        error: 'Failed to reschedule appointment. Please try again.',
      }
    }

    // Send reschedule email notification (don't fail reschedule if email fails)
    try {
      // Extract appointment type (Supabase returns array for joins, take first element)
      const appointmentType = Array.isArray(currentAppointment.appointment_type)
        ? currentAppointment.appointment_type[0]
        : currentAppointment.appointment_type

      const appointmentTypeName = currentAppointment.patient_locale === 'es'
        ? (appointmentType.display_name_es || appointmentType.display_name)
        : appointmentType.display_name

      await sendAppointmentReschedule({
        patientName: currentAppointment.patient_name,
        patientEmail: currentAppointment.patient_email,
        appointmentType: appointmentTypeName,
        oldAppointmentDate: new Date(currentAppointment.start_time),
        oldAppointmentTime: format(new Date(currentAppointment.start_time), 'h:mm a'),
        newAppointmentDate: newStartDateTime,
        newAppointmentTime: format(newStartDateTime, 'h:mm a'),
        timezone: currentAppointment.timezone,
        locale: currentAppointment.patient_locale,
      })
    } catch (emailError) {
      // Log error but don't fail the reschedule
      console.error('Error sending reschedule email:', emailError)
    }

    // Return success response
    return {
      success: true,
      error: null,
      appointment: {
        id: updatedAppointment.id,
        startTime: updatedAppointment.start_time,
        endTime: updatedAppointment.end_time,
        status: updatedAppointment.status,
      },
    }

  } catch (error) {
    console.error('Error in rescheduleAppointment Server Action:', error)
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.',
    }
  }
}
