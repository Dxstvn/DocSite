'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, Lock } from 'lucide-react'
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
import { AvailabilityEditDialog } from '@/components/admin/AvailabilityEditDialog'
import { AvailabilityCopyDialog } from '@/components/admin/AvailabilityCopyDialog'

type AvailabilitySlot = {
  id: string
  day_of_week: number | null
  specific_date: string | null
  start_time: string
  end_time: string
  is_recurring: boolean
  is_blocked: boolean
  block_reason: string | null
}

type AvailabilityListProps = {
  slots: AvailabilitySlot[]
  locale: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function AvailabilityList({ slots, locale }: AvailabilityListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error deleting availability:', error)
      alert('Failed to delete time slot. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateTotalHours = (slots: AvailabilitySlot[]) => {
    const totalMinutes = slots
      .filter(slot => !slot.is_blocked) // Only count non-blocked slots
      .reduce((sum, slot) => {
        const [startHours, startMinutes] = slot.start_time.split(':').map(Number)
        const [endHours, endMinutes] = slot.end_time.split(':').map(Number)

        const startTotalMinutes = startHours * 60 + startMinutes
        const endTotalMinutes = endHours * 60 + endMinutes

        return sum + (endTotalMinutes - startTotalMinutes)
      }, 0)

    const hours = totalMinutes / 60

    // Format: "1 hour" vs "8 hours" vs "4.5 hours"
    if (hours === 1) {
      return '1 hour'
    } else if (hours % 1 === 0) {
      return `${hours} hours`
    } else {
      return `${hours.toFixed(1)} hours`
    }
  }

  // Separate recurring and specific date slots
  const recurringSlots = slots.filter(slot => slot.is_recurring)
  const specificSlots = slots.filter(slot => !slot.is_recurring)

  // Group recurring slots by day
  const slotsByDay = recurringSlots.reduce((acc, slot) => {
    const day = slot.day_of_week!
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(slot)
    return acc
  }, {} as Record<number, AvailabilitySlot[]>)

  // Group specific date slots by date
  const slotsByDate = specificSlots.reduce((acc, slot) => {
    const date = slot.specific_date!
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(slot)
    return acc
  }, {} as Record<string, AvailabilitySlot[]>)

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500" data-testid="availability-schedule">
        <p>No availability slots set</p>
        <p className="text-sm mt-1">Add time slots to allow patients to book appointments</p>
      </div>
    )
  }

  const renderSlot = (slot: AvailabilitySlot) => {
    const isBlocked = slot.is_blocked

    return (
      <div
        key={slot.id}
        className={`flex items-center justify-between p-3 rounded-lg border ${
          isBlocked
            ? 'bg-red-50 border-red-200'
            : 'bg-neutral-50 border-neutral-200'
        }`}
        data-testid="availability-slot"
        data-blocked={isBlocked ? 'true' : undefined}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isBlocked && <Lock className="h-4 w-4 text-red-600" />}
            <span className={`text-sm font-medium ${isBlocked ? 'text-red-900' : ''}`}>
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </span>
            {isBlocked && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                Blocked
              </span>
            )}
          </div>
          {isBlocked && slot.block_reason && (
            <p className="text-xs text-red-700 mt-1">
              {slot.block_reason}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Edit Button */}
          <AvailabilityEditDialog slot={slot} locale={locale} />

          {/* Copy Button */}
          <AvailabilityCopyDialog slot={slot} locale={locale} />

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={deletingId === slot.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="delete-slot-button"
              >
                {deletingId === slot.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this time slot?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the {formatTime(slot.start_time)} - {formatTime(slot.end_time)} slot
                  from your availability. Patients will no longer be able to book appointments during this time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(slot.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="availability-schedule">
      {/* Recurring Weekly Slots */}
      {Object.keys(slotsByDay).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            Recurring Weekly
          </h3>
          {Object.keys(slotsByDay)
            .map(Number)
            .sort((a, b) => a - b)
            .map((dayNum) => (
              <div key={dayNum} data-testid="availability-day-group">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  {DAY_NAMES[dayNum]} ({calculateTotalHours(slotsByDay[dayNum])})
                </h4>
                <div className="space-y-2">
                  {slotsByDay[dayNum].map(renderSlot)}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Specific Date Slots */}
      {Object.keys(slotsByDate).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            Specific Dates
          </h3>
          {Object.keys(slotsByDate)
            .sort((a, b) => a.localeCompare(b))
            .map((dateStr) => (
              <div key={dateStr} data-testid="availability-day-group">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')} ({calculateTotalHours(slotsByDate[dateStr])})
                </h4>
                <div className="space-y-2">
                  {slotsByDate[dateStr].map(renderSlot)}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
