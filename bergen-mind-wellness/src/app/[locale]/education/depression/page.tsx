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
    title: 'Depression Treatment & Information | Symptoms, Causes & Recovery',
    description: 'Understanding major depressive disorder: symptoms, causes, medication options (SSRIs, SNRIs), therapy approaches (CBT, IPT), and lifestyle strategies for recovery.',
    keywords: ['depression treatment', 'major depressive disorder', 'antidepressants', 'depression symptoms', 'CBT depression', 'SSRIs', 'SNRIs', 'depression therapy'],
    openGraph: {
      title: 'Depression Treatment & Information | Symptoms, Causes & Recovery',
      description: 'Understanding major depressive disorder: symptoms, causes, medication options, therapy approaches, and lifestyle strategies for recovery.',
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education/depression`,
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
      title: 'Depression Treatment & Information',
      description: 'Understanding major depressive disorder: symptoms, causes, and evidence-based treatments.'
    }
  }
}

export default async function DepressionPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  const symptoms = t('education:pages.depression.symptoms.list', { returnObjects: true }) as string[]
  const lifestyleList = t('education:pages.depression.treatment.lifestyle.list', { returnObjects: true }) as string[]
  const sideEffects = t('education:pages.depression.medicationDetails.sideEffects', { returnObjects: true }) as string[]
  const importantNotes = t('education:pages.depression.medicationDetails.importantNotes', { returnObjects: true }) as string[]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('education:pages.depression.pageTitle')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('education:common.clinicalInfoTitle')}</AlertTitle>
          <AlertDescription>
            {t('education:pages.depression.clinicalDisclaimer')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>{t('education:pages.depression.whatIs.title')}</h2>
          <p>{t('education:pages.depression.whatIs.p1')}</p>
          <p>{t('education:pages.depression.whatIs.p2')}</p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>{t('education:common.symptomsTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.depression.symptoms.intro')}</p>
                <ul>
                  {symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
                <p>{t('education:pages.depression.symptoms.conclusion')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>{t('education:common.treatmentTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.depression.treatment.psychotherapy.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.depression.treatment.psychotherapy.cbt')}</strong></li>
                  <li><strong>{t('education:pages.depression.treatment.psychotherapy.ipt')}</strong></li>
                  <li><strong>{t('education:pages.depression.treatment.psychotherapy.ba')}</strong></li>
                </ul>

                <h3>{t('education:pages.depression.treatment.medication.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.depression.treatment.medication.ssris')}</strong></li>
                  <li><strong>{t('education:pages.depression.treatment.medication.snris')}</strong></li>
                  <li><strong>{t('education:pages.depression.treatment.medication.atypical')}</strong></li>
                </ul>

                <h3>{t('education:pages.depression.treatment.lifestyle.title')}</h3>
                <ul>
                  {lifestyleList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>{t('education:pages.depression.medicationDetails.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.depression.medicationDetails.intro')}</p>

                <h3>{t('education:pages.depression.medicationDetails.sideEffectsTitle')}</h3>
                <ul>
                  {sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.depression.medicationDetails.importantNotesTitle')}</h3>
                <ul>
                  {importantNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>{t('education:common.resourcesTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.depression.resources.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.apa.org/topics/depression" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.depression.resources.apa')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.depression.resources.nami')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/phq-9">{t('education:pages.depression.cta.screening')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t('education:common.scheduleAppointment')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
