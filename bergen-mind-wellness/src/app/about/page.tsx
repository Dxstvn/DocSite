import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">About Bergen Mind & Wellness</h1>

        <div className="prose mb-12">
          <p className="text-lg">
            Bergen Mind & Wellness, LLC provides compassionate, evidence-based mental health
            care to individuals in New Jersey. Our approach combines clinical expertise with
            a holistic understanding of mental wellness.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Dr. Jane Smith, Ph.D.</CardTitle>
            <CardDescription>Licensed Clinical Psychologist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Credentials</h3>
                <ul className="space-y-1 text-neutral-600">
                  <li>Ph.D. in Clinical Psychology, Rutgers University</li>
                  <li>Licensed Clinical Psychologist, State of New Jersey (License #PSY12345)</li>
                  <li>Board Certified in Clinical Psychology</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Depression</Badge>
                  <Badge>Anxiety Disorders</Badge>
                  <Badge>ADHD</Badge>
                  <Badge>Bipolar Disorder</Badge>
                  <Badge>PTSD & Trauma</Badge>
                  <Badge>Cognitive Behavioral Therapy (CBT)</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <p className="text-neutral-600">
                  15+ years providing individual and group therapy, with extensive training
                  in evidence-based treatments including CBT, DBT, and trauma-focused therapies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose">
          <h2>Our Approach</h2>
          <p>
            We believe in a collaborative, client-centered approach to mental health care.
            Treatment is tailored to each individual's unique needs, combining therapy,
            lifestyle modifications, and when appropriate, medication management.
          </p>

          <h2>Evidence-Based Care</h2>
          <p>
            All our treatment recommendations are grounded in scientific research and
            clinical best practices. We stay current with the latest developments in
            mental health research to provide the most effective care possible.
          </p>
        </div>
      </div>
    </div>
  )
}
