import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Lock, Info } from 'lucide-react'

const screenings = [
  {
    slug: 'phq-9',
    title: 'PHQ-9',
    subtitle: 'Depression Screening',
    description: '9-question assessment for depression symptoms',
    duration: '2-3 minutes',
  },
  {
    slug: 'gad-7',
    title: 'GAD-7',
    subtitle: 'Anxiety Screening',
    description: '7-question assessment for anxiety symptoms',
    duration: '2 minutes',
  },
  {
    slug: 'asrs',
    title: 'ASRS',
    subtitle: 'Adult ADHD Screening',
    description: 'Self-report scale for ADHD in adults',
    duration: '3-4 minutes',
  },
  {
    slug: 'mdq',
    title: 'MDQ',
    subtitle: 'Mood Disorder Screening',
    description: 'Screening for bipolar disorder',
    duration: '3 minutes',
  },
  {
    slug: 'pcl-5',
    title: 'PCL-5',
    subtitle: 'PTSD Screening',
    description: 'Assessment for post-traumatic stress symptoms',
    duration: '5 minutes',
  },
]

export default function ScreeningPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="mb-6">Mental Health Screening Tools</h1>
          <p className="text-lg text-neutral-600 mb-6">
            Free, confidential self-assessment tools to help you understand your mental health.
            These screenings are processed entirely in your browser—we do not collect or store
            your responses.
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              These are <strong>screening tools, not diagnostic instruments</strong>. Results should
              be discussed with a licensed mental health professional. If you&apos;re experiencing a crisis,
              call 988 immediately.
            </AlertDescription>
          </Alert>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Your Privacy is Protected</AlertTitle>
            <AlertDescription>
              All screening tools are processed client-side only. Your responses are never transmitted
              to our servers or stored anywhere. You maintain complete control over your data.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {screenings.map((screening) => (
            <Card key={screening.slug}>
              <CardHeader>
                <CardTitle>{screening.title}</CardTitle>
                <CardDescription className="font-semibold text-primary-700">
                  {screening.subtitle}
                </CardDescription>
                <CardDescription>{screening.description}</CardDescription>
                <CardDescription className="text-sm text-neutral-500">
                  ⏱ {screening.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/screening/${screening.slug}`}>Start Screening</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
