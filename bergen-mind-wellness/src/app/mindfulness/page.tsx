import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Heart } from 'lucide-react'

export default function MindfulnessPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">Mindfulness & Lifestyle Practices</h1>
          <p className="text-lg text-neutral-600">
            Evidence-based techniques to reduce stress, improve focus, and support mental wellness.
          </p>
        </div>

        <Tabs defaultValue="meditation" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="journaling">Journaling</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="meditation">
            <Card>
              <CardHeader>
                <CardTitle>Guided Meditations</CardTitle>
                <CardDescription>Free audio-guided meditation practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/inpok4MKVLM"
                    title="5-Minute Meditation for Beginners"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-neutral-600">
                  Meditation has been shown to reduce stress, improve focus, and support overall mental health.
                  Start with just 5 minutes per day.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breathing">
            <Card>
              <CardHeader>
                <CardTitle>Breathing Exercises</CardTitle>
                <CardDescription>
                  Simple techniques to activate the parasympathetic nervous system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">4-7-8 Breathing</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>Breathe in through your nose for 4 counts</li>
                    <li>Hold your breath for 7 counts</li>
                    <li>Exhale through your mouth for 8 counts</li>
                    <li>Repeat 3-4 times</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Box Breathing</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>Breathe in for 4 counts</li>
                    <li>Hold for 4 counts</li>
                    <li>Breathe out for 4 counts</li>
                    <li>Hold for 4 counts</li>
                    <li>Repeat 5-10 times</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journaling">
            <Card>
              <CardHeader>
                <CardTitle>Journaling Templates</CardTitle>
                <CardDescription>Structured prompts for reflection and growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Gratitude Journal Template</h3>
                    <p className="text-sm text-neutral-600">Daily gratitude practice</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/gratitude-journal.pdf" download>
                      Download PDF
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Thought Record Worksheet</h3>
                    <p className="text-sm text-neutral-600">CBT-based thought challenging</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/thought-record.pdf" download>
                      Download PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Hygiene Tips</CardTitle>
                <CardDescription>Evidence-based strategies for better sleep</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-neutral-600">
                  <li>✓ Maintain a consistent sleep schedule (same bedtime/wake time)</li>
                  <li>✓ Create a relaxing bedtime routine</li>
                  <li>✓ Keep bedroom cool, dark, and quiet</li>
                  <li>✓ Limit screen time 1 hour before bed</li>
                  <li>✓ Avoid caffeine after 2pm</li>
                  <li>✓ Get regular exercise (but not close to bedtime)</li>
                  <li>✓ Reserve bed for sleep and intimacy only</li>
                  <li>✓ If you can't sleep after 20 minutes, get up and do a calm activity</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
