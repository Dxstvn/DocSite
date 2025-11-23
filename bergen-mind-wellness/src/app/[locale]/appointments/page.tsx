import type { Metadata } from 'next'
import { initTranslations } from '@/lib/i18n'
import { BookingInterface } from '@/components/appointments/BookingInterface'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:appointments.title'),
    description: t('metadata:appointments.description'),
    keywords: [
      'book appointment',
      'schedule consultation',
      'psychiatrist appointment',
      'mental health booking',
      'therapy session',
      'medication management'
    ],
    openGraph: {
      title: t('metadata:appointments.title'),
      description: t('metadata:appointments.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/appointments`,
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [{
        url: `${baseUrl}/logo-200.png`,
        width: 200,
        height: 267,
        alt: 'Bergen Mind & Wellness Logo'
      }]
    },
    twitter: {
      card: 'summary',
      title: t('metadata:appointments.title'),
      description: t('metadata:appointments.description')
    }
  }
}

export default async function AppointmentsPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['appointments', 'common'])

  // Fetch active appointment types from database
  const supabase = await createClient()
  const { data: appointmentTypes, error } = await supabase
    .from('appointment_types')
    .select('id, name, display_name, display_name_es, duration_minutes, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching appointment types:', error)
  }

  return (
    <div className="section bg-neutral-50">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {t('appointments:title', 'Schedule Your Appointment')}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('appointments:subtitle', 'Choose a convenient time for your consultation. We offer flexible scheduling to accommodate your needs.')}
            </p>
          </div>

          {/* Booking Interface */}
          <BookingInterface
            locale={locale as 'en' | 'es'}
            appointmentTypes={appointmentTypes || []}
          />

          {/* Help Text */}
          <div className="mt-12 text-center text-sm text-neutral-600">
            <p>
              {t('appointments:helpText', 'Need assistance? Call us at')} {' '}
              <a href="tel:+12016902182" className="text-primary-600 hover:underline font-medium">
                (201) 690-2182
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
