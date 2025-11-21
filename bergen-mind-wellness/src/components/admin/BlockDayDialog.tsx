'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import type { AppointmentRecord } from '@/lib/appointments/slot-calculator'

interface BlockDayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  existingAppointments: AppointmentRecord[]
  onConfirm: (reason: string) => Promise<void>
}

/**
 * Confirmation dialog for blocking an entire day
 *
 * Shows warning if appointments exist on that day
 * Requires admin to provide a reason for blocking
 */
export function BlockDayDialog({
  open,
  onOpenChange,
  date,
  existingAppointments,
  onConfirm,
}: BlockDayDialogProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasAppointments = existingAppointments.length > 0

  const handleConfirm = async () => {
    if (!reason.trim()) {
      return // Reason is required
    }

    setIsSubmitting(true)
    try {
      await onConfirm(reason)
      // Close dialog and reset on success
      onOpenChange(false)
      setReason('')
    } catch (error) {
      console.error('Failed to block day:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Block Entire Day</DialogTitle>
          <DialogDescription>
            Block all time slots on {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning if appointments exist */}
          {hasAppointments && (
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  ⚠️ Warning: {existingAppointments.length} existing {existingAppointments.length === 1 ? 'appointment' : 'appointments'}
                </p>
                <ul className="mt-2 space-y-1">
                  {existingAppointments.map((apt, index) => (
                    <li key={index} className="text-sm text-amber-800">
                      • {format(new Date(apt.start_time), 'h:mm a')}
                      {apt.patient_name && ` - ${apt.patient_name}`}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-700 mt-2">
                  Blocking this day will NOT automatically cancel these appointments.
                  You may need to reschedule or cancel them separately.
                </p>
              </div>
            </div>
          )}

          {/* Reason input */}
          <div className="space-y-2">
            <Label htmlFor="block-reason">
              Reason for blocking <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="block-reason"
              placeholder="e.g., Vacation, Conference, Personal day..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              aria-required="true"
              className="resize-none"
            />
            <p className="text-xs text-neutral-500">
              This reason will be visible when viewing availability
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Blocking...' : 'Block Entire Day'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
