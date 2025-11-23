'use client'

import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Calendar, Clock, Mail, Phone, FileText } from 'lucide-react'
import Link from 'next/link'

interface BookingConfirmationProps {
  appointmentDetails: {
    confirmationNumber: string
    patientName: string
    email: string
    phone: string
    date: Date
    timeSlot: {
      start: string
      end: string
    }
    appointmentType: string
    notes?: string
  }
  onBookAnother: () => void
  locale?: string
}

export function BookingConfirmation({ appointmentDetails, onBookAnother, locale = 'en' }: BookingConfirmationProps) {
  const { confirmationNumber, patientName, email, phone, date, timeSlot, appointmentType, notes } = appointmentDetails

  const appointmentTypeLabels: Record<string, { en: string; es: string }> = {
    'initial-consultation': { en: 'Initial Consultation', es: 'Consulta Inicial' },
    'follow-up': { en: 'Follow-up Appointment', es: 'Seguimiento' },
    'medication-management': { en: 'Medication Management', es: 'Gestión de Medicamentos' },
    'therapy-session': { en: 'Therapy Session', es: 'Sesión de Terapia' },
  }

  const typeLabel = appointmentTypeLabels[appointmentType]?.[locale as 'en' | 'es'] || appointmentType

  return (
    <div className="space-y-6 mx-6 overflow-hidden" data-testid="booking-confirmation">
      <Alert className="border-green-200 bg-green-50" data-testid="confirmation-success-alert">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900">
          {locale === 'es' ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}
        </AlertTitle>
        <AlertDescription className="text-green-800">
          {locale === 'es'
            ? 'Su cita ha sido reservada exitosamente. Hemos enviado un correo de confirmación a su dirección.'
            : 'Your appointment has been successfully booked. We\'ve sent a confirmation email to your address.'}
        </AlertDescription>
      </Alert>

      <Card data-testid="confirmation-details">
        <CardHeader>
          <CardTitle>{locale === 'es' ? 'Detalles de la Cita' : 'Appointment Details'}</CardTitle>
          <CardDescription>
            {locale === 'es' ? 'Número de Confirmación' : 'Confirmation Number'}:{' '}
            <span className="font-mono font-semibold break-all" data-testid="confirmation-number">{confirmationNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Patient Name */}
            <div className="flex items-start">
              <FileText className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {locale === 'es' ? 'Paciente' : 'Patient'}
                </p>
                <p className="text-base" data-testid="patient-name">{patientName}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {locale === 'es' ? 'Fecha' : 'Date'}
                </p>
                <p className="text-base" data-testid="appointment-date">{format(date, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start">
              <Clock className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {locale === 'es' ? 'Hora' : 'Time'}
                </p>
                <p className="text-base" data-testid="appointment-time">
                  {format(new Date(timeSlot.start), 'h:mm a')} - {format(new Date(timeSlot.end), 'h:mm a')}
                </p>
              </div>
            </div>

            {/* Appointment Type */}
            <div className="flex items-start">
              <FileText className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  {locale === 'es' ? 'Tipo de Cita' : 'Appointment Type'}
                </p>
                <p className="text-base" data-testid="appointment-type">{typeLabel}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                {locale === 'es' ? 'Información de Contacto' : 'Contact Information'}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-neutral-500 flex-shrink-0" />
                  <span className="break-words">{email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-neutral-500 flex-shrink-0" />
                  <span className="break-words">{phone}</span>
                </div>
              </div>
            </div>

            {/* Notes if provided */}
            {notes && (
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-medium text-neutral-700 mb-2">
                  {locale === 'es' ? 'Notas Adicionales' : 'Additional Notes'}
                </p>
                <p className="text-sm text-neutral-600 break-words">{notes}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="w-full sm:w-auto" data-testid="return-home-button">
            <Link href={`/${locale}`}>
              {locale === 'es' ? 'Volver al Inicio' : 'Return to Home'}
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto" data-testid="manage-appointment-link">
            <Link href={`/${locale}/appointments/manage?token=${confirmationNumber}`}>
              {locale === 'es' ? 'Gestionar Cita' : 'Manage Appointment'}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>{locale === 'es' ? 'Siguiente Paso' : 'Next Steps'}</AlertTitle>
        <AlertDescription>
          {locale === 'es' ? (
            <>
              Hemos enviado un correo de confirmación con los detalles de su cita. Por favor llegue 10 minutos antes
              de su cita programada. Si necesita reprogramar o cancelar, por favor contáctenos al menos 24 horas antes.
            </>
          ) : (
            <>
              We've sent a confirmation email with your appointment details. Please arrive 10 minutes before your
              scheduled appointment time. If you need to reschedule or cancel, please contact us at least 24 hours in
              advance.
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
