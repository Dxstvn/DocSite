import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const conditions = [
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Understanding symptoms, causes, and evidence-based treatments for major depressive disorder',
  },
  {
    slug: 'anxiety',
    title: 'Anxiety Disorders',
    description: 'Learn about GAD, panic disorder, social anxiety, and effective treatment options',
  },
  {
    slug: 'adhd',
    title: 'ADHD',
    description: 'Attention-deficit/hyperactivity disorder in adults: symptoms, diagnosis, and management',
  },
  {
    slug: 'bipolar',
    title: 'Bipolar Disorder',
    description: 'Mood cycling, medication management, and lifestyle strategies for bipolar disorder',
  },
  {
    slug: 'ptsd',
    title: 'PTSD',
    description: 'Post-traumatic stress disorder: understanding trauma and evidence-based treatments',
  },
]

export default function EducationPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mb-6">Mental Health Education</h1>
          <p className="text-lg text-neutral-600">
            Evidence-based information about mental health conditions, treatment options,
            and pathways to recovery. Knowledge is the first step toward healing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conditions.map((condition) => (
            <Card key={condition.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{condition.title}</CardTitle>
                <CardDescription>{condition.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/education/${condition.slug}`}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
