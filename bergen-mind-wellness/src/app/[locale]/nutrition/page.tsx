import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Leaf } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:nutrition.title'),
    description: t('metadata:nutrition.description'),
  keywords: ['nutrition mental health', 'brain food', 'depression diet', 'anxiety foods', 'supplements mental health', 'omega-3', 'vitamin D', 'mental wellness nutrition'],
  openGraph: {
    title: t('metadata:nutrition.title'),
    description: t('metadata:nutrition.description'),
    url: `${baseUrl}${locale === 'es' ? '/es' : ''}/nutrition`,
    type: 'website',
    locale: locale === 'es' ? 'es_ES' : 'en_US',
    images: [{
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/logo-200.png`,
      width: 200,
      height: 267,
      alt: 'Bergen Mind & Wellness Logo'
    }]
  },
  twitter: {
    card: 'summary',
    title: t('metadata:nutrition.title'),
    description: 'Evidence-based nutrition strategies to support mental wellness. Brain-healthy foods & supplements.'
  }
  }
}

export default async function NutritionPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['nutrition'])

  const nutritionTopics = [
    {
      slug: 'depression',
      title: t('hub.topics.depression.title'),
      description: t('hub.topics.depression.description'),
    },
    {
      slug: 'anxiety',
      title: t('hub.topics.anxiety.title'),
      description: t('hub.topics.anxiety.description'),
    },
    {
      slug: 'focus',
      title: t('hub.topics.focus.title'),
      description: t('hub.topics.focus.description'),
    },
    {
      slug: 'supplements',
      title: t('hub.topics.supplements.title'),
      description: t('hub.topics.supplements.description'),
    },
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Leaf className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">{t('hub.title')}</h1>
          <p className="text-lg text-neutral-600">
            {t('hub.description')}
          </p>
        </div>

        <Alert className="max-w-3xl mx-auto mb-12">
          <AlertTitle>{t('hub.disclaimer.title')}</AlertTitle>
          <AlertDescription>
            {t('hub.disclaimer.text')}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {nutritionTopics.map((topic) => (
            <Card key={topic.slug}>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/nutrition/${topic.slug}`}>{t('hub.explore')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>{t('hub.resources.title')}</CardTitle>
              <CardDescription>{t('hub.resources.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">{t('hub.resources.mealPlan.title')}</h3>
                  <p className="text-sm text-neutral-600">{t('hub.resources.mealPlan.description')}</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/brain-healthy-meal-plan.pdf" download>
                    {t('hub.downloadPDF')}
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">{t('hub.resources.groceryList.title')}</h3>
                  <p className="text-sm text-neutral-600">{t('hub.resources.groceryList.description')}</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/mood-boosting-grocery-list.pdf" download>
                    {t('hub.downloadPDF')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
