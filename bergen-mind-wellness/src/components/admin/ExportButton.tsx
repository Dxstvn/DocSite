'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { format } from 'date-fns'

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

type ExportButtonProps = {
  slots: AvailabilitySlot[]
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ExportButton({ slots }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    setShowSuccess(false)

    try {
      // Create CSV header
      const headers = ['Type', 'Day/Date', 'Start Time', 'End Time', 'Status', 'Block Reason']

      // Create CSV rows
      const rows = slots.map(slot => {
        const type = slot.is_recurring ? 'Recurring Weekly' : 'Specific Date'
        const dayOrDate = slot.is_recurring
          ? DAY_NAMES[slot.day_of_week!]
          : format(new Date(slot.specific_date!), 'yyyy-MM-dd')
        const status = slot.is_blocked ? 'Blocked' : 'Available'
        const blockReason = slot.block_reason || ''

        return [type, dayOrDate, slot.start_time, slot.end_time, status, blockReason]
      })

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `availability-schedule-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={exportToCSV}
        variant="outline"
        disabled={isExporting}
        className="w-full sm:w-auto"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {showSuccess && (
        <p className="text-sm text-green-600">
          ✓ CSV export downloaded successfully
        </p>
      )}
    </div>
  )
}
