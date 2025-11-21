import type { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Heart } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:mindfulness.title'),
    description: t('metadata:mindfulness.description'),
    keywords: ['mindfulness meditation', 'breathing exercises', 'mental health journaling', 'sleep hygiene', 'stress management', 'guided meditation', 'mindfulness practices'],
    openGraph: {
      title: t('metadata:mindfulness.title'),
      description: t('metadata:mindfulness.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/mindfulness`,
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
      title: t('metadata:mindfulness.title'),
      description: t('metadata:mindfulness.description')
    }
  }
}

export default async function MindfulnessPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['mindfulness'])

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">{t('hero.title')}</h1>
          <p className="text-lg text-neutral-600">
            {t('hero.description')}
          </p>
        </div>

        <Tabs defaultValue="meditation" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditation">{t('tabs.meditation')}</TabsTrigger>
            <TabsTrigger value="breathing">{t('tabs.breathing')}</TabsTrigger>
            <TabsTrigger value="journaling">{t('tabs.journaling')}</TabsTrigger>
            <TabsTrigger value="sleep">{t('tabs.sleep')}</TabsTrigger>
          </TabsList>

          <TabsContent value="meditation">
            <Card>
              <CardHeader>
                <CardTitle>{t('meditation.title')}</CardTitle>
                <CardDescription>{t('meditation.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/inpok4MKVLM"
                    title={t('meditation.videoTitle')}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-neutral-600">
                  {t('meditation.content')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breathing">
            <Card>
              <CardHeader>
                <CardTitle>{t('breathing.title')}</CardTitle>
                <CardDescription>
                  {t('breathing.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('breathing.exercise478.title')}</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>{t('breathing.exercise478.steps.step1')}</li>
                    <li>{t('breathing.exercise478.steps.step2')}</li>
                    <li>{t('breathing.exercise478.steps.step3')}</li>
                    <li>{t('breathing.exercise478.steps.step4')}</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('breathing.boxBreathing.title')}</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>{t('breathing.boxBreathing.steps.step1')}</li>
                    <li>{t('breathing.boxBreathing.steps.step2')}</li>
                    <li>{t('breathing.boxBreathing.steps.step3')}</li>
                    <li>{t('breathing.boxBreathing.steps.step4')}</li>
                    <li>{t('breathing.boxBreathing.steps.step5')}</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journaling">
            <Card>
              <CardHeader>
                <CardTitle>{t('journaling.title')}</CardTitle>
                <CardDescription>{t('journaling.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{t('journaling.gratitude.title')}</h3>
                    <p className="text-sm text-neutral-600">{t('journaling.gratitude.description')}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/gratitude-journal.pdf" download>
                      {t('journaling.gratitude.button')}
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{t('journaling.thoughtRecord.title')}</h3>
                    <p className="text-sm text-neutral-600">{t('journaling.thoughtRecord.description')}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/thought-record.pdf" download>
                      {t('journaling.thoughtRecord.button')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep">
            <Card>
              <CardHeader>
                <CardTitle>{t('sleep.title')}</CardTitle>
                <CardDescription>{t('sleep.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-neutral-600">
                  <li>✓ {t('sleep.tips.tip1')}</li>
                  <li>✓ {t('sleep.tips.tip2')}</li>
                  <li>✓ {t('sleep.tips.tip3')}</li>
                  <li>✓ {t('sleep.tips.tip4')}</li>
                  <li>✓ {t('sleep.tips.tip5')}</li>
                  <li>✓ {t('sleep.tips.tip6')}</li>
                  <li>✓ {t('sleep.tips.tip7')}</li>
                  <li>✓ {t('sleep.tips.tip8')}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
