import { Resend } from 'resend'
import AppointmentCancellationEmail from '@/emails/appointment-cancellation'
import AppointmentConfirmationEmail from '@/emails/appointment-confirmation'
import AppointmentReminderEmail from '@/emails/appointment-reminder'
import AppointmentRescheduledEmail from '@/emails/appointment-rescheduled'
import type { Locale } from '@/types/database'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'rocio@bergenmindwellness.com'
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Bergen Mind & Wellness'

interface AppointmentEmailData {
  patientName: string
  patientEmail: string
  appointmentType: string
  appointmentDate: Date
  appointmentTime: string
  timezone: string
  locale?: Locale
}

interface ConfirmationEmailData extends AppointmentEmailData {
  bookingToken: string
}

interface CancellationEmailData extends AppointmentEmailData {
  cancelledBy: 'patient' | 'doctor'
  cancellationReason?: string
}

interface ReminderEmailData extends AppointmentEmailData {
  bookingToken: string
  isTelehealth?: boolean
}

interface RescheduleEmailData {
  patientName: string
  patientEmail: string
  appointmentType: string
  oldAppointmentDate: Date
  oldAppointmentTime: string
  newAppointmentDate: Date
  newAppointmentTime: string
  timezone: string
  locale?: Locale
}

/**
 * Send appointment confirmation email
 * Sent immediately when a patient books an appointment
 */
export async function sendAppointmentConfirmation(
  data: ConfirmationEmailData
) {
  const {
    patientName,
    patientEmail,
    appointmentType,
    appointmentDate,
    appointmentTime,
    timezone,
    bookingToken,
    locale = 'en',
  } = data

  const manageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/appointments/manage?token=${bookingToken}`

  const subject =
    locale === 'en'
      ? 'Appointment Confirmed - Bergen Mind & Wellness'
      : 'Cita Confirmada - Bergen Mind & Wellness'

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      react: AppointmentConfirmationEmail({
        patientName,
        appointmentType,
        appointmentDate,
        appointmentTime,
        timezone,
        manageUrl,
        locale,
      }),
    })

    if (error) {
      console.error('Error sending confirmation email:', error)
      return {
        success: false,
        error: error.message || 'Unknown error'
      }
    }

    console.log('Confirmation email sent successfully:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    // Return error result instead of throwing - don't fail booking if email fails
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send appointment reminder email
 * Sent 24 hours before the appointment via scheduled job
 */
export async function sendAppointmentReminder(data: ReminderEmailData) {
  const {
    patientName,
    patientEmail,
    appointmentType,
    appointmentDate,
    appointmentTime,
    timezone,
    bookingToken,
    locale = 'en',
    isTelehealth = false,
  } = data

  const manageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/appointments/manage?token=${bookingToken}`

  const subject =
    locale === 'en'
      ? 'Reminder: Your appointment is tomorrow - Bergen Mind & Wellness'
      : 'Recordatorio: Su cita es mañana - Bergen Mind & Wellness'

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      react: AppointmentReminderEmail({
        patientName,
        appointmentType,
        appointmentDate,
        appointmentTime,
        timezone,
        manageUrl,
        locale,
        isTelehealth,
      }),
    })

    if (error) {
      console.error('Error sending reminder email:', error)
      throw new Error(`Failed to send reminder email: ${error.message}`)
    }

    console.log('Reminder email sent successfully:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (error) {
    console.error('Error sending reminder email:', error)
    throw new Error(`Failed to send reminder email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Send appointment cancellation email
 * Sent when an appointment is cancelled by patient or doctor
 */
export async function sendAppointmentCancellation(
  data: CancellationEmailData
) {
  const {
    patientName,
    patientEmail,
    appointmentType,
    appointmentDate,
    appointmentTime,
    timezone,
    cancelledBy,
    cancellationReason,
    locale = 'en',
  } = data

  const bookNewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/appointments`

  const subject =
    locale === 'en'
      ? 'Appointment Cancelled - Bergen Mind & Wellness'
      : 'Cita Cancelada - Bergen Mind & Wellness'

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      react: AppointmentCancellationEmail({
        patientName,
        appointmentType,
        appointmentDate,
        appointmentTime,
        timezone,
        cancelledBy,
        cancellationReason,
        bookNewUrl,
        locale,
      }),
    })

    if (error) {
      console.error('Error sending cancellation email:', error)
      throw new Error(`Failed to send cancellation email: ${error.message}`)
    }

    console.log('Cancellation email sent successfully:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (error) {
    console.error('Error sending cancellation email:', error)
    throw new Error(`Failed to send cancellation email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Send appointment reschedule email
 * Sent when an appointment is rescheduled by an admin
 */
export async function sendAppointmentReschedule(
  data: RescheduleEmailData
) {
  const {
    patientName,
    patientEmail,
    appointmentType,
    oldAppointmentDate,
    oldAppointmentTime,
    newAppointmentDate,
    newAppointmentTime,
    timezone,
    locale = 'en',
  } = data

  const manageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/appointments`

  const subject =
    locale === 'en'
      ? 'Your Appointment Has Been Rescheduled - Bergen Mind & Wellness'
      : 'Su Cita Ha Sido Reprogramada - Bergen Mind & Wellness'

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      react: AppointmentRescheduledEmail({
        patientName,
        appointmentType,
        oldAppointmentDate,
        oldAppointmentTime,
        newAppointmentDate,
        newAppointmentTime,
        timezone,
        manageUrl,
        locale,
      }),
    })

    if (error) {
      console.error('Error sending reschedule email:', error)
      return {
        success: false,
        error: error.message || 'Unknown error'
      }
    }

    console.log('Reschedule email sent successfully:', emailData?.id)
    return { success: true, id: emailData?.id }
  } catch (error) {
    console.error('Error sending reschedule email:', error)
    // Return error result instead of throwing - don't fail reschedule if email fails
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Batch send reminder emails
 * Used by scheduled job to send reminders for all appointments in the next 24 hours
 */
export async function batchSendReminders(reminders: ReminderEmailData[]) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  }

  for (const reminder of reminders) {
    try {
      await sendAppointmentReminder(reminder)
      results.success++
    } catch (error) {
      results.failed++
      results.errors.push({
        email: reminder.patientEmail,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}
