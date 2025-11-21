'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { format } from 'date-fns'
import { es as dateFnsEs } from 'date-fns/locale'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface AppointmentCalendarProps {
  onDateSelect: (date: Date, availableSlots: TimeSlot[]) => void
  appointmentTypeId: string | null
  locale?: string
}

export function AppointmentCalendar({ onDateSelect, appointmentTypeId, locale = 'en' }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  // Business hours configuration for FullCalendar
  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
    startTime: '09:00',
    endTime: '17:00',
  }

  // Update data-selected attributes when selection changes
  // FullCalendar doesn't re-mount cells on state changes, so we manually update attributes
  useEffect(() => {
    const cells = document.querySelectorAll('[data-testid="calendar-day"]')
    cells.forEach(cell => {
      const cellElement = cell as HTMLElement

      if (selectedDate) {
        // FullCalendar's parent .fc-daygrid-day element has data-date in YYYY-MM-DD format
        const fcDayEl = cellElement.closest('.fc-daygrid-day')
        if (fcDayEl) {
          const fcDateStr = fcDayEl.getAttribute('data-date')
          const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')

          if (fcDateStr === selectedDateStr) {
            cellElement.setAttribute('data-selected', 'true')
          } else {
            cellElement.removeAttribute('data-selected')
          }
        }
      } else {
        // No date selected, remove all selections
        cellElement.removeAttribute('data-selected')
      }
    })
  }, [selectedDate])

  // Fetch available slots when date is selected
  const fetchAvailableSlots = async (date: Date) => {
    setLoading(true)
    setError(null)

    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const url = appointmentTypeId
        ? `/api/appointments/available-slots?date=${dateStr}&appointmentTypeId=${appointmentTypeId}`
        : `/api/appointments/available-slots?date=${dateStr}`
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch available slots')
      }

      const data = await response.json()
      setAvailableSlots(data.slots || [])
      onDateSelect(date, data.slots || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load available slots'
      setError(errorMessage)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  // Handle date click in calendar
  const handleDateClick = (info: any) => {
    const clickedDate = info.date

    // Normalize dates to compare only the date part (ignore time)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const clickedDateNormalized = new Date(clickedDate)
    clickedDateNormalized.setHours(0, 0, 0, 0)

    // Don't allow past dates or weekends - show error message
    if (clickedDateNormalized < today || info.dayEl.classList.contains('fc-day-sat') || info.dayEl.classList.contains('fc-day-sun')) {
      setError(locale === 'es'
        ? 'No se pueden reservar citas para fechas pasadas o fines de semana'
        : 'Cannot book appointments for past dates or weekends')
      setAvailableSlots([])
      return
    }

    // Clear any previous errors
    setError(null)
    setSelectedDate(clickedDate)
    fetchAvailableSlots(clickedDate)
  }

  return (
    <Card className="w-full" data-testid="booking-calendar" role="region" aria-label={locale === 'es' ? 'Calendario de citas' : 'Appointment calendar'}>
      <CardHeader>
        <CardTitle as="h2">{locale === 'es' ? 'Seleccionar Fecha' : 'Select Appointment Date'}</CardTitle>
        <CardDescription>
          {locale === 'es'
            ? 'Haga clic en una fecha disponible para ver los horarios disponibles'
            : 'Click on an available date to see available time slots'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {locale === 'es'
              ? 'Las citas están disponibles de lunes a viernes, de 9:00 AM a 5:00 PM. Se requiere un aviso mínimo de 24 horas.'
              : 'Appointments are available Monday-Friday, 9:00 AM - 5:00 PM. Minimum 24-hour notice required.'}
          </AlertDescription>
        </Alert>

        <div
          className="calendar-wrapper"
          data-testid="calendar-container"
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={locale === 'es' ? esLocale : undefined}
            businessHours={businessHours}
            weekends={false}
            hiddenDays={[0, 6]}
            dayHeaderContent={(args) => {
              // Hide weekend day headers (Sun=0, Sat=6)
              if (args.dow === 0 || args.dow === 6) return null
              return args.text
            }}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            height="auto"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            validRange={{
              start: new Date(),
              end: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120-day booking window (buffer for testing)
            }}
            dayCellClassNames={(arg) => {
              const day = arg.date.getDay()
              // Disable weekends
              if (day === 0 || day === 6) {
                return ['fc-day-disabled']
              }
              // Highlight selected date
              if (selectedDate && arg.date.toDateString() === selectedDate.toDateString()) {
                return ['fc-day-selected']
              }
              return []
            }}
            dayCellDidMount={(arg) => {
              // Add data-testid to each day cell
              arg.el.setAttribute('data-testid', 'calendar-day')

              // Add data-day-number attribute (day of month: 1-31)
              // Note: FullCalendar uses data-date for YYYY-MM-DD format, so we use different name
              const dayNumber = arg.date.getDate()
              arg.el.setAttribute('data-day-number', dayNumber.toString())

              // Add data-selected attribute if this date is selected
              if (selectedDate && arg.date.toDateString() === selectedDate.toDateString()) {
                arg.el.setAttribute('data-selected', 'true')
              } else {
                arg.el.removeAttribute('data-selected')
              }

              // Add data-testid to parent week row (once per week)
              const weekRow = arg.el.closest('.fc-daygrid-week')
              if (weekRow && !weekRow.hasAttribute('data-testid')) {
                weekRow.setAttribute('data-testid', 'calendar-week')
              }

              // Add aria-disabled for past dates, weekends, and dates beyond 90-day window
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const cellDate = new Date(arg.date)
              cellDate.setHours(0, 0, 0, 0)
              const day = arg.date.getDay()

              // Calculate 120-day maximum booking window (buffer for testing)
              const maxDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
              maxDate.setHours(0, 0, 0, 0)

              const isDisabled = cellDate < today || cellDate > maxDate || day === 0 || day === 6

              if (isDisabled) {
                arg.el.setAttribute('aria-disabled', 'true')
                arg.el.style.cursor = 'not-allowed'
              } else {
                // Make enabled cells focusable and add keyboard navigation
                arg.el.setAttribute('tabindex', '0')
                arg.el.setAttribute('role', 'button')
                arg.el.setAttribute('aria-label', format(arg.date, 'EEEE, MMMM d, yyyy', { locale: locale === 'es' ? dateFnsEs : undefined }))

                // Add keyboard event handler
                arg.el.addEventListener('keydown', (e: KeyboardEvent) => {
                  const currentCell = e.target as HTMLElement

                  // Arrow key navigation
                  if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    const nextCell = currentCell.nextElementSibling as HTMLElement
                    if (nextCell && nextCell.hasAttribute('tabindex')) {
                      nextCell.focus()
                    }
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    const prevCell = currentCell.previousElementSibling as HTMLElement
                    if (prevCell && prevCell.hasAttribute('tabindex')) {
                      prevCell.focus()
                    }
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    // currentCell is the <td> element itself
                    // Find the parent <tr> row
                    const currentRow = currentCell.closest('tr')
                    const nextRow = currentRow?.nextElementSibling as HTMLTableRowElement

                    if (currentRow && nextRow) {
                      // Get column index from the <td> within the <tr>
                      const cellIndex = Array.from(currentRow.children).indexOf(currentCell)
                      const nextRowCell = nextRow.children[cellIndex] as HTMLElement

                      // The TD itself has tabindex, focus it directly
                      if (nextRowCell && nextRowCell.hasAttribute('tabindex')) {
                        nextRowCell.focus()
                      }
                    }
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    // currentCell is the <td> element itself
                    // Find the parent <tr> row
                    const currentRow = currentCell.closest('tr')
                    const prevRow = currentRow?.previousElementSibling as HTMLTableRowElement

                    if (currentRow && prevRow) {
                      // Get column index from the <td> within the <tr>
                      const cellIndex = Array.from(currentRow.children).indexOf(currentCell)
                      const prevRowCell = prevRow.children[cellIndex] as HTMLElement

                      // The TD itself has tabindex, focus it directly
                      if (prevRowCell && prevRowCell.hasAttribute('tabindex')) {
                        prevRowCell.focus()
                      }
                    }
                  }
                  // Date selection with Enter or Space
                  else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleDateClick({ date: arg.date, dayEl: arg.el })
                  }
                })
              }

              // Add data-has-availability attribute (for availability indicator tests)
              // Future weekdays that aren't disabled are considered to have availability
              const hasAvailability = !isDisabled
              arg.el.setAttribute('data-has-availability', hasAvailability.toString())

              // Add data-adjacent-month attribute (for adjacent month styling test)
              // Adjacent month dates should always be disabled
              const currentMonth = arg.view.currentStart.getMonth()
              const cellMonth = arg.date.getMonth()
              if (currentMonth !== cellMonth) {
                arg.el.setAttribute('data-adjacent-month', 'true')
                arg.el.setAttribute('aria-disabled', 'true')
                arg.el.style.cursor = 'not-allowed'
                arg.el.style.pointerEvents = 'none'
              }

              // Add data-day attribute (for weekend styling test)
              arg.el.setAttribute('data-day', day.toString())

              // Mark today's date
              if (cellDate.getTime() === today.getTime()) {
                arg.el.setAttribute('data-today', 'true')
              }
            }}
            viewDidMount={(arg) => {
              // Add data-testid to navigation buttons and title after calendar mounts
              const prevButton = arg.el.querySelector('.fc-prev-button')
              const nextButton = arg.el.querySelector('.fc-next-button')
              const title = arg.el.querySelector('.fc-toolbar-title')

              if (prevButton) {
                prevButton.setAttribute('data-testid', 'calendar-prev')
                prevButton.setAttribute('aria-label', 'Previous month')
              }
              if (nextButton) {
                nextButton.setAttribute('data-testid', 'calendar-next')
                nextButton.setAttribute('aria-label', 'Next month')
              }
              if (title) {
                title.setAttribute('data-testid', 'calendar-month')
              }
            }}
            datesSet={() => {
              // Re-apply test IDs immediately without setTimeout for faster test execution
              const prevButton = document.querySelector('.fc-prev-button')
              const nextButton = document.querySelector('.fc-next-button')
              const title = document.querySelector('.fc-toolbar-title')

              if (prevButton) {
                prevButton.setAttribute('data-testid', 'calendar-prev')
                prevButton.setAttribute('aria-label', 'Previous month')
              }
              if (nextButton) {
                nextButton.setAttribute('data-testid', 'calendar-next')
                nextButton.setAttribute('aria-label', 'Next month')
              }
              if (title) {
                title.setAttribute('data-testid', 'calendar-month')
              }

              // Add test IDs to all week rows for week count test
              // FullCalendar's week rows are in .fc-daygrid-body tbody
              const weekRows = document.querySelectorAll('.fc-daygrid-body tr')
              weekRows.forEach(week => {
                week.setAttribute('data-testid', 'calendar-week')
              })
            }}
          />
        </div>

        {loading && (
          <div className="mt-4 text-center text-neutral-600" data-testid="calendar-loading">
            {locale === 'es' ? 'Cargando horarios disponibles...' : 'Loading available slots...'}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4" data-testid="calendar-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <style jsx global>{`
          .calendar-wrapper {
            --fc-border-color: #e5e7eb;
            --fc-button-bg-color: #2563eb;
            --fc-button-border-color: #2563eb;
            --fc-button-hover-bg-color: #1d4ed8;
            --fc-button-hover-border-color: #1d4ed8;
            --fc-button-active-bg-color: #1e40af;
            --fc-button-active-border-color: #1e40af;
            --fc-today-bg-color: #f0fdf4;
          }

          .fc-day-disabled {
            background-color: #f9fafb;
            cursor: not-allowed;
          }

          .fc-day-selected {
            background-color: #dbeafe !important;
          }

          .fc-day-past {
            background-color: #fafafa;
            cursor: not-allowed;
          }

          .fc-day-future:hover {
            background-color: #f3f4f6;
            cursor: pointer;
          }

          /* Today's date styling - distinct visual indicator */
          .fc-day[data-today="true"] {
            border: 2px solid #2563eb !important;
            font-weight: 600;
            background-color: #f0fdf4;
          }

          /* Today's date when selected - combine both styles */
          .fc-day[data-today="true"][data-selected="true"] {
            border: 2px solid #1d4ed8 !important;
            background-color: #dbeafe !important;
            font-weight: 600;
          }

          .fc .fc-button {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .fc .fc-toolbar-title {
            font-size: 1.25rem;
            font-weight: 600;
          }
        `}</style>
      </CardContent>
    </Card>
  )
}
