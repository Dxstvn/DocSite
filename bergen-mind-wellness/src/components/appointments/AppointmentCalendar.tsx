'use client';

import { GoogleCalendarLink } from './GoogleCalendarLink';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AppointmentCalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  appointmentTypeId?: string;
  locale?: 'en' | 'es';
}

/**
 * Simplified appointment calendar component that directs users to Google Calendar.
 * This is a temporary replacement for the full FullCalendar-based booking system.
 *
 * Original component archived at: _archived/AppointmentCalendar.original.tsx
 */
export function AppointmentCalendar({
  selectedDate,
  onDateSelect,
  appointmentTypeId,
  locale = 'en',
}: AppointmentCalendarProps) {
  const noticeText = locale === 'es'
    ? 'Hemos simplificado nuestro proceso de reserva de citas. Vea los horarios disponibles a través de nuestro calendario o llámenos para programar.'
    : "We've simplified our appointment booking process. View available times through our calendar or call us to schedule.";

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {noticeText}
        </AlertDescription>
      </Alert>

      <GoogleCalendarLink locale={locale} />
    </div>
  );
}
