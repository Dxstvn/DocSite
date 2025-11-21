'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { format } from 'date-fns'

type AppointmentType = {
  display_name: string
}

type Appointment = {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  patient_locale: 'en' | 'es'
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  timezone: string
  notes: string | null
  created_at: string
  confirmed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  cancelled_by: string | null
  appointment_type?: AppointmentType | AppointmentType[]
}

type AppointmentsExportButtonProps = {
  appointments: Appointment[]
}

export function AppointmentsExportButton({ appointments }: AppointmentsExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    setShowSuccess(false)

    try {
      // Create CSV header
      const headers = [
        'Patient Name',
        'Email',
        'Phone',
        'Language',
        'Appointment Type',
        'Date',
        'Time',
        'Duration (min)',
        'Status',
        'Timezone',
        'Notes/Reason for Visit',
        'Created Date',
        'Confirmed Date',
        'Cancelled Date',
        'Cancelled By',
        'Cancellation Reason'
      ]

      // Create CSV rows
      const rows = appointments.map(appointment => {
        // Handle appointment_type which might be an array
        const appointmentType = Array.isArray(appointment.appointment_type)
          ? appointment.appointment_type[0]
          : appointment.appointment_type

        // Format dates
        const appointmentDate = format(new Date(appointment.start_time), 'yyyy-MM-dd')
        const appointmentTime = format(new Date(appointment.start_time), 'HH:mm')
        const createdDate = format(new Date(appointment.created_at), 'yyyy-MM-dd HH:mm')
        const confirmedDate = appointment.confirmed_at
          ? format(new Date(appointment.confirmed_at), 'yyyy-MM-dd HH:mm')
          : ''
        const cancelledDate = appointment.cancelled_at
          ? format(new Date(appointment.cancelled_at), 'yyyy-MM-dd HH:mm')
          : ''

        // Calculate duration
        const startTime = new Date(appointment.start_time)
        const endTime = new Date(appointment.end_time)
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

        // Format cancellation reason
        const cancellationReason = appointment.cancellation_reason
          ? appointment.cancellation_reason.replace(/_/g, ' ')
          : ''

        return [
          appointment.patient_name,
          appointment.patient_email,
          appointment.patient_phone,
          appointment.patient_locale,
          appointmentType?.display_name || 'Appointment',
          appointmentDate,
          appointmentTime,
          durationMinutes.toString(),
          appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
          appointment.timezone,
          appointment.notes || '',
          createdDate,
          confirmedDate,
          cancelledDate,
          appointment.cancelled_by || '',
          cancellationReason
        ]
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
      link.setAttribute('download', `appointments-export-${format(new Date(), 'yyyy-MM-dd')}.csv`)
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
        disabled={isExporting || appointments.length === 0}
        className="w-full sm:w-auto"
        data-testid="export-appointments-button"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export to CSV'}
      </Button>

      {showSuccess && (
        <p className="text-sm text-green-600" data-testid="export-success-message">
          ✓ CSV export downloaded successfully
        </p>
      )}

      {appointments.length === 0 && (
        <p className="text-sm text-neutral-500">
          No appointments to export
        </p>
      )}
    </div>
  )
}
