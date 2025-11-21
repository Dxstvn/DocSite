import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free PTSD Screening (PCL-5) | Trauma Assessment | Confidential',
  description: 'Take the PCL-5 PTSD screening. Free, confidential, 20-question assessment for post-traumatic stress disorder. Results in 5 minutes.',
  keywords: ['PCL-5', 'PTSD screening', 'PTSD test online', 'trauma assessment', 'post traumatic stress test', 'free PTSD screening', 'confidential trauma screening'],
  openGraph: {
    title: 'Free PTSD Screening (PCL-5) | Trauma Assessment',
    description: 'Take the PCL-5 PTSD screening. Free, confidential, 20-question assessment for post-traumatic stress disorder.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/screening/pcl-5`,
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
    title: 'Free PTSD Screening (PCL-5)',
    description: 'Free, confidential PTSD screening. 20 questions, results in 5 minutes. Processed privately in your browser.'
  }
}

export default function PCL5Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return children
}
