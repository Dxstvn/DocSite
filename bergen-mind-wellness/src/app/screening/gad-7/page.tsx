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
import { gad7Questions, gad7Options, calculateGAD7, type GAD7Result } from '@/lib/screening/gad7'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(3)).length(7),
})

export default function GAD7Page() {
  const [result, setResult] = useState<GAD7Result | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(7).fill(-1),  // -1 indicates unanswered
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedResult = calculateGAD7(data.answers)
    setResult(calculatedResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const isSevere = result.score >= 15

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">GAD-7 Results</h1>

          {isSevere && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Immediate Attention Recommended</AlertTitle>
              <AlertDescription>
                Your score suggests severe anxiety symptoms. Please contact a mental health
                professional or your primary care physician as soon as possible.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Score: {result.score}/21</CardTitle>
              <CardDescription className="text-lg">
                Severity Level: <span className="font-semibold">{result.severity}</span>
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
                  can provide an accurate diagnosis and treatment plan.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">Schedule an Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/education/anxiety">Learn About Anxiety</Link>
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
        <h1 className="mb-6">GAD-7 Anxiety Screening</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>About This Screening</AlertTitle>
          <AlertDescription>
            The Generalized Anxiety Disorder (GAD-7) is a validated screening tool for anxiety.
            It asks about symptoms you may have experienced over the past two weeks. Your responses
            are processed entirely in your browser and are not stored or transmitted.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {gad7Questions.map((question, index) => (
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
                        {gad7Options.map((option) => (
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
