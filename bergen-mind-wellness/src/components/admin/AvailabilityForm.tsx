'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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

type AvailabilityFormProps = {
  locale: string
  mode?: 'create' | 'edit'
  initialData?: AvailabilitySlot
  onSuccess?: () => void
}

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
]

export function AvailabilityForm({ locale, mode = 'create', initialData, onSuccess }: AvailabilityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Availability mode: 'recurring' or 'specific'
  const [availabilityMode, setAvailabilityMode] = useState<'recurring' | 'specific'>(
    initialData ? (initialData.is_recurring ? 'recurring' : 'specific') : 'recurring'
  )

  // Recurring fields
  const [dayOfWeek, setDayOfWeek] = useState<string>(
    initialData && initialData.day_of_week !== null ? String(initialData.day_of_week) : ''
  )

  // Specific date field
  const [specificDate, setSpecificDate] = useState<Date | undefined>(
    initialData?.specific_date ? new Date(initialData.specific_date) : undefined
  )

  // Common fields
  const [startTime, setStartTime] = useState<string>(initialData?.start_time || '')
  const [endTime, setEndTime] = useState<string>(initialData?.end_time || '')

  // Blocked time fields
  const [isBlocked, setIsBlocked] = useState(initialData?.is_blocked || false)
  const [blockReason, setBlockReason] = useState<string>(initialData?.block_reason || '')

  // Conflict detection state
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictMessage, setConflictMessage] = useState('')

  // Real-time conflict detection
  useEffect(() => {
    const checkConflicts = async () => {
      // Only check if we have the minimum required fields
      if (!startTime || !endTime) {
        setHasConflict(false)
        return
      }

      // Validate times first
      if (startTime >= endTime) {
        setHasConflict(false)
        return
      }

      // Check based on mode
      if (availabilityMode === 'recurring' && !dayOfWeek) {
        setHasConflict(false)
        return
      }

      if (availabilityMode === 'specific' && !specificDate) {
        setHasConflict(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setHasConflict(false)
          return
        }

        let query = supabase
          .from('availability_slots')
          .select('*')
          .eq('doctor_id', user.id)

        // Build query based on mode
        if (availabilityMode === 'recurring') {
          query = query
            .eq('is_recurring', true)
            .eq('day_of_week', parseInt(dayOfWeek))
        } else {
          const dateStr = format(specificDate!, 'yyyy-MM-dd')
          query = query
            .eq('is_recurring', false)
            .eq('specific_date', dateStr)
        }

        // Exclude current slot in edit mode
        if (mode === 'edit' && initialData) {
          query = query.neq('id', initialData.id)
        }

        const { data: existing } = await query

        if (existing && existing.length > 0) {
          // Check for actual time overlap
          const hasOverlap = existing.some(slot => {
            const slotStart = slot.start_time
            const slotEnd = slot.end_time

            // Check if times overlap
            return (
              (startTime >= slotStart && startTime < slotEnd) ||
              (endTime > slotStart && endTime <= slotEnd) ||
              (startTime <= slotStart && endTime >= slotEnd)
            )
          })

          if (hasOverlap) {
            setHasConflict(true)
            setConflictMessage('⚠️ Warning: This time overlaps with an existing availability slot')
          } else {
            setHasConflict(false)
            setConflictMessage('')
          }
        } else {
          setHasConflict(false)
          setConflictMessage('')
        }
      } catch (err) {
        // Silently handle errors in conflict check
        setHasConflict(false)
      }
    }

    // Debounce to avoid excessive queries
    const timeoutId = setTimeout(checkConflicts, 300)
    return () => clearTimeout(timeoutId)
  }, [availabilityMode, dayOfWeek, specificDate, startTime, endTime, mode, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate common fields
      if (!startTime || !endTime) {
        throw new Error('Please fill in start and end times')
      }

      if (startTime >= endTime) {
        throw new Error('End time must be after start time')
      }

      // Validate mode-specific fields
      if (availabilityMode === 'recurring' && !dayOfWeek) {
        throw new Error('Please select a day of the week')
      }

      if (availabilityMode === 'specific' && !specificDate) {
        throw new Error('Please select a specific date')
      }

      // Validate blocked time requires reason
      if (isBlocked && !blockReason.trim()) {
        throw new Error('Please provide a reason for blocking this time')
      }

      const supabase = createClient()

      // Get current user (doctor_id is required)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to add availability')
      }

      // Note: Overlap validation intentionally removed
      // Overlapping slots are valid and necessary for use cases like:
      // - Blocked time within available time (e.g., lunch break during business hours)
      // - Specific date overrides for recurring availability
      // The slot calculation logic properly handles overlaps (blocked slots take precedence)

      // Prepare data for insert or update
      const data: {
        doctor_id: string
        is_recurring: boolean
        start_time: string
        end_time: string
        is_blocked: boolean
        day_of_week?: number | null
        specific_date?: string | null
        block_reason?: string | null
      } = {
        doctor_id: user.id,
        is_recurring: availabilityMode === 'recurring',
        start_time: startTime,
        end_time: endTime,
        is_blocked: isBlocked,
      }

      if (availabilityMode === 'recurring') {
        data.day_of_week = parseInt(dayOfWeek)
        data.specific_date = null
      } else {
        data.specific_date = format(specificDate!, 'yyyy-MM-dd')
        data.day_of_week = null
      }

      if (isBlocked) {
        data.block_reason = blockReason
      } else {
        data.block_reason = null
      }

      // Insert new availability or update existing
      if (mode === 'create') {
        const { error: insertError } = await supabase
          .from('availability_slots')
          .insert(data)

        if (insertError) throw insertError
      } else {
        // Update existing availability
        const { error: updateError } = await supabase
          .from('availability_slots')
          .update(data)
          .eq('id', initialData!.id)

        if (updateError) throw updateError
      }

      setSuccess(true)

      // Reset form only in create mode
      if (mode === 'create') {
        setAvailabilityMode('recurring')
        setDayOfWeek('')
        setSpecificDate(undefined)
        setStartTime('')
        setEndTime('')
        setIsBlocked(false)
        setBlockReason('')
      }

      // Refresh the page to show new data
      router.refresh()

      // Call onSuccess callback after showing success message (delay to show message)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500) // 1.5 second delay to show success message
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to add availability')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="availability-form">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>
            ✓ Availability {isBlocked ? 'blocked' : 'added'} successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Mode Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Availability Type</label>
        <RadioGroup value={availabilityMode} onValueChange={(value: 'recurring' | 'specific') => setAvailabilityMode(value)} data-testid="mode-selector">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recurring" id="recurring" />
            <label htmlFor="recurring" className="text-sm cursor-pointer">
              Recurring Weekly
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specific" id="specific" />
            <label htmlFor="specific" className="text-sm cursor-pointer">
              Specific Date
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Day of Week (Recurring) */}
      {availabilityMode === 'recurring' && (
        <div className="space-y-2">
          <label htmlFor="day" className="text-sm font-medium">
            Day of Week
          </label>
          <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
            <SelectTrigger id="day" data-testid="day-select">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Specific Date Picker */}
      {availabilityMode === 'specific' && (
        <div className="space-y-2">
          <label htmlFor="specific-date" className="text-sm font-medium">
            Specific Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="specific-date"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !specificDate && 'text-muted-foreground'
                )}
                data-testid="date-picker-trigger"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {specificDate ? format(specificDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={specificDate}
                onSelect={setSpecificDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                data-testid="date-picker-calendar"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Start Time */}
      <div className="space-y-2">
        <label htmlFor="start-time" className="text-sm font-medium">
          Start Time
        </label>
        <Input
          id="start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          disabled={loading}
          data-testid="start-time"
        />
      </div>

      {/* End Time */}
      <div className="space-y-2">
        <label htmlFor="end-time" className="text-sm font-medium">
          End Time
        </label>
        <Input
          id="end-time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          disabled={loading}
          data-testid="end-time"
        />
      </div>

      {/* Block Time Checkbox */}
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="block-time"
          checked={isBlocked}
          onCheckedChange={(checked) => setIsBlocked(checked as boolean)}
          disabled={loading}
          data-testid="block-checkbox"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="block-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Block this time (unavailable for appointments)
          </label>
          <p className="text-sm text-muted-foreground">
            Mark this time as blocked/unavailable (e.g., vacation, personal time off)
          </p>
        </div>
      </div>

      {/* Block Reason (conditional) */}
      {isBlocked && (
        <div className="space-y-2">
          <label htmlFor="block-reason" className="text-sm font-medium">
            Reason for Blocking
          </label>
          <Textarea
            id="block-reason"
            placeholder="e.g., Personal time off, Vacation, Staff meeting"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            disabled={loading}
            rows={3}
            data-testid="block-reason"
          />
        </div>
      )}

      {/* Conflict Warning (non-blocking) */}
      {hasConflict && (
        <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertDescription>{conflictMessage}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading} data-testid="submit-button">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {mode === 'edit' ? 'Saving...' : (isBlocked ? 'Blocking...' : 'Adding...')}
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            {mode === 'edit' ? 'Save Changes' : (isBlocked ? 'Block Time' : 'Add Time Slot')}
          </>
        )}
      </Button>
    </form>
  )
}
