import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Languages, Users, Pill } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">About Bergen Mind & Wellness</h1>

        <div className="prose mb-12">
          <p className="text-lg">
            Bergen Mind & Wellness, LLC provides compassionate, evidence-based mental health
            care to individuals in New Jersey. Our approach combines clinical expertise with
            a holistic understanding of mental wellness, focusing on the connection between
            mind, body, and emotions.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src="/images/team/rocio-jenkins.png"
                  alt="Rocio Jenkins, PMHNP-BC, Board-Certified Psychiatric-Mental Health Nurse Practitioner"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="rounded-full object-cover border-4 border-primary-100 shadow-md"
                  priority={false}
                />
              </div>

              {/* Name and Title */}
              <div className="flex-1 text-center md:text-left">
                <CardTitle>Rocio Jenkins, PMHNP-BC</CardTitle>
                <CardDescription>Board-Certified Psychiatric-Mental Health Nurse Practitioner</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About Rocio</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  I'm Rocio Jenkins, PMHNP-BC, a board-certified Psychiatric-Mental Health Nurse
                  Practitioner passionate about helping individuals find clarity, stability, and
                  peace of mind. I take a <strong>holistic, person-centered approach</strong>,
                  focusing on the connection between mind, body, and emotions.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  I specialize in working with <strong>adults and adolescents</strong> experiencing
                  anxiety, depression, ADHD, and trauma-related concerns. My treatment style blends
                  compassionate listening, supportive therapy, and individualized medication management.
                  I aim to create a partnership where clients feel heard, respected, and supported
                  throughout their journey.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Education & Credentials</h3>
                <ul className="space-y-1 text-neutral-600">
                  <li>MSN (Master of Science in Nursing), Chamberlain University</li>
                  <li>Advanced Practice Nurse (APN), State of New Jersey</li>
                  <li>Board-Certified Psychiatric-Mental Health Nurse Practitioner (PMHNP-BC)</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 border-t pt-6">
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Languages</h4>
                    <p className="text-sm text-neutral-600">English, Spanish</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Age Groups</h4>
                    <p className="text-sm text-neutral-600">Adolescents, Adults, Seniors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pill className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Services</h4>
                    <p className="text-sm text-neutral-600">Virtual Sessions, Medication Management</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Areas of Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Depression</Badge>
                  <Badge>Anxiety</Badge>
                  <Badge>ADHD</Badge>
                  <Badge>PTSD & Trauma</Badge>
                  <Badge>Bipolar Disorder</Badge>
                  <Badge>OCD</Badge>
                  <Badge>Panic Disorders</Badge>
                  <Badge>Eating Disorders</Badge>
                  <Badge>Maternal Mental Health</Badge>
                  <Badge>LGBTQIA+</Badge>
                  <Badge>Grief & Loss</Badge>
                  <Badge>Cultural & Ethnic Issues</Badge>
                  <Badge>Sleep Disorders</Badge>
                  <Badge>Stress Management</Badge>
                  <Badge>Anger Management</Badge>
                  <Badge>Chronic Conditions</Badge>
                  <Badge>Family Issues</Badge>
                  <Badge>Physical Health Issues</Badge>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Treatment Modalities</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Cognitive Behavioral Therapy (CBT)</Badge>
                  <Badge variant="outline">Behavioral Activation (BA)</Badge>
                  <Badge variant="outline">Mindfulness-Based Cognitive Therapy (MBCT)</Badge>
                  <Badge variant="outline">Psychodynamic Therapy</Badge>
                  <Badge variant="outline">Gestalt Therapy</Badge>
                  <Badge variant="outline">Multi-Systemic Therapy (MST)</Badge>
                  <Badge variant="outline">Behavior Management</Badge>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Therapeutic Style</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">Empowering</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">Open-minded</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="font-semibold text-primary-900">Holistic</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose mb-12">
          <h2>My Approach to Care</h2>
          <p>
            My approach is <strong>holistic, collaborative, and compassionate</strong>. I take time to
            truly listen and understand each client's unique story, considering biological, psychological,
            and social factors that impact mental health. Together, we develop an individualized treatment
            plan that may include <strong>medication management, lifestyle support, and therapeutic guidance</strong>.
          </p>
          <p>
            I believe in <strong>partnership</strong>—clients are active participants in their care, and
            my role is to provide education, support, and evidence-based tools to help them reach stability
            and emotional well-being.
          </p>

          <h2>What to Expect from Your First Session</h2>
          <p>
            During our first session, my goal is to create a <strong>safe, welcoming, and judgment-free
            environment</strong> where you can share what's been happening in your life and what brings
            you to care. I'll take the time to listen carefully to your concerns, review your medical and
            mental health history, and begin to understand how symptoms are affecting your daily life.
          </p>
          <p>
            Together, we'll <strong>clarify your goals</strong>, discuss potential treatment options,
            including therapy, medication, or lifestyle changes, and develop an individualized plan that
            feels comfortable and achievable for you.
          </p>
          <p>
            You can expect to leave your first session feeling <strong>heard, understood, and supported</strong>,
            with clear next steps toward balance and wellness.
          </p>

          <h2>Medication Management</h2>
          <p>
            As a board-certified Psychiatric-Mental Health Nurse Practitioner, I am licensed to prescribe
            medication as part of comprehensive mental health treatment. Medication management is integrated
            with supportive therapy and lifestyle guidance to provide holistic care tailored to your unique needs.
          </p>
        </div>

        <Alert className="mb-8">
          <AlertDescription>
            <h3 className="font-semibold mb-2">Insurance Accepted</h3>
            <p className="text-sm mb-2">
              We accept the following insurance plans for mental health services:
            </p>
            <ul className="text-sm space-y-1">
              <li>• Aetna</li>
              <li>• Carelon Behavioral Health</li>
              <li>• Cigna</li>
              <li>• Independence Blue Cross Pennsylvania</li>
              <li>• Quest Behavioral Health</li>
            </ul>
            <p className="text-sm mt-3">
              Please contact us to verify your specific coverage and benefits.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
