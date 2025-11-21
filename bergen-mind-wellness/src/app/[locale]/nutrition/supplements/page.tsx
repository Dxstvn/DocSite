import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, AlertTriangle } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'


type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
  title: 'Mental Health Supplements Guide | Evidence-Based Vitamins & Safety',
  description: 'Comprehensive guide to supplements for mental health: omega-3, vitamin D, magnesium, probiotics. Evidence levels, dosages, safety, and quality considerations.',
  keywords: ['mental health supplements', 'omega-3 for depression', 'vitamin D mental health', 'magnesium for anxiety', 'supplements for depression', 'evidence-based supplements', 'supplement safety'],
  openGraph: {
    title: 'Mental Health Supplements Guide | Evidence-Based & Safe',
    description: 'Comprehensive guide to supplements for mental health: omega-3, vitamin D, magnesium, probiotics. Evidence levels and safety info.',
    url: `${baseUrl}${locale === 'es' ? '/es' : ''}/nutrition/supplements`,
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
    title: 'Mental Health Supplements Guide',
    description: 'Evidence-based guide to supplements for mental health. Omega-3, vitamin D, magnesium, and safety info.'
  }
  }
}

export default async function SupplementsPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['nutrition'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">{t('supplements.title')}</h1>

        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('supplements.safetyAlert.title')}</AlertTitle>
          <AlertDescription>
            {t('supplements.safetyAlert.text')}
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <p className="text-lg">
            {t('supplements.intro.p1')}
          </p>
          <p>
            {t('supplements.intro.p2')}
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="omega3">
            <AccordionTrigger>{t('supplements.supplements.omega3.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.omega3.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.omega3.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.common.depression')}</strong> {t('supplements.supplements.omega3.benefits.depression')}</li>
                  <li><strong>{t('supplements.common.adhd')}</strong> {t('supplements.supplements.omega3.benefits.adhd')}</li>
                  <li><strong>{t('supplements.common.anxiety')}</strong> {t('supplements.supplements.omega3.benefits.anxiety')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.omega3.dosage.text')}</p>

                <h4>{t('supplements.qualityConsiderations')}</h4>
                <ul>
                  <li>{t('supplements.supplements.omega3.quality.items.item1')}</li>
                  <li>{t('supplements.supplements.omega3.quality.items.item2')}</li>
                  <li>{t('supplements.supplements.omega3.quality.items.item3')}</li>
                  <li>{t('supplements.supplements.omega3.quality.items.item4')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.omega3.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="vitamin-d">
            <AccordionTrigger>{t('supplements.supplements.vitaminD.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.vitaminD.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.vitaminD.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.common.depression')}</strong> {t('supplements.supplements.vitaminD.benefits.depression')}</li>
                  <li><strong>{t('supplements.common.sad')}</strong> {t('supplements.supplements.vitaminD.benefits.sad')}</li>
                  <li><strong>{t('supplements.common.cognition')}</strong> {t('supplements.supplements.vitaminD.benefits.cognition')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.vitaminD.dosage.text')} <strong>{t('supplements.supplements.vitaminD.dosage.detail')}</strong></p>

                <h4>{t('supplements.qualityConsiderations')}</h4>
                <ul>
                  <li>{t('supplements.supplements.vitaminD.quality.items.item1')}</li>
                  <li>{t('supplements.supplements.vitaminD.quality.items.item2')}</li>
                  <li>{t('supplements.supplements.vitaminD.quality.items.item3')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.vitaminD.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="b-complex">
            <AccordionTrigger>{t('supplements.supplements.bComplex.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.bComplex.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.bComplex.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.supplements.bComplex.benefits.b6b12folate.title')}</strong> {t('supplements.supplements.bComplex.benefits.b6b12folate.text')}</li>
                  <li><strong>{t('supplements.supplements.bComplex.benefits.b12deficiency.title')}</strong> {t('supplements.supplements.bComplex.benefits.b12deficiency.text')}</li>
                  <li><strong>{t('supplements.supplements.bComplex.benefits.folate.title')}</strong> {t('supplements.supplements.bComplex.benefits.folate.text')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.bComplex.dosage.text')}</p>

                <h4>{t('supplements.supplements.bComplex.whoBenefitsTitle')}</h4>
                <ul>
                  <li>{t('supplements.supplements.bComplex.whoBenefits.items.item1')}</li>
                  <li>{t('supplements.supplements.bComplex.whoBenefits.items.item2')}</li>
                  <li>{t('supplements.supplements.bComplex.whoBenefits.items.item3')}</li>
                  <li>{t('supplements.supplements.bComplex.whoBenefits.items.item4')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.bComplex.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="magnesium">
            <AccordionTrigger>{t('supplements.supplements.magnesium.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.magnesium.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.magnesium.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.common.anxiety')}</strong> {t('supplements.supplements.magnesium.benefits.anxiety')}</li>
                  <li><strong>{t('supplements.common.depression')}</strong> {t('supplements.supplements.magnesium.benefits.depression')}</li>
                  <li><strong>{t('supplements.common.sleep')}</strong> {t('supplements.supplements.magnesium.benefits.sleep')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.magnesium.dosage.text')}</p>

                <h4>{t('supplements.supplements.magnesium.formsTitle')}</h4>
                <ul>
                  <li><strong>{t('supplements.supplements.magnesium.forms.glycinate.title')}</strong> {t('supplements.supplements.magnesium.forms.glycinate.text')}</li>
                  <li><strong>{t('supplements.supplements.magnesium.forms.citrate.title')}</strong> {t('supplements.supplements.magnesium.forms.citrate.text')}</li>
                  <li><strong>{t('supplements.supplements.magnesium.forms.threonate.title')}</strong> {t('supplements.supplements.magnesium.forms.threonate.text')}</li>
                  <li><strong>{t('supplements.supplements.magnesium.forms.oxide.title')}</strong> {t('supplements.supplements.magnesium.forms.oxide.text')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.magnesium.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="probiotics">
            <AccordionTrigger>{t('supplements.supplements.probiotics.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.probiotics.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.probiotics.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.supplements.probiotics.benefits.anxietyDepression.title')}</strong> {t('supplements.supplements.probiotics.benefits.anxietyDepression.text')}</li>
                  <li><strong>{t('supplements.supplements.probiotics.benefits.stress.title')}</strong> {t('supplements.supplements.probiotics.benefits.stress.text')}</li>
                  <li><strong>{t('supplements.supplements.probiotics.benefits.gut.title')}</strong> {t('supplements.supplements.probiotics.benefits.gut.text')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.probiotics.dosage.text')}</p>

                <h4>{t('supplements.supplements.probiotics.strainsTitle')}</h4>
                <ul>
                  <li>{t('supplements.supplements.probiotics.strains.items.item1')}</li>
                  <li>{t('supplements.supplements.probiotics.strains.items.item2')}</li>
                  <li>{t('supplements.supplements.probiotics.strains.items.item3')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.probiotics.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="same">
            <AccordionTrigger>{t('supplements.supplements.same.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.same.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.same.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.common.depression')}</strong> {t('supplements.supplements.same.benefits.depression')}</li>
                  <li><strong>{t('supplements.supplements.same.benefits.onset.title')}</strong> {t('supplements.supplements.same.benefits.onset.text')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.same.dosage.text')}</p>

                <h4>{t('supplements.supplements.same.considerationsTitle')}</h4>
                <ul>
                  <li><strong>{t('supplements.supplements.same.considerations.items.item1title')}</strong> {t('supplements.supplements.same.considerations.items.item1text')}</li>
                  <li><strong>{t('supplements.supplements.same.considerations.items.item2title')}</strong> {t('supplements.supplements.same.considerations.items.item2text')}</li>
                  <li><strong>{t('supplements.supplements.same.considerations.items.item3title')}</strong> {t('supplements.supplements.same.considerations.items.item3text')}</li>
                  <li>{t('supplements.supplements.same.considerations.items.item4')}</li>
                </ul>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.same.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="l-theanine">
            <AccordionTrigger>{t('supplements.supplements.lTheanine.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.evidenceLevel')} <span className="text-primary-700">{t('supplements.supplements.lTheanine.evidenceLevel')}</span></h3>
                <p>{t('supplements.supplements.lTheanine.description')}</p>

                <h4>{t('supplements.mentalHealthBenefits')}</h4>
                <ul>
                  <li><strong>{t('supplements.common.anxiety')}</strong> {t('supplements.supplements.lTheanine.benefits.anxiety')}</li>
                  <li><strong>{t('supplements.common.focus')}</strong> {t('supplements.supplements.lTheanine.benefits.focus')}</li>
                  <li><strong>{t('supplements.common.sleep')}</strong> {t('supplements.supplements.lTheanine.benefits.sleep')}</li>
                </ul>

                <h4>{t('supplements.recommendedDosage')}</h4>
                <p>{t('supplements.supplements.lTheanine.dosage.text')}</p>

                <h4>{t('supplements.safety')}</h4>
                <p>{t('supplements.supplements.lTheanine.safety.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="caution">
            <AccordionTrigger>{t('supplements.caution.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.caution.stJohnsWort.title')}</h3>
                <p>{t('supplements.caution.stJohnsWort.text')}</p>
                <p className="text-sm text-error-700">
                  <strong>{t('supplements.caution.stJohnsWort.warning')}</strong>
                </p>

                <h3>{t('supplements.caution.highDose.title')}</h3>
                <p>{t('supplements.caution.highDose.text')}</p>

                <h3>{t('supplements.caution.unregulated.title')}</h3>
                <p>{t('supplements.caution.unregulated.text')}</p>

                <h3>{t('supplements.caution.kava.title')}</h3>
                <p>{t('supplements.caution.kava.text')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="safety">
            <AccordionTrigger>{t('supplements.safetySection.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>{t('supplements.safetySection.fdaRegulation.title')}</h3>
                <p>{t('supplements.safetySection.fdaRegulation.text')}</p>

                <h3>{t('supplements.safetySection.thirdParty.title')}</h3>
                <p>{t('supplements.safetySection.thirdParty.text')}</p>
                <ul>
                  <li><strong>{t('supplements.safetySection.thirdParty.certifications.usp.title')}</strong> {t('supplements.safetySection.thirdParty.certifications.usp.text')}</li>
                  <li><strong>{t('supplements.safetySection.thirdParty.certifications.nsf.title')}</strong> {t('supplements.safetySection.thirdParty.certifications.nsf.text')}</li>
                  <li><strong>{t('supplements.safetySection.thirdParty.certifications.consumerLab.title')}</strong> {t('supplements.safetySection.thirdParty.certifications.consumerLab.text')}</li>
                  <li><strong>{t('supplements.safetySection.thirdParty.certifications.ifos.title')}</strong> {t('supplements.safetySection.thirdParty.certifications.ifos.text')}</li>
                </ul>

                <h3>{t('supplements.safetySection.interactions.title')}</h3>
                <p>{t('supplements.safetySection.interactions.text')}</p>
                <ul>
                  <li>{t('supplements.safetySection.interactions.items.item1')}</li>
                  <li>{t('supplements.safetySection.interactions.items.item2')}</li>
                  <li>{t('supplements.safetySection.interactions.items.item3')}</li>
                  <li>{t('supplements.safetySection.interactions.items.item4')}</li>
                </ul>

                <h3>{t('supplements.safetySection.whenAvoid.title')}</h3>
                <ul>
                  <li>{t('supplements.safetySection.whenAvoid.items.item1')}</li>
                  <li>{t('supplements.safetySection.whenAvoid.items.item2')}</li>
                  <li>{t('supplements.safetySection.whenAvoid.items.item3')}</li>
                  <li>{t('supplements.safetySection.whenAvoid.items.item4')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="research">
            <AccordionTrigger>{t('supplements.research.title')}</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/mental-health-medications" target="_blank" rel="noopener noreferrer">
                      {t('supplements.research.links.nimh')}
                    </a>
                  </li>
                  <li>
                    <a href="https://ods.od.nih.gov/" target="_blank" rel="noopener noreferrer">
                      {t('supplements.research.links.nih')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cochrane.org/" target="_blank" rel="noopener noreferrer">
                      {t('supplements.research.links.cochrane')}
                    </a>
                  </li>
                  <li>
                    <a href="https://www.consumerlab.com/" target="_blank" rel="noopener noreferrer">
                      {t('supplements.research.links.consumerLab')}
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('supplements.bottomLine.title')}</AlertTitle>
          <AlertDescription>
            {t('supplements.bottomLine.text')}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href={`/${locale}/contact`}>{t('supplements.discussButton')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/nutrition`}>{t('supplements.backButton')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
