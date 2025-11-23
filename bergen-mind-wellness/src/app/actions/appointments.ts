'use server'

import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateAppointmentBooking, hasTimeConflict, getAvailableHoursForDay } from '@/lib/appointments/availability'
import { addMinutes, parseISO, format, startOfDay, endOfDay } from 'date-fns'
import { sendAppointmentConfirmation } from '@/lib/email/send'

/**
 * Server Action for booking appointments
 *
 * Replaces the API route with a type-safe Server Action that provides:
 * - Built-in CSRF protection
 * - End-to-end type safety
 * - Progressive enhancement
 * - Automatic state management with useActionState
 */

// Zod schema for booking validation
const bookingSchema = z.object({
  // Patient information
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientEmail: z.string().email('Invalid email address'),
  patientPhone: z.string().regex(/^\+?1?\d{10,14}$/, 'Please enter a valid phone number'),
  patientLocale: z.enum(['en', 'es']).optional().default('en'),

  // Appointment details
  startTime: z.string(), // ISO datetime string
  appointmentTypeId: z.string().uuid('Invalid appointment type'),
  timezone: z.string().optional().default('America/New_York'),

  // Optional fields
  reasonForVisit: z.string().optional(),
  doctorId: z.string().uuid().optional(),
})

// Input type for direct Server Action calls (from react-hook-form)
export type BookingInput = z.infer<typeof bookingSchema>

// Type for the Server Action state (returned to useActionState)
export type BookingState = {
  success: boolean
  error: string | null
  appointment?: {
    id: string
    startTime: string
    endTime: string
    status: string
    bookingToken: string
  }
  fieldErrors?: {
    [key: string]: string[]
  }
}

/**
 * Book Appointment Server Action
 *
 * Called directly from react-hook-form onSubmit handler.
 * Provides CSRF protection, type safety, and validation.
 *
 * @param data - Booking form data from react-hook-form
 * @returns BookingState - Success/error state with appointment details
 */
