'use client'

import { useState, useMemo, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppointmentActions } from '@/components/admin/AppointmentActions'
import { AppointmentFilters } from '@/components/admin/AppointmentFilters'
import { AppointmentPagination } from '@/components/admin/AppointmentPagination'
import { AppointmentsExportButton } from '@/components/admin/AppointmentsExportButton'
import { Calendar, Mail, Phone, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

type Appointment = {
  id: string
  start_time: string
  end_time: string
  patient_name: string
  patient_email: string
  patient_phone: string
  patient_locale: 'en' | 'es'
  notes: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  timezone: string
  doctor_id: string
  confirmed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  cancelled_by: string | null
  appointment_type?: {
    id: string
    display_name: string
    display_name_es?: string
    name: string
  }
}

type AppointmentsClientProps = {
  appointments: Appointment[]
  locale: string
}

export function AppointmentsClient({ appointments, locale }: AppointmentsClientProps) {
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const formatDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime)
      return format(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a')
    } catch {
      return datetime
    }
  }

  // Filter and search logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Status filter
      if (statusFilter !== 'all' && appointment.status !== statusFilter) {
        return false
      }

      // Type filter (when implemented with join)
      if (typeFilter !== 'all' && appointment.appointment_type?.name !== typeFilter) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = appointment.patient_name.toLowerCase().includes(query)
        const matchesEmail = appointment.patient_email.toLowerCase().includes(query)
        if (!matchesName && !matchesEmail) {
          return false
        }
      }

      // Date range filter
      const appointmentDate = new Date(appointment.start_time)
      if (startDate && appointmentDate < startDate) {
        return false
      }
      if (endDate) {
        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)
        if (appointmentDate > endOfDay) {
          return false
        }
      }

      return true
    })
  }, [appointments, statusFilter, typeFilter, searchQuery, startDate, endDate])

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / pageSize)
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredAppointments.slice(startIndex, endIndex)
  }, [filteredAppointments, currentPage, pageSize])

  // Reset to page 1 when filters change
  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }, [])

  const handleTypeChange = useCallback((type: string) => {
    setTypeFilter(type)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((search: string) => {
    setSearchQuery(search)
    setCurrentPage(1)
  }, [])

  const handleDateRangeChange = useCallback(
    (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start)
      setEndDate(end)
      setCurrentPage(1)
    },
    []
  )

  const handleClearFilters = useCallback(() => {
    setStatusFilter('all')
    setTypeFilter('all')
    setSearchQuery('')
    setStartDate(undefined)
    setEndDate(undefined)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // Scroll to top of appointments list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  // Group appointments by status for summary stats
  const pendingCount = filteredAppointments.filter((a) => a.status === 'pending').length
  const confirmedCount = filteredAppointments.filter((a) => a.status === 'confirmed').length
  const cancelledCount = filteredAppointments.filter((a) => a.status === 'cancelled').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Appointments</h1>
        <p className="text-neutral-600 mt-2">
          Manage appointment requests and view scheduling history
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-600">Pending</p>
              <p className="text-4xl font-bold text-amber-600 mt-2">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-600">Confirmed</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-600">Cancelled</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{cancelledCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end">
        <AppointmentsExportButton appointments={filteredAppointments} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <AppointmentFilters
            onStatusChange={handleStatusChange}
            onTypeChange={handleTypeChange}
            onSearchChange={handleSearchChange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={handleClearFilters}
            currentStatus={statusFilter}
            currentType={typeFilter}
            currentSearch={searchQuery}
            currentStartDate={startDate}
            currentEndDate={endDate}
          />
        </CardContent>
      </Card>

      {/* Appointments List */}
      {paginatedAppointments.length > 0 ? (
        <div className="space-y-4">
          {paginatedAppointments.map((appointment) => (
            <Card key={appointment.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{appointment.patient_name}</CardTitle>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(appointment.start_time)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <a
                      href={`mailto:${appointment.patient_email}`}
                      className="text-primary-600 hover:underline transition-colors"
                    >
                      {appointment.patient_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <a
                      href={`tel:${appointment.patient_phone}`}
                      className="text-primary-600 hover:underline transition-colors"
                    >
                      {appointment.patient_phone}
                    </a>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-700">Notes:</p>
                      <p className="text-neutral-600 mt-1">{appointment.notes}</p>
                    </div>
                  </div>
                )}
                <AppointmentActions
                  appointmentId={appointment.id}
                  currentStatus={appointment.status}
                  locale={locale}
                  appointment={
                    appointment.appointment_type
                      ? {
                          id: appointment.id,
                          patient_name: appointment.patient_name,
                          patient_email: appointment.patient_email,
                          appointment_type: {
                            display_name: appointment.appointment_type.display_name,
                            display_name_es: appointment.appointment_type.display_name_es,
                            id: appointment.appointment_type.id,
                          },
                          start_time: appointment.start_time,
                          end_time: appointment.end_time,
                          timezone: appointment.timezone,
                          doctor_id: appointment.doctor_id,
                          patient_locale: appointment.patient_locale,
                        }
                      : undefined
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No appointments found
            </h3>
            <p className="text-neutral-600">
              {filteredAppointments.length === 0 && appointments.length > 0
                ? 'Try adjusting your filters to see more results'
                : 'Appointment requests will appear here when patients book through your website'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <AppointmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredAppointments.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
