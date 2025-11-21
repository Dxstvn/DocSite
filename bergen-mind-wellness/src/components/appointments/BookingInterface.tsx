'use client'

import { useState } from 'react'
import { AppointmentTypeSelector } from './AppointmentTypeSelector'
import { CompactAppointmentTypeSelector } from './CompactAppointmentTypeSelector'
import { AppointmentCalendar } from './AppointmentCalendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import { BookingForm, BookingFormData } from './BookingForm'
import { BookingConfirmation } from './BookingConfirmation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle } from 'lucide-react'
import type { AppointmentType } from '@/types/database'
import { bookAppointment } from '@/app/actions/appointments'
import { format } from 'date-fns'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface BookingInterfaceProps {
  locale?: 'en' | 'es'
  appointmentTypes: AppointmentType[]
}

type BookingStep = 'type' | 'calendar' | 'form' | 'confirmation'

export function BookingInterface({ locale = 'en', appointmentTypes }: BookingInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('type')
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [confirmationDetails, setConfirmationDetails] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // State for Server Action calls
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  // State for slot recalculation when changing appointment type
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // State for form data persistence (Phase 3)
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Handle appointment type selection
  const handleTypeSelect = (typeId: string) => {
    setSelectedAppointmentTypeId(typeId)
    setCurrentStep('calendar')
  }

  // Handle appointment type change mid-flow (Phase 2)
  const handleAppointmentTypeChange = async (newTypeId: string) => {
    // Clear selected slot since duration change may invalidate it
    setSelectedSlot(null)

    // Update appointment type
    setSelectedAppointmentTypeId(newTypeId)

    // If a date is already selected, refetch slots for new duration
    if (selectedDate) {
      setIsLoadingSlots(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const url = `/api/appointments/available-slots?date=${dateStr}&appointmentTypeId=${newTypeId}`
        const response = await fetch(url)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch available slots')
        }

        const data = await response.json()
        setAvailableSlots(data.slots || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reload time slots'
        setBookingError(
          locale === 'es'
            ? `Error al cargar horarios: ${errorMessage}`
            : `Error loading time slots: ${errorMessage}`
        )
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }
  }

  // Handle date selection from calendar
  const handleDateSelect = (date: Date, slots: TimeSlot[]) => {
    setSelectedDate(date)
    setAvailableSlots(slots)
    setSelectedSlot(null) // Reset slot when date changes
  }

  // Handle time slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setCurrentStep('form')
  }

  // Handle booking form submission with Server Action
  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedDate || !selectedSlot) {
      setBookingError(
        locale === 'es'
          ? 'Por favor seleccione una fecha y horario'
          : 'Please select a date and time slot'
      )
      return
    }

    setIsSubmitting(true)
    setBookingError(null)

    try {
      // Map form data to Server Action format
      // Use selectedAppointmentTypeId from state
      const bookingData = {
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        patientLocale: locale,
        startTime: selectedSlot.start,
        appointmentTypeId: selectedAppointmentTypeId!,
        reasonForVisit: formData.notes || undefined,
        timezone: 'America/New_York', // TODO: Get from user or browser
      }

      // Call Server Action directly
      const result = await bookAppointment(bookingData)

      if (result.success && result.appointment) {
        // Get appointment type name for confirmation
        const selectedType = appointmentTypes.find(t => t.id === selectedAppointmentTypeId)
        const appointmentTypeName = selectedType
          ? (locale === 'es' && selectedType.display_name_es)
            ? selectedType.display_name_es
            : selectedType.display_name
          : 'Appointment'

        // Set confirmation details
        setConfirmationDetails({
          confirmationNumber: result.appointment.bookingToken,
          patientName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          date: selectedDate,
          timeSlot: selectedSlot,
          appointmentType: appointmentTypeName,
          notes: formData.notes,
        })

        setCurrentStep('confirmation')
        setShowConfirmation(true)
      } else if (result.error) {
        setBookingError(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : locale === 'es'
          ? 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.'
          : 'An unexpected error occurred. Please try again.'
      setBookingError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle booking another appointment
  const handleBookAnother = () => {
    setShowConfirmation(false)
    setCurrentStep('type')
    setSelectedAppointmentTypeId(null)
    setSelectedDate(null)
    setAvailableSlots([])
    setSelectedSlot(null)
    setConfirmationDetails(null)
    setBookingError(null)
  }

  // Render based on current step
  if (currentStep === 'confirmation' && confirmationDetails) {
    return (
      <Dialog open={showConfirmation} onOpenChange={(open) => {
        if (!open) handleBookAnother()
      }}>
        <DialogContent
          data-testid="confirmation-modal"
          role="dialog"
          aria-modal="true"
          className="max-w-2xl"
        >
          <DialogTitle className="sr-only">
            {locale === 'es' ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}
          </DialogTitle>
          <BookingConfirmation
            appointmentDetails={confirmationDetails}
            onBookAnother={handleBookAnother}
            locale={locale}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-8" data-testid="booking-interface">
      {bookingError && (
        <Alert variant="destructive" data-testid="booking-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{bookingError}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Appointment Type Selection */}
      {currentStep === 'type' && (
        <div className="max-w-2xl mx-auto">
          <AppointmentTypeSelector
            appointmentTypes={appointmentTypes}
            selectedTypeId={selectedAppointmentTypeId}
            onTypeSelect={handleTypeSelect}
            locale={locale}
          />
        </div>
      )}

      {/* Steps 2-3: Calendar, Time Slots, and Form */}
      {(currentStep === 'calendar' || currentStep === 'form') && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Calendar and Time Slots */}
          <div className="space-y-8" data-testid="calendar-section">
            {/* Compact Appointment Type Selector - Always Visible */}
            <CompactAppointmentTypeSelector
              appointmentTypes={appointmentTypes}
              selectedTypeId={selectedAppointmentTypeId}
              onTypeChange={handleAppointmentTypeChange}
              locale={locale}
              disabled={isLoadingSlots}
            />

            <AppointmentCalendar
              onDateSelect={handleDateSelect}
              appointmentTypeId={selectedAppointmentTypeId}
              locale={locale}
            />

            {selectedDate && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
                locale={locale}
                isLoading={isLoadingSlots}
              />
            )}
          </div>

          {/* Right Column: Booking Form */}
          <div data-testid="booking-form-section">
            {currentStep === 'form' && selectedSlot ? (
              <BookingForm
                onSubmit={handleBookingSubmit}
                isPending={isSubmitting}
                locale={locale}
                initialValues={formData}
                onValueChange={setFormData}
              />
            ) : (
              <Alert data-testid="booking-placeholder">
                <AlertDescription>
                  {locale === 'es'
                    ? 'Seleccione una fecha y horario para continuar con la reserva'
                    : 'Select a date and time slot to continue with booking'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
