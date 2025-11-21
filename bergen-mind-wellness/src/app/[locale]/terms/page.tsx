import type { Metadata } from 'next'
import Link from 'next/link'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Terms of Service | Bergen Mind & Wellness',
  description: 'Terms of Service for Bergen Mind & Wellness. Read our terms and conditions for using our website and mental health services.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['legal'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Terms of Service</h1>

        <div className="prose">
          <p className="text-sm text-neutral-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using the Bergen Mind & Wellness, LLC website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
          </p>

          <h2>Description of Services</h2>
          <p>
            Bergen Mind & Wellness provides mental health services including psychiatric evaluation, medication management, and supportive therapy. Our website offers educational resources, self-assessment tools, and appointment scheduling.
          </p>

          <h2>Eligibility</h2>
          <p>
            Our Services are available to:
          </p>
          <ul>
            <li>Adults (18 years and older)</li>
            <li>Adolescents (13-17 years) with parental/guardian consent</li>
            <li>Individuals located in the State of New Jersey</li>
          </ul>
          <p>
            By using our Services, you represent that you meet these eligibility requirements.
          </p>

          <h2>Provider-Patient Relationship</h2>

          <h3>Establishment of Care</h3>
          <p>
            A provider-patient relationship is established only after:
          </p>
          <ul>
            <li>Completion of an initial psychiatric evaluation</li>
            <li>Mutual agreement to proceed with treatment</li>
            <li>Execution of required consent forms</li>
          </ul>

          <h3>Not Medical Advice</h3>
          <p>
            Information on our website is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personalized medical guidance.
          </p>

          <h3>No Emergency Services</h3>
          <p>
            <strong>Our Services are not for medical emergencies.</strong> If you are experiencing a mental health crisis:
          </p>
          <ul>
            <li>Call 911 for immediate emergency assistance</li>
            <li>Call 988 for the Suicide & Crisis Lifeline</li>
            <li>Text HOME to 741741 for Crisis Text Line</li>
            <li>Go to your nearest emergency room</li>
          </ul>

          <h2>Use of Website</h2>

          <h3>Permitted Use</h3>
          <p>You may use our website for:</p>
          <ul>
            <li>Accessing educational mental health information</li>
            <li>Completing self-assessment screening tools</li>
            <li>Scheduling appointments</li>
            <li>Contacting our practice</li>
          </ul>

          <h3>Prohibited Use</h3>
          <p>You may NOT:</p>
          <ul>
            <li>Use our Services for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Transmit viruses, malware, or harmful code</li>
            <li>Scrape, copy, or redistribute our content without permission</li>
            <li>Impersonate another person or misrepresent your affiliation</li>
            <li>Harass, abuse, or harm others through our Services</li>
          </ul>

          <h2>Screening Tools and Self-Assessments</h2>
          <p>
            Our website offers validated mental health screening tools (PHQ-9, GAD-7, ASRS, MDQ, PCL-5). These tools:
          </p>
          <ul>
            <li>Are processed entirely in your browser for privacy</li>
            <li>Provide educational information only, not diagnoses</li>
            <li>Do not replace professional evaluation</li>
            <li>Should not be used for self-diagnosis or treatment decisions</li>
          </ul>
          <p>
            If screening results suggest mental health concerns, please schedule an appointment with a qualified healthcare provider.
          </p>

          <h2>Appointment Scheduling and Cancellations</h2>

          <h3>Scheduling</h3>
          <p>
            Appointments are confirmed only when you receive confirmation from our practice. Submitting a contact form does not guarantee appointment availability.
          </p>

          <h3>Cancellations</h3>
          <p>
            Please provide at least 24 hours notice for appointment cancellations. Late cancellations or no-shows may result in fees as outlined in our practice policies.
          </p>

          <h2>Insurance and Payment</h2>
          <p>
            We accept the following insurance plans: Aetna, Carelon Behavioral Health, Cigna, Independence Blue Cross Pennsylvania, and Quest Behavioral Health. Insurance coverage and benefits vary; please verify your specific coverage before scheduling.
          </p>
          <p>
            Payment is due at the time of service. You are responsible for any co-pays, deductibles, or non-covered services.
          </p>

          <h2>Telehealth Services</h2>
          <p>
            We offer virtual appointments via HIPAA-compliant telehealth platforms. By participating in telehealth:
          </p>
          <ul>
            <li>You consent to receiving care via video conferencing</li>
            <li>You are responsible for ensuring a private, confidential location</li>
            <li>You must be physically located in New Jersey during the appointment</li>
            <li>Technical issues may require rescheduling without penalty</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website—including text, graphics, logos, images, and software—is the property of Bergen Mind & Wellness, LLC or its licensors and is protected by copyright and intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website contains links to third-party resources for educational purposes. We do not endorse or assume responsibility for third-party content, services, or privacy practices. Use of third-party websites is at your own risk.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            Our Services are provided "as is" without warranties of any kind, express or implied. We do not guarantee that:
          </p>
          <ul>
            <li>Our website will be error-free or uninterrupted</li>
            <li>Defects will be corrected</li>
            <li>Our website is free of viruses or harmful components</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Bergen Mind & Wellness, LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services, even if we have been advised of the possibility of such damages.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Bergen Mind & Wellness, LLC and its employees from any claims, damages, losses, or expenses (including legal fees) arising from your violation of these Terms or misuse of our Services.
          </p>

          <h2>HIPAA and Privacy</h2>
          <p>
            Your privacy and the confidentiality of your health information are protected under HIPAA. Please review our{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Privacy Policy
            </Link>{' '}
            for details on how we collect, use, and protect your information.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of our Services after changes constitutes acceptance of the revised Terms.
          </p>

          <h2>Termination</h2>
          <p>
            We may suspend or terminate your access to our Services at any time for violations of these Terms or for any other reason at our sole discretion.
          </p>
          <p>
            Either party may terminate the provider-patient relationship with appropriate notice as outlined in our practice policies and in accordance with professional ethical standards.
          </p>

          <h2>Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the State of New Jersey, without regard to conflict of law principles.
          </p>
          <p>
            Any disputes arising from these Terms or use of our Services shall be resolved through binding arbitration in Bergen County, New Jersey, except where prohibited by law or for claims that may be brought in small claims court.
          </p>

          <h2>Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
          </p>

          <h2>Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy and any additional agreements executed in connection with our Services, constitute the entire agreement between you and Bergen Mind & Wellness, LLC.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-none">
            <li><strong>Bergen Mind & Wellness, LLC</strong></li>
            <li>Bergen County, New Jersey</li>
            <li>
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                Contact Form
              </Link>
            </li>
          </ul>

          <p className="mt-8 text-sm text-neutral-600">
            By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
