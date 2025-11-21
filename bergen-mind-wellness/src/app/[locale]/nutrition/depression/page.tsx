import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'


type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
  title: 'Nutrition for Depression | Brain-Healthy Foods & Meal Plans',
  description: 'Evidence-based nutrition strategies for depression. Learn which foods support mood, omega-3 benefits, gut-brain connection, and practical meal plans for mental health.',
  keywords: ['nutrition for depression', 'foods for depression', 'omega-3 depression', 'gut-brain axis', 'depression diet', 'brain food', 'mood-boosting foods', 'mental health nutrition'],
  openGraph: {
    title: 'Nutrition for Depression | Brain-Healthy Foods & Meal Plans',
    description: 'Evidence-based nutrition strategies for depression. Foods that support mood, omega-3 benefits, and practical meal plans.',
    url: `${baseUrl}${locale === 'es' ? '/es' : ''}/nutrition/depression`,
    type: 'article',
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
    title: 'Nutrition for Depression',
    description: 'Evidence-based nutrition strategies for depression. Brain-healthy foods and meal plans to support mental health.'
  }
  }
}

export default async function DepressionNutritionPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['nutrition'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('depression.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('common.disclaimer.title')}</AlertTitle>
          <AlertDescription>
            {t('common.disclaimer.text')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            {t('depression.intro.p1')}
          </p>
          <p>
            {t('depression.intro.p2')}
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>{t('depression.sections.foods.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('depression.sections.foods.fattyFish.title')}</h3>
                <p>{t('depression.sections.foods.fattyFish.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.fattyFish.serving')}</p>

                <h3>{t('depression.sections.foods.leafyGreens.title')}</h3>
                <p>{t('depression.sections.foods.leafyGreens.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.leafyGreens.serving')}</p>

                <h3>{t('depression.sections.foods.nutsSeeds.title')}</h3>
                <p>{t('depression.sections.foods.nutsSeeds.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.nutsSeeds.serving')}</p>

                <h3>{t('depression.sections.foods.berries.title')}</h3>
                <p>{t('depression.sections.foods.berries.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.berries.serving')}</p>

                <h3>{t('depression.sections.foods.wholeGrains.title')}</h3>
                <p>{t('depression.sections.foods.wholeGrains.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.wholeGrains.serving')}</p>

                <h3>{t('depression.sections.foods.fermented.title')}</h3>
                <p>{t('depression.sections.foods.fermented.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.fermented.serving')}</p>

                <h3>{t('depression.sections.foods.darkChocolate.title')}</h3>
                <p>{t('depression.sections.foods.darkChocolate.description')}</p>
                <p className="text-sm text-neutral-600">{t('depression.sections.foods.darkChocolate.serving')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>{t('depression.sections.nutrients.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('depression.sections.nutrients.omega3.title')}</h3>
                <p>{t('depression.sections.nutrients.omega3.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.omega3.sources')}
                </p>

                <h3>{t('depression.sections.nutrients.bVitamins.title')}</h3>
                <p>{t('depression.sections.nutrients.bVitamins.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.bVitamins.sources')}
                </p>

                <h3>{t('depression.sections.nutrients.vitaminD.title')}</h3>
                <p>{t('depression.sections.nutrients.vitaminD.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.vitaminD.sources')}
                </p>

                <h3>{t('depression.sections.nutrients.magnesium.title')}</h3>
                <p>{t('depression.sections.nutrients.magnesium.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.magnesium.sources')}
                </p>

                <h3>{t('depression.sections.nutrients.zinc.title')}</h3>
                <p>{t('depression.sections.nutrients.zinc.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.zinc.sources')}
                </p>

                <h3>{t('depression.sections.nutrients.tryptophan.title')}</h3>
                <p>{t('depression.sections.nutrients.tryptophan.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('depression.sections.nutrients.tryptophan.sources')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>{t('depression.sections.limit.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('depression.sections.limit.processedFoods.title')}</h3>
                <p>{t('depression.sections.limit.processedFoods.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('depression.sections.limit.processedFoods.advice')}
                </p>

                <h3>{t('depression.sections.limit.caffeine.title')}</h3>
                <p>{t('depression.sections.limit.caffeine.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('depression.sections.limit.caffeine.advice')}
                </p>

                <h3>{t('depression.sections.limit.alcohol.title')}</h3>
                <p>{t('depression.sections.limit.alcohol.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('depression.sections.limit.alcohol.advice')}
                </p>

                <h3>{t('depression.sections.limit.transFats.title')}</h3>
                <p>{t('depression.sections.limit.transFats.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('depression.sections.limit.transFats.advice')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>{t('depression.sections.research.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                      {t('depression.sections.research.nimhLink')}
                    </a>
                  </li>
                  <li>
                    <a href="https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/" target="_blank" rel="noopener noreferrer">
                      {t('depression.sections.research.harvardLink')}
                    </a>
                  </li>
                  <li>
                    <strong>{t('depression.sections.research.keyStudies')}</strong>
                    <ul>
                      <li>{t('depression.sections.research.studies.mediterranean')}</li>
                      <li>{t('depression.sections.research.studies.omega3')}</li>
                      <li>{t('depression.sections.research.studies.gutBrain')}</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals">
            <AccordionTrigger>{t('depression.sections.meals.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('depression.sections.meals.breakfast.title')}</h3>
                <ul>
                  <li>{t('depression.sections.meals.breakfast.items.item1')}</li>
                  <li>{t('depression.sections.meals.breakfast.items.item2')}</li>
                  <li>{t('depression.sections.meals.breakfast.items.item3')}</li>
                  <li>{t('depression.sections.meals.breakfast.items.item4')}</li>
                </ul>

                <h3>{t('depression.sections.meals.lunch.title')}</h3>
                <ul>
                  <li>{t('depression.sections.meals.lunch.items.item1')}</li>
                  <li>{t('depression.sections.meals.lunch.items.item2')}</li>
                  <li>{t('depression.sections.meals.lunch.items.item3')}</li>
                  <li>{t('depression.sections.meals.lunch.items.item4')}</li>
                </ul>

                <h3>{t('depression.sections.meals.dinner.title')}</h3>
                <ul>
                  <li>{t('depression.sections.meals.dinner.items.item1')}</li>
                  <li>{t('depression.sections.meals.dinner.items.item2')}</li>
                  <li>{t('depression.sections.meals.dinner.items.item3')}</li>
                  <li>{t('depression.sections.meals.dinner.items.item4')}</li>
                </ul>

                <h3>{t('depression.sections.meals.snacks.title')}</h3>
                <ul>
                  <li>{t('depression.sections.meals.snacks.items.item1')}</li>
                  <li>{t('depression.sections.meals.snacks.items.item2')}</li>
                  <li>{t('depression.sections.meals.snacks.items.item3')}</li>
                  <li>{t('depression.sections.meals.snacks.items.item4')}</li>
                  <li>{t('depression.sections.meals.snacks.items.item5')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>{t('depression.scheduleButton')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/education/depression`}>{t('depression.learnMoreButton')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
