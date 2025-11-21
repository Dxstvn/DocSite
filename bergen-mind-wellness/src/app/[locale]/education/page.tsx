import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:education.title'),
    description: t('metadata:education.description'),
    keywords: ['mental health education', 'depression information', 'anxiety disorders', 'ADHD resources', 'mental health conditions', 'bipolar disorder info', 'PTSD education'],
    openGraph: {
      title: t('metadata:education.title'),
      description: t('metadata:education.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education`,
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
      title: t('metadata:education.title'),
      description: t('metadata:education.description')
    }
  }
}

const conditionSlugs = ['depression', 'anxiety', 'adhd', 'bipolar', 'ptsd'] as const

export default async function EducationPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mb-6">{t('education:hub.title')}</h1>
          <p className="text-lg text-neutral-600">
            {t('education:hub.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conditionSlugs.map((slug) => (
            <Card key={slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{t(`education:conditions.${slug}.title`)}</CardTitle>
                <CardDescription>{t(`education:conditions.${slug}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/education/${slug}`}>{t('education:hub.learnMore')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
