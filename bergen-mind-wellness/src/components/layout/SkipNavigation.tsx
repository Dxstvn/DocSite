/**
 * SkipNavigation Component
 *
 * Provides a "Skip to main content" link for keyboard users to bypass navigation.
 * WCAG 2.1 Level A requirement for accessibility.
 *
 * The link is visually hidden by default but becomes visible when focused with Tab key.
 */

'use client'

import { useTranslation } from 'react-i18next'

export default function SkipNavigation() {
  const { t } = useTranslation('common')

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
