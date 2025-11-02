import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Leaf } from 'lucide-react'

const nutritionTopics = [
  {
    slug: 'depression',
    title: 'Foods for Depression',
    description: 'Nutrition strategies to support mood and mental health recovery',
  },
  {
    slug: 'anxiety',
    title: 'Foods for Anxiety',
    description: 'Dietary approaches to reduce anxiety and promote calm',
  },
  {
    slug: 'focus',
    title: 'Foods for Focus',
    description: 'Brain-healthy foods to support concentration and cognitive function',
  },
  {
    slug: 'supplements',
    title: 'Supplements & Nutrients',
    description: 'Evidence-based supplements for mental health support',
  },
]

export default function NutritionPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Leaf className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">Nutrition & Brain Optimization</h1>
          <p className="text-lg text-neutral-600">
            What you eat affects how you feel. Discover evidence-based nutrition strategies
            to support your mental health and optimize brain function.
          </p>
        </div>

        <Alert className="max-w-3xl mx-auto mb-12">
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            Nutritional information is educational and not a substitute for medical advice.
            Always consult with your healthcare provider before making significant dietary
            changes or starting supplements, especially if you take medications.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {nutritionTopics.map((topic) => (
            <Card key={topic.slug}>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/nutrition/${topic.slug}`}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Downloadable Resources</CardTitle>
              <CardDescription>Free guides to support your nutrition journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Brain-Healthy Meal Plan</h3>
                  <p className="text-sm text-neutral-600">7-day meal plan for mental wellness</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/brain-healthy-meal-plan.pdf" download>
                    Download PDF
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Mood-Boosting Grocery List</h3>
                  <p className="text-sm text-neutral-600">Foods to stock for mental health support</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/mood-boosting-grocery-list.pdf" download>
                    Download PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
