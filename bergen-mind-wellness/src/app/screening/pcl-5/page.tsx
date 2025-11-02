'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { pcl5Questions, pcl5Options, calculatePCL5, type PCL5Result } from '@/lib/screening/pcl5'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(4)).length(20),
})

export default function PCL5Page() {
  const [result, setResult] = useState<PCL5Result | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(20).fill(-1),  // -1 indicates unanswered
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedResult = calculatePCL5(data.answers)
    setResult(calculatedResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const isSevere = result.totalScore >= 33

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">PCL-5 Results</h1>

          {isSevere && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Immediate Attention Recommended</AlertTitle>
              <AlertDescription>
                Your score suggests symptoms consistent with PTSD. Please contact a mental health
                professional who specializes in trauma as soon as possible. PTSD is highly treatable
                with evidence-based therapies.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Score: {result.totalScore}/80</CardTitle>
              <CardDescription className="text-lg">
                {result.provisionalDiagnosis
                  ? 'Score suggests clinically significant PTSD symptoms'
                  : 'Score below typical PTSD threshold'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Symptom Cluster Scores:</h3>
                <ul className="space-y-1 text-sm text-neutral-700">
                  <li>Re-experiencing: {result.clusterScores.reexperiencing}/20</li>
                  <li>Avoidance: {result.clusterScores.avoidance}/8</li>
                  <li>Negative Cognitions & Mood: {result.clusterScores.negative_cognitions}/28</li>
                  <li>Arousal & Reactivity: {result.clusterScores.arousal}/24</li>
                </ul>
              </div>

              <p className="text-neutral-700">{result.interpretation}</p>
              <p className="text-neutral-700">{result.recommendation}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Remember</AlertTitle>
                <AlertDescription>
                  This screening tool is not a diagnosis. Only a licensed mental health professional
                  can provide an accurate diagnosis of PTSD after a comprehensive clinical evaluation
                  that includes trauma history and functional assessment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">Schedule an Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/education/ptsd">Learn About PTSD</Link>
            </Button>
            <Button variant="ghost" onClick={() => {
              setResult(null)
              form.reset()
            }}>
              Retake Screening
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="mb-6">PCL-5 PTSD Screening</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>About This Screening</AlertTitle>
          <AlertDescription>
            The PTSD Checklist for DSM-5 (PCL-5) is a validated screening tool for post-traumatic stress disorder.
            It asks about symptoms you may have experienced in the past month related to a traumatic event.
            Your responses are processed entirely in your browser and are not stored or transmitted.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Below is a list of problems that people sometimes have in response to a very stressful experience.
              Please read each problem carefully and then select one of the options to indicate how much you
              have been bothered by that problem <strong>in the past month</strong>.
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {pcl5Questions.map((question, index) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`answers.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {question.id}. {question.text}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        className="space-y-2"
                      >
                        {pcl5Options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                            <Label htmlFor={`q${question.id}-${option.value}`} className="font-normal cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" size="lg" className="w-full">
              Calculate Score
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
