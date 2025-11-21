import PublicLayoutWrapper from '@/components/layout/PublicLayoutWrapper'
import TranslationsProvider from '@/components/TranslationsProvider'
import { initTranslations } from '@/lib/i18n'
import i18nConfig from '@/i18nConfig'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

// All translation namespaces used across the app
const namespaces = [
  'common',
  'navigation',
  'crisis',
  'home',
  'about',
  'contact',
  'education',
  'screening',
  'nutrition',
  'mindfulness',
  'legal',
  'metadata',
]

// Generate static params for both locales
export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  // In Next.js 15+, params are async
  const { locale } = await params

  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound()
  }

  // Initialize translations for server components
  const { resources } = await initTranslations(locale, namespaces)

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={namespaces}
      resources={resources}
    >
      <PublicLayoutWrapper>
        {children}
      </PublicLayoutWrapper>
    </TranslationsProvider>
  )
}
