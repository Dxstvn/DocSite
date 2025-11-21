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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { calculateMDQ, type MDQResult } from '@/lib/screening/mdq'

const formSchema = z.object({
  answers: z.array(z.boolean()).length(13),
  coOccurrence: z.boolean(),
  problemLevel: z.number().min(0).max(3),
})



export default function MDQPage() {
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation('screening')

  const [result, setResult] = useState<MDQResult | null>(null)

  // Define questions with translation keys
  const questions = [
    { id: 1, key: 'mdq.questions.q1' },
    { id: 2, key: 'mdq.questions.q2' },
    { id: 3, key: 'mdq.questions.q3' },
    { id: 4, key: 'mdq.questions.q4' },
    { id: 5, key: 'mdq.questions.q5' },
    { id: 6, key: 'mdq.questions.q6' },
    { id: 7, key: 'mdq.questions.q7' },
    { id: 8, key: 'mdq.questions.q8' },
    { id: 9, key: 'mdq.questions.q9' },
    { id: 10, key: 'mdq.questions.q10' },
    { id: 11, key: 'mdq.questions.q11' },
    { id: 12, key: 'mdq.questions.q12' },
    { id: 13, key: 'mdq.questions.q13' },
  ]

  // Define problem level options with translation keys
  const problemLevelOptions = [
    { value: 0, key: 'mdq.problemLevelOptions.noProblem' },
    { value: 1, key: 'mdq.problemLevelOptions.minorProblem' },
    { value: 2, key: 'mdq.problemLevelOptions.moderateProblem' },
    { value: 3, key: 'mdq.problemLevelOptions.seriousProblem' },
  ]

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
    const isPositive = result.screeningKey === 'positive'

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">{t('mdq.resultsTitle')}</h1>

          {isPositive && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('mdq.results.positiveAlert.title')}</AlertTitle>
              <AlertDescription>
                {t('mdq.results.positiveAlert.text')}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('mdq.results.screeningResult')}: {t(`mdq.results.screening.${result.screeningKey}`)}</CardTitle>
              <CardDescription className="text-lg space-y-2">
                <div>{t('mdq.results.symptomsEndorsed')}: {result.yesCount}/13</div>
                <div>{t('mdq.results.coOccurrence')}: {result.coOccurrence ? t('mdq.results.yes') : t('mdq.results.no')}</div>
                <div>{t('mdq.results.problemLevel')}: {t(problemLevelOptions[result.problemLevel].key)}</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">{t(`mdq.results.interpretation.${result.interpretationKey}`)}</p>
              <p className="text-neutral-700">{t(`mdq.results.recommendation.${result.recommendationKey}`)}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t('mdq.results.disclaimer.title')}</AlertTitle>
                <AlertDescription>
                  {t('mdq.results.disclaimer.text')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href={`/${locale}/contact`}>{t('common.scheduleAppointment')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/education/bipolar`}>{t('mdq.results.learnMore')}</Link>
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
        <h1 className="mb-6">{t('mdq.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('mdq.about.title')}</AlertTitle>
          <AlertDescription>
            {t('mdq.about.text')}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('mdq.instructions.title')}</CardTitle>
            <CardDescription>
              {t('mdq.instructions.text')}
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">{t('mdq.instructions.title')}</CardTitle>
                <CardDescription>
                  {t('mdq.instructions.prefix')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
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
                            {question.id}. {t(question.key)}
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
                <CardTitle className="text-primary-700">{t('mdq.followUp.coOccurrenceTitle')}</CardTitle>
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
                          {t('mdq.followUp.coOccurrenceQuestion')}
                        </FormLabel>
                        <FormDescription>
                          {t('mdq.followUp.coOccurrenceDescription')}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">{t('mdq.followUp.problemLevelTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="problemLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {t('mdq.followUp.problemLevelQuestion')}
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
                                {t(option.key)}
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
              {t('common.calculateScore')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
