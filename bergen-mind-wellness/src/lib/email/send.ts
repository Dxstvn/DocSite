import { render } from '@react-email/components'
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import AppointmentCancellationEmail from '@/emails/appointment-cancellation'
import AppointmentConfirmationEmail from '@/emails/appointment-confirmation'
import AppointmentReminderEmail from '@/emails/appointment-reminder'
import AppointmentRescheduledEmail from '@/emails/appointment-rescheduled'
import type { Locale } from '@/types/database'

// SMTP Configuration from environment variables
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'appointments@bergenmindwellness.com'
const FROM_NAME = process.env.SMTP_FROM_NAME || 'Bergen Mind & Wellness'

// Create reusable transporter
let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    // Validate required environment variables
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
      throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD environment variables.')
    }

    transporter = nodemailer.createTransport(SMTP_CONFIG)

    // Verify connection configuration
    transporter.verify((error) => {
      if (error) {
        console.error('SMTP connection error:', error)
      } else {
        console.log('SMTP server is ready to send emails')
      }
    })
  }

  return transporter
}

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

  const emailHtml = await render(
    AppointmentConfirmationEmail({
      patientName,
      appointmentType,
      appointmentDate,
      appointmentTime,
      timezone,
      manageUrl,
      locale,
    })
  )

  const subject =
    locale === 'en'
      ? 'Appointment Confirmed - Bergen Mind & Wellness'
      : 'Cita Confirmada - Bergen Mind & Wellness'

  try {
    const transport = getTransporter()

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      html: emailHtml,
    })

    console.log('Confirmation email sent successfully:', info.messageId)
    return { success: true, id: info.messageId }
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

  const emailHtml = await render(
    AppointmentReminderEmail({
      patientName,
      appointmentType,
      appointmentDate,
      appointmentTime,
      timezone,
      manageUrl,
      locale,
      isTelehealth,
    })
  )

  const subject =
    locale === 'en'
      ? 'Reminder: Your appointment is tomorrow - Bergen Mind & Wellness'
      : 'Recordatorio: Su cita es mañana - Bergen Mind & Wellness'

  try {
    const transport = getTransporter()

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      html: emailHtml,
    })

    console.log('Reminder email sent successfully:', info.messageId)
    return { success: true, id: info.messageId }
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

  const emailHtml = await render(
    AppointmentCancellationEmail({
      patientName,
      appointmentType,
      appointmentDate,
      appointmentTime,
      timezone,
      cancelledBy,
      cancellationReason,
      bookNewUrl,
      locale,
    })
  )

  const subject =
    locale === 'en'
      ? 'Appointment Cancelled - Bergen Mind & Wellness'
      : 'Cita Cancelada - Bergen Mind & Wellness'

  try {
    const transport = getTransporter()

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      html: emailHtml,
    })

    console.log('Cancellation email sent successfully:', info.messageId)
    return { success: true, id: info.messageId }
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

  const emailHtml = await render(
    AppointmentRescheduledEmail({
      patientName,
      appointmentType,
      oldAppointmentDate,
      oldAppointmentTime,
      newAppointmentDate,
      newAppointmentTime,
      timezone,
      manageUrl,
      locale,
    })
  )

  const subject =
    locale === 'en'
      ? 'Your Appointment Has Been Rescheduled - Bergen Mind & Wellness'
      : 'Su Cita Ha Sido Reprogramada - Bergen Mind & Wellness'

  try {
    const transport = getTransporter()

    const info = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: patientEmail,
      subject,
      html: emailHtml,
    })

    console.log('Reschedule email sent successfully:', info.messageId)
    return { success: true, id: info.messageId }
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

/**
 * Close the transporter connection (for graceful shutdown)
 */
export async function closeTransporter() {
  if (transporter) {
    transporter.close()
    transporter = null
    console.log('SMTP transporter closed')
  }
}
