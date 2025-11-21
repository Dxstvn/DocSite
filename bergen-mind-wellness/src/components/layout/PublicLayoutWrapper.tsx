'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import CrisisButton from './CrisisButton'
import SkipNavigation from './SkipNavigation'

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're in an admin route
  const isAdminRoute = pathname?.includes('/admin')

  if (isAdminRoute) {
    // Admin routes only get the main content - admin layout provides its own nav
    return (
      <main id="main-content" className="flex-1">
        {children}
      </main>
    )
  }

  // Public routes get full header/footer
  return (
    <>
      <SkipNavigation />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CrisisButton />
    </>
  )
}
