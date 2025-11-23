'use client'

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, AlertCircle } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface TimeSlotPickerProps {
  selectedDate: Date | null
  availableSlots: TimeSlot[]
  selectedSlot: TimeSlot | null
  onSlotSelect: (slot: TimeSlot) => void
  locale?: string
  isLoading?: boolean
}

export function TimeSlotPicker({
  selectedDate,
  availableSlots,
  selectedSlot,
  onSlotSelect,
  locale = 'en',
  isLoading = false,
}: TimeSlotPickerProps) {
  if (!selectedDate) {
    return (
      <Card className="w-full" data-testid="time-slot-picker">
        <CardHeader>
          <CardTitle as="h2">{locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}</CardTitle>
          <CardDescription>
            {locale === 'es'
              ? 'Primero seleccione una fecha en el calendario'
              : 'Please select a date from the calendar first'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert data-testid="no-date-selected-alert">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es'
                ? 'Haga clic en una fecha en el calendario de arriba para ver los horarios disponibles'
                : 'Click on a date in the calendar above to view available time slots'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy')

  // Show loading state when recalculating slots
  if (isLoading) {
    return (
      <Card className="w-full" data-testid="time-slot-picker">
        <CardHeader>
          <CardTitle as="h2">{locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert data-testid="loading-slots-alert">
            <Clock className="h-4 w-4 animate-spin" />
            <AlertDescription>
              {locale === 'es'
                ? 'Recalculando horarios disponibles...'
                : 'Recalculating available time slots...'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (availableSlots.length === 0) {
    return (
      <Card className="w-full" data-testid="time-slot-picker">
        <CardHeader>
          <CardTitle as="h2">{locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" data-testid="no-slots-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es'
                ? 'No hay horarios disponibles para esta fecha. Por favor seleccione otra fecha.'
                : 'No available time slots for this date. Please select another date.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Filter to only show available slots
  const onlyAvailableSlots = availableSlots.filter(slot => slot.available)

  // If all slots are unavailable, show the no slots message
  if (onlyAvailableSlots.length === 0) {
    return (
      <Card className="w-full" data-testid="time-slot-picker">
        <CardHeader>
          <CardTitle as="h2">{locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" data-testid="no-slots-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es'
                ? 'No hay horarios disponibles para esta fecha. Por favor seleccione otra fecha.'
                : 'No available time slots for this date. Please select another date.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full" data-testid="time-slot-picker">
      <CardHeader>
        <CardTitle>{locale === 'es' ? 'Seleccionar Horario' : 'Select Time Slot'}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="time-slots">
          {onlyAvailableSlots.map((slot, index) => {
            const slotStart = new Date(slot.start)
            const slotTime = format(slotStart, 'h:mm a')
            const isSelected = selectedSlot?.start === slot.start

            return (
              <Button
                key={index}
                data-testid="time-slot"
                data-selected={isSelected}
                variant={isSelected ? 'default' : 'outline'}
                className={`
                  justify-center font-medium
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  hover:bg-primary/10
                `}
                onClick={() => onSlotSelect(slot)}
              >
                <Clock className="w-4 h-4 mr-2" />
                {slotTime}
              </Button>
            )
          })}
        </div>

        {selectedSlot && (
          <Alert className="mt-6" data-testid="selected-slot-indicator">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {locale === 'es' ? (
                <>
                  <strong>Horario seleccionado:</strong> {format(new Date(selectedSlot.start), 'h:mm a')} -{' '}
                  {format(new Date(selectedSlot.end), 'h:mm a')}
                </>
              ) : (
                <>
                  <strong>Selected time:</strong> {format(new Date(selectedSlot.start), 'h:mm a')} -{' '}
                  {format(new Date(selectedSlot.end), 'h:mm a')}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
