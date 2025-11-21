import type { Metadata } from 'next'
import Link from 'next/link'
import { initTranslations } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Privacy Policy | Bergen Mind & Wellness',
  description: 'Bergen Mind & Wellness privacy policy. Learn how we protect your personal health information and maintain HIPAA compliance.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params
  const { t } = await initTranslations(locale, ['legal'])

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Privacy Policy</h1>

        <div className="prose">
          <p className="text-sm text-neutral-600 mb-8">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2>Overview</h2>
          <p>
            Bergen Mind & Wellness, LLC ("we," "our," or "us") is committed to protecting your privacy and maintaining the confidentiality of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2>HIPAA Compliance</h2>
          <p>
            As a mental health care provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA) and its implementing regulations. We maintain strict safeguards to protect the privacy and security of your Protected Health Information (PHI).
          </p>

          <h3>Protected Health Information (PHI)</h3>
          <p>PHI includes:</p>
          <ul>
            <li>Personally identifiable information about your health condition</li>
            <li>Healthcare services provided to you</li>
            <li>Payment information related to your healthcare</li>
          </ul>

          <h2>Information We Collect</h2>

          <h3>Personal Information</h3>
          <p>We may collect the following information when you:</p>
          <ul>
            <li>Schedule an appointment</li>
            <li>Fill out forms on our website</li>
            <li>Contact us via email or phone</li>
            <li>Complete screening assessments</li>
          </ul>

          <p>This may include:</p>
          <ul>
            <li>Name, contact information (email, phone, address)</li>
            <li>Date of birth</li>
            <li>Insurance information</li>
            <li>Medical history and current symptoms</li>
            <li>Treatment notes and medication information</li>
          </ul>

          <h3>Website Usage Information</h3>
          <p>We automatically collect certain information when you visit our website:</p>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages viewed and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h3>Screening Tools</h3>
          <p>
            All screening assessments (PHQ-9, GAD-7, ASRS, MDQ, PCL-5) are processed entirely in your browser and are <strong>not stored on our servers or transmitted to us</strong> unless you explicitly share your results when scheduling an appointment.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use your information for:</p>
          <ul>
            <li><strong>Treatment:</strong> Providing, coordinating, and managing your mental health care</li>
            <li><strong>Payment:</strong> Billing and insurance processing</li>
            <li><strong>Healthcare Operations:</strong> Quality improvement, staff training, and business administration</li>
            <li><strong>Legal Requirements:</strong> Complying with legal and regulatory obligations</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>

          <h3>We May Share Your Information:</h3>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly authorize disclosure</li>
            <li><strong>For Treatment:</strong> With other healthcare providers involved in your care (with your consent)</li>
            <li><strong>For Payment:</strong> With insurance companies and billing services</li>
            <li><strong>Legal Obligations:</strong> When required by law or court order</li>
            <li><strong>To Prevent Harm:</strong> If we believe disclosure is necessary to prevent serious harm to you or others</li>
          </ul>

          <h3>We Will NOT:</h3>
          <ul>
            <li>Sell your personal information to third parties</li>
            <li>Use your PHI for marketing without your authorization</li>
            <li>Share your information for purposes unrelated to your care without consent</li>
          </ul>

          <h2>Your Rights Under HIPAA</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request copies of your medical records</li>
            <li><strong>Amendment:</strong> Request corrections to your medical records</li>
            <li><strong>Accounting of Disclosures:</strong> Receive a list of certain disclosures of your PHI</li>
            <li><strong>Restrictions:</strong> Request limits on how we use or disclose your information</li>
            <li><strong>Confidential Communications:</strong> Request we communicate with you in specific ways</li>
            <li><strong>Revoke Authorization:</strong> Withdraw consent for uses beyond treatment, payment, and operations</li>
          </ul>

          <h2>Data Security</h2>
          <p>We implement appropriate technical, physical, and administrative safeguards to protect your information, including:</p>
          <ul>
            <li>Secure, encrypted data storage and transmission</li>
            <li>Access controls and authentication</li>
            <li>Regular security assessments</li>
            <li>Staff training on privacy and security practices</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            Our website uses cookies and similar technologies for analytics and functionality. These do not track PHI. You can disable cookies in your browser settings, though this may affect website functionality.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services that may collect non-PHI information:</p>
          <ul>
            <li><strong>Vercel Analytics:</strong> Website performance and usage statistics</li>
            <li><strong>Vercel Speed Insights:</strong> Website performance monitoring</li>
          </ul>
          <p>These services do not have access to your PHI.</p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are intended for individuals 18 years and older. We do not knowingly collect personal information from children under 13 without parental consent. Adolescent services (ages 13-17) require parental/guardian consent.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. We will notify you of significant changes as required by law.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
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

          <h2>Notice of Privacy Practices</h2>
          <p>
            For a more detailed explanation of how we use and disclose your PHI, please request a copy of our Notice of Privacy Practices when you begin treatment. You have the right to receive this notice and to have your questions answered.
          </p>
        </div>
      </div>
    </div>
  )
}
