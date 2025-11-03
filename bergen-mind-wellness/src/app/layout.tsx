import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MotionConfig } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrisisButton from '@/components/layout/CrisisButton'
import SkipNavigation from '@/components/layout/SkipNavigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
        url: '/logo.png',
        width: 622,
        height: 833,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased flex flex-col">
        <SkipNavigation />
        <MotionConfig reducedMotion="user">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CrisisButton />
        </MotionConfig>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
