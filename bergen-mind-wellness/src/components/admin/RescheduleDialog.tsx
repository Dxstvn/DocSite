'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, isPast, isWeekend, startOfDay } from 'date-fns'
import { rescheduleAppointment } from '@/app/actions/reschedule'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Clock, AlertCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface AppointmentDetails {
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

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: AppointmentDetails
  locale?: 'en' | 'es'
}

export function RescheduleDialog({
  open,
  onOpenChange,
  appointment,
  locale = 'en',
}: RescheduleDialogProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedDate(undefined)
      setSelectedSlot(null)
      setAvailableSlots([])
      setError(null)
    }
  }, [open])

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      setSelectedSlot(null)
      return
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true)
      setError(null)
      setSelectedSlot(null)

      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd')
        const response = await fetch(
          `/api/appointments/available-slots-reschedule?date=${formattedDate}&doctorId=${appointment.doctor_id}&appointmentTypeId=${appointment.appointment_type.id}&currentAppointmentId=${appointment.id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch available slots')
        }

        const data = await response.json()
        setAvailableSlots(data.slots || [])
      } catch (err) {
        console.error('Error fetching slots:', err)
        setError(
          locale === 'es'
            ? 'Error al cargar los horarios disponibles'
            : 'Failed to load available time slots'
        )
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate, appointment.doctor_id, appointment.appointment_type.id, appointment.id, locale])

  const handleConfirm = async () => {
    if (!selectedSlot) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await rescheduleAppointment({
        appointmentId: appointment.id,
        newStartTime: selectedSlot.start,
        newEndTime: selectedSlot.end,
        locale: appointment.patient_locale,
      })

      if (!result.success) {
        setError(result.error || 'Failed to reschedule appointment')
        return
      }

      // Success - close dialog and refresh
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error('Error rescheduling appointment:', err)
      setError(
        locale === 'es'
          ? 'Error al reprogramar la cita'
          : 'Failed to reschedule appointment'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    return isPast(startOfDay(date)) || isWeekend(date)
  }

  const currentAppointmentDate = new Date(appointment.start_time)
  const currentAppointmentTime = format(currentAppointmentDate, 'h:mm a')
  const appointmentTypeName =
    locale === 'es' && appointment.appointment_type.display_name_es
      ? appointment.appointment_type.display_name_es
      : appointment.appointment_type.display_name

  // Filter to only show available slots
  const onlyAvailableSlots = availableSlots.filter(slot => slot.available)

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {locale === 'es'
              ? `Reprogramar cita para ${appointment.patient_name}`
              : `Reschedule Appointment for ${appointment.patient_name}`}
          </DialogTitle>
          <DialogDescription>
            {locale === 'es'
              ? 'Seleccione una nueva fecha y hora para esta cita'
              : 'Select a new date and time for this appointment'}
          </DialogDescription>
        </DialogHeader>

        {/* Current Appointment Summary */}
        <div
          role="region"
          aria-labelledby="current-appointment-heading"
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          style={{ opacity: 0.85 }}
        >
          <h3 id="current-appointment-heading" className="text-sm font-semibold text-red-900 mb-2">
            {locale === 'es' ? 'Cita Actual' : 'Current Appointment'}
          </h3>
          <div className="space-y-1 text-sm text-red-800">
            <p>
              <strong>{locale === 'es' ? 'Tipo:' : 'Type:'}</strong> {appointmentTypeName}
            </p>
            <p>
              <strong>{locale === 'es' ? 'Fecha:' : 'Date:'}</strong>{' '}
              {format(currentAppointmentDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <p>
              <strong>{locale === 'es' ? 'Hora:' : 'Time:'}</strong> {currentAppointmentTime}
            </p>
          </div>
        </div>

        {/* Arrow separator */}
        <div className="flex justify-center my-2">
          <div className="text-neutral-400 text-2xl">↓</div>
        </div>

        {/* New Appointment Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900">
            {locale === 'es' ? 'Seleccionar Nueva Fecha y Hora' : 'Select New Date and Time'}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4 text-neutral-500" />
                <h4 id="calendar-heading" className="text-sm font-medium">
                  {locale === 'es' ? 'Seleccionar Fecha' : 'Select Date'}
                </h4>
              </div>
              <div aria-labelledby="calendar-heading">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  className="border rounded-lg"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-neutral-500" />
                <h4 id="timeslot-heading" className="text-sm font-medium">
                  {locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}
                </h4>
              </div>

              {!selectedDate ? (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    {locale === 'es'
                      ? 'Seleccione una fecha primero'
                      : 'Please select a date first'}
                  </AlertDescription>
                </Alert>
              ) : isLoadingSlots ? (
                <Alert role="status" aria-live="polite">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    {locale === 'es'
                      ? 'Cargando horarios disponibles...'
                      : 'Loading available time slots...'}
                  </AlertDescription>
                </Alert>
              ) : onlyAvailableSlots.length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {locale === 'es'
                      ? 'No hay horarios disponibles para esta fecha'
                      : 'No available time slots for this date'}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <div
                    role="radiogroup"
                    aria-labelledby="timeslot-heading"
                    className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-2"
                  >
                    {onlyAvailableSlots.map((slot, index) => {
                      const slotStart = new Date(slot.start)
                      const slotTime = format(slotStart, 'h:mm a')
                      const isSelected = selectedSlot?.start === slot.start

                      return (
                        <Button
                          key={index}
                          role="radio"
                          aria-checked={isSelected}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`
                            justify-center font-medium
                            ${isSelected ? 'ring-2 ring-primary ring-offset-2 bg-[#4A7C7E] hover:bg-[#3d6668]' : ''}
                            hover:bg-primary/10
                          `}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {slotTime}
                        </Button>
                      )
                    })}
                  </div>

                  {selectedSlot && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="bg-green-100 border-2 border-green-300 rounded-lg p-3"
                    >
                      <Alert className="border-0 bg-transparent p-0">
                        <Clock className="h-4 w-4 text-green-800" />
                        <AlertDescription className="text-green-900 font-semibold">
                          {locale === 'es' ? (
                            <>
                              <strong>Nuevo horario:</strong> {format(new Date(selectedSlot.start), 'h:mm a')} -{' '}
                              {format(new Date(selectedSlot.end), 'h:mm a')}
                            </>
                          ) : (
                            <>
                              <strong>New time:</strong> {format(new Date(selectedSlot.start), 'h:mm a')} -{' '}
                              {format(new Date(selectedSlot.end), 'h:mm a')}
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            {locale === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || isSubmitting}
            className="bg-[#4A7C7E] hover:bg-[#3d6668]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {locale === 'es' ? 'Reprogramando...' : 'Rescheduling...'}
              </>
            ) : (
              <>{locale === 'es' ? 'Confirmar Reprogramación' : 'Confirm Reschedule'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
