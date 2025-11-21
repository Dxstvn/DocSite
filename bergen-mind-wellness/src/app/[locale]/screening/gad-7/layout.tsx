import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Anxiety Screening (GAD-7) | Confidential Mental Health Assessment',
  description: 'Take the GAD-7 anxiety screening questionnaire. Free, confidential, 7-question assessment for generalized anxiety disorder. Results in 2 minutes.',
  keywords: ['GAD-7', 'anxiety screening', 'anxiety test online', 'generalized anxiety disorder test', 'GAD assessment', 'free anxiety test', 'confidential screening'],
  openGraph: {
    title: 'Free Anxiety Screening (GAD-7) | Confidential Assessment',
    description: 'Take the GAD-7 anxiety screening questionnaire. Free, confidential, 7-question assessment for generalized anxiety disorder.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/screening/gad-7`,
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
    title: 'Free Anxiety Screening (GAD-7)',
    description: 'Free, confidential anxiety screening. 7 questions, results in 2 minutes. Processed privately in your browser.'
  }
}

export default function GAD7Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return children
}
