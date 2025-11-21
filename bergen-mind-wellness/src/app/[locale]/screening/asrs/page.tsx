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
import { calculateASRS, type ASRSResult } from '@/lib/screening/asrs'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(4)).length(18),
})

export default function ASRSPage() {
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation('screening')

  const [result, setResult] = useState<ASRSResult | null>(null)

  // Define questions with translation keys
  const questions = [
    { id: 1, part: 'A', key: 'asrs.questions.q1' },
    { id: 2, part: 'A', key: 'asrs.questions.q2' },
    { id: 3, part: 'A', key: 'asrs.questions.q3' },
    { id: 4, part: 'A', key: 'asrs.questions.q4' },
    { id: 5, part: 'A', key: 'asrs.questions.q5' },
    { id: 6, part: 'A', key: 'asrs.questions.q6' },
    { id: 7, part: 'B', key: 'asrs.questions.q7' },
    { id: 8, part: 'B', key: 'asrs.questions.q8' },
    { id: 9, part: 'B', key: 'asrs.questions.q9' },
    { id: 10, part: 'B', key: 'asrs.questions.q10' },
    { id: 11, part: 'B', key: 'asrs.questions.q11' },
    { id: 12, part: 'B', key: 'asrs.questions.q12' },
    { id: 13, part: 'B', key: 'asrs.questions.q13' },
    { id: 14, part: 'B', key: 'asrs.questions.q14' },
    { id: 15, part: 'B', key: 'asrs.questions.q15' },
    { id: 16, part: 'B', key: 'asrs.questions.q16' },
    { id: 17, part: 'B', key: 'asrs.questions.q17' },
    { id: 18, part: 'B', key: 'asrs.questions.q18' },
  ]

  // Define options with translation keys
  const options = [
    { value: 0, key: 'asrs.options.never' },
    { value: 1, key: 'asrs.options.rarely' },
    { value: 2, key: 'asrs.options.sometimes' },
    { value: 3, key: 'asrs.options.often' },
    { value: 4, key: 'asrs.options.veryOften' },
  ]

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
    const isPositive = result.screeningKey === 'positive'

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">{t('asrs.resultsTitle')}</h1>

          {isPositive && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('asrs.results.screeningResult')}</AlertTitle>
              <AlertDescription>
                {t('asrs.results.interpretation.positive')}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('asrs.results.screeningResult')}: {t(`asrs.results.screening.${result.screeningKey}`)}</CardTitle>
              <CardDescription className="text-lg space-y-2">
                <div>{t('asrs.results.partAScore')}: {result.partAScore}/24 ({result.partAPositive} {t('asrs.results.questionsMarked') || 'questions marked Often/Very Often'})</div>
                <div>{t('asrs.results.partBScore')}: {result.partBScore}/48</div>
                <div>{t('asrs.results.totalScore')}: {result.totalScore}/72</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">{t(`asrs.results.interpretation.${result.interpretationKey}`)}</p>
              <p className="text-neutral-700">{t(`asrs.results.recommendation.${result.recommendationKey}`)}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t('asrs.results.disclaimer.title')}</AlertTitle>
                <AlertDescription>
                  {t('asrs.results.disclaimer.text')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href={`/${locale}/contact`}>{t('common.scheduleAppointment')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/education/adhd`}>{t('asrs.results.learnMore')}</Link>
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

  const partAQuestions = questions.filter(q => q.part === 'A')
  const partBQuestions = questions.filter(q => q.part === 'B')

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="mb-6">{t('asrs.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('asrs.about.title')}</AlertTitle>
          <AlertDescription>
            {t('asrs.about.text')}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('asrs.instructions.title')}</CardTitle>
            <CardDescription>
              {t('asrs.instructions.text')}
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Part A */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">{t('asrs.partA')}</CardTitle>
                <CardDescription>
                  {t('asrs.partADescription') || 'The following 6 questions are the most predictive of ADHD symptoms.'}
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
              </CardContent>
            </Card>

            {/* Part B */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-700">{t('asrs.partB')}</CardTitle>
                <CardDescription>
                  {t('asrs.partBDescription') || 'The following 12 questions provide additional clinical information.'}
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
