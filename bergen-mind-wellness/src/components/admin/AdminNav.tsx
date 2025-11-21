'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, Settings, LogOut, LayoutDashboard } from 'lucide-react'

type AdminNavProps = {
  locale: string
  userEmail: string
}

export function AdminNav({ locale, userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = `/${locale}/auth/login`
  }

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/appointments`,
      label: 'Appointments',
      icon: Calendar,
    },
    {
      href: `/${locale}/admin/availability`,
      label: 'Availability',
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={`/${locale}`} className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
                <Image
                  src="/logo-48.png"
                  alt="Bergen Mind & Wellness"
                  width={48}
                  height={64}
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-primary-600 hidden sm:inline">
                  Bergen Mind & Wellness
                </span>
              </Link>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                Admin
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-600">{userEmail}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-neutral-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
