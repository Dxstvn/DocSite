import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function AnxietyPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding Anxiety Disorders</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about anxiety disorders. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What are Anxiety Disorders?</h2>
          <p>
            Anxiety disorders are the most common mental health conditions in the United States,
            affecting approximately 40 million adults. While everyone experiences anxiety from time
            to time, anxiety disorders involve persistent, excessive worry that interferes with
            daily activities.
          </p>

          <p>
            Anxiety disorders include generalized anxiety disorder (GAD), panic disorder, social
            anxiety disorder, and specific phobias. The good news: anxiety disorders are highly
            treatable with therapy, medication, or a combination of both.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>Symptoms of anxiety disorders may include:</p>
                <ul>
                  <li>Excessive worry or fear that's difficult to control</li>
                  <li>Restlessness or feeling on edge</li>
                  <li>Muscle tension</li>
                  <li>Difficulty concentrating or mind going blank</li>
                  <li>Sleep disturbances</li>
                  <li>Panic attacks (sudden intense fear with physical symptoms)</li>
                  <li>Avoidance of situations that trigger anxiety</li>
                  <li>Physical symptoms: rapid heartbeat, sweating, trembling, shortness of breath</li>
                </ul>
                <p>
                  If anxiety significantly impacts your daily life, relationships, or work,
                  consider consulting a mental health professional.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types">
            <AccordionTrigger>Types of Anxiety Disorders</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Generalized Anxiety Disorder (GAD)</h3>
                <p>
                  Persistent, excessive worry about various aspects of daily life (work, health,
                  relationships) lasting at least 6 months.
                </p>

                <h3>Panic Disorder</h3>
                <p>
                  Recurrent unexpected panic attacks—sudden episodes of intense fear accompanied
                  by physical symptoms like rapid heartbeat, sweating, and chest pain.
                </p>

                <h3>Social Anxiety Disorder</h3>
                <p>
                  Intense fear of social situations where you might be judged, embarrassed, or
                  scrutinized by others.
                </p>

                <h3>Specific Phobias</h3>
                <p>
                  Excessive fear of specific objects or situations (e.g., heights, flying, animals)
                  that leads to avoidance behavior.
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
                  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps identify and challenge anxious thoughts</li>
                  <li><strong>Exposure Therapy:</strong> Gradual, controlled exposure to feared situations</li>
                  <li><strong>Acceptance and Commitment Therapy (ACT):</strong> Learning to accept anxiety while pursuing valued goals</li>
                  <li><strong>Relaxation Techniques:</strong> Deep breathing, progressive muscle relaxation, mindfulness</li>
                </ul>

                <h3>Medication</h3>
                <ul>
                  <li><strong>SSRIs:</strong> First-line treatment (e.g., escitalopram, sertraline)</li>
                  <li><strong>SNRIs:</strong> Effective for GAD (e.g., venlafaxine, duloxetine)</li>
                  <li><strong>Buspirone:</strong> Non-sedating anti-anxiety medication</li>
                  <li><strong>Beta-blockers:</strong> For performance anxiety and physical symptoms</li>
                </ul>

                <h3>Lifestyle Modifications</h3>
                <ul>
                  <li>Regular aerobic exercise</li>
                  <li>Mindfulness and meditation</li>
                  <li>Limiting caffeine and alcohol</li>
                  <li>Adequate sleep (7-9 hours)</li>
                  <li>Stress management techniques</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>
                  Medications for anxiety work by affecting neurotransmitters in the brain
                  that regulate mood and stress responses.
                </p>

                <h3>Important Considerations:</h3>
                <ul>
                  <li><strong>SSRIs/SNRIs:</strong> Take 4-6 weeks for full effect; first-line for long-term management</li>
                  <li><strong>Benzodiazepines:</strong> Fast-acting but only for short-term use due to dependency risk</li>
                  <li><strong>Buspirone:</strong> Non-addictive but takes several weeks to work</li>
                  <li><strong>Beta-blockers:</strong> Helpful for situational anxiety (e.g., public speaking)</li>
                </ul>

                <h3>Common Side Effects:</h3>
                <ul>
                  <li>Nausea (usually temporary)</li>
                  <li>Sleep changes</li>
                  <li>Sexual side effects (SSRIs/SNRIs)</li>
                  <li>Drowsiness (varies by medication)</li>
                </ul>

                <p>
                  Work with your healthcare provider to find the most effective medication with
                  minimal side effects. Never stop medication abruptly without medical supervision.
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
                    <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Anxiety Disorders
                    </a>
                  </li>
                  <li>
                    <a href="https://adaa.org/" target="_blank" rel="noopener noreferrer">
                      Anxiety and Depression Association of America (ADAA)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer">
                      American Psychological Association (APA) - Anxiety
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/gad-7">Take Anxiety Screening (GAD-7)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
