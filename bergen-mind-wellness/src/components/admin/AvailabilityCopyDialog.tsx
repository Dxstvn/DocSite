'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

type AvailabilityCopyDialogProps = {
  slot: AvailabilitySlot
  locale: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function AvailabilityCopyDialog({ slot, locale }: AvailabilityCopyDialogProps) {
  const [open, setOpen] = useState(false)
  const [targetDay, setTargetDay] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Only allow copying recurring weekly slots
  if (!slot.is_recurring || slot.day_of_week === null) {
    return null
  }

  const sourceDayName = DAY_NAMES[slot.day_of_week]

  // Available days (exclude source day)
  const availableDays = DAY_NAMES.map((name, index) => ({
    value: index.toString(),
    label: name,
    disabled: index === slot.day_of_week
  }))

  const handleCopy = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!targetDay || targetDay === slot.day_of_week?.toString()) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    setShowSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create new slot with same times but different day
      const { error: insertError } = await supabase.from('availability').insert({
        doctor_id: user.id,
        day_of_week: parseInt(targetDay),
        specific_date: null,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_recurring: true,
        is_blocked: slot.is_blocked,
        block_reason: slot.block_reason
      })

      if (insertError) throw insertError

      setShowSuccess(true)
      router.refresh()

      // Close dialog after showing success message
      setTimeout(() => {
        setOpen(false)
        setTargetDay('')
        setShowSuccess(false)
      }, 1500)
    } catch (err: any) {
      console.error('Error copying availability:', err)
      setError(err.message || 'Failed to copy availability slot')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          aria-label="Copy"
          data-testid="copy-slot-button"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy Time Slot</DialogTitle>
          <DialogDescription>
            Copy this time slot to another day of the week
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCopy} className="space-y-4">
          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                ✓ Successfully copied to {targetDay && DAY_NAMES[parseInt(targetDay)]}!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Source slot info (read-only) */}
          <div className="rounded-md bg-neutral-50 p-4 space-y-2">
            <h4 className="font-semibold text-sm text-neutral-700">Source Slot</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Day:</span> {sourceDayName}
              </p>
              <p>
                <span className="font-medium">Time:</span> {slot.start_time} - {slot.end_time}
              </p>
              {slot.is_blocked && (
                <p>
                  <span className="font-medium">Status:</span> Blocked
                  {slot.block_reason && ` (${slot.block_reason})`}
                </p>
              )}
            </div>
          </div>

          {/* Target day selector */}
          <div className="space-y-2">
            <label htmlFor="targetDay" className="text-sm font-medium">
              Copy to Day
            </label>
            <select
              id="targetDay"
              name="targetDay"
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a day...</option>
              {availableDays.map((day) => (
                <option key={day.value} value={day.value} disabled={day.disabled}>
                  {day.label} {day.disabled ? '(source)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !targetDay}
            >
              {isSubmitting ? 'Copying...' : 'Copy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
