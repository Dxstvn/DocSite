import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Brain, Heart, Leaf, BookOpen } from 'lucide-react'
import { StructuredData } from '@/components/StructuredData'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:home.title'),
    description: t('metadata:home.description'),
    keywords: ['mental health Bergen County', 'psychiatrist New Jersey', 'PMHNP', 'depression treatment', 'anxiety therapy', 'ADHD treatment', 'bipolar disorder', 'PTSD therapy', 'telepsychiatry', 'virtual mental health'],
    openGraph: {
      title: t('metadata:home.title'),
      description: t('metadata:home.description'),
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}${locale === 'es' ? '/es' : ''}`,
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [{
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
        width: 200,
        height: 267,
        alt: 'Bergen Mind & Wellness Logo'
      }]
    },
    twitter: {
      card: 'summary',
      title: t('metadata:home.title'),
      description: t('metadata:home.description')
    }
  }
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}#localbusiness`,
  name: 'Bergen Mind & Wellness, LLC',
  description: 'Board-certified psychiatric nurse practitioner offering compassionate, evidence-based mental health care in New Jersey. Virtual appointments available.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app',
  logo: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
    width: 200,
    height: 267,
  },
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bergen County',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'State',
    name: 'New Jersey',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Mental Health Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Psychiatric Evaluation & Medication Management',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Depression Treatment',
              description: 'Evidence-based treatment for major depressive disorder',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Anxiety Treatment',
              description: 'Comprehensive care for anxiety disorders',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ADHD Treatment',
              description: 'Adult ADHD assessment and medication management',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Bipolar Disorder Treatment',
              description: 'Mood stabilization and comprehensive care',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'PTSD Treatment',
              description: 'Trauma-informed care for post-traumatic stress',
            },
          },
        ],
      },
    ],
  },
  paymentAccepted: ['Cash', 'Credit Card', 'Insurance'],
  acceptsReservations: 'true',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['home'])

  return (
    <>
      <StructuredData data={localBusinessSchema} />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">{t('hero.scheduleButton')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/screening">{t('hero.screeningButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-12">{t('services.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>{t('services.education.title')}</CardTitle>
                <CardDescription>
                  {t('services.education.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/education">{t('services.education.button')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>{t('services.screening.title')}</CardTitle>
                <CardDescription>
                  {t('services.screening.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/screening">{t('services.screening.button')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>{t('services.nutrition.title')}</CardTitle>
                <CardDescription>
                  {t('services.nutrition.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/nutrition">{t('services.nutrition.button')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>{t('services.mindfulness.title')}</CardTitle>
                <CardDescription>
                  {t('services.mindfulness.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/mindfulness">{t('services.mindfulness.button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Assurance */}
      <section className="section bg-primary-50">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="mb-6">{t('privacy.title')}</h2>
            <p className="text-lg text-neutral-600 mb-8">
              {t('privacy.description')}
            </p>
            <Button asChild variant="outline">
              <Link href="/privacy">{t('privacy.button')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
