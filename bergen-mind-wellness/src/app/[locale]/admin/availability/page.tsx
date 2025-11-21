import { createClient } from '@/lib/supabase/server'
import { AvailabilityDialog } from '@/components/admin/AvailabilityDialog'
import { AvailabilityPageClient } from '@/components/admin/AvailabilityPageClient'
import { ExportButton } from '@/components/admin/ExportButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AvailabilityPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()

  // Fetch all availability slots (recurring and specific dates)
  const { data: slots, error } = await supabase
    .from('availability_slots')
    .select('id, day_of_week, specific_date, start_time, end_time, is_recurring, is_blocked, block_reason')
    .order('is_recurring', { ascending: false }) // Recurring first
    .order('day_of_week', { ascending: true })
    .order('specific_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching availability:', error)
  }

  // Fetch appointment types for dynamic slot generation
  const { data: appointmentTypesRaw, error: appointmentTypesError } = await supabase
    .from('appointment_types')
    .select('id, name, duration_minutes')
    .order('duration_minutes', { ascending: true })

  if (appointmentTypesError) {
    console.error('Error fetching appointment types:', appointmentTypesError)
  }

  // Transform to match AppointmentType interface (uses 'duration' not 'duration_minutes')
  const appointmentTypes = appointmentTypesRaw?.map(t => ({
    id: t.id,
    name: t.name,
    duration: t.duration_minutes
  })) || []

  return (
    <div className="space-y-8" data-testid="availability-page">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Availability Management</h1>
        <p className="text-neutral-600 mt-2">
          Set your available time slots for patient appointments
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Patients can only book appointments during your available time slots. Each slot represents
          one available appointment time. Set recurring weekly availability below.
        </AlertDescription>
      </Alert>

      {/* Actions: Add Availability and Export */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <AvailabilityDialog locale={locale} />
        <ExportButton slots={slots || []} />
      </div>

      {/* Current Availability Schedule - List or Grid View */}
      <AvailabilityPageClient
        slots={slots || []}
        appointmentTypes={appointmentTypes || []}
        locale={locale}
      />
    </div>
  )
}
