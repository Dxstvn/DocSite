import type { Metadata } from 'next'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
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
    title: 'Anxiety Disorders: GAD, Panic, Social Anxiety | Treatment Options',
    description: 'Learn about generalized anxiety disorder, panic disorder, and social anxiety. Evidence-based treatments including therapy, medication, and coping strategies.',
    keywords: ['anxiety treatment', 'GAD', 'panic disorder', 'social anxiety', 'anxiety medication', 'anxiety therapy', 'generalized anxiety disorder', 'exposure therapy'],
    openGraph: {
      title: 'Anxiety Disorders: GAD, Panic, Social Anxiety | Treatment Options',
      description: 'Learn about generalized anxiety disorder, panic disorder, and social anxiety. Evidence-based treatments including therapy and medication.',
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education/anxiety`,
      type: 'article',
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
      title: 'Anxiety Disorders: GAD, Panic, Social Anxiety',
      description: 'Evidence-based treatments for generalized anxiety disorder, panic disorder, and social anxiety.'
    }
  }
}

export default async function AnxietyPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  const symptoms = t('education:pages.anxiety.symptoms.list', { returnObjects: true }) as string[]
  const lifestyleList = t('education:pages.anxiety.treatment.lifestyle.list', { returnObjects: true }) as string[]
  const considerations = t('education:pages.anxiety.medicationDetails.considerations', { returnObjects: true }) as string[]
  const sideEffects = t('education:pages.anxiety.medicationDetails.sideEffects', { returnObjects: true }) as string[]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('education:pages.anxiety.pageTitle')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('education:common.clinicalInfoTitle')}</AlertTitle>
          <AlertDescription>
            {t('education:pages.anxiety.clinicalDisclaimer')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>{t('education:pages.anxiety.whatIs.title')}</h2>
          <p>{t('education:pages.anxiety.whatIs.p1')}</p>
          <p>{t('education:pages.anxiety.whatIs.p2')}</p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>{t('education:common.symptomsTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.anxiety.symptoms.intro')}</p>
                <ul>
                  {symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
                <p>{t('education:pages.anxiety.symptoms.conclusion')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types">
            <AccordionTrigger>{t('education:pages.anxiety.types.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.anxiety.types.gad.title')}</h3>
                <p>{t('education:pages.anxiety.types.gad.description')}</p>

                <h3>{t('education:pages.anxiety.types.panic.title')}</h3>
                <p>{t('education:pages.anxiety.types.panic.description')}</p>

                <h3>{t('education:pages.anxiety.types.social.title')}</h3>
                <p>{t('education:pages.anxiety.types.social.description')}</p>

                <h3>{t('education:pages.anxiety.types.phobias.title')}</h3>
                <p>{t('education:pages.anxiety.types.phobias.description')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>{t('education:common.treatmentTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.anxiety.treatment.psychotherapy.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.anxiety.treatment.psychotherapy.cbt')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.psychotherapy.exposure')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.psychotherapy.act')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.psychotherapy.relaxation')}</strong></li>
                </ul>

                <h3>{t('education:pages.anxiety.treatment.medication.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.anxiety.treatment.medication.ssris')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.medication.snris')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.medication.buspirone')}</strong></li>
                  <li><strong>{t('education:pages.anxiety.treatment.medication.betaBlockers')}</strong></li>
                </ul>

                <h3>{t('education:pages.anxiety.treatment.lifestyle.title')}</h3>
                <ul>
                  {lifestyleList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>{t('education:pages.anxiety.medicationDetails.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.anxiety.medicationDetails.intro')}</p>

                <h3>{t('education:pages.anxiety.medicationDetails.considerationsTitle')}</h3>
                <ul>
                  {considerations.map((item, index) => (
                    <li key={index}><strong>{item}</strong></li>
                  ))}
                </ul>

                <h3>{t('education:pages.anxiety.medicationDetails.sideEffectsTitle')}</h3>
                <ul>
                  {sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>

                <p>{t('education:pages.anxiety.medicationDetails.conclusion')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>{t('education:common.resourcesTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.anxiety.resources.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://adaa.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.anxiety.resources.adaa')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.anxiety.resources.apa')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/gad-7">{t('education:pages.anxiety.cta.screening')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t('education:common.scheduleAppointment')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
