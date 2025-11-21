'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, startOfWeek, format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Check, X, User, Clock, CalendarOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import {
  generateWeeklyGrid,
  calculateWeeklyStats,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT_NAMES,
  type WeeklySlot,
  type AvailabilityRecord,
  type AppointmentRecord,
} from '@/lib/appointments/slot-calculator'
import { TimeSlotCell } from './TimeSlotCell'
import { BlockDayDialog } from './BlockDayDialog'
import { AppointmentTypeSelector, type AppointmentType } from './AppointmentTypeSelector'
import { cn } from '@/lib/utils'

interface WeeklyAvailabilityGridProps {
  appointmentTypes: AppointmentType[]
}

/**
 * Weekly Availability Grid - Google Calendar Style with Dynamic Slot Durations
 *
 * Displays availability grid with slots matching patient booking experience.
 * Slot intervals adjust based on selected appointment type:
 * - 30-min appointments: ~18 slots/day (45-min intervals)
 * - 45-min appointments: ~14 slots/day (60-min intervals)
 * - 60-min appointments: ~11 slots/day (75-min intervals)
 *
 * Visual states: Available (green), Blocked (red), Booked (blue), Past (gray)
 *
 * Features:
 * - Appointment type selector with tabs (30/45/60 minutes)
 * - Click slots to block/unblock periods
 * - "Block Day" button to block entire day with confirmation dialog
 * - Week navigation (Prev/Next)
 * - Statistics cards showing availability metrics
 * - Mobile-responsive with day selector tabs
 */
