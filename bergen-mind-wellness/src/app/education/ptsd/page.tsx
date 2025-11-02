import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function PTSDPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding PTSD</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about PTSD. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What is PTSD?</h2>
          <p>
            Post-Traumatic Stress Disorder (PTSD) is a mental health condition that can develop
            after experiencing or witnessing a traumatic event. Traumatic events may include
            combat, natural disasters, serious accidents, physical or sexual assault, or any
            life-threatening situation.
          </p>

          <p>
            PTSD is not a sign of weakness—it's a normal response to abnormal and overwhelming
            circumstances. The brain's natural stress response becomes disrupted after trauma,
            leading to persistent symptoms that interfere with daily life. With proper treatment,
            recovery is possible, and many people with PTSD go on to heal and thrive.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>
                  PTSD symptoms typically begin within 3 months of the traumatic event but may
                  appear later. Symptoms must last more than one month and be severe enough to
                  interfere with relationships or work.
                </p>

                <h3>Re-experiencing (Intrusive Symptoms):</h3>
                <ul>
                  <li>Flashbacks—reliving the traumatic event</li>
                  <li>Nightmares or disturbing dreams</li>
                  <li>Intrusive, distressing memories</li>
                  <li>Severe emotional distress when reminded of trauma</li>
                  <li>Physical reactions to trauma reminders (sweating, rapid heartbeat)</li>
                </ul>

                <h3>Avoidance:</h3>
                <ul>
                  <li>Avoiding thoughts, feelings, or conversations about the trauma</li>
                  <li>Avoiding people, places, or activities that trigger memories</li>
                  <li>Emotional numbing or detachment</li>
                  <li>Difficulty remembering important aspects of the traumatic event</li>
                </ul>

                <h3>Negative Changes in Thinking and Mood:</h3>
                <ul>
                  <li>Negative beliefs about oneself, others, or the world</li>
                  <li>Persistent negative emotions (fear, horror, anger, guilt, shame)</li>
                  <li>Loss of interest in previously enjoyed activities</li>
                  <li>Feeling detached from others</li>
                  <li>Inability to experience positive emotions</li>
                </ul>

                <h3>Hyperarousal (Increased Reactivity):</h3>
                <ul>
                  <li>Hypervigilance (constantly on guard)</li>
                  <li>Exaggerated startle response</li>
                  <li>Irritability or angry outbursts</li>
                  <li>Reckless or self-destructive behavior</li>
                  <li>Sleep disturbances</li>
                  <li>Difficulty concentrating</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>Treatment Options</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Trauma-Focused Psychotherapy (Most Effective):</h3>
                <ul>
                  <li>
                    <strong>Cognitive Processing Therapy (CPT):</strong> Helps process the trauma
                    and challenge unhelpful beliefs about the traumatic event
                  </li>
                  <li>
                    <strong>Prolonged Exposure (PE):</strong> Gradual, repeated exposure to trauma
                    memories and reminders in a safe, controlled way to reduce fear response
                  </li>
                  <li>
                    <strong>Eye Movement Desensitization and Reprocessing (EMDR):</strong> Processes
                    traumatic memories using bilateral stimulation (eye movements, taps, sounds)
                  </li>
                  <li>
                    <strong>Trauma-Focused Cognitive Behavioral Therapy (TF-CBT):</strong> Combines
                    CBT techniques with trauma-specific interventions
                  </li>
                </ul>

                <h3>Medication:</h3>
                <ul>
                  <li><strong>SSRIs:</strong> Sertraline (Zoloft) and paroxetine (Paxil) are FDA-approved for PTSD</li>
                  <li><strong>Prazosin:</strong> Can reduce nightmares and improve sleep</li>
                  <li>Medication is often used alongside therapy for optimal results</li>
                </ul>

                <h3>Complementary Approaches:</h3>
                <ul>
                  <li>Mindfulness and meditation</li>
                  <li>Yoga and body-based therapies</li>
                  <li>Grounding techniques for managing flashbacks</li>
                  <li>Support groups with other trauma survivors</li>
                  <li>Service animals for veterans with PTSD</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trauma-informed-care">
            <AccordionTrigger>Trauma-Informed Care Principles</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>
                  Effective PTSD treatment follows trauma-informed care principles that prioritize
                  safety, choice, and empowerment:
                </p>

                <h3>Safety First:</h3>
                <ul>
                  <li>Creating physical and emotional safety before processing trauma memories</li>
                  <li>Establishing coping skills and crisis plans</li>
                  <li>Ensuring current safety (domestic violence, self-harm risks addressed)</li>
                </ul>

                <h3>Client Control:</h3>
                <ul>
                  <li>You control the pace and depth of trauma disclosure</li>
                  <li>No pressure to share details you're not ready to discuss</li>
                  <li>You can pause or stop at any time during therapy</li>
                </ul>

                <h3>Stabilization Before Trauma Processing:</h3>
                <ul>
                  <li>Building emotion regulation skills</li>
                  <li>Developing healthy coping strategies</li>
                  <li>Addressing substance use, self-harm, or safety concerns</li>
                  <li>Only when stable will trauma-focused work begin</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>SSRIs for PTSD:</h3>
                <p>
                  Selective serotonin reuptake inhibitors can help reduce PTSD symptoms including
                  intrusive thoughts, avoidance, negative mood, and hyperarousal. They take 4-6
                  weeks to reach full effectiveness.
                </p>

                <h3>Prazosin for Nightmares:</h3>
                <p>
                  Prazosin is an alpha-blocker that can significantly reduce PTSD-related nightmares
                  and improve sleep quality. It's taken before bedtime and may require dose adjustment.
                </p>

                <h3>Medications to Avoid:</h3>
                <ul>
                  <li>
                    <strong>Benzodiazepines:</strong> Not recommended for PTSD as they can interfere
                    with trauma processing and have addiction potential
                  </li>
                  <li>Long-term use of sleep medications without addressing underlying trauma</li>
                </ul>

                <h3>Important Considerations:</h3>
                <ul>
                  <li>Medication alone is less effective than therapy alone for PTSD</li>
                  <li>Combination of medication and trauma-focused therapy is often most effective</li>
                  <li>Work with a psychiatrist experienced in treating trauma</li>
                  <li>Regular monitoring for side effects and treatment response</li>
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
                    <a href="https://www.ptsd.va.gov/" target="_blank" rel="noopener noreferrer">
                      National Center for PTSD (U.S. Department of Veterans Affairs)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - PTSD
                    </a>
                  </li>
                  <li>
                    <a href="https://istss.org/" target="_blank" rel="noopener noreferrer">
                      International Society for Traumatic Stress Studies (ISTSS)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.rainn.org/" target="_blank" rel="noopener noreferrer">
                      RAINN (Rape, Abuse & Incest National Network) - For sexual assault survivors
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/pcl-5">Take PTSD Screening (PCL-5)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
