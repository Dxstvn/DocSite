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
    title: 'Bipolar Disorder Treatment | Mood Stabilizers & Therapy',
    description: 'Understanding bipolar disorder, mood cycling, mania and depression. Medication management with mood stabilizers, therapy approaches, and lifestyle strategies.',
    keywords: ['bipolar disorder', 'mood stabilizers', 'bipolar treatment', 'mania', 'mood cycling', 'bipolar medication', 'lithium', 'bipolar therapy'],
    openGraph: {
      title: 'Bipolar Disorder Treatment | Mood Stabilizers & Therapy',
      description: 'Understanding bipolar disorder, mood cycling, mania and depression. Medication management with mood stabilizers and therapy approaches.',
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education/bipolar`,
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
      title: 'Bipolar Disorder Treatment',
      description: 'Understanding bipolar disorder, mood cycling, mania and depression. Medication and therapy approaches.'
    }
  }
}

export default async function BipolarPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  const manicSymptoms = t('education:pages.bipolar.symptoms.mania', { returnObjects: true }) as string[]
  const depressiveSymptoms = t('education:pages.bipolar.symptoms.depression', { returnObjects: true }) as string[]
  const medicationList = t('education:pages.bipolar.treatment.medication.list', { returnObjects: true }) as string[]
  const psychotherapyList = t('education:pages.bipolar.treatment.psychotherapy.list', { returnObjects: true }) as string[]
  const lifestyleList = t('education:pages.bipolar.treatment.lifestyle.list', { returnObjects: true }) as string[]
  const considerations = t('education:pages.bipolar.medicationDetails.considerations', { returnObjects: true }) as string[]
  const maniaWarnings = t('education:pages.bipolar.crisisManagement.maniaWarnings', { returnObjects: true }) as string[]
  const depressionWarnings = t('education:pages.bipolar.crisisManagement.depressionWarnings', { returnObjects: true }) as string[]
  const emergencySigns = t('education:pages.bipolar.crisisManagement.emergencySigns', { returnObjects: true }) as string[]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('education:pages.bipolar.pageTitle')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('education:common.clinicalInfoTitle')}</AlertTitle>
          <AlertDescription>
            {t('education:pages.bipolar.clinicalDisclaimer')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>{t('education:pages.bipolar.whatIs.title')}</h2>
          <p>{t('education:pages.bipolar.whatIs.p1')}</p>
          <p dangerouslySetInnerHTML={{ __html: t('education:pages.bipolar.whatIs.p2') }} />
          <p>{t('education:pages.bipolar.whatIs.p3')}</p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>{t('education:common.symptomsTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.bipolar.symptoms.maniaTitle')}</h3>
                <ul>
                  {manicSymptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.bipolar.symptoms.hypomaniaTitle')}</h3>
                <p>{t('education:pages.bipolar.symptoms.hypomaniaDescription')}</p>

                <h3>{t('education:pages.bipolar.symptoms.depressionTitle')}</h3>
                <ul>
                  {depressiveSymptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>{t('education:common.treatmentTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.bipolar.treatment.medication.title')}</h3>
                <ul>
                  {medicationList.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <h3>{t('education:pages.bipolar.treatment.psychotherapy.title')}</h3>
                <ul>
                  {psychotherapyList.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <h3>{t('education:pages.bipolar.treatment.lifestyle.title')}</h3>
                <ul>
                  {lifestyleList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>{t('education:common.medicationTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.bipolar.medicationDetails.moodStabilizersTitle')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('education:pages.bipolar.medicationDetails.lithium') }} />
                <p dangerouslySetInnerHTML={{ __html: t('education:pages.bipolar.medicationDetails.lamotrigine') }} />

                <h3>{t('education:pages.bipolar.medicationDetails.atypicalTitle')}</h3>
                <p>{t('education:pages.bipolar.medicationDetails.atypicalIntro')}</p>

                <h3>{t('education:pages.bipolar.medicationDetails.considerationsTitle')}</h3>
                <ul>
                  {considerations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crisis-management">
            <AccordionTrigger>{t('education:pages.bipolar.crisisManagement.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.bipolar.crisisManagement.maniaWarningTitle')}</h3>
                <ul>
                  {maniaWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.bipolar.crisisManagement.depressionWarningTitle')}</h3>
                <ul>
                  {depressionWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.bipolar.crisisManagement.emergencyTitle')}</h3>
                <ul>
                  {emergencySigns.map((sign, index) => (
                    <li key={index}>{sign}</li>
                  ))}
                </ul>

                <p>{t('education:pages.bipolar.crisisManagement.conclusion')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>{t('education:common.resourcesTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.dbsalliance.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.bipolar.resources.dbsa')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/bipolar-disorder" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.bipolar.resources.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Bipolar-Disorder" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.bipolar.resources.nami')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/mdq">{t('education:pages.bipolar.cta.screening')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t('education:common.scheduleAppointment')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
