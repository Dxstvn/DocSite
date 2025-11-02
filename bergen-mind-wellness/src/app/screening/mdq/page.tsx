'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { mdqQuestions, mdqFollowUpQuestions, problemLevelOptions, calculateMDQ, type MDQResult } from '@/lib/screening/mdq'

const formSchema = z.object({
  answers: z.array(z.boolean()).length(13),
  coOccurrence: z.boolean(),
  problemLevel: z.number().min(0).max(3),
})

export default function MDQPage() {
  const [result, setResult] = useState<MDQResult | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(13).fill(false),
      coOccurrence: false,
      problemLevel: -1,  // -1 indicates unanswered
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedResult = calculateMDQ(data.answers, data.coOccurrence, data.problemLevel)
    setResult(calculatedResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const isPositive = result.screening === 'Positive'

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">MDQ Results</h1>

          {isPositive && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Positive Screening Result</AlertTitle>
              <AlertDescription>
                Your screening suggests symptoms consistent with bipolar disorder. Please schedule
                an evaluation with a mental health professional who specializes in mood disorders.
                Bipolar disorder requires comprehensive clinical assessment for accurate diagnosis.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Screening Result: {result.screening}</CardTitle>
              <CardDescription className="text-lg space-y-2">
                <div>Symptoms Endorsed: {result.yesCount}/13</div>
                <div>Co-occurrence: {result.coOccurrence ? 'Yes' : 'No'}</div>
                <div>Problem Level: {problemLevelOptions[result.problemLevel].label}</div>
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
                  can provide an accurate diagnosis of bipolar disorder after a comprehensive clinical
                  evaluation that includes mood history, family history, and functional assessment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">Schedule an Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/education/bipolar">Learn About Bipolar Disorder</Link>
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
        <h1 className="mb-6">MDQ Mood Disorder Screening</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>About This Screening</AlertTitle>
          <AlertDescription>
            The Mood Disorder Questionnaire (MDQ) is a validated screening tool for bipolar disorder.
            It asks about periods of elevated or irritable mood and related symptoms. Your responses
            are processed entirely in your browser and are not stored or transmitted.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Please answer each question as best you can. Check YES or NO for each item.
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">Part 1: Symptom Questions</CardTitle>
                <CardDescription>
                  Has there ever been a period of time when you were not your usual self and...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mdqQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={`answers.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium cursor-pointer">
                            {question.id}. {question.text}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">Part 2: Co-occurrence</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coOccurrence"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-medium cursor-pointer">
                          {mdqFollowUpQuestions.coOccurrence}
                        </FormLabel>
                        <FormDescription>
                          Check YES if several of these symptoms happened during the same period of time.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">Part 3: Problem Level</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="problemLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {mdqFollowUpQuestions.problemLevel}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          className="space-y-2"
                        >
                          {problemLevelOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value.toString()} id={`problem-${option.value}`} />
                              <Label htmlFor={`problem-${option.value}`} className="font-normal cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
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
