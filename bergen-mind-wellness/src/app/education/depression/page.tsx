import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function DepressionPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding Depression</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about depression. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What is Depression?</h2>
          <p>
            Major depressive disorder (MDD) is a common but serious mood disorder that affects
            how you feel, think, and handle daily activities. It's characterized by persistent
            sadness and loss of interest in previously enjoyed activities.
          </p>

          <p>
            Depression affects approximately 21 million adults in the United States, making it
            one of the most common mental health conditions. The good news: depression is highly
            treatable with therapy, medication, or a combination of both.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>Symptoms of depression may include:</p>
                <ul>
                  <li>Persistent sad, anxious, or "empty" mood</li>
                  <li>Loss of interest or pleasure in hobbies and activities</li>
                  <li>Decreased energy or fatigue</li>
                  <li>Difficulty concentrating, remembering, or making decisions</li>
                  <li>Changes in sleep patterns (insomnia or oversleeping)</li>
                  <li>Changes in appetite or weight</li>
                  <li>Feelings of worthlessness or excessive guilt</li>
                  <li>Thoughts of death or suicide</li>
                </ul>
                <p>
                  If you experience five or more of these symptoms for at least two weeks,
                  consult a mental health professional for evaluation.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>Treatment Options</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Psychotherapy</h3>
                <ul>
                  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps identify and change negative thought patterns</li>
                  <li><strong>Interpersonal Therapy (IPT):</strong> Focuses on improving relationships and social functioning</li>
                  <li><strong>Behavioral Activation:</strong> Increases engagement in positive activities</li>
                </ul>

                <h3>Medication</h3>
                <ul>
                  <li><strong>SSRIs:</strong> Selective serotonin reuptake inhibitors (e.g., fluoxetine, sertraline)</li>
                  <li><strong>SNRIs:</strong> Serotonin-norepinephrine reuptake inhibitors (e.g., venlafaxine, duloxetine)</li>
                  <li><strong>Atypical antidepressants:</strong> Bupropion, mirtazapine</li>
                </ul>

                <h3>Lifestyle Modifications</h3>
                <ul>
                  <li>Regular exercise (30 minutes, 3-5 times per week)</li>
                  <li>Consistent sleep schedule</li>
                  <li>Social connection and support</li>
                  <li>Stress management techniques</li>
                  <li>Nutrition and brain-healthy foods</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management & Side Effects</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>
                  Antidepressant medications are often effective for moderate to severe depression.
                  They work by adjusting neurotransmitter levels in the brain.
                </p>

                <h3>Common Side Effects (vary by medication):</h3>
                <ul>
                  <li>Nausea (usually temporary)</li>
                  <li>Weight changes</li>
                  <li>Sleep changes (insomnia or drowsiness)</li>
                  <li>Sexual side effects</li>
                  <li>Dry mouth</li>
                </ul>

                <h3>Important Notes:</h3>
                <ul>
                  <li>Medications typically take 4-6 weeks to show full effects</li>
                  <li>Never stop antidepressants abruptly (risk of discontinuation syndrome)</li>
                  <li>Work closely with your prescriber to find the right medication and dosage</li>
                  <li>Report any concerning side effects immediately</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>Evidence-Based Resources</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://www.apa.org/topics/depression" target="_blank" rel="noopener noreferrer">
                      American Psychological Association (APA) - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression" target="_blank" rel="noopener noreferrer">
                      National Alliance on Mental Illness (NAMI) - Depression
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/phq-9">Take Depression Screening (PHQ-9)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
