import type { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Languages, Users, Pill } from 'lucide-react'
import { StructuredData } from '@/components/StructuredData'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:about.title'),
    description: t('metadata:about.description'),
    keywords: ['Rocio Jenkins', 'PMHNP-BC', 'psychiatric nurse practitioner', 'bilingual mental health', 'Bergen County psychiatrist', 'Spanish speaking therapist', 'mental health provider NJ'],
    openGraph: {
      title: t('metadata:about.title'),
      description: t('metadata:about.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/about`,
      type: 'profile',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: [{
        url: `${baseUrl}/images/team/rocio-jenkins.png`,
        width: 400,
        height: 533,
        alt: 'Rocio Jenkins, PMHNP-BC'
      }]
    },
    twitter: {
      card: 'summary',
      title: t('metadata:about.title'),
      description: t('metadata:about.description')
    }
  }
}

const physicianSchema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/about#physician`,
  name: 'Rocio Jenkins',
  honorificSuffix: 'PMHNP-BC',
  jobTitle: 'Psychiatric-Mental Health Nurse Practitioner',
  description: 'Board-certified Psychiatric-Mental Health Nurse Practitioner passionate about helping individuals find clarity, stability, and peace of mind through holistic, person-centered care.',
  image: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/images/team/rocio-jenkins.png`,
    width: 400,
    height: 533,
  },
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/about`,
  memberOf: {
    '@type': 'MedicalOrganization',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}#organization`,
    name: 'Bergen Mind & Wellness, LLC',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Chamberlain University',
  },
  knowsLanguage: [
    { '@type': 'Language', name: 'English' },
    { '@type': 'Language', name: 'Spanish' },
  ],
  medicalSpecialty: ['Psychiatry', 'Mental Health', 'Psychiatric Nursing'],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'Master of Science in Nursing (MSN)',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Board-Certified Psychiatric-Mental Health Nurse Practitioner (PMHNP-BC)',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: 'Advanced Practice Nurse (APN), State of New Jersey',
    },
  ],
  areaServed: {
    '@type': 'State',
    name: 'New Jersey',
  },
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Psychiatric Evaluation',
      description: 'Comprehensive mental health assessment and diagnosis',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Medication Management',
      description: 'Evidence-based psychiatric medication prescription and monitoring',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Supportive Therapy',
      description: 'Compassionate therapeutic guidance and support',
    },
  ],
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['about'])

  return (
    <>
      <StructuredData data={physicianSchema} />
      <div className="section">
        <div className="container max-w-4xl">
          <h1 className="mb-8">{t('about:title')}</h1>

        <div className="prose mb-12">
          <p className="text-lg">
            {t('about:intro')}
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image */}
              <div className="relative w-40 h-[213px] md:w-44 md:h-[235px] flex-shrink-0">
                <Image
                  src="/images/team/rocio-jenkins.png"
                  alt={t('about:provider.imageAlt')}
                  fill
                  sizes="(max-width: 768px) 160px, 176px"
                  className="rounded-2xl object-cover border-4 border-primary-100 shadow-md"
                  priority={false}
                />
              </div>

              {/* Name and Title */}
              <div className="flex-1 text-center md:text-left md:flex md:flex-col md:justify-center">
                <CardTitle className="text-2xl mb-2">{t('about:provider.name')}</CardTitle>
                <CardDescription className="text-base">
                  {t('about:provider.title')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6 text-primary-700">{t('about:provider.profileTitle')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('about:provider.aboutTitle')}</h3>
                <p
                  className="text-neutral-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: t('about:provider.bio1') }}
                />
                <p
                  className="text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('about:provider.bio2') }}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">{t('about:credentials.title')}</h3>
                <ul className="space-y-1 text-neutral-600">
                  <li>{t('about:credentials.msn')}</li>
                  <li>{t('about:credentials.apn')}</li>
                  <li>{t('about:credentials.pmhnpbc')}</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 border-t pt-6">
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t('about:quickInfo.languages.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('about:quickInfo.languages.value')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t('about:quickInfo.ageGroups.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('about:quickInfo.ageGroups.value')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pill className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t('about:quickInfo.services.title')}</h4>
                    <p className="text-sm text-neutral-600">{t('about:quickInfo.services.value')}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">{t('about:specializations.title')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>{t('about:specializations.depression')}</Badge>
                  <Badge>{t('about:specializations.anxiety')}</Badge>
                  <Badge>{t('about:specializations.adhd')}</Badge>
                  <Badge>{t('about:specializations.ptsd')}</Badge>
                  <Badge>{t('about:specializations.bipolar')}</Badge>
                  <Badge>{t('about:specializations.ocd')}</Badge>
                  <Badge>{t('about:specializations.panic')}</Badge>
                  <Badge>{t('about:specializations.eating')}</Badge>
                  <Badge>{t('about:specializations.maternal')}</Badge>
                  <Badge>{t('about:specializations.lgbtqia')}</Badge>
                  <Badge>{t('about:specializations.grief')}</Badge>
                  <Badge>{t('about:specializations.cultural')}</Badge>
                  <Badge>{t('about:specializations.sleep')}</Badge>
                  <Badge>{t('about:specializations.stress')}</Badge>
                  <Badge>{t('about:specializations.anger')}</Badge>
                  <Badge>{t('about:specializations.chronic')}</Badge>
                  <Badge>{t('about:specializations.family')}</Badge>
                  <Badge>{t('about:specializations.physical')}</Badge>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">{t('about:modalities.title')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{t('about:modalities.cbt')}</Badge>
                  <Badge variant="outline">{t('about:modalities.ba')}</Badge>
                  <Badge variant="outline">{t('about:modalities.mbct')}</Badge>
                  <Badge variant="outline">{t('about:modalities.psychodynamic')}</Badge>
                  <Badge variant="outline">{t('about:modalities.gestalt')}</Badge>
                  <Badge variant="outline">{t('about:modalities.mst')}</Badge>
                  <Badge variant="outline">{t('about:modalities.behavior')}</Badge>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">{t('about:therapeuticStyle.title')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">{t('about:therapeuticStyle.empowering')}</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">{t('about:therapeuticStyle.openMinded')}</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">{t('about:therapeuticStyle.holistic')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose mb-12">
          <h2>{t('about:approach.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('about:approach.description1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('about:approach.description2') }} />

          <h2>{t('about:firstSession.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('about:firstSession.description1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('about:firstSession.description2') }} />
          <p dangerouslySetInnerHTML={{ __html: t('about:firstSession.description3') }} />

          <h2>{t('about:medication.title')}</h2>
          <p>{t('about:medication.description')}</p>
        </div>

        <Alert className="mb-8">
          <AlertDescription>
            <h3 className="font-semibold mb-2">{t('about:insurance.title')}</h3>
            <p className="text-sm mb-2">
              {t('about:insurance.description')}
            </p>
            <ul className="text-sm space-y-1">
              <li>• {t('about:insurance.aetna')}</li>
              <li>• {t('about:insurance.carelon')}</li>
              <li>• {t('about:insurance.cigna')}</li>
              <li>• {t('about:insurance.independence')}</li>
              <li>• {t('about:insurance.quest')}</li>
            </ul>
            <p className="text-sm mt-3">
              {t('about:insurance.verifyNote')}
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
    </>
  )
}
