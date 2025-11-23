'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const { t } = useTranslation('navigation')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)

  // Simple navigation links
  const mainNavigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
  ]

  // Resources dropdown items
  const resourcesNavigation = [
    { name: t('nav.mentalHealthEducation'), href: '/education' },
    { name: t('nav.screeningTools'), href: '/screening' },
    { name: t('nav.nutrition'), href: '/nutrition' },
    { name: t('nav.mindfulness'), href: '/mindfulness' },
  ]

  // Handle Escape key and click outside to close dropdowns
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (resourcesDropdownOpen) {
          setResourcesDropdownOpen(false)
          dropdownButtonRef.current?.focus()
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false)
        }
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, resourcesDropdownOpen])

  // Handle keyboard navigation within dropdown
  const handleDropdownKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const items = dropdownRef.current?.querySelectorAll('a')
      if (!items) return

      const currentIndex = Array.from(items).findIndex(item => item === document.activeElement)
      let nextIndex = currentIndex

      if (event.key === 'ArrowDown') {
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
      }

      items[nextIndex]?.focus()
    }
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <nav className="container flex items-center justify-between py-4" aria-label={t('header.mainNavAriaLabel')}>
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
            aria-label={t('header.logoAriaLabel')}
          >
            <Image
              src="/logo-48.png"
              alt={t('header.logoAlt')}
              width={48}
              height={64}
              priority
              sizes="48px"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-primary-700 hidden sm:inline">
              {t('header.siteName')}
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-700 hover:text-primary-700 underline underline-offset-4 transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {/* Resources Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={dropdownButtonRef}
              onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setResourcesDropdownOpen(!resourcesDropdownOpen)
                }
                if (e.key === 'ArrowDown' && !resourcesDropdownOpen) {
                  e.preventDefault()
                  setResourcesDropdownOpen(true)
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-primary-700 underline underline-offset-4 transition-colors"
              aria-expanded={resourcesDropdownOpen}
              aria-haspopup="true"
            >
              {t('nav.resources')}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {resourcesDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                onKeyDown={handleDropdownKeyDown}
              >
                <div className="py-1">
                  {resourcesNavigation.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-700 transition-colors"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setResourcesDropdownOpen(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' && !e.shiftKey && index === resourcesNavigation.length - 1) {
                          setResourcesDropdownOpen(false)
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4 lg:items-center">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/appointments">{t('header.scheduleAppointment')}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden gap-2 items-center">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('header.toggleMenuAriaLabel')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-neutral-200"
          role="dialog"
          aria-label={t('header.mobileMenuAriaLabel')}
        >
          <div className="space-y-1 px-4 py-4">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md underline underline-offset-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Resources Accordion */}
            <div className="border-t border-neutral-200 pt-2 mt-2">
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                aria-expanded={mobileResourcesOpen}
              >
                <span className="underline underline-offset-2">{t('nav.resources')}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {mobileResourcesOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {resourcesNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-100 rounded-md underline underline-offset-2 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Button asChild className="w-full mt-4">
              <Link href="/appointments">{t('header.scheduleAppointment')}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
