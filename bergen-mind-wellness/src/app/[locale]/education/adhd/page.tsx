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
    title: 'Adult ADHD: Symptoms, Diagnosis & Treatment | Bergen Mind & Wellness',
    description: 'Understanding ADHD in adults: inattention, hyperactivity, executive function. Medication management, behavioral strategies, and workplace accommodations.',
    keywords: ['adult ADHD', 'ADHD treatment', 'ADHD medication', 'attention deficit disorder', 'executive function', 'ADHD diagnosis', 'stimulant medication', 'ADHD therapy'],
    openGraph: {
      title: 'Adult ADHD: Symptoms, Diagnosis & Treatment',
      description: 'Understanding ADHD in adults: inattention, hyperactivity, executive function. Medication management and behavioral strategies.',
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education/adhd`,
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
      title: 'Adult ADHD: Symptoms, Diagnosis & Treatment',
      description: 'Understanding ADHD in adults: inattention, hyperactivity, executive function, and treatment options.'
    }
  }
}

export default async function ADHDPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  const inattention = t('education:pages.adhd.symptoms.inattention', { returnObjects: true }) as string[]
  const hyperactivity = t('education:pages.adhd.symptoms.hyperactivity', { returnObjects: true }) as string[]
  const lifestyleList = t('education:pages.adhd.treatment.lifestyle.list', { returnObjects: true }) as string[]
  const sideEffects = t('education:pages.adhd.medicationDetails.sideEffects', { returnObjects: true }) as string[]
  const considerations = t('education:pages.adhd.medicationDetails.considerations', { returnObjects: true }) as string[]
  const workplace = t('education:pages.adhd.livingWith.workplace', { returnObjects: true }) as string[]
  const timeManagement = t('education:pages.adhd.livingWith.timeManagement', { returnObjects: true }) as string[]
  const support = t('education:pages.adhd.livingWith.support', { returnObjects: true }) as string[]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('education:pages.adhd.pageTitle')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('education:common.clinicalInfoTitle')}</AlertTitle>
          <AlertDescription>
            {t('education:pages.adhd.clinicalDisclaimer')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>{t('education:pages.adhd.whatIs.title')}</h2>
          <p>{t('education:pages.adhd.whatIs.p1')}</p>
          <p>{t('education:pages.adhd.whatIs.p2')}</p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>{t('education:common.symptomsTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.adhd.symptoms.inattentionTitle')}</h3>
                <ul>
                  {inattention.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.adhd.symptoms.hyperactivityTitle')}</h3>
                <ul>
                  {hyperactivity.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <p>{t('education:pages.adhd.symptoms.conclusion')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>{t('education:common.treatmentTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.adhd.treatment.medication.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.adhd.treatment.medication.stimulants')}</strong></li>
                  <li><strong>{t('education:pages.adhd.treatment.medication.nonStimulants')}</strong></li>
                </ul>

                <h3>{t('education:pages.adhd.treatment.behavioral.title')}</h3>
                <ul>
                  <li><strong>{t('education:pages.adhd.treatment.behavioral.skills')}</strong></li>
                  <li><strong>{t('education:pages.adhd.treatment.behavioral.cbt')}</strong></li>
                  <li><strong>{t('education:pages.adhd.treatment.behavioral.coaching')}</strong></li>
                  <li><strong>{t('education:pages.adhd.treatment.behavioral.routines')}</strong></li>
                </ul>

                <h3>{t('education:pages.adhd.treatment.lifestyle.title')}</h3>
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
                <h3>{t('education:pages.adhd.medicationDetails.stimulantsTitle')}</h3>
                <p>{t('education:pages.adhd.medicationDetails.stimulantsIntro')}</p>

                <h3>{t('education:pages.adhd.medicationDetails.sideEffectsTitle')}</h3>
                <ul>
                  {sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.adhd.medicationDetails.nonStimulantsTitle')}</h3>
                <p>{t('education:pages.adhd.medicationDetails.nonStimulantsIntro')}</p>

                <h3>{t('education:pages.adhd.medicationDetails.considerationsTitle')}</h3>
                <ul>
                  {considerations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="living-with-adhd">
            <AccordionTrigger>{t('education:pages.adhd.livingWith.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('education:pages.adhd.livingWith.workplaceTitle')}</h3>
                <ul>
                  {workplace.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.adhd.livingWith.timeManagementTitle')}</h3>
                <ul>
                  {timeManagement.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.adhd.livingWith.supportTitle')}</h3>
                <ul>
                  {support.map((item, index) => (
                    <li key={index}>{item}</li>
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
                    <a href="https://chadd.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.adhd.resources.chadd')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.adhd.resources.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://add.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.adhd.resources.adda')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/asrs">{t('education:pages.adhd.cta.screening')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t('education:common.scheduleAppointment')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
