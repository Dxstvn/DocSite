import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Bipolar Screening (MDQ) | Mood Disorder Assessment | Confidential',
  description: 'Take the MDQ bipolar disorder screening. Free, confidential assessment for mood cycling and manic episodes. Results in 3-4 minutes.',
  keywords: ['MDQ', 'bipolar screening', 'bipolar test online', 'mood disorder questionnaire', 'mania screening', 'free bipolar test', 'confidential screening'],
  openGraph: {
    title: 'Free Bipolar Screening (MDQ) | Mood Disorder Assessment',
    description: 'Take the MDQ bipolar disorder screening. Free, confidential assessment for mood cycling and manic episodes.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/screening/mdq`,
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
    title: 'Free Bipolar Screening (MDQ)',
    description: 'Free, confidential bipolar disorder screening. Results in 3-4 minutes. Processed privately in your browser.'
  }
}

export default function MDQLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return children
}
