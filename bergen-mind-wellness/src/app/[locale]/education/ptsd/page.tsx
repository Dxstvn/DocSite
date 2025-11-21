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
    title: 'PTSD Treatment | Trauma Therapy & Evidence-Based Care',
    description: 'Understanding post-traumatic stress disorder: symptoms, triggers, and evidence-based treatments including trauma-focused therapy and medication options.',
    keywords: ['PTSD treatment', 'trauma therapy', 'post traumatic stress', 'PTSD symptoms', 'trauma counseling', 'CPT', 'PE therapy', 'EMDR', 'trauma-informed care'],
    openGraph: {
      title: 'PTSD Treatment | Trauma Therapy & Evidence-Based Care',
      description: 'Understanding post-traumatic stress disorder: symptoms, triggers, and evidence-based treatments including trauma-focused therapy.',
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/education/ptsd`,
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
      title: 'PTSD Treatment | Trauma Therapy',
      description: 'Understanding post-traumatic stress disorder: symptoms, triggers, and evidence-based treatments.'
    }
  }
}

export default async function PTSDPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['education'])

  const reexperiencing = t('education:pages.ptsd.symptoms.reexperiencing', { returnObjects: true }) as string[]
  const avoidance = t('education:pages.ptsd.symptoms.avoidance', { returnObjects: true }) as string[]
  const negativeChanges = t('education:pages.ptsd.symptoms.negativeChanges', { returnObjects: true }) as string[]
  const hyperarousal = t('education:pages.ptsd.symptoms.hyperarousal', { returnObjects: true }) as string[]
  const traumaTherapy = t('education:pages.ptsd.treatment.traumaTherapy.list', { returnObjects: true }) as string[]
  const medication = t('education:pages.ptsd.treatment.medication.list', { returnObjects: true }) as string[]
  const complementary = t('education:pages.ptsd.treatment.complementary.list', { returnObjects: true }) as string[]
  const safetyFirst = t('education:pages.ptsd.traumaInformedCare.safetyFirst', { returnObjects: true }) as string[]
  const clientControl = t('education:pages.ptsd.traumaInformedCare.clientControl', { returnObjects: true }) as string[]
  const stabilization = t('education:pages.ptsd.traumaInformedCare.stabilization', { returnObjects: true }) as string[]
  const avoidMedications = t('education:pages.ptsd.medicationDetails.avoidList', { returnObjects: true }) as string[]
  const considerations = t('education:pages.ptsd.medicationDetails.considerations', { returnObjects: true }) as string[]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('education:pages.ptsd.pageTitle')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('education:common.clinicalInfoTitle')}</AlertTitle>
          <AlertDescription>
            {t('education:pages.ptsd.clinicalDisclaimer')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>{t('education:pages.ptsd.whatIs.title')}</h2>
          <p>{t('education:pages.ptsd.whatIs.p1')}</p>
          <p>{t('education:pages.ptsd.whatIs.p2')}</p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>{t('education:common.symptomsTitle')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.ptsd.symptoms.intro')}</p>

                <h3>{t('education:pages.ptsd.symptoms.reexperiencingTitle')}</h3>
                <ul>
                  {reexperiencing.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.symptoms.avoidanceTitle')}</h3>
                <ul>
                  {avoidance.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.symptoms.negativeChangesTitle')}</h3>
                <ul>
                  {negativeChanges.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.symptoms.hyperarousalTitle')}</h3>
                <ul>
                  {hyperarousal.map((symptom, index) => (
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
                <h3>{t('education:pages.ptsd.treatment.traumaTherapy.title')}</h3>
                <ul>
                  {traumaTherapy.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.treatment.medication.title')}</h3>
                <ul>
                  {medication.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.treatment.complementary.title')}</h3>
                <ul>
                  {complementary.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trauma-informed-care">
            <AccordionTrigger>{t('education:pages.ptsd.traumaInformedCare.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>{t('education:pages.ptsd.traumaInformedCare.intro')}</p>

                <h3>{t('education:pages.ptsd.traumaInformedCare.safetyFirstTitle')}</h3>
                <ul>
                  {safetyFirst.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.traumaInformedCare.clientControlTitle')}</h3>
                <ul>
                  {clientControl.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.traumaInformedCare.stabilizationTitle')}</h3>
                <ul>
                  {stabilization.map((item, index) => (
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
                <h3>{t('education:pages.ptsd.medicationDetails.ssrisTitle')}</h3>
                <p>{t('education:pages.ptsd.medicationDetails.ssrisIntro')}</p>

                <h3>{t('education:pages.ptsd.medicationDetails.prazosinTitle')}</h3>
                <p>{t('education:pages.ptsd.medicationDetails.prazosinIntro')}</p>

                <h3>{t('education:pages.ptsd.medicationDetails.avoidTitle')}</h3>
                <ul>
                  {avoidMedications.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <h3>{t('education:pages.ptsd.medicationDetails.considerationsTitle')}</h3>
                <ul>
                  {considerations.map((item, index) => (
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
                    <a href="https://www.ptsd.va.gov/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.ptsd.resources.va')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.ptsd.resources.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://istss.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.ptsd.resources.istss')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.rainn.org/" target="_blank" rel="noopener noreferrer">
                      {t('education:pages.ptsd.resources.rainn')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/pcl-5">{t('education:pages.ptsd.cta.screening')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">{t('education:common.scheduleAppointment')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
