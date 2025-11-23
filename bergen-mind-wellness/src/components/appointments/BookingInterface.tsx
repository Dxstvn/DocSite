'use client';

import { GoogleCalendarLink } from './GoogleCalendarLink';

interface BookingInterfaceProps {
  locale?: 'en' | 'es';
  appointmentTypes?: any[]; // Keep for backward compatibility but not used
}

/**
 * Simplified booking interface that directs users to Google Calendar.
 * This is a temporary replacement for the full multi-step booking flow.
 * All appointments are 30 minutes via Google Calendar.
 *
 * Original component archived at: _archived/BookingInterface.original.tsx
 */
export function BookingInterface({ locale = 'en' }: BookingInterfaceProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <GoogleCalendarLink locale={locale} />
    </div>
  );
}
