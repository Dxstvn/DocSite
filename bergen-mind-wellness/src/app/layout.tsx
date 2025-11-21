import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'Bergen Mind & Wellness, LLC',
  description: 'Compassionate mental health care in New Jersey. Evidence-based treatment for depression, anxiety, ADHD, bipolar disorder, and PTSD.',
  keywords: ['mental health', 'therapy', 'counseling', 'Bergen County', 'New Jersey', 'depression', 'anxiety', 'ADHD'],
  authors: [{ name: 'Bergen Mind & Wellness' }],

  // Favicon configuration
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // OpenGraph with logo image
  openGraph: {
    title: 'Bergen Mind & Wellness, LLC',
    description: 'Compassionate mental health care in New Jersey',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo-200.png',
        width: 200,
        height: 267,
        alt: 'Bergen Mind & Wellness logo',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary',
    title: 'Bergen Mind & Wellness, LLC',
    description: 'Compassionate mental health care in New Jersey',
    images: ['/logo.png'],
  },

  // Web App Manifest
  manifest: '/site.webmanifest',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}#organization`,
  name: 'Bergen Mind & Wellness, LLC',
  legalName: 'Bergen Mind & Wellness, LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app',
  logo: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
    width: 200,
    height: 267,
  },
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/logo-200.png`,
  description: 'Compassionate, evidence-based mental health care in New Jersey. Specializing in depression, anxiety, ADHD, bipolar disorder, and PTSD treatment.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bergen County',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'State',
    name: 'New Jersey',
  },
  medicalSpecialty: ['Psychiatry', 'Mental Health'],
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Depression Treatment',
      description: 'Evidence-based treatment for major depressive disorder including medication management and supportive therapy.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Anxiety Treatment',
      description: 'Comprehensive treatment for anxiety disorders including GAD, panic disorder, and social anxiety.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'ADHD Treatment',
      description: 'Adult ADHD assessment and treatment including medication management and behavioral strategies.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Bipolar Disorder Treatment',
      description: 'Mood stabilization and comprehensive care for bipolar I and II disorder.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'PTSD Treatment',
      description: 'Trauma-informed care for post-traumatic stress disorder with evidence-based approaches.',
    },
  ],
  sameAs: [],
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'}/contact`,
      actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
    },
    result: {
      '@type': 'Reservation',
      name: 'Mental Health Appointment',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <StructuredData data={organizationSchema} />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
