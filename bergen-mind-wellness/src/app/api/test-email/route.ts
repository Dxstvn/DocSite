import { NextRequest, NextResponse } from 'next/server'
import {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendAppointmentReschedule,
  sendAppointmentReminder,
} from '@/lib/email/send'

/**
 * Test API route for email functionality
 * Usage:
 * - /api/test-email?type=confirmation
 * - /api/test-email?type=cancellation-patient
 * - /api/test-email?type=cancellation-doctor
 * - /api/test-email?type=reschedule
 * - /api/test-email?type=reminder
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const email = searchParams.get('email') || 'rocio@bergenmindwellness.com'

  // Test data
  const testDate = new Date('2025-12-15T14:00:00Z')
  const oldDate = new Date('2025-12-10T10:00:00Z')

  try {
    let result

    switch (type) {
      case 'confirmation':
        result = await sendAppointmentConfirmation({
          patientName: 'Test Patient',
          patientEmail: email,
          appointmentType: 'Initial Consultation',
          appointmentDate: testDate,
          appointmentTime: '2:00 PM',
          timezone: 'America/New_York',
          bookingToken: 'test-token-12345',
          locale: 'en',
        })
        break

      case 'cancellation-patient':
        result = await sendAppointmentCancellation({
          patientName: 'Test Patient',
          patientEmail: email,
          appointmentType: 'Initial Consultation',
          appointmentDate: testDate,
          appointmentTime: '2:00 PM',
          timezone: 'America/New_York',
          cancelledBy: 'patient',
          cancellationReason: 'Schedule conflict',
          locale: 'en',
        })
        break

      case 'cancellation-doctor':
        result = await sendAppointmentCancellation({
          patientName: 'Test Patient',
          patientEmail: email,
          appointmentType: 'Initial Consultation',
          appointmentDate: testDate,
          appointmentTime: '2:00 PM',
          timezone: 'America/New_York',
          cancelledBy: 'doctor',
          cancellationReason: 'Doctor unavailable - emergency situation',
          locale: 'en',
        })
        break

      case 'reschedule':
        result = await sendAppointmentReschedule({
          patientName: 'Test Patient',
          patientEmail: email,
          appointmentType: 'Follow-up Appointment',
          oldAppointmentDate: oldDate,
          oldAppointmentTime: '10:00 AM',
          newAppointmentDate: testDate,
          newAppointmentTime: '2:00 PM',
          timezone: 'America/New_York',
          locale: 'en',
        })
        break

      case 'reminder':
        result = await sendAppointmentReminder({
          patientName: 'Test Patient',
          patientEmail: email,
          appointmentType: 'Follow-up Appointment',
          appointmentDate: testDate,
          appointmentTime: '2:00 PM',
          timezone: 'America/New_York',
          bookingToken: 'test-token-12345',
          locale: 'en',
          isTelehealth: false,
        })
        break

      default:
        return NextResponse.json(
          {
            error: 'Invalid email type',
            validTypes: [
              'confirmation',
              'cancellation-patient',
              'cancellation-doctor',
              'reschedule',
              'reminder',
            ],
          },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      type,
      result,
      message: `Test ${type} email sent successfully to ${email}`,
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
