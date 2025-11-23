import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

/**
 * GET /api/appointments/business-hours
 *
 * Returns a summary of business hours based on availability records
 * Used by the patient-facing calendar for visual styling and informational text
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get the default doctor ID
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

    const doctorId = doctors.id

    // Fetch recurring (weekly) availability records that are not blocked
    const { data: availabilityRecords, error: availError } = await supabase
      .from('availability_slots')
      .select('day_of_week, start_time, end_time, is_blocked')
      .eq('doctor_id', doctorId)
      .eq('is_recurring', true)
      .eq('is_blocked', false)

    if (availError) {
      console.error('Error fetching availability:', availError)
      return NextResponse.json(
        { error: 'Failed to fetch availability data' },
        { status: 500 }
      )
    }

    // If no availability records, return default hours
    if (!availabilityRecords || availabilityRecords.length === 0) {
      return NextResponse.json({
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
          startTime: '09:00',
          endTime: '17:00',
        },
        description: 'Monday-Friday, 9:00 AM - 5:00 PM',
        descriptionEs: 'Lunes a viernes, de 9:00 AM a 5:00 PM',
      })
    }

    // Calculate the overall time range and days
    const daysOfWeek = [...new Set(availabilityRecords.map(r => r.day_of_week).filter(Boolean))]
    const startTimes = availabilityRecords.map(r => r.start_time.substring(0, 5))
    const endTimes = availabilityRecords.map(r => r.end_time.substring(0, 5))

    const earliestStart = startTimes.sort()[0]
    const latestEnd = endTimes.sort().reverse()[0]

    // Convert to 12-hour format for description
    const formatTime = (time: string): string => {
      const [hours, minutes] = time.split(':').map(Number)
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }

    // Generate day range description
    const dayNames: Record<number, { en: string; es: string }> = {
      1: { en: 'Monday', es: 'Lunes' },
      2: { en: 'Tuesday', es: 'Martes' },
      3: { en: 'Wednesday', es: 'Miércoles' },
      4: { en: 'Thursday', es: 'Jueves' },
      5: { en: 'Friday', es: 'Viernes' },
      6: { en: 'Saturday', es: 'Sábado' },
    }

    const sortedDays = daysOfWeek.sort()
    const firstDay = sortedDays[0]
    const lastDay = sortedDays[sortedDays.length - 1]

    const dayRangeEn = sortedDays.length > 1
      ? `${dayNames[firstDay]?.en}-${dayNames[lastDay]?.en}`
      : dayNames[firstDay]?.en || 'Monday-Friday'

    const dayRangeEs = sortedDays.length > 1
      ? `${dayNames[firstDay]?.es} a ${dayNames[lastDay]?.es}`
      : dayNames[firstDay]?.es || 'Lunes a viernes'

    return NextResponse.json({
      businessHours: {
        daysOfWeek: sortedDays,
        startTime: earliestStart,
        endTime: latestEnd,
      },
      description: `${dayRangeEn}, ${formatTime(earliestStart)} - ${formatTime(latestEnd)}`,
      descriptionEs: `${dayRangeEs}, de ${formatTime(earliestStart)} a ${formatTime(latestEnd)}`,
    })

  } catch (error) {
    console.error('Error in business-hours API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
