import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Stethoscope, Mail, Phone, MapPin, Info, PhoneCall, Calendar } from 'lucide-react'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['metadata'])

  return {
    title: t('metadata:contact.title'),
    description: t('metadata:contact.description'),
    keywords: ['schedule appointment', 'mental health appointment NJ', 'virtual psychiatry', 'telepsychiatry Bergen County', 'book therapist', 'psychiatric appointment', 'mental health consultation'],
    openGraph: {
      title: t('metadata:contact.title'),
      description: t('metadata:contact.description'),
      url: `${baseUrl}${locale === 'es' ? '/es' : ''}/contact`,
      type: 'website',
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
      title: t('metadata:contact.title'),
      description: t('metadata:contact.description')
    }
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['contact'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Stethoscope className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">Schedule an Appointment</h1>
          <p className="text-lg text-neutral-600">
            Take the first step toward better mental health. We're here to support you on your journey to wellness.
          </p>
        </div>

        {/* Privacy Assurance */}
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Your Privacy Matters</AlertTitle>
          <AlertDescription>
            All communications are confidential. We follow HIPAA guidelines to protect your personal health information.
          </AlertDescription>
        </Alert>

        {/* Appointment Types */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold tracking-tight">Appointment Types</h2>
            <CardDescription>We offer several types of appointments to meet your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-600 pl-4">
                <p className="font-semibold mb-1">Initial Consultation</p>
                <p className="text-sm text-neutral-600 mb-1">60 minutes</p>
                <p className="text-neutral-700">
                  Comprehensive evaluation to understand your concerns, history, and goals. We'll discuss treatment options and create a personalized plan.
                </p>
              </div>

              <div className="border-l-4 border-primary-600 pl-4">
                <p className="font-semibold mb-1">Follow-Up Session</p>
                <p className="text-sm text-neutral-600 mb-1">45 minutes</p>
                <p className="text-neutral-700">
                  Ongoing therapy sessions for established patients. We'll monitor your progress and adjust your treatment plan as needed.
                </p>
              </div>

              <div className="border-l-4 border-primary-600 pl-4">
                <p className="font-semibold mb-1">Medication Management</p>
                <p className="text-sm text-neutral-600 mb-1">30 minutes</p>
                <p className="text-neutral-700">
                  Medication review and adjustment appointments. We'll discuss effectiveness, side effects, and any concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Appointment CTA */}
        <Card className="mb-8 border-primary-200 bg-primary-50">
          <CardContent className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Ready to Schedule?</h2>
              <p className="text-neutral-700 mb-6">
                Use our online booking system to find available appointment times and schedule your visit.
                You'll receive instant confirmation via email.
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/appointments">
                  Book an Appointment Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold tracking-tight">Contact Information</h2>
              <CardDescription>Reach out to us directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Phone</h3>
                  <a
                    href="tel:+12016902182"
                    className="text-neutral-700 hover:text-primary-700 transition-colors"
                  >
                    (201) 690-2182
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Email</h3>
                  <a
                    href="mailto:info@bergenmindwellness.com"
                    className="text-neutral-700 hover:text-primary-700 transition-colors break-all"
                  >
                    info@bergenmindwellness.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Address</h3>
                  <p className="text-neutral-700">
                    123 Main Street, Suite 200<br />
                    Bergen County, NJ 07000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold tracking-tight">Office Hours</h2>
              <CardDescription>When we're available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700">Monday - Friday</span>
                  <span className="text-neutral-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700">Saturday</span>
                  <span className="text-neutral-600">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-700">Sunday</span>
                  <span className="text-neutral-600">Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  <strong>New Patient Appointments:</strong> Please allow 1-2 business days for us to return your call to schedule your initial consultation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold tracking-tight">What to Expect at Your First Visit</h2>
            <CardDescription>We want you to feel prepared and comfortable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <ul className="space-y-2">
                <li>Arrive 10-15 minutes early to complete paperwork (or download forms from your confirmation email)</li>
                <li>Bring your insurance card and a valid ID</li>
                <li>List any current medications you're taking</li>
                <li>Be prepared to discuss your medical history and current concerns</li>
                <li>The initial consultation typically lasts 60 minutes</li>
                <li>Ask questions - we're here to help you understand your treatment options</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold tracking-tight">Insurance & Payment</h2>
            <CardDescription>We accept most major insurance plans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 mb-4">
              We are in-network with most major insurance providers including Aetna, Blue Cross Blue Shield, Cigna, and United Healthcare.
              Please contact our office to verify your specific plan coverage.
            </p>
            <p className="text-neutral-700">
              <strong>Self-Pay Options:</strong> We also welcome self-pay patients and offer competitive rates. Payment is due at the time of service.
            </p>
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <Alert variant="destructive" className="mb-8">
          <PhoneCall className="h-4 w-4" />
          <AlertTitle>Crisis Resources</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              <strong>If you're experiencing a mental health emergency, please contact:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (available 24/7)
              </li>
              <li>
                <strong>Crisis Text Line:</strong> Text HOME to 741741 (available 24/7)
              </li>
              <li>
                <strong>Emergency Services:</strong> Call 911 or visit your nearest emergency room
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Back to Resources */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/education">Browse Mental Health Education</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/screening">Take a Self-Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
