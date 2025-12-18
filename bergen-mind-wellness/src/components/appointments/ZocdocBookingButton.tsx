'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ZocdocBookingButtonProps {
  locale?: 'en' | 'es'
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg' | 'sm'
  className?: string
}

/**
 * ZocdocBookingButton Component
 *
 * Integrates Zocdoc's booking widget into the application.
 * Loads the Zocdoc embed script dynamically and cleans up on unmount.
 *
 * @param locale - Language locale for internationalization ('en' | 'es')
 * @param variant - Button visual variant (default | outline)
 * @param size - Button size (default | lg | sm)
 * @param className - Additional CSS classes
 */
export function ZocdocBookingButton({
  locale = 'en',
  variant = 'default',
  size = 'lg',
  className
}: ZocdocBookingButtonProps) {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptLoadedRef.current) return

    // Check if script already exists in document
    const existingScript = document.querySelector('script[src="https://offsiteschedule.zocdoc.com/plugin/embed"]')
    if (existingScript) {
      scriptLoadedRef.current = true
      return
    }

    // Load Zocdoc embed script
    const script = document.createElement('script')
    script.src = 'https://offsiteschedule.zocdoc.com/plugin/embed'
    script.type = 'text/javascript'
    script.async = true

    // Mark as loaded when script loads
    script.onload = () => {
      scriptLoadedRef.current = true
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      // Only remove script if this component instance loaded it
      if (script.parentNode) {
        try {
          document.body.removeChild(script)
        } catch (error) {
          // Script may have already been removed, ignore error
          console.debug('Zocdoc script cleanup: script already removed')
        }
      }
      scriptLoadedRef.current = false
    }
  }, [])

  const text = {
    label: locale === 'es' ? 'Reservar en Zocdoc' : 'Book on Zocdoc',
    ariaLabel: locale === 'es'
      ? 'Abrir Zocdoc para reservar una cita con Bergen Mind & Wellness'
      : 'Open Zocdoc to book an appointment with Bergen Mind & Wellness'
  }

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <a
        href="https://www.zocdoc.com/practice/bergen-mind-and-wellness-llc-153105?lock=true&isNewPatient=false&referrerType=widget"
        className="zd-plugin"
        data-type="book-button"
        data-practice-id="153105"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={text.ariaLabel}
        title="Bergen Mind & Wellness LLC"
      >
        {text.label}
      </a>
    </Button>
  )
}
