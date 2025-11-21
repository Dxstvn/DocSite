'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

export interface AppointmentType {
  id: string
  name: string
  duration: number  // in minutes
  color?: string
}

interface AppointmentTypeSelectorProps {
  appointmentTypes: AppointmentType[]
  selectedTypeId: string
  onTypeChange: (typeId: string) => void
  availableCounts?: Record<string, number>  // Optional: show available slot counts per type
}

/**
 * Appointment Type Selector - Tabs for switching between appointment types
 *
 * Displays appointment types as clickable tabs with duration badges.
 * When an appointment type is selected, the grid updates to show slots
 * calculated using that type's duration.
 *
 * Example: Selecting "45-Minute Session" shows slots every 60 minutes
 * (45 min appointment + 15 min buffer)
 */
export function AppointmentTypeSelector({
  appointmentTypes,
  selectedTypeId,
  onTypeChange,
  availableCounts,
}: AppointmentTypeSelectorProps) {
  if (appointmentTypes.length === 0) {
    return (
      <div className="text-sm text-neutral-500">
        No appointment types available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <Clock className="h-4 w-4" />
        <span>View availability for:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {appointmentTypes.map((type) => {
          const isSelected = type.id === selectedTypeId
          const availableCount = availableCounts?.[type.id]

          return (
            <Button
              key={type.id}
              variant={isSelected ? 'default' : 'outline'}
              size="lg"
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "h-auto flex-col items-start gap-1 px-4 py-3 transition-all",
                isSelected
                  ? "bg-primary-500 text-white shadow-md"
                  : "hover:bg-neutral-50 hover:border-neutral-300"
              )}
              data-testid={`appointment-type-${type.duration}`}
            >
              {/* Type Name */}
              <div className="flex items-center gap-2 w-full">
                <span className="font-semibold text-sm">{type.name}</span>
                {availableCount !== undefined && (
                  <Badge
                    variant={isSelected ? "secondary" : "outline"}
                    className="ml-auto"
                  >
                    {availableCount}
                  </Badge>
                )}
              </div>

              {/* Duration Badge */}
              <div className={cn(
                "text-xs font-medium",
                isSelected ? "text-primary-100" : "text-neutral-500"
              )}>
                {type.duration} minutes
                <span className="opacity-70 ml-1">
                  (+ 15 min buffer)
                </span>
              </div>
            </Button>
          )
        })}
      </div>

      {/* Help Text */}
      <p className="text-xs text-neutral-500 mt-2">
        Each appointment type shows different available time slots based on its duration.
        Patients see these exact slots when booking.
      </p>
    </div>
  )
}
