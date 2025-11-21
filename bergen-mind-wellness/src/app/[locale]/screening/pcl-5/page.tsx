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
import { calculatePCL5, type PCL5Result } from '@/lib/screening/pcl5'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(4)).length(20),
})



export default function PCL5Page() {
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation('screening')

  const [result, setResult] = useState<PCL5Result | null>(null)

  // Define questions with translation keys
  const questions = [
    { id: 1, key: 'pcl5.questions.q1' },
    { id: 2, key: 'pcl5.questions.q2' },
    { id: 3, key: 'pcl5.questions.q3' },
    { id: 4, key: 'pcl5.questions.q4' },
    { id: 5, key: 'pcl5.questions.q5' },
    { id: 6, key: 'pcl5.questions.q6' },
    { id: 7, key: 'pcl5.questions.q7' },
    { id: 8, key: 'pcl5.questions.q8' },
    { id: 9, key: 'pcl5.questions.q9' },
    { id: 10, key: 'pcl5.questions.q10' },
    { id: 11, key: 'pcl5.questions.q11' },
    { id: 12, key: 'pcl5.questions.q12' },
    { id: 13, key: 'pcl5.questions.q13' },
    { id: 14, key: 'pcl5.questions.q14' },
    { id: 15, key: 'pcl5.questions.q15' },
    { id: 16, key: 'pcl5.questions.q16' },
    { id: 17, key: 'pcl5.questions.q17' },
    { id: 18, key: 'pcl5.questions.q18' },
    { id: 19, key: 'pcl5.questions.q19' },
    { id: 20, key: 'pcl5.questions.q20' },
  ]

  // Define options with translation keys
  const options = [
    { value: 0, key: 'pcl5.options.notAtAll' },
    { value: 1, key: 'pcl5.options.aLittleBit' },
    { value: 2, key: 'pcl5.options.moderately' },
    { value: 3, key: 'pcl5.options.quiteABit' },
    { value: 4, key: 'pcl5.options.extremely' },
  ]

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
          <h1 className="mb-8">{t('pcl5.resultsTitle')}</h1>

          {isSevere && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('pcl5.results.severeAlert.title')}</AlertTitle>
              <AlertDescription>
                {t('pcl5.results.severeAlert.text')}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('pcl5.results.yourScore')}: {result.totalScore}/80</CardTitle>
              <CardDescription className="text-lg">
                {result.provisionalDiagnosis
                  ? t('pcl5.results.provisionalDiagnosis.positive')
                  : t('pcl5.results.provisionalDiagnosis.negative')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('pcl5.results.symptomClusters')}:</h3>
                <ul className="space-y-1 text-sm text-neutral-700">
                  <li>{t('pcl5.clusters.reexperiencing')}: {result.clusterScores.reexperiencing}/20</li>
                  <li>{t('pcl5.clusters.avoidance')}: {result.clusterScores.avoidance}/8</li>
                  <li>{t('pcl5.clusters.negativeCognitions')}: {result.clusterScores.negative_cognitions}/28</li>
                  <li>{t('pcl5.clusters.arousal')}: {result.clusterScores.arousal}/24</li>
                </ul>
              </div>

              <p className="text-neutral-700">{t(`pcl5.results.interpretation.${result.interpretationKey}`)}</p>
              <p className="text-neutral-700">{t(`pcl5.results.recommendation.${result.recommendationKey}`)}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t('pcl5.results.disclaimer.title')}</AlertTitle>
                <AlertDescription>
                  {t('pcl5.results.disclaimer.text')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href={`/${locale}/contact`}>{t('common.scheduleAppointment')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/education/ptsd`}>{t('pcl5.results.learnMore')}</Link>
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
        <h1 className="mb-6">{t('pcl5.title')}</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('pcl5.about.title')}</AlertTitle>
          <AlertDescription>
            {t('pcl5.about.text')}
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pcl5.instructions.title')}</CardTitle>
            <CardDescription>
              {t('pcl5.instructions.text')}
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
