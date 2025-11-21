import { createClient } from '@/lib/supabase/server'
import { AppointmentsClient } from '@/components/admin/AppointmentsClient'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AppointmentsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()

  // Fetch all appointments with appointment type details, ordered by start_time
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      appointment_type:appointment_types(
        id,
        name,
        display_name,
        display_name_es,
        duration_minutes
      )
    `)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching appointments:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading appointments. Please try again.</p>
      </div>
    )
  }

  return <AppointmentsClient appointments={appointments || []} locale={locale} />
}
