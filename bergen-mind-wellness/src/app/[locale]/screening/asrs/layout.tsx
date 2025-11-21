import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ADHD Screening (ASRS) | Adult ADHD Assessment | Confidential',
  description: 'Take the ASRS adult ADHD screening. Free, confidential, 18-question assessment for attention deficit hyperactivity disorder. Results in 5 minutes.',
  keywords: ['ASRS', 'ADHD screening', 'adult ADHD test', 'ADHD assessment', 'attention deficit test', 'free ADHD screening', 'confidential ADHD test'],
  openGraph: {
    title: 'Free ADHD Screening (ASRS) | Adult ADHD Assessment',
    description: 'Take the ASRS adult ADHD screening. Free, confidential, 18-question assessment for attention deficit hyperactivity disorder.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/screening/asrs`,
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
    title: 'Free ADHD Screening (ASRS)',
    description: 'Free, confidential adult ADHD screening. 18 questions, results in 5 minutes. Processed privately in your browser.'
  }
}

export default function ASRSLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return children
}