export async function bookAppointment(
  data: BookingInput
): Promise<BookingState> {
  try {
    // Validate input with Zod
    const validationResult = bookingSchema.safeParse(data)

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: fieldErrors as { [key: string]: string[] },
      }
    }

    const validatedData = validationResult.data

    // Parse start time
    let startDateTime: Date
    try {
      startDateTime = parseISO(validatedData.startTime)
      if (isNaN(startDateTime.getTime())) {
        throw new Error('Invalid date')
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid start time format. Please select a valid time slot.',
      }
    }

    // Create Supabase client with service role (bypasses RLS for public booking)
    const supabase = createServiceRoleClient()

    // Get or default doctor ID (need this to fetch availability)
    let doctorId = validatedData.doctorId
    if (!doctorId) {
      const { data: doctor, error: doctorError } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['doctor', 'admin'])
        .limit(1)
        .single()

      if (doctorError || !doctor) {
        return {
          success: false,
          error: 'No doctors available at this time. Please try again later.',
        }
      }

      doctorId = doctor.id
    }

    // Fetch availability records to validate appointment time
    const dateString = format(startDateTime, 'yyyy-MM-dd')
    const dayOfWeek = startDateTime.getDay() === 0 ? 7 : startDateTime.getDay()

    // Fetch both specific date and recurring availability
    const { data: specificDateAvailability } = await supabase
      .from('availability_slots')
      .select('id, day_of_week, specific_date, start_time, end_time, is_recurring, is_blocked, block_reason')
      .eq('doctor_id', doctorId)
      .eq('specific_date', dateString)

    const { data: recurringAvailability } = await supabase
      .from('availability_slots')
      .select('id, day_of_week, specific_date, start_time, end_time, is_recurring, is_blocked, block_reason')
      .eq('doctor_id', doctorId)
      .eq('is_recurring', true)
      .eq('day_of_week', dayOfWeek)

    const availabilityRecords = [...(specificDateAvailability || []), ...(recurringAvailability || [])]
    const availableHours = getAvailableHoursForDay(startDateTime, availabilityRecords)

    // Validate the appointment time is allowed
    const validation = validateAppointmentBooking(startDateTime, availableHours)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'This time slot is not available.',
      }
    }

    // Get appointment type details
    const { data: appointmentType, error: typeError } = await supabase
      .from('appointment_types')
      .select('id, duration_minutes, display_name, display_name_es')
      .eq('id', validatedData.appointmentTypeId)
      .eq('is_active', true)
      .single()

    if (typeError || !appointmentType) {
      return {
        success: false,
        error: 'Invalid appointment type. Please select a valid appointment type.',
      }
    }

    // Calculate end time based on appointment type duration
    const endDateTime = addMinutes(startDateTime, appointmentType.duration_minutes)

    // Check for conflicts with existing appointments
    // Proper overlap detection: existing appointment overlaps if:
    //   - it starts before new appointment ends AND
    //   - it ends after new appointment starts
    const { data: existingAppointments, error: conflictError} = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', doctorId)
      .in('status', ['pending', 'confirmed'])
      .lt('start_time', endDateTime.toISOString())
      .gt('end_time', startDateTime.toISOString())

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

    if (hasTimeConflict(startDateTime, endDateTime, appointments)) {
      return {
        success: false,
        error: 'This time slot is no longer available. Please select a different time.',
      }
    }

    // Generate a unique booking token for guest access
    const bookingToken = crypto.randomUUID()

    // Create the appointment
    const { data: newAppointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctorId,
        appointment_type_id: validatedData.appointmentTypeId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        timezone: validatedData.timezone,
        status: 'pending',
        patient_name: validatedData.patientName,
        patient_email: validatedData.patientEmail,
        patient_phone: validatedData.patientPhone,
        patient_locale: validatedData.patientLocale,
        reason_for_visit: validatedData.reasonForVisit,
        booking_token: bookingToken,
      })
      .select()
      .single()

    if (insertError || !newAppointment) {
      console.error('Error creating appointment:', insertError)

      // Check if error is due to unique constraint violation (duplicate booking)
      // PostgreSQL error code 23505 = unique_violation
      if (
        insertError?.code === '23505' ||
        insertError?.message?.includes('duplicate') ||
        insertError?.message?.includes('unique') ||
        insertError?.message?.includes('idx_appointments_no_double_booking')
      ) {
        return {
          success: false,
          error: 'This time slot is no longer available. Please select a different time.',
        }
      }

      return {
        success: false,
        error: 'Failed to create appointment. Please try again.',
      }
    }

    // Send confirmation email (don't fail booking if email fails)
    try {
      await sendAppointmentConfirmation({
        patientEmail: validatedData.patientEmail,
        patientName: validatedData.patientName,
        appointmentType: validatedData.patientLocale === 'es'
          ? appointmentType.display_name_es || appointmentType.display_name
          : appointmentType.display_name,
        appointmentDate: startDateTime,
        appointmentTime: format(startDateTime, 'h:mm a'),
        timezone: validatedData.timezone,
        bookingToken,
        locale: validatedData.patientLocale,
      })
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error('Error sending confirmation email:', emailError)
    }

    // Return success response
    return {
      success: true,
      error: null,
      appointment: {
        id: newAppointment.id,
        startTime: newAppointment.start_time,
        endTime: newAppointment.end_time,
        status: newAppointment.status,
        bookingToken: newAppointment.booking_token,
      },
    }

  } catch (error) {
    console.error('Error in bookAppointment Server Action:', error)
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Server Action for fetching appointment by booking token
 *
 * Allows patients to view and manage their appointments using the
 * booking token provided in their confirmation email.
 *
 * @param token - The unique booking token for the appointment
 * @returns Appointment data or error
 */
export async function getAppointmentByToken(token: string) {
  try {
    // Validate token format (should be a UUID)
    if (!token || typeof token !== 'string' || token.length < 10) {
      return {
        error: 'Invalid booking token',
        appointment: null,
      }
    }

    // Create service role client to bypass RLS (needed to query by booking_token)
    const supabase = await createServiceRoleClient()

    // Fetch appointment with related appointment type information
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_name,
        patient_email,
        patient_phone,
        patient_locale,
        start_time,
        end_time,
        status,
        timezone,
        reason_for_visit,
        cancelled_at,
        cancelled_by,
        cancellation_reason,
        created_at,
        booking_token,
        appointment_type:appointment_types(
          id,
          name,
          display_name,
          display_name_es,
          duration_minutes
        )
      `)
      .eq('booking_token', token)
      .single()

    if (error || !appointment) {
      console.error('Error fetching appointment by token:', error)
      return {
        error: 'Appointment not found. Please check your booking token.',
        appointment: null,
      }
    }

    return {
      error: null,
      appointment,
    }
  } catch (error) {
    console.error('Error in getAppointmentByToken Server Action:', error)
    return {
      error: 'Failed to fetch appointment. Please try again.',
      appointment: null,
    }
  }
}
