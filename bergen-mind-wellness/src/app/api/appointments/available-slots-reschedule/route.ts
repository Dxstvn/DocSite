import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlotsForDate } from '@/lib/appointments/availability'
import { parseISO, startOfDay, endOfDay } from 'date-fns'

/**
 * GET /api/appointments/available-slots-reschedule
 *
 * Specialized endpoint for rescheduling appointments.
 * Returns available time slots EXCLUDING the current appointment being rescheduled.
 *
 * Query parameters:
 * - date: ISO date string (e.g., "2025-01-15")
 * - doctorId: UUID of the doctor
 * - appointmentTypeId: UUID of the appointment type
 * - currentAppointmentId: UUID of the appointment being rescheduled (REQUIRED)
 *
 * Returns: Array of available time slots for the specified date
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')
    const doctorId = searchParams.get('doctorId')
    const appointmentTypeId = searchParams.get('appointmentTypeId')
    const currentAppointmentId = searchParams.get('currentAppointmentId')

    // Validate required parameters
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Doctor ID parameter is required' },
        { status: 400 }
      )
    }

    if (!appointmentTypeId) {
      return NextResponse.json(
        { error: 'Appointment type ID parameter is required' },
        { status: 400 }
      )
    }

    if (!currentAppointmentId) {
      return NextResponse.json(
        { error: 'Current appointment ID parameter is required' },
        { status: 400 }
      )
    }

    // Parse the date
    let requestedDate: Date
    try {
      requestedDate = parseISO(dateParam)
      if (isNaN(requestedDate.getTime())) {
        throw new Error('Invalid date')
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Fetch appointment type duration
    const { data: appointmentType, error: typeError } = await supabase
      .from('appointment_types')
      .select('duration_minutes')
      .eq('id', appointmentTypeId)
      .single()

    if (typeError || !appointmentType) {
      console.error('Error fetching appointment type:', typeError)
      return NextResponse.json(
        { error: 'Invalid appointment type' },
        { status: 400 }
      )
    }

    // Fetch existing appointments for the date
    // KEY DIFFERENCE: Exclude the current appointment being rescheduled
    const dayStart = startOfDay(requestedDate)
    const dayEnd = endOfDay(requestedDate)

    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id, start_time, end_time')
      .eq('doctor_id', doctorId)
      .in('status', ['pending', 'confirmed'])
      .neq('id', currentAppointmentId) // EXCLUDE current appointment
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString())

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError)
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    // Convert appointment times to Date objects
    const appointments = (existingAppointments || []).map(apt => ({
      start: new Date(apt.start_time),
      end: new Date(apt.end_time),
    }))

    // Get available slots using our utility function
    const availableSlots = await getAvailableSlotsForDate(
      requestedDate,
      appointments,
      appointmentType.duration_minutes
    )

    // Format slots for response
    const formattedSlots = availableSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      available: slot.available,
    }))

    return NextResponse.json({
      date: dateParam,
      doctorId,
      currentAppointmentId, // Include in response for verification
      slots: formattedSlots,
      totalAvailable: formattedSlots.filter(s => s.available).length,
    })

  } catch (error) {
    console.error('Error in available-slots-reschedule API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
