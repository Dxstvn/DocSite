'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export default function Footer() {
  const { t } = useTranslation(['navigation', 'common'])
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('navigation:footer.siteName')}</h3>
            <p className="text-sm text-neutral-300">
              {t('navigation:footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('navigation:footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.aboutUs')}</Link></li>
              <li><Link href="/education" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.education')}</Link></li>
              <li><Link href="/screening" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.screeningTools')}</Link></li>
              <li><Link href="/contact" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.contact')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('navigation:footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nutrition" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.nutritionBrainHealth')}</Link></li>
              <li><Link href="/mindfulness" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.mindfulnessPractices')}</Link></li>
              <li>
                <a
                  href="https://988lifeline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-white transition-colors"
                >
                  {t('navigation:footer.988Lifeline')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('navigation:footer.legal')}</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/privacy" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="text-primary-400 hover:text-white transition-colors">{t('navigation:footer.termsOfService')}</Link></li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                {t('navigation:footer.hipaaCompliant')}
              </Badge>
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                {t('navigation:footer.secureSSL')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
          <p className="text-neutral-300">{t('common:copyright', { year: currentYear })}</p>
          <p className="mt-2 text-neutral-400">
            {t('navigation:footer.licenseNotice')}
          </p>
        </div>
      </div>
    </footer>
  )
}
