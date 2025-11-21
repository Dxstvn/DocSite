'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ViewToggle, type ViewMode } from './ViewToggle'
import { AvailabilityList } from './AvailabilityList'
import { WeeklyAvailabilityGrid } from './WeeklyAvailabilityGrid'
import type { AvailabilityRecord } from '@/lib/appointments/slot-calculator'
import type { AppointmentType } from './AppointmentTypeSelector'

interface AvailabilityPageClientProps {
  slots: AvailabilityRecord[]
  appointmentTypes: AppointmentType[]
  locale: string
}

/**
 * Client component wrapper for Availability page
 *
 * Manages view state (List vs Grid) and conditionally renders
 * the appropriate view component
 */
export function AvailabilityPageClient({ slots, appointmentTypes, locale }: AvailabilityPageClientProps) {
  const [view, setView] = useState<ViewMode>('list')

  return (
    <div data-testid="week-view">
      {/* View Toggle */}
      <div className="mb-4 flex justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Conditional Rendering Based on View */}
      {view === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Weekly Schedule</CardTitle>
            <CardDescription>Your available appointment times by day</CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilityList slots={slots} locale={locale} />
          </CardContent>
        </Card>
      ) : (
        <WeeklyAvailabilityGrid appointmentTypes={appointmentTypes} />
      )}
    </div>
  )
}
