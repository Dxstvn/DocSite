import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrisisButton from '@/components/layout/CrisisButton'

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
  openGraph: {
    title: 'Bergen Mind & Wellness, LLC',
    description: 'Compassionate mental health care in New Jersey',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased flex flex-col">
        <MotionConfig reducedMotion="user">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CrisisButton />
        </MotionConfig>
      </body>
    </html>
  )
}
