/**
 * LiveRegion Component
 *
 * Provides ARIA live region for announcing dynamic content changes to screen readers.
 * Use this component when content changes dynamically and users need to be notified
 * (form submissions, error messages, loading states, screening results, etc.).
 *
 * WCAG 2.1 Level AA requirement for dynamic content announcements.
 *
 * @param message - The message to announce to screen readers
 * @param politeness - 'polite' (default) waits for pause, 'assertive' interrupts immediately
 *
 * @example
 * // Polite announcement (default) - waits for screen reader to finish current task
 * <LiveRegion message="Form submitted successfully!" />
 *
 * @example
 * // Assertive announcement - interrupts immediately (use sparingly, for errors/alerts)
 * <LiveRegion message="Error: Please fill in all required fields" politeness="assertive" />
 */

interface LiveRegionProps {
  message: string
  politeness?: 'polite' | 'assertive'
}

export default function LiveRegion({
  message,
  politeness = 'polite'
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
