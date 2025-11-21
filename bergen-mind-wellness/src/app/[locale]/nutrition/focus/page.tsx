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
  title: 'Nutrition for Focus & ADHD | Brain-Boosting Foods for Concentration',
  description: 'Foods that improve focus and concentration. Learn about nutrients for ADHD, brain-healthy meals, protein-rich breakfasts, and cognitive performance.',
  keywords: ['nutrition for focus', 'ADHD diet', 'brain food', 'foods for concentration', 'cognitive function', 'omega-3 for ADHD', 'protein for focus', 'brain health'],
  openGraph: {
    title: 'Nutrition for Focus & ADHD | Brain-Boosting Foods',
    description: 'Foods that improve focus and concentration. Nutrients for ADHD, brain-healthy meals, and cognitive performance.',
    url: `${baseUrl}${locale === 'es' ? '/es' : ''}/nutrition/focus`,
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
    title: 'Nutrition for Focus & ADHD',
    description: 'Foods that improve focus and concentration. Brain-healthy meals for cognitive performance.'
  }
  }
}

export default async function FocusNutritionPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['nutrition'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('focus.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('common.disclaimer.title')}</AlertTitle>
          <AlertDescription>
            {t('common.disclaimer.text')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            {t('focus.intro.p1')}
          </p>
          <p>
            {t('focus.intro.p2')}
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="foods">
            <AccordionTrigger>{t('focus.sections.foods.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('focus.sections.foods.fattyFish.title')}</h3>
                <p>{t('focus.sections.foods.fattyFish.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.fattyFish.serving')}</p>

                <h3>{t('focus.sections.foods.eggs.title')}</h3>
                <p>{t('focus.sections.foods.eggs.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.eggs.serving')}</p>

                <h3>{t('focus.sections.foods.blueberries.title')}</h3>
                <p>{t('focus.sections.foods.blueberries.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.blueberries.serving')}</p>

                <h3>{t('focus.sections.foods.nuts.title')}</h3>
                <p>{t('focus.sections.foods.nuts.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.nuts.serving')}</p>

                <h3>{t('focus.sections.foods.greenTea.title')}</h3>
                <p>{t('focus.sections.foods.greenTea.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.greenTea.serving')}</p>

                <h3>{t('focus.sections.foods.beets.title')}</h3>
                <p>{t('focus.sections.foods.beets.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.beets.serving')}</p>

                <h3>{t('focus.sections.foods.darkChocolate.title')}</h3>
                <p>{t('focus.sections.foods.darkChocolate.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.darkChocolate.serving')}</p>

                <h3>{t('focus.sections.foods.wholeGrains.title')}</h3>
                <p>{t('focus.sections.foods.wholeGrains.description')}</p>
                <p className="text-sm text-neutral-600">{t('focus.sections.foods.wholeGrains.serving')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nutrients">
            <AccordionTrigger>{t('focus.sections.nutrients.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('focus.sections.nutrients.omega3.title')}</h3>
                <p>{t('focus.sections.nutrients.omega3.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.omega3.sources')}
                </p>

                <h3>{t('focus.sections.nutrients.bVitamins.title')}</h3>
                <p>{t('focus.sections.nutrients.bVitamins.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.bVitamins.sources')}
                </p>

                <h3>{t('focus.sections.nutrients.iron.title')}</h3>
                <p>{t('focus.sections.nutrients.iron.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.iron.sources')}
                </p>

                <h3>{t('focus.sections.nutrients.zinc.title')}</h3>
                <p>{t('focus.sections.nutrients.zinc.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.zinc.sources')}
                </p>

                <h3>{t('focus.sections.nutrients.protein.title')}</h3>
                <p>{t('focus.sections.nutrients.protein.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.protein.sources')}
                </p>

                <h3>{t('focus.sections.nutrients.choline.title')}</h3>
                <p>{t('focus.sections.nutrients.choline.description')}</p>
                <p className="text-sm text-neutral-600">
                  <strong>{t('common.sources')}</strong> {t('focus.sections.nutrients.choline.sources')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limit">
            <AccordionTrigger>{t('focus.sections.limit.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('focus.sections.limit.sugar.title')}</h3>
                <p>{t('focus.sections.limit.sugar.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('focus.sections.limit.sugar.advice')}
                </p>

                <h3>{t('focus.sections.limit.additives.title')}</h3>
                <p>{t('focus.sections.limit.additives.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('focus.sections.limit.additives.advice')}
                </p>

                <h3>{t('focus.sections.limit.caffeine.title')}</h3>
                <p>{t('focus.sections.limit.caffeine.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('focus.sections.limit.caffeine.advice')}
                </p>

                <h3>{t('focus.sections.limit.skippingMeals.title')}</h3>
                <p>{t('focus.sections.limit.skippingMeals.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('focus.sections.limit.skippingMeals.advice')}
                </p>

                <h3>{t('focus.sections.limit.allergens.title')}</h3>
                <p>{t('focus.sections.limit.allergens.description')}</p>
                <p className="text-sm text-neutral-600">
                  {t('focus.sections.limit.allergens.advice')}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>{t('focus.sections.research.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://chadd.org/about-adhd/diet-and-nutrition/" target="_blank" rel="noopener noreferrer">
                      {t('focus.sections.research.chaddLink')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noopener noreferrer">
                      {t('focus.sections.research.nimhLink')}
                    </a>
                  </li>
                  <li>
                    <strong>{t('focus.sections.research.keyFindings')}</strong>
                    <ul>
                      <li>{t('focus.sections.research.studies.omega3')}</li>
                      <li>{t('focus.sections.research.studies.protein')}</li>
                      <li>{t('focus.sections.research.studies.minerals')}</li>
                      <li>{t('focus.sections.research.studies.mediterranean')}</li>
                      <li>{t('focus.sections.research.studies.elimination')}</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals">
            <AccordionTrigger>{t('focus.sections.meals.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('focus.sections.meals.breakfast.title')}</h3>
                <ul>
                  <li>{t('focus.sections.meals.breakfast.items.item1')}</li>
                  <li>{t('focus.sections.meals.breakfast.items.item2')}</li>
                  <li>{t('focus.sections.meals.breakfast.items.item3')}</li>
                  <li>{t('focus.sections.meals.breakfast.items.item4')}</li>
                </ul>

                <h3>{t('focus.sections.meals.lunch.title')}</h3>
                <ul>
                  <li>{t('focus.sections.meals.lunch.items.item1')}</li>
                  <li>{t('focus.sections.meals.lunch.items.item2')}</li>
                  <li>{t('focus.sections.meals.lunch.items.item3')}</li>
                  <li>{t('focus.sections.meals.lunch.items.item4')}</li>
                </ul>

                <h3>{t('focus.sections.meals.dinner.title')}</h3>
                <ul>
                  <li>{t('focus.sections.meals.dinner.items.item1')}</li>
                  <li>{t('focus.sections.meals.dinner.items.item2')}</li>
                  <li>{t('focus.sections.meals.dinner.items.item3')}</li>
                  <li>{t('focus.sections.meals.dinner.items.item4')}</li>
                </ul>

                <h3>{t('focus.sections.meals.snacks.title')}</h3>
                <ul>
                  <li>{t('focus.sections.meals.snacks.items.item1')}</li>
                  <li>{t('focus.sections.meals.snacks.items.item2')}</li>
                  <li>{t('focus.sections.meals.snacks.items.item3')}</li>
                  <li>{t('focus.sections.meals.snacks.items.item4')}</li>
                  <li>{t('focus.sections.meals.snacks.items.item5')}</li>
                </ul>

                <h3>{t('focus.sections.meals.beverages.title')}</h3>
                <ul>
                  <li>{t('focus.sections.meals.beverages.items.item1')}</li>
                  <li>{t('focus.sections.meals.beverages.items.item2')}</li>
                  <li>{t('focus.sections.meals.beverages.items.item3')}</li>
                  <li>{t('focus.sections.meals.beverages.items.item4')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>{t('focus.scheduleButton')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/education/adhd`}>{t('focus.learnMoreButton')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
