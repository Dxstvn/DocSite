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
import { asrsQuestions, asrsOptions, calculateASRS, type ASRSResult } from '@/lib/screening/asrs'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(4)).length(18),
})

export default function ASRSPage() {
  const [result, setResult] = useState<ASRSResult | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(18).fill(-1),  // -1 indicates unanswered
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedResult = calculateASRS(data.answers)
    setResult(calculatedResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const isPositive = result.screening === 'Positive'

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">ASRS Results</h1>

          {isPositive && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Positive Screening Result</AlertTitle>
              <AlertDescription>
                Your screening suggests symptoms consistent with adult ADHD. Please schedule
                a comprehensive evaluation with a mental health professional or physician
                who specializes in ADHD for a formal diagnosis.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Screening Result: {result.screening}</CardTitle>
              <CardDescription className="text-lg space-y-2">
                <div>Part A Score: {result.partAScore}/24 ({result.partAPositive} questions marked Often/Very Often)</div>
                <div>Part B Score: {result.partBScore}/48</div>
                <div>Total Score: {result.totalScore}/72</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">{result.interpretation}</p>
              <p className="text-neutral-700">{result.recommendation}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Remember</AlertTitle>
                <AlertDescription>
                  This screening tool is not a diagnosis. Only a licensed mental health professional
                  can provide an accurate diagnosis of ADHD after a comprehensive clinical evaluation
                  that includes developmental history and functional assessment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">Schedule an Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/education/adhd">Learn About ADHD</Link>
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

  const partAQuestions = asrsQuestions.filter(q => q.part === 'A')
  const partBQuestions = asrsQuestions.filter(q => q.part === 'B')

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="mb-6">ASRS Adult ADHD Screening</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>About This Screening</AlertTitle>
          <AlertDescription>
            The Adult ADHD Self-Report Scale (ASRS) is a validated screening tool for ADHD in adults.
            It consists of 18 questions divided into Part A (6 questions) and Part B (12 questions).
            Your responses are processed entirely in your browser and are not stored or transmitted.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Please answer all questions based on how you have felt and conducted yourself
              over the past 6 months.
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Part A */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">Part A</CardTitle>
                <CardDescription>
                  The following 6 questions are the most predictive of ADHD symptoms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {partAQuestions.map((question, index) => (
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
                            {asrsOptions.map((option) => (
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
              </CardContent>
            </Card>

            {/* Part B */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">Part B</CardTitle>
                <CardDescription>
                  The following 12 questions provide additional clinical information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {partBQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={`answers.${index + 6}`}
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
                            {asrsOptions.map((option) => (
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
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Calculate Score
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
