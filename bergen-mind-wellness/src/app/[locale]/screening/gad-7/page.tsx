'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
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
import { calculateGAD7, type GAD7Result } from '@/lib/screening/gad7'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(3)).length(7),
})

export default function GAD7Page() {
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation('screening')

  const [result, setResult] = useState<GAD7Result | null>(null)

  // Define questions with translation keys
  const questions = [
    { id: 1, key: 'gad7.questions.q1' },
    { id: 2, key: 'gad7.questions.q2' },
    { id: 3, key: 'gad7.questions.q3' },
    { id: 4, key: 'gad7.questions.q4' },
    { id: 5, key: 'gad7.questions.q5' },
    { id: 6, key: 'gad7.questions.q6' },
    { id: 7, key: 'gad7.questions.q7' },
  ]

  // Define options with translation keys (same as PHQ-9)
  const options = [
    { value: 0, key: 'phq9.options.notAtAll' },
    { value: 1, key: 'phq9.options.severalDays' },
    { value: 2, key: 'phq9.options.moreThanHalf' },
    { value: 3, key: 'phq9.options.nearlyEvery' },
  ]

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
          <h1 className="mb-8">{t('gad7.resultsTitle')}</h1>

          {isSevere && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('gad7.results.immediateAttention.title')}</AlertTitle>
              <AlertDescription>
                {t('gad7.results.immediateAttention.severeSymptoms')}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('common.yourScore')}: {result.score}/21</CardTitle>
              <CardDescription className="text-lg">
                {t('gad7.results.severityLabel')}: <span className="font-semibold">{t(`gad7.results.severity.${result.severityKey}`)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">{t(`gad7.results.interpretation.${result.severityKey}`)}</p>
              <p className="text-neutral-700">{t(`gad7.results.recommendation.${result.recommendationKey}`)}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t('gad7.results.disclaimer.title')}</AlertTitle>
                <AlertDescription>
                  {t('gad7.results.disclaimer.text')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href={`/${locale}/contact`}>{t('common.scheduleAppointment')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/education/anxiety`}>{t('gad7.results.learnMore')}</Link>
            </Button>
            <Button variant="ghost" onClick={() => {
              setResult(null)
              form.reset()
            }}>
              {t('common.retakeScreening')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="mb-6">{t('gad7.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('gad7.about.title')}</AlertTitle>
          <AlertDescription>
            {t('gad7.about.text')}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('gad7.instructions.title')}</CardTitle>
            <CardDescription>
              {t('gad7.instructions.text')}
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questions.map((question, index) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`answers.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {question.id}. {t(question.key)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        className="space-y-2"
                      >
                        {options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                            <Label htmlFor={`q${question.id}-${option.value}`} className="font-normal cursor-pointer">
                              {t(option.key)}
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
              {t('common.calculateScore')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
