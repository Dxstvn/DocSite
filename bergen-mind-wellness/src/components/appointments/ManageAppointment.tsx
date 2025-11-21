'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

interface AppointmentType {
  id: string
  name: string
  display_name: string
  display_name_es: string | null
  duration_minutes: number
}

interface ManageAppointmentProps {
  appointment: {
    id: string
    patient_name: string
    patient_email: string
    patient_phone: string
    patient_locale: string | null
    start_time: string
    end_time: string
    status: string
    timezone: string
    reason_for_visit: string | null
    cancelled_at: string | null
    cancelled_by: string | null
    cancellation_reason: string | null
    created_at: string
    booking_token: string
    appointment_type: AppointmentType | null
  }
  locale?: string
}

export function ManageAppointment({ appointment, locale = 'en' }: ManageAppointmentProps) {
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [localStatus, setLocalStatus] = useState(appointment.status)

  const isCancelled = localStatus === 'cancelled'
  const appointmentDate = parseISO(appointment.start_time)
  const appointmentEndTime = parseISO(appointment.end_time)

  // Get display name based on locale
  const appointmentTypeName = appointment.appointment_type
    ? locale === 'es' && appointment.appointment_type.display_name_es
      ? appointment.appointment_type.display_name_es
      : appointment.appointment_type.display_name
    : locale === 'es' ? 'Tipo de cita desconocido' : 'Unknown appointment type'

  const handleCancelAppointment = async () => {
    setIsCancelling(true)
    setCancelError(null)

    try {
      const response = await fetch(`/api/appointments/${appointment.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: appointment.booking_token,  // API expects "token" property
          cancelled_by: 'patient',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel appointment')
      }

      // Update local state
      setLocalStatus('cancelled')
      setCancelSuccess(true)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      setCancelError(error instanceof Error ? error.message : 'Failed to cancel appointment')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card data-testid="appointment-details">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {locale === 'es' ? 'Detalles de la Cita' : 'Appointment Details'}
              </CardTitle>
              <CardDescription>
                {locale === 'es'
                  ? 'Gestione su cita programada'
                  : 'Manage your scheduled appointment'}
              </CardDescription>
            </div>
            <Badge
              variant={
                isCancelled ? 'destructive' :
                localStatus === 'confirmed' ? 'default' :
                'secondary'
              }
            >
              {isCancelled && <XCircle className="w-3 h-3 mr-1" />}
              {localStatus === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
              {locale === 'es'
                ? (isCancelled ? 'Cancelada' : localStatus === 'confirmed' ? 'Confirmada' : 'Pendiente')
                : (isCancelled ? 'Cancelled' : localStatus === 'confirmed' ? 'Confirmed' : 'Pending')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          {cancelSuccess && (
            <Alert data-testid="cancellation-success-alert">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>
                {locale === 'es' ? 'Cita Cancelada' : 'Appointment Cancelled'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'es'
                  ? 'Su cita ha sido cancelada exitosamente. Hemos enviado un correo de confirmación.'
                  : 'Your appointment has been successfully cancelled. A confirmation email has been sent.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {cancelError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{locale === 'es' ? 'Error' : 'Error'}</AlertTitle>
              <AlertDescription>{cancelError}</AlertDescription>
            </Alert>
          )}

          {/* Appointment Type */}
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 mt-0.5 text-primary" />
            <div>
              <p className="text-sm font-medium text-neutral-500">
                {locale === 'es' ? 'Tipo de Cita' : 'Appointment Type'}
              </p>
              <p className="font-medium">{appointmentTypeName}</p>
              {appointment.appointment_type && (
                <p className="text-sm text-neutral-600 mt-1">
                  {appointment.appointment_type.duration_minutes} {locale === 'es' ? 'minutos' : 'minutes'}
                </p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {locale === 'es' ? 'Fecha' : 'Date'}
                </p>
                <p className="font-medium">
                  {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {locale === 'es' ? 'Hora' : 'Time'}
                </p>
                <p className="font-medium">
                  {format(appointmentDate, 'h:mm a')} - {format(appointmentEndTime, 'h:mm a')}
                </p>
                <p className="text-sm text-neutral-600 mt-1">{appointment.timezone}</p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">
              {locale === 'es' ? 'Información del Paciente' : 'Patient Information'}
            </h3>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-sm text-neutral-500">
                  {locale === 'es' ? 'Nombre' : 'Name'}
                </p>
                <p className="font-medium">{appointment.patient_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-sm text-neutral-500">
                  {locale === 'es' ? 'Correo Electrónico' : 'Email'}
                </p>
                <p className="font-medium">{appointment.patient_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-sm text-neutral-500">
                  {locale === 'es' ? 'Teléfono' : 'Phone'}
                </p>
                <p className="font-medium">{appointment.patient_phone}</p>
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          {appointment.reason_for_visit && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-neutral-500 mb-2">
                {locale === 'es' ? 'Motivo de Visita' : 'Reason for Visit'}
              </p>
              <p className="text-neutral-700">{appointment.reason_for_visit}</p>
            </div>
          )}

          {/* Cancellation Details */}
          {isCancelled && appointment.cancelled_at && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-neutral-500 mb-2">
                {locale === 'es' ? 'Detalles de Cancelación' : 'Cancellation Details'}
              </p>
              <div className="space-y-1 text-sm text-neutral-600">
                <p>
                  {locale === 'es' ? 'Cancelada el: ' : 'Cancelled on: '}
                  {format(parseISO(appointment.cancelled_at), 'MMMM d, yyyy \'at\' h:mm a')}
                </p>
                {appointment.cancelled_by && (
                  <p>
                    {locale === 'es' ? 'Cancelada por: ' : 'Cancelled by: '}
                    {appointment.cancelled_by === 'patient'
                      ? (locale === 'es' ? 'Paciente' : 'Patient')
                      : (locale === 'es' ? 'Doctor' : 'Doctor')}
                  </p>
                )}
                {appointment.cancellation_reason && (
                  <p>
                    {locale === 'es' ? 'Razón: ' : 'Reason: '}
                    {appointment.cancellation_reason}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isCancelled || isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'es' ? 'Cancelando...' : 'Cancelling...'}
                  </>
                ) : (
                  <>{locale === 'es' ? 'Cancelar Cita' : 'Cancel Appointment'}</>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {locale === 'es' ? '¿Está seguro?' : 'Are you sure?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {locale === 'es'
                    ? 'Esta acción cancelará su cita. Puede reprogramar contactándonos dentro de las 24 horas.'
                    : 'This action will cancel your appointment. You can reschedule by contacting us within 24 hours.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {locale === 'es' ? 'No, mantener cita' : 'No, keep appointment'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelAppointment}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {locale === 'es' ? 'Sí, cancelar' : 'Yes, cancel'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
