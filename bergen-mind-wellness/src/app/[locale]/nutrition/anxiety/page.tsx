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
  title: 'Nutrition for Anxiety | Calming Foods & Anti-Anxiety Diet',
  description: 'Foods that reduce anxiety naturally. Learn about magnesium-rich foods, calming nutrients, gut-brain connection, and meal plans to manage anxiety symptoms.',
  keywords: ['nutrition for anxiety', 'anti-anxiety foods', 'magnesium for anxiety', 'calming foods', 'anxiety diet', 'foods that reduce stress', 'gut-brain axis anxiety'],
  openGraph: {
    title: 'Nutrition for Anxiety | Calming Foods & Anti-Anxiety Diet',
    description: 'Foods that reduce anxiety naturally. Magnesium-rich foods, calming nutrients, and meal plans to manage anxiety symptoms.',
    url: `${baseUrl}${locale === 'es' ? '/es' : ''}/nutrition/anxiety`,
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
    title: 'Nutrition for Anxiety',
    description: 'Foods that reduce anxiety naturally. Calming nutrients and meal plans to manage anxiety symptoms.'
  }
  }
}

export default async function AnxietyNutritionPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['nutrition'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('anxiety.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('common.disclaimer.title')}</AlertTitle>
          <AlertDescription>
            {t('common.disclaimer.text')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            {t('anxiety.intro.p1')}
          </p>
          <p>
            {t('anxiety.intro.p2')}
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>{t('anxiety.sections.foods.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('anxiety.sections.foods.fattyFish.title')}</h3>
                <p>{t('anxiety.sections.foods.fattyFish.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.fattyFish.serving')}</p>

                <h3>{t('anxiety.sections.foods.leafyGreens.title')}</h3>
                <p>{t('anxiety.sections.foods.leafyGreens.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.leafyGreens.serving')}</p>

                <h3>{t('anxiety.sections.foods.chamomile.title')}</h3>
                <p>{t('anxiety.sections.foods.chamomile.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.chamomile.serving')}</p>

                <h3>{t('anxiety.sections.foods.almonds.title')}</h3>
                <p>{t('anxiety.sections.foods.almonds.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.almonds.serving')}</p>

                <h3>{t('anxiety.sections.foods.avocados.title')}</h3>
                <p>{t('anxiety.sections.foods.avocados.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.avocados.serving')}</p>

                <h3>{t('anxiety.sections.foods.turkey.title')}</h3>
                <p>{t('anxiety.sections.foods.turkey.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.turkey.serving')}</p>

                <h3>{t('anxiety.sections.foods.bananas.title')}</h3>
                <p>{t('anxiety.sections.foods.bananas.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.bananas.serving')}</p>

                <h3>{t('anxiety.sections.foods.complexCarbs.title')}</h3>
                <p>{t('anxiety.sections.foods.complexCarbs.description')}</p>
                <p className="text-sm text-neutral-600">{t('anxiety.sections.foods.complexCarbs.serving')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>{t('anxiety.sections.nutrients.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('anxiety.sections.nutrients.magnesium.title')}</h3>
                <p>{t('anxiety.sections.nutrients.magnesium.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.magnesium.sources')}
                </p>

                <h3>{t('anxiety.sections.nutrients.bVitamins.title')}</h3>
                <p>{t('anxiety.sections.nutrients.bVitamins.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.bVitamins.sources')}
                </p>

                <h3>{t('anxiety.sections.nutrients.omega3.title')}</h3>
                <p>{t('anxiety.sections.nutrients.omega3.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.omega3.sources')}
                </p>

                <h3>{t('anxiety.sections.nutrients.probiotics.title')}</h3>
                <p>{t('anxiety.sections.nutrients.probiotics.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.probiotics.sources')}
                </p>

                <h3>{t('anxiety.sections.nutrients.lTheanine.title')}</h3>
                <p>{t('anxiety.sections.nutrients.lTheanine.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.lTheanine.sources')}
                </p>

                <h3>{t('anxiety.sections.nutrients.antioxidants.title')}</h3>
                <p>{t('anxiety.sections.nutrients.antioxidants.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('anxiety.sections.nutrients.antioxidants.sources')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>{t('anxiety.sections.limit.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('anxiety.sections.limit.caffeine.title')}</h3>
                <p>{t('anxiety.sections.limit.caffeine.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('anxiety.sections.limit.caffeine.advice')}
                </p>

                <h3>{t('anxiety.sections.limit.alcohol.title')}</h3>
                <p>{t('anxiety.sections.limit.alcohol.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('anxiety.sections.limit.alcohol.advice')}
                </p>

                <h3>{t('anxiety.sections.limit.sugar.title')}</h3>
                <p>{t('anxiety.sections.limit.sugar.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('anxiety.sections.limit.sugar.advice')}
                </p>

                <h3>{t('anxiety.sections.limit.processed.title')}</h3>
                <p>{t('anxiety.sections.limit.processed.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('anxiety.sections.limit.processed.advice')}
                </p>

                <h3>{t('anxiety.sections.limit.sodium.title')}</h3>
                <p>{t('anxiety.sections.limit.sodium.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('anxiety.sections.limit.sodium.advice')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>{t('anxiety.sections.research.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://adaa.org/living-with-anxiety/managing-anxiety/exercise-stress-and-anxiety" target="_blank" rel="noopener noreferrer">
                      {t('anxiety.sections.research.adaaLink')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                      {t('anxiety.sections.research.nimhLink')}
                    </a>
                  </li>
                  <li>
                    <strong>{t('anxiety.sections.research.keyFindings')}</strong>
                    <ul>
                      <li>{t('anxiety.sections.research.studies.magnesium')}</li>
                      <li>{t('anxiety.sections.research.studies.omega3')}</li>
                      <li>{t('anxiety.sections.research.studies.probiotics')}</li>
                      <li>{t('anxiety.sections.research.studies.mediterranean')}</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals">
            <AccordionTrigger>{t('anxiety.sections.meals.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('anxiety.sections.meals.breakfast.title')}</h3>
                <ul>
                  <li>{t('anxiety.sections.meals.breakfast.items.item1')}</li>
                  <li>{t('anxiety.sections.meals.breakfast.items.item2')}</li>
                  <li>{t('anxiety.sections.meals.breakfast.items.item3')}</li>
                  <li>{t('anxiety.sections.meals.breakfast.items.item4')}</li>
                </ul>

                <h3>{t('anxiety.sections.meals.lunch.title')}</h3>
                <ul>
                  <li>{t('anxiety.sections.meals.lunch.items.item1')}</li>
                  <li>{t('anxiety.sections.meals.lunch.items.item2')}</li>
                  <li>{t('anxiety.sections.meals.lunch.items.item3')}</li>
                  <li>{t('anxiety.sections.meals.lunch.items.item4')}</li>
                </ul>

                <h3>{t('anxiety.sections.meals.dinner.title')}</h3>
                <ul>
                  <li>{t('anxiety.sections.meals.dinner.items.item1')}</li>
                  <li>{t('anxiety.sections.meals.dinner.items.item2')}</li>
                  <li>{t('anxiety.sections.meals.dinner.items.item3')}</li>
                  <li>{t('anxiety.sections.meals.dinner.items.item4')}</li>
                </ul>

                <h3>{t('anxiety.sections.meals.snacks.title')}</h3>
                <ul>
                  <li>{t('anxiety.sections.meals.snacks.items.item1')}</li>
                  <li>{t('anxiety.sections.meals.snacks.items.item2')}</li>
                  <li>{t('anxiety.sections.meals.snacks.items.item3')}</li>
                  <li>{t('anxiety.sections.meals.snacks.items.item4')}</li>
                  <li>{t('anxiety.sections.meals.snacks.items.item5')}</li>
                </ul>

                <h3>{t('anxiety.sections.meals.beverages.title')}</h3>
                <ul>
                  <li>{t('anxiety.sections.meals.beverages.items.item1')}</li>
                  <li>{t('anxiety.sections.meals.beverages.items.item2')}</li>
                  <li>{t('anxiety.sections.meals.beverages.items.item3')}</li>
                  <li>{t('anxiety.sections.meals.beverages.items.item4')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>{t('anxiety.scheduleButton')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/education/anxiety`}>{t('anxiety.learnMoreButton')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
