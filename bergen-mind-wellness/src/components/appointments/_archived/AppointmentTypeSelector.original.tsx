'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'
import type { AppointmentType } from '@/types/database'

interface AppointmentTypeSelectorProps {
  appointmentTypes: AppointmentType[]
  selectedTypeId: string | null
  onTypeSelect: (typeId: string) => void
  locale?: 'en' | 'es'
}

export function AppointmentTypeSelector({
  appointmentTypes,
  selectedTypeId,
  onTypeSelect,
  locale = 'en',
}: AppointmentTypeSelectorProps) {
  // Get display name for selected type
  const selectedType = appointmentTypes.find((t) => t.id === selectedTypeId)
  const selectedDisplayName = selectedType
    ? locale === 'es' && selectedType.display_name_es
      ? selectedType.display_name_es
      : selectedType.display_name
    : ''

  return (
    <Card className="w-full" data-testid="appointment-type-selector">
      <CardHeader>
        <CardTitle as="h2">
          <Calendar className="inline mr-2 h-5 w-5" />
          {locale === 'es' ? 'Seleccione el Tipo de Cita' : 'Select Appointment Type'}
        </CardTitle>
        <CardDescription>
          {locale === 'es'
            ? 'Elija el tipo de cita que mejor se adapte a sus necesidades'
            : 'Choose the appointment type that best fits your needs'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="appointment-type-select">
            {locale === 'es' ? 'Tipo de Cita' : 'Appointment Type'}
          </Label>
          <Select value={selectedTypeId || ''} onValueChange={onTypeSelect}>
            <SelectTrigger
              id="appointment-type-select"
              data-testid="appointment-type-select"
              className="w-full"
            >
              <SelectValue
                placeholder={locale === 'es' ? 'Seleccione un tipo de cita' : 'Select an appointment type'}
              >
                {selectedDisplayName}
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
        </div>
      </CardContent>
    </Card>
  )
}
