'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'
import type { AppointmentType } from '@/types/database'

interface CompactAppointmentTypeSelectorProps {
  appointmentTypes: AppointmentType[]
  selectedTypeId: string | null
  onTypeChange: (typeId: string) => void
  locale?: 'en' | 'es'
  disabled?: boolean
}

export function CompactAppointmentTypeSelector({
  appointmentTypes,
  selectedTypeId,
  onTypeChange,
  locale = 'en',
  disabled = false,
}: CompactAppointmentTypeSelectorProps) {
  // Get display name for selected type
  const selectedType = appointmentTypes.find((t) => t.id === selectedTypeId)
  const selectedDisplayName = selectedType
    ? locale === 'es' && selectedType.display_name_es
      ? selectedType.display_name_es
      : selectedType.display_name
    : ''

  return (
    <Card className="w-full" data-testid="compact-appointment-type-selector">
      <CardContent className="py-4">
        <div className="space-y-2">
          <Label htmlFor="change-appointment-type" className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-600" />
            {locale === 'es' ? 'Tipo de Cita' : 'Appointment Type'}
          </Label>
          <Select value={selectedTypeId || ''} onValueChange={onTypeChange} disabled={disabled}>
            <SelectTrigger
              id="change-appointment-type"
              data-testid="change-appointment-type-select"
              className="w-full"
            >
              <SelectValue
                placeholder={locale === 'es' ? 'Seleccione un tipo' : 'Select a type'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{selectedDisplayName}</span>
                  {selectedType && (
                    <span className="text-sm text-neutral-600 ml-2">
                      ({selectedType.duration_minutes} {locale === 'es' ? 'min' : 'min'})
                    </span>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => {
                const displayName =
                  locale === 'es' && type.display_name_es ? type.display_name_es : type.display_name

                return (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{displayName}</span>
                      <span className="text-sm text-neutral-600">
                        {type.duration_minutes} {locale === 'es' ? 'minutos' : 'minutes'}
                      </span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500">
            {locale === 'es'
              ? 'Cambiar el tipo recalculará los horarios disponibles'
              : 'Changing type will recalculate available times'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
