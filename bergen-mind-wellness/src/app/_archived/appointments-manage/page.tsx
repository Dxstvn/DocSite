import { ManageAppointment } from '@/components/appointments/_archived/ManageAppointment.original'
import { getAppointmentByToken } from '@/app/actions/appointments'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'
import type { Metadata } from 'next'

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    title: locale === 'es' ? 'Gestionar Cita | Bergen Mind & Wellness' : 'Manage Appointment | Bergen Mind & Wellness',
    description:
      locale === 'es'
        ? 'Gestione su cita programada, vea detalles y cancele si es necesario.'
        : 'Manage your scheduled appointment, view details, and cancel if needed.',
  }
}

export default async function ManageAppointmentPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { token } = await searchParams

  // Check if token is provided
  if (!token) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {locale === 'es' ? 'Token Requerido' : 'Token Required'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'es'
                  ? 'Por favor proporcione un token de reserva válido para gestionar su cita.'
                  : 'Please provide a valid booking token to manage your appointment.'}
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href={`/${locale}`}>
                  <Home className="mr-2 h-4 w-4" />
                  {locale === 'es' ? 'Volver al Inicio' : 'Return to Home'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch appointment by token
  const { appointment, error } = await getAppointmentByToken(token)

  // Handle error or appointment not found
  if (error || !appointment) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {locale === 'es' ? 'Cita No Encontrada' : 'Appointment Not Found'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'es'
                  ? 'No pudimos encontrar una cita con este token. Por favor verifique el enlace en su correo de confirmación.'
                  : 'We could not find an appointment with this token. Please check the link in your confirmation email.'}
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href={`/${locale}`}>
                  <Home className="mr-2 h-4 w-4" />
                  {locale === 'es' ? 'Volver al Inicio' : 'Return to Home'}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/appointments`}>
                  {locale === 'es' ? 'Reservar Nueva Cita' : 'Book New Appointment'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform appointment_type from array to single object (Supabase returns arrays for foreign key relationships)
  const transformedAppointment = {
    ...appointment,
    appointment_type: Array.isArray(appointment.appointment_type)
      ? appointment.appointment_type[0] || null
      : appointment.appointment_type,
  }

  // Render appointment management component
  return <ManageAppointment appointment={transformedAppointment} locale={locale} />
}
