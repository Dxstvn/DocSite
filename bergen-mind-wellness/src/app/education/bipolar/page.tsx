import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function BipolarPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding Bipolar Disorder</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about bipolar disorder. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What is Bipolar Disorder?</h2>
          <p>
            Bipolar disorder is a mental health condition characterized by extreme mood swings
            that include emotional highs (mania or hypomania) and lows (depression). These mood
            episodes can affect sleep, energy, activity levels, judgment, behavior, and the ability
            to think clearly.
          </p>

          <p>
            <strong>Bipolar I Disorder</strong> involves at least one manic episode that may be
            preceded or followed by hypomanic or major depressive episodes.
            <strong> Bipolar II Disorder</strong> involves at least one major depressive episode
            and at least one hypomanic episode, but no full manic episodes.
          </p>

          <p>
            Bipolar disorder is a lifelong condition that requires ongoing treatment, but with
            proper management including medication, therapy, and lifestyle modifications, people
            with bipolar disorder can lead fulfilling, productive lives.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Manic Episode Symptoms:</h3>
                <ul>
                  <li>Elevated, expansive, or irritable mood</li>
                  <li>Increased energy and activity levels</li>
                  <li>Decreased need for sleep (feeling rested after 3 hours)</li>
                  <li>Racing thoughts and rapid speech</li>
                  <li>Grandiosity or inflated self-esteem</li>
                  <li>Distractibility</li>
                  <li>Increased goal-directed activity or agitation</li>
                  <li>Engaging in risky behaviors (spending sprees, reckless driving, impulsive decisions)</li>
                </ul>

                <h3>Hypomanic Episode Symptoms:</h3>
                <p>
                  Similar to mania but less severe and shorter duration (at least 4 days).
                  Functioning is not as severely impaired, and there are no psychotic features.
                </p>

                <h3>Depressive Episode Symptoms:</h3>
                <ul>
                  <li>Persistent sad, empty, or hopeless mood</li>
                  <li>Loss of interest in activities</li>
                  <li>Significant weight changes or appetite changes</li>
                  <li>Sleep disturbances (insomnia or hypersomnia)</li>
                  <li>Fatigue or loss of energy</li>
                  <li>Feelings of worthlessness or guilt</li>
                  <li>Difficulty thinking or concentrating</li>
                  <li>Thoughts of death or suicide</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>Treatment Options</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Medication (Primary Treatment)</h3>
                <ul>
                  <li><strong>Mood Stabilizers:</strong> Lithium, lamotrigine (Lamictal), valproate (Depakote)</li>
                  <li><strong>Atypical Antipsychotics:</strong> Quetiapine (Seroquel), lurasidone (Latuda), aripiprazole (Abilify)</li>
                  <li><strong>Combination Therapy:</strong> Often requires multiple medications for optimal control</li>
                </ul>

                <h3>Psychotherapy</h3>
                <ul>
                  <li><strong>Psychoeducation:</strong> Understanding bipolar disorder, recognizing early warning signs</li>
                  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Identifying triggers, developing coping strategies</li>
                  <li><strong>Family-Focused Therapy:</strong> Improving communication and problem-solving</li>
                  <li><strong>Interpersonal and Social Rhythm Therapy (IPSRT):</strong> Stabilizing daily routines and sleep</li>
                </ul>

                <h3>Lifestyle Management</h3>
                <ul>
                  <li>Consistent sleep-wake schedule (critical for mood stability)</li>
                  <li>Avoiding alcohol and recreational drugs</li>
                  <li>Stress reduction techniques</li>
                  <li>Regular exercise</li>
                  <li>Mood tracking and early warning sign monitoring</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Mood Stabilizers:</h3>
                <p>
                  <strong>Lithium:</strong> Gold standard for bipolar treatment. Requires regular
                  blood level monitoring to ensure therapeutic range and prevent toxicity. Side
                  effects may include tremor, weight gain, increased thirst and urination.
                </p>

                <p>
                  <strong>Lamotrigine:</strong> Particularly effective for bipolar depression.
                  Requires slow titration to minimize rash risk. Generally well-tolerated.
                </p>

                <h3>Atypical Antipsychotics:</h3>
                <p>
                  Effective for treating acute mania and preventing relapse. Common side effects
                  include weight gain, metabolic changes (monitor blood sugar and lipids), and
                  sedation.
                </p>

                <h3>Important Considerations:</h3>
                <ul>
                  <li>Medication adherence is critical; stopping medication often leads to relapse</li>
                  <li>Regular blood work and monitoring required for many bipolar medications</li>
                  <li>Antidepressants alone can trigger mania; always use with mood stabilizer if prescribed</li>
                  <li>Pregnancy planning requires specialized care due to medication considerations</li>
                  <li>Work closely with a psychiatrist experienced in treating bipolar disorder</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crisis-management">
            <AccordionTrigger>Crisis Management & Warning Signs</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Warning Signs of Mania:</h3>
                <ul>
                  <li>Decreased sleep without feeling tired</li>
                  <li>Increased energy and activity</li>
                  <li>Irritability or agitation</li>
                  <li>Racing thoughts</li>
                  <li>Impulsive or risky behaviors</li>
                </ul>

                <h3>Warning Signs of Depression:</h3>
                <ul>
                  <li>Withdrawal from social activities</li>
                  <li>Increased sleep or difficulty getting out of bed</li>
                  <li>Loss of interest in previously enjoyed activities</li>
                  <li>Negative thinking patterns</li>
                  <li>Thoughts of death or suicide</li>
                </ul>

                <h3>When to Seek Emergency Care:</h3>
                <ul>
                  <li>Thoughts of harming yourself or others</li>
                  <li>Psychotic symptoms (hallucinations, delusions)</li>
                  <li>Severe agitation or inability to care for yourself</li>
                  <li>Dangerous risk-taking behaviors</li>
                </ul>

                <p>
                  Developing a crisis plan with your treatment team and loved ones can help
                  identify early warning signs and intervene before episodes become severe.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>Evidence-Based Resources</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.dbsalliance.org/" target="_blank" rel="noopener noreferrer">
                      Depression and Bipolar Support Alliance (DBSA)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/bipolar-disorder" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Bipolar Disorder
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Bipolar-Disorder" target="_blank" rel="noopener noreferrer">
                      National Alliance on Mental Illness (NAMI) - Bipolar Disorder
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/mdq">Take Bipolar Screening (MDQ)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
