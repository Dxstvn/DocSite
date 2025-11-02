import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function ADHDPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding ADHD</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about ADHD. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What is ADHD?</h2>
          <p>
            Attention-Deficit/Hyperactivity Disorder (ADHD) is a neurodevelopmental condition
            characterized by persistent patterns of inattention, hyperactivity, and impulsivity.
            While often diagnosed in childhood, many adults continue to experience symptoms that
            impact work, relationships, and daily functioning.
          </p>

          <p>
            ADHD affects executive functions—the brain's ability to plan, organize, focus, and
            regulate emotions. With proper treatment including medication, therapy, and behavioral
            strategies, individuals with ADHD can thrive and achieve their goals.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Inattention Symptoms:</h3>
                <ul>
                  <li>Difficulty sustaining attention on tasks</li>
                  <li>Easily distracted by external stimuli</li>
                  <li>Forgetfulness in daily activities</li>
                  <li>Difficulty organizing tasks and managing time</li>
                  <li>Frequently losing important items</li>
                  <li>Avoiding tasks that require sustained mental effort</li>
                  <li>Difficulty following through on instructions</li>
                </ul>

                <h3>Hyperactivity/Impulsivity Symptoms:</h3>
                <ul>
                  <li>Restlessness or feeling driven by a motor</li>
                  <li>Difficulty staying seated when expected</li>
                  <li>Excessive talking</li>
                  <li>Interrupting or intruding on others</li>
                  <li>Difficulty waiting turn</li>
                  <li>Acting without thinking about consequences</li>
                  <li>Fidgeting with hands or feet</li>
                </ul>

                <p>
                  ADHD presents differently in adults than children, often with less visible
                  hyperactivity and more internal restlessness and executive function challenges.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>Treatment Options</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Medication</h3>
                <ul>
                  <li><strong>Stimulants:</strong> Methylphenidate (Ritalin, Concerta) and amphetamines (Adderall, Vyvanse)—most effective for symptom management</li>
                  <li><strong>Non-stimulants:</strong> Atomoxetine (Strattera), guanfacine, clonidine—alternative options with different side effect profiles</li>
                </ul>

                <h3>Behavioral Strategies</h3>
                <ul>
                  <li><strong>Organizational skills training:</strong> Time management, task prioritization, calendar systems</li>
                  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Addressing negative thought patterns and procrastination</li>
                  <li><strong>ADHD coaching:</strong> Accountability and skill-building support</li>
                  <li><strong>Structured routines:</strong> Creating predictable daily schedules</li>
                </ul>

                <h3>Lifestyle Modifications</h3>
                <ul>
                  <li>Regular exercise (particularly aerobic activity)</li>
                  <li>Consistent sleep schedule (ADHD often co-occurs with sleep disorders)</li>
                  <li>Minimizing distractions in work/study environments</li>
                  <li>Breaking large tasks into smaller, manageable steps</li>
                  <li>Using timers and external reminders</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Stimulant Medications:</h3>
                <p>
                  Stimulants increase dopamine and norepinephrine in the brain, improving focus,
                  impulse control, and executive function. They work quickly (often within 30-60 minutes)
                  and are highly effective for 70-80% of people with ADHD.
                </p>

                <h3>Common Side Effects:</h3>
                <ul>
                  <li>Decreased appetite</li>
                  <li>Sleep difficulties (take early in day)</li>
                  <li>Increased heart rate or blood pressure (requires monitoring)</li>
                  <li>Irritability or mood changes</li>
                  <li>Dry mouth</li>
                </ul>

                <h3>Non-Stimulant Medications:</h3>
                <p>
                  Non-stimulants like atomoxetine take longer to work (several weeks) but provide
                  24-hour coverage and have lower abuse potential. They may be preferred for people
                  with anxiety, substance use history, or cardiovascular concerns.
                </p>

                <h3>Important Considerations:</h3>
                <ul>
                  <li>Medication is most effective when combined with behavioral strategies</li>
                  <li>Finding the right medication and dose may take time and adjustment</li>
                  <li>Regular follow-ups with your prescriber are essential</li>
                  <li>Stimulants are controlled substances; follow prescription guidelines carefully</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="living-with-adhd">
            <AccordionTrigger>Living with ADHD</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Workplace Accommodations:</h3>
                <ul>
                  <li>Flexible work schedules</li>
                  <li>Quiet workspace or noise-canceling headphones</li>
                  <li>Written instructions and checklists</li>
                  <li>Regular check-ins with supervisors</li>
                  <li>Breaking projects into smaller milestones</li>
                </ul>

                <h3>Time Management Tools:</h3>
                <ul>
                  <li>Digital calendars with alerts and reminders</li>
                  <li>Task management apps (Todoist, Things, Asana)</li>
                  <li>Pomodoro technique (25-minute focused work intervals)</li>
                  <li>Visual timers and time-blocking</li>
                </ul>

                <h3>Support Resources:</h3>
                <ul>
                  <li>ADHD support groups (in-person or online)</li>
                  <li>ADHD coaches or accountability partners</li>
                  <li>Educational resources for family members</li>
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
                    <a href="https://chadd.org/" target="_blank" rel="noopener noreferrer">
                      Children and Adults with Attention-Deficit/Hyperactivity Disorder (CHADD)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - ADHD
                    </a>
                  </li>
                  <li>
                    <a href="https://add.org/" target="_blank" rel="noopener noreferrer">
                      Attention Deficit Disorder Association (ADDA)
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/asrs">Take ADHD Screening (ASRS)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
