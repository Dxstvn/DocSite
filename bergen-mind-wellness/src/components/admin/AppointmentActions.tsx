'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cancelAppointmentAsAdmin } from '@/app/actions/cancel-appointment'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2, Calendar } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RescheduleDialog } from './RescheduleDialog'

type AppointmentActionsProps = {
  appointmentId: string
  currentStatus: 'pending' | 'confirmed' | 'cancelled'
  locale: string
  appointment?: {
    id: string
    patient_name: string
    patient_email: string
    appointment_type: {
      display_name: string
      display_name_es?: string
      id: string
    }
    start_time: string
    end_time: string
    timezone: string
    doctor_id: string
    patient_locale: 'en' | 'es'
  }
}

export function AppointmentActions({
  appointmentId,
  currentStatus,
  locale,
  appointment,
}: AppointmentActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState<string>('')
  const [customReason, setCustomReason] = useState<string>('')
  const [cancelError, setCancelError] = useState<string | null>(null)

  const updateStatus = async (newStatus: 'confirmed') => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Failed to update appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async () => {
    setLoading(true)
    setCancelError(null)

    try {
      // Use custom reason if "Other" is selected, otherwise use predefined reason
      const finalReason = cancellationReason === 'other' ? customReason : cancellationReason

      const result = await cancelAppointmentAsAdmin({
        appointmentId,
        cancellationReason: finalReason || undefined,
        locale: locale as 'en' | 'es',
      })

      if (!result.success) {
        setCancelError(result.error || 'Failed to cancel appointment')
        return
      }

      // Success - close dialog and refresh
      setCancelDialogOpen(false)
      setCancellationReason('')
      setCustomReason('')
      router.refresh()
    } catch (err) {
      console.error('Error cancelling appointment:', err)
      setCancelError(
        locale === 'es'
          ? 'Error al cancelar la cita'
          : 'Failed to cancel appointment'
      )
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === 'cancelled') {
    return (
      <div className="text-sm text-neutral-500 italic">
        This appointment has been cancelled
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-3 pt-2">
        {currentStatus === 'pending' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Confirm Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm this appointment?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send a confirmation email to the patient and mark the appointment as confirmed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => updateStatus('confirmed')}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Reschedule button - only for pending or confirmed appointments */}
        {(currentStatus === 'pending' || currentStatus === 'confirmed') && appointment && (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-2"
            onClick={() => setRescheduleOpen(true)}
          >
            <Calendar className="h-4 w-4" />
            Reschedule
          </Button>
        )}

        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {locale === 'es' ? 'Cancelar Cita' : 'Cancel Appointment'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {locale === 'es' ? '¿Cancelar esta cita?' : 'Cancel this appointment?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {locale === 'es'
                  ? 'Esto enviará un aviso de cancelación al paciente.'
                  : 'This will send a cancellation notice to the patient.'}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Cancellation Reason Selection */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cancellation-reason">
                  {locale === 'es'
                    ? 'Motivo de cancelación (opcional)'
                    : 'Cancellation reason (optional)'}
                </Label>
                <Select
                  value={cancellationReason}
                  onValueChange={setCancellationReason}
                >
                  <SelectTrigger id="cancellation-reason">
                    <SelectValue
                      placeholder={
                        locale === 'es'
                          ? 'Seleccionar un motivo'
                          : 'Select a reason'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient_requested">
                      {locale === 'es'
                        ? 'Solicitado por el paciente'
                        : 'Patient requested'}
                    </SelectItem>
                    <SelectItem value="clinician_unavailable">
                      {locale === 'es'
                        ? 'Clínico no disponible'
                        : 'Clinician unavailable'}
                    </SelectItem>
                    <SelectItem value="rescheduled">
                      {locale === 'es' ? 'Reprogramada' : 'Rescheduled'}
                    </SelectItem>
                    <SelectItem value="other">
                      {locale === 'es' ? 'Otro' : 'Other'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom reason textarea - shown when "Other" is selected */}
              {cancellationReason === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-reason">
                    {locale === 'es'
                      ? 'Especificar motivo'
                      : 'Specify reason'}
                  </Label>
                  <Textarea
                    id="custom-reason"
                    placeholder={
                      locale === 'es'
                        ? 'Ingrese el motivo de cancelación...'
                        : 'Enter cancellation reason...'
                    }
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Error message */}
              {cancelError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {cancelError}
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                {locale === 'es' ? 'Mantener Cita' : 'Keep Appointment'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelAppointment}
                disabled={loading || (cancellationReason === 'other' && !customReason.trim())}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'es' ? 'Cancelando...' : 'Cancelling...'}
                  </>
                ) : (
                  <>{locale === 'es' ? 'Cancelar Cita' : 'Cancel Appointment'}</>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Reschedule Dialog */}
      {appointment && (
        <RescheduleDialog
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          appointment={appointment}
          locale={locale as 'en' | 'es'}
        />
      )}
    </>
  )
}
