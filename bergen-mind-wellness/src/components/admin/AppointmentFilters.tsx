'use client'

import { Search, X, Filter, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'

type AppointmentFiltersProps = {
  onStatusChange: (status: string) => void
  onTypeChange: (type: string) => void
  onSearchChange: (search: string) => void
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  onClearFilters: () => void
  currentStatus: string
  currentType: string
  currentSearch: string
  currentStartDate: Date | undefined
  currentEndDate: Date | undefined
}

export function AppointmentFilters({
  onStatusChange,
  onTypeChange,
  onSearchChange,
  onDateRangeChange,
  onClearFilters,
  currentStatus,
  currentType,
  currentSearch,
  currentStartDate,
  currentEndDate,
}: AppointmentFiltersProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    onDateRangeChange(date, currentEndDate)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    onDateRangeChange(currentStartDate, date)
  }

  const hasActiveFilters =
    currentStatus !== 'all' ||
    currentType !== 'all' ||
    currentSearch !== '' ||
    currentStartDate !== undefined ||
    currentEndDate !== undefined

  return (
    <div className="space-y-4">
      {/* Search Bar - Full Width */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search by patient name or email..."
          value={currentSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-10 h-12 bg-white border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
        />
        {currentSearch && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <Select value={currentStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px] h-10 bg-white border-neutral-200 hover:border-neutral-300 transition-colors">
              <SelectValue placeholder="All Appointments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="pending">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending
                </span>
              </SelectItem>
              <SelectItem value="confirmed">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Confirmed
                </span>
              </SelectItem>
              <SelectItem value="cancelled">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Cancelled
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointment Type Filter */}
        <Select value={currentType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[200px] h-10 bg-white border-neutral-200 hover:border-neutral-300 transition-colors">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="initial">Initial Consultation</SelectItem>
            <SelectItem value="followup">Follow-Up Session</SelectItem>
            <SelectItem value="medication_mgmt">Medication Management</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range - Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 justify-start text-left font-normal w-[160px] bg-white border-neutral-200 hover:border-neutral-300 transition-colors ${
                !currentStartDate && 'text-neutral-500'
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {currentStartDate ? format(currentStartDate, 'MMM dd, yyyy') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentStartDate}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date Range - End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 justify-start text-left font-normal w-[160px] bg-white border-neutral-200 hover:border-neutral-300 transition-colors ${
                !currentEndDate && 'text-neutral-500'
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {currentEndDate ? format(currentEndDate, 'MMM dd, yyyy') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentEndDate}
              onSelect={handleEndDateChange}
              disabled={(date) => (currentStartDate ? date < currentStartDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="h-10 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
