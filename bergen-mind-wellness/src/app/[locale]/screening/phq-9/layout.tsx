import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Depression Screening (PHQ-9) | Confidential Mental Health Assessment',
  description: 'Take the PHQ-9 depression screening questionnaire. Free, confidential, 9-question assessment processed privately in your browser. Results in 2-3 minutes.',
  keywords: ['PHQ-9', 'depression screening', 'depression test online', 'mental health assessment', 'depression questionnaire', 'free depression test', 'confidential screening'],
  openGraph: {
    title: 'Free Depression Screening (PHQ-9) | Confidential Assessment',
    description: 'Take the PHQ-9 depression screening questionnaire. Free, confidential, 9-question assessment processed privately in your browser.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/screening/phq-9`,
    type: 'website',
    images: [{
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
      width: 200,
      height: 267,
      alt: 'Bergen Mind & Wellness Logo'
    }]
  },
  twitter: {
    card: 'summary',
    title: 'Free Depression Screening (PHQ-9)',
    description: 'Free, confidential depression screening. 9 questions, results in 2-3 minutes. Processed privately in your browser.'
  }
}

export default function PHQ9Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return children
}
