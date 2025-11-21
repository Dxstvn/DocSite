import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlotsForDate } from '@/lib/appointments/availability'
import { parseISO, startOfDay, endOfDay, format } from 'date-fns'

/**
 * Get day of week for database queries (1 = Monday, 7 = Sunday)
 */
function getDayOfWeek(date: Date): number {
  const day = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day === 0 ? 7 : day // Convert 0 (Sunday) to 7, keep 1-6 as is
}

/**
 * GET /api/appointments/available-slots
 *
 * Query parameters:
 * - date: ISO date string (e.g., "2025-01-15")
 * - doctorId: UUID of the doctor (optional, defaults to primary provider)
 * - appointmentTypeId: UUID of the appointment type (optional, defaults to 60-minute slots)
 *
 * Returns: Array of available time slots for the specified date
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')
    const doctorId = searchParams.get('doctorId')
    const appointmentTypeId = searchParams.get('appointmentTypeId')

    // Validate required parameters
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
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

    // Get the doctor ID (default to first active doctor if not specified)
    let selectedDoctorId = doctorId
    if (!selectedDoctorId) {
      const { data: doctors, error: doctorError } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['doctor', 'admin'])
        .limit(1)
        .single()

      if (doctorError || !doctors) {
        console.error('Error fetching doctors:', doctorError)
        return NextResponse.json(
          { error: 'No doctors available' },
          { status: 404 }
        )
      }

      selectedDoctorId = doctors.id
    }

    // Fetch appointment type duration if provided
    let appointmentDuration: number | undefined
    if (appointmentTypeId) {
      const { data: appointmentType, error: typeError } = await supabase
        .from('appointment_types')
        .select('duration_minutes')
        .eq('id', appointmentTypeId)
        .single()

      if (typeError) {
        console.error('Error fetching appointment type:', typeError)
        // Don't fail the request, just use default duration
      } else if (appointmentType) {
        appointmentDuration = appointmentType.duration_minutes
      }
    }

    // Fetch existing appointments for the date
    const dayStart = startOfDay(requestedDate)
    const dayEnd = endOfDay(requestedDate)

    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('doctor_id', selectedDoctorId)
      .in('status', ['pending', 'confirmed'])
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

    // Fetch blocked availability slots for the date
    const dateString = format(requestedDate, 'yyyy-MM-dd')
    const dayOfWeek = getDayOfWeek(requestedDate)

    console.log(`[Available Slots API] Fetching blocked slots for ${dateString} (day ${dayOfWeek})`)

    // Query 1: Specific date blocks for this exact date
    const { data: specificDateBlocks, error: specificError } = await supabase
      .from('availability_slots')
      .select('id, specific_date, start_time, end_time, day_of_week, is_recurring, is_blocked, block_reason')
      .eq('doctor_id', selectedDoctorId)
      .eq('is_blocked', true)
      .eq('specific_date', dateString)

    // Query 2: Recurring weekly blocks for this day of week
    const { data: recurringBlocks, error: recurringError } = await supabase
      .from('availability_slots')
      .select('id, specific_date, start_time, end_time, day_of_week, is_recurring, is_blocked, block_reason')
      .eq('doctor_id', selectedDoctorId)
      .eq('is_blocked', true)
      .eq('is_recurring', true)
      .eq('day_of_week', dayOfWeek)

    // Combine results
    const blockedSlots = [...(specificDateBlocks || []), ...(recurringBlocks || [])]
    const blockedError = specificError || recurringError

    if (blockedError) {
      console.error('[Available Slots API] Error fetching blocked slots:', blockedError)
      // Don't fail the request - just log the error and continue without blocked slots
    } else {
      console.log(`[Available Slots API] Found ${blockedSlots?.length || 0} blocked slots:`,
        blockedSlots?.map(s => ({
          type: s.is_recurring ? 'recurring' : 'specific',
          date: s.specific_date,
          time: `${s.start_time}-${s.end_time}`,
          reason: s.block_reason
        }))
      )
    }

    // Get available slots using our utility function with dynamic duration
    const availableSlots = await getAvailableSlotsForDate(
      requestedDate,
      appointments,
      appointmentDuration,
      blockedSlots || []
    )

    // Format slots for response
    const formattedSlots = availableSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      available: slot.available,
    }))

    return NextResponse.json({
      date: dateParam,
      doctorId: selectedDoctorId,
      slots: formattedSlots,
      totalAvailable: formattedSlots.filter(s => s.available).length,
    })

  } catch (error) {
    console.error('Error in available-slots API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