export function WeeklyAvailabilityGrid({ appointmentTypes }: WeeklyAvailabilityGridProps) {
  const router = useRouter()
  const supabase = createClient()

  // Select default appointment type (prefer 45-min if available, otherwise first)
  const defaultAppointmentType = appointmentTypes.find(t => t.duration === 45) || appointmentTypes[0]

  // Current week (always start on Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    return startOfWeek(today, { weekStartsOn: 1 }) // 1 = Monday
  })

  // Selected appointment type for dynamic slot generation
  const [selectedTypeId, setSelectedTypeId] = useState<string>(defaultAppointmentType?.id || '')

  // Data state
  const [availabilityRecords, setAvailabilityRecords] = useState<AvailabilityRecord[]>([])
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state for blocking entire day
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isBlockDayDialogOpen, setIsBlockDayDialogOpen] = useState(false)

  // Mobile: selected day for day-selector view
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  // Fetch availability records and appointments for current week
  useEffect(() => {
    async function fetchWeekData() {
      setIsLoading(true)
      setError(null)

      try {
        const weekEnd = addDays(currentWeekStart, 6) // Saturday

        // Fetch availability records (recurring + specific dates for this week)
        const { data: availabilityData, error: availabilityError} = await supabase
          .from('availability_slots')
          .select('*')
          .or(`is_recurring.eq.true,and(specific_date.gte.${format(currentWeekStart, 'yyyy-MM-dd')},specific_date.lte.${format(weekEnd, 'yyyy-MM-dd')})`)

        if (availabilityError) throw availabilityError

        // Fetch appointments for this week
        // Note: Removed profiles join to avoid RLS issues - patient names not needed for availability view
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .gte('start_time', currentWeekStart.toISOString())
          .lte('start_time', addDays(weekEnd, 1).toISOString())
          .eq('status', 'confirmed')

        if (appointmentsError) throw appointmentsError

        // Transform appointments data
        const transformedAppointments: AppointmentRecord[] = (appointmentsData || []).map(
          (apt: any) => ({
            start_time: apt.start_time,
            end_time: apt.end_time,
            // patient_name not needed for availability grid
          })
        )

        setAvailabilityRecords(availabilityData || [])
        setAppointments(transformedAppointments)
      } catch (err) {
        console.error('Failed to fetch week data:', err)
        setError('Failed to load availability data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeekData()
  }, [currentWeekStart, supabase])

  // Get selected appointment type duration
  const selectedType = appointmentTypes.find(t => t.id === selectedTypeId)
  const selectedDuration = selectedType?.duration || 30

  // Generate grid from current data with selected duration
  const weeklyGrid = generateWeeklyGrid(
    currentWeekStart,
    selectedDuration,
    availabilityRecords,
    appointments
  )
  const stats = calculateWeeklyStats(weeklyGrid)

  // Week navigation handlers
  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }))
  }

  // Individual slot click handler (block/unblock slot with dynamic duration)
  const handleSlotClick = async (slot: WeeklySlot) => {
    if (slot.state === 'booked' || slot.state === 'past') {
      return // Cannot modify booked or past slots
    }

    try {
      const slotDate = slot.date
      const dateStr = format(slotDate, 'yyyy-MM-dd')

      // Get authenticated user for doctor_id (required by RLS policy)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (slot.state === 'available') {
        // Block this slot with its actual duration
        await supabase.from('availability_slots').insert({
          doctor_id: user.id,
          specific_date: dateStr,
          day_of_week: null,
          start_time: `${slot.startTime}:00`,
          end_time: `${slot.endTime}:00`,
          is_recurring: false,
          is_blocked: true,
          block_reason: `Manually blocked (${slot.duration}-min slot)`,
        })
      } else if (slot.state === 'blocked') {
        // Unblock this slot - find and delete the matching blocked record
        const { error } = await supabase
          .from('availability_slots')
          .delete()
          .eq('specific_date', dateStr)
          .eq('start_time', `${slot.startTime}:00`)
          .eq('is_blocked', true)

        if (error) throw error
      }

      // Refresh data
      router.refresh()
      const weekEnd = addDays(currentWeekStart, 6)
      const { data: availabilityData } = await supabase
        .from('availability_slots')
        .select('*')
        .or(`is_recurring.eq.true,and(specific_date.gte.${format(currentWeekStart, 'yyyy-MM-dd')},specific_date.lte.${format(weekEnd, 'yyyy-MM-dd')})`)

      if (availabilityData) setAvailabilityRecords(availabilityData)
    } catch (err) {
      console.error('Failed to toggle slot:', err)
      alert('Failed to update slot. Please try again.')
    }
  }

  // Block entire day handler
  const handleBlockDay = (date: Date) => {
    setSelectedDate(date)
    setIsBlockDayDialogOpen(true)
  }

  // Confirm block entire day
  const handleConfirmBlockDay = async (reason: string) => {
    if (!selectedDate) return

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')

      // Get authenticated user for doctor_id (required by RLS policy)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create a single all-day block record (7:00 AM - 9:00 PM)
      await supabase.from('availability_slots').insert({
        doctor_id: user.id,
        specific_date: dateStr,
        day_of_week: null,
        start_time: '07:00:00',
        end_time: '21:00:00',
        is_recurring: false,
        is_blocked: true,
        block_reason: reason,
      })

      // Refresh data
      router.refresh()
      const weekEnd = addDays(currentWeekStart, 6)
      const { data: availabilityData } = await supabase
        .from('availability_slots')
        .select('*')
        .or(`is_recurring.eq.true,and(specific_date.gte.${format(currentWeekStart, 'yyyy-MM-dd')},specific_date.lte.${format(weekEnd, 'yyyy-MM-dd')})`)

      if (availabilityData) setAvailabilityRecords(availabilityData)
    } catch (err) {
      console.error('Failed to block day:', err)
      throw err
    }
  }

  // Get appointments for a specific day (for BlockDayDialog warning)
  const getAppointmentsForDate = (date: Date): AppointmentRecord[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time)
      return isSameDay(aptDate, date)
    })
  }

  return (
    <div className="space-y-6">
      {/* Appointment Type Selector */}
      <AppointmentTypeSelector
        appointmentTypes={appointmentTypes}
        selectedTypeId={selectedTypeId}
        onTypeChange={setSelectedTypeId}
      />

      {/* Week Navigation Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 5), 'MMMM d, yyyy')}
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Click slots to block/unblock • Green = Available • Red = Blocked • Blue = Booked
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="hidden sm:flex"
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Available</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.availableSlots}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Booked</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.bookedSlots}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Blocked</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.blockedSlots}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Clock className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Hours</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.totalAvailableHours}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-600">Loading availability...</div>
        </div>
      )}

      {/* Desktop Grid View */}
      {!isLoading && (
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day Headers */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-2 mb-2">
              <div></div>
              {WEEKDAY_NAMES.map((day, index) => {
                const date = addDays(currentWeekStart, index)
                const dayAppointments = getAppointmentsForDate(date)
                return (
                  <div key={day} className="text-center space-y-2">
                    <div>
                      <div className="font-semibold text-neutral-900">{day}</div>
                      <div className="text-sm text-neutral-600">{format(date, 'MMM d')}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockDay(date)}
                      className="w-full text-xs h-8 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <CalendarOff className="h-3 w-3 mr-1" />
                      Block Day
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-1">
              {Array.from({ length: 28 }).map((_, slotIndex) => {
                const firstDaySlots = weeklyGrid[0]
                const timeLabel = firstDaySlots?.[slotIndex]?.startTime || ''

                return (
                  <div key={slotIndex} className="grid grid-cols-[80px_repeat(6,1fr)] gap-2">
                    {/* Time Label */}
                    <div className="flex items-center justify-end pr-3 text-sm text-neutral-600 font-medium">
                      {timeLabel}
                    </div>

                    {/* Slots for each day */}
                    {weeklyGrid.map((daySlots, dayIndex) => {
                      const slot = daySlots[slotIndex]
                      if (!slot) return <div key={dayIndex} />

                      return (
                        <TimeSlotCell
                          key={`${dayIndex}-${slotIndex}`}
                          slot={slot}
                          onClick={() => handleSlotClick(slot)}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile View - Day Selector Tabs */}
      {!isLoading && (
        <div className="lg:hidden">
          {/* Day Selector Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {WEEKDAY_SHORT_NAMES.map((shortDay, index) => {
              const date = addDays(currentWeekStart, index)
              return (
                <button
                  key={shortDay}
                  onClick={() => setSelectedDayIndex(index)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all",
                    selectedDayIndex === index
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  <div className="text-sm">{shortDay}</div>
                  <div className="text-xs opacity-80">{format(date, 'M/d')}</div>
                </button>
              )
            })}
          </div>

          {/* Block Day Button */}
          <Button
            variant="outline"
            onClick={() => handleBlockDay(addDays(currentWeekStart, selectedDayIndex))}
            className="w-full mb-4 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <CalendarOff className="h-4 w-4 mr-2" />
            Block Entire Day
          </Button>

          {/* Time Slots for Selected Day */}
          <div className="space-y-2">
            {weeklyGrid[selectedDayIndex]?.map((slot, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm text-neutral-600 font-medium">
                  {slot.startTime}
                </div>
                <div className="flex-1">
                  <TimeSlotCell
                    slot={slot}
                    onClick={() => handleSlotClick(slot)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block Day Confirmation Dialog */}
      {selectedDate && (
        <BlockDayDialog
          open={isBlockDayDialogOpen}
          onOpenChange={setIsBlockDayDialogOpen}
          date={selectedDate}
          existingAppointments={getAppointmentsForDate(selectedDate)}
          onConfirm={handleConfirmBlockDay}
        />
      )}
    </div>
  )
}
