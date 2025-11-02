import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Brain, Heart, Leaf, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Compassionate Mental Health Care
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Evidence-based treatment for depression, anxiety, ADHD, bipolar disorder, and PTSD.
              Your journey to wellness starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Schedule an Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/screening">Take a Screening</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Mental Health Education</CardTitle>
                <CardDescription>
                  Learn about conditions, treatments, and evidence-based resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/education">Explore</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Screening Tools</CardTitle>
                <CardDescription>
                  Free, confidential mental health assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/screening">Take a Screening</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Nutrition & Wellness</CardTitle>
                <CardDescription>
                  Brain-healthy foods and lifestyle optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/nutrition">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Mindfulness Practices</CardTitle>
                <CardDescription>
                  Guided meditations, journaling, and breathing exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/mindfulness">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Assurance */}
      <section className="section bg-primary-50">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="mb-6">Your Privacy Matters</h2>
            <p className="text-lg text-neutral-600 mb-8">
              All screening tools are processed entirely in your browser. We do not collect,
              store, or transmit your responses. Your mental health journey is private and secure.
            </p>
            <Button asChild variant="outline">
              <Link href="/privacy">Read Our Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
