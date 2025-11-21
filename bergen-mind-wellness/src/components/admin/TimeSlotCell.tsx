'use client'

import { Button } from '@/components/ui/button'
import { Check, X, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SlotState, WeeklySlot } from '@/lib/appointments/slot-calculator'

interface TimeSlotCellProps {
  slot: WeeklySlot
  onClick: () => void
  disabled?: boolean
}

/**
 * Individual time slot cell in the weekly availability grid
 *
 * Visual states:
 * - Available (green): Open for appointments - checkmark icon
 * - Blocked (red): Manually blocked - X icon
 * - Booked (blue): Has appointment - user icon
 * - Past (gray): Historical, read-only - clock icon
 */
export function TimeSlotCell({ slot, onClick, disabled }: TimeSlotCellProps) {
  const { state, appointment, blockReason } = slot

  // Determine icon based on state
  const Icon =
    state === 'available' ? Check :
    state === 'blocked' ? X :
    state === 'booked' ? User :
    Clock

  // Determine if slot is clickable
  const isInteractive = !disabled && state !== 'past' && state !== 'booked'

  // Build ARIA label for screen readers
  const ariaLabel = buildAriaLabel(slot)

  // Build tooltip text
  const tooltipText = buildTooltipText(slot)

  return (
    <Button
      variant="outline"
      className={cn(
        "h-12 w-full relative group transition-all",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // State-specific colors
        state === 'available' && "bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400",
        state === 'blocked' && "bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400",
        state === 'booked' && "bg-blue-50 border-blue-300 cursor-not-allowed",
        state === 'past' && "bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-50",
        // Disabled state
        !isInteractive && "pointer-events-none"
      )}
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      aria-label={ariaLabel}
      aria-disabled={!isInteractive}
      title={tooltipText}
      data-testid={`slot-${slot.startTime}`}
      data-state={state}
    >
      {/* Icon */}
      <Icon
        className={cn(
          "h-4 w-4",
          state === 'available' && "text-green-600",
          state === 'blocked' && "text-red-600",
          state === 'booked' && "text-blue-600",
          state === 'past' && "text-neutral-400"
        )}
        aria-hidden="true"
      />

      {/* Tooltip on hover (desktop only) */}
      {tooltipText && (
        <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded whitespace-nowrap z-10 pointer-events-none">
          {tooltipText}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
        </span>
      )}
    </Button>
  )
}

/**
 * Build accessible ARIA label for screen readers
 */
function buildAriaLabel(slot: WeeklySlot): string {
  const timeLabel = `${slot.startTime} to ${slot.endTime}`
  const durationLabel = `${slot.duration}-minute appointment`

  switch (slot.state) {
    case 'available':
      return `${timeLabel} - ${durationLabel} - Available - Press Enter to block`
    case 'blocked':
      return `${timeLabel} - ${durationLabel} - Blocked${slot.blockReason ? ` - ${slot.blockReason}` : ''} - Press Enter to unblock`
    case 'booked':
      return `${timeLabel} - ${durationLabel} - Booked${slot.appointment?.patient_name ? ` - ${slot.appointment.patient_name}` : ''} - Cannot modify`
    case 'past':
      return `${timeLabel} - ${durationLabel} - Past time slot - Cannot modify`
    default:
      return timeLabel
  }
}

/**
 * Build tooltip text shown on hover
 */
function buildTooltipText(slot: WeeklySlot): string {
  const duration = `${slot.duration} min`

  switch (slot.state) {
    case 'available':
      return `Available (${duration}) - Click to block`
    case 'blocked':
      return slot.blockReason
        ? `Blocked (${duration}): ${slot.blockReason}`
        : `Blocked (${duration}) - Click to unblock`
    case 'booked':
      return slot.appointment?.patient_name
        ? `Appointment (${duration}): ${slot.appointment.patient_name}`
        : `Appointment booked (${duration})`
    case 'past':
      return `Past time slot (${duration})`
    default:
      return duration
  }
}
