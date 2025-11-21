import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Lock, Info } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:screening.title'),
    description: t('metadata:screening.description'),
    keywords: ['mental health screening', 'depression test', 'anxiety assessment', 'ADHD test', 'free mental health quiz', 'PHQ-9', 'GAD-7', 'ASRS', 'confidential screening'],
    openGraph: {
      title: t('metadata:screening.title'),
      description: t('metadata:screening.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/screening`,
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
      title: t('metadata:screening.title'),
      description: t('metadata:screening.description')
    }
  }
}

export default async function ScreeningPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['screening'])

  const screenings = [
    {
      slug: 'phq-9',
      title: t('tools.phq9.name'),
      subtitle: t('tools.phq9.fullName'),
      description: t('tools.phq9.description'),
      duration: t('tools.phq9.duration'),
    },
    {
      slug: 'gad-7',
      title: t('tools.gad7.name'),
      subtitle: t('tools.gad7.fullName'),
      description: t('tools.gad7.description'),
      duration: t('tools.gad7.duration'),
    },
    {
      slug: 'asrs',
      title: t('tools.asrs.name'),
      subtitle: t('tools.asrs.fullName'),
      description: t('tools.asrs.description'),
      duration: t('tools.asrs.duration'),
    },
    {
      slug: 'mdq',
      title: t('tools.mdq.name'),
      subtitle: t('tools.mdq.fullName'),
      description: t('tools.mdq.description'),
      duration: t('tools.mdq.duration'),
    },
    {
      slug: 'pcl-5',
      title: t('tools.pcl5.name'),
      subtitle: t('tools.pcl5.fullName'),
      description: t('tools.pcl5.description'),
      duration: t('tools.pcl5.duration'),
    },
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="mb-6">{t('hub.title')}</h1>
          <p className="text-lg text-neutral-600 mb-6">
            {t('common.privacyNote')}
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>{t('hub.disclaimer.title')}</AlertTitle>
            <AlertDescription>
              {t('hub.disclaimer.text')}
            </AlertDescription>
          </Alert>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Your Privacy is Protected</AlertTitle>
            <AlertDescription>
              {t('common.privacyNote')}
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {screenings.map((screening) => (
            <Card key={screening.slug}>
              <CardHeader>
                <CardTitle>{screening.title}</CardTitle>
                <CardDescription className="font-semibold text-primary-700">
                  {screening.subtitle}
                </CardDescription>
                <CardDescription>{screening.description}</CardDescription>
                <CardDescription className="text-sm text-neutral-500">
                  ⏱ {screening.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/screening/${screening.slug}`}>{t('common.startButton')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
