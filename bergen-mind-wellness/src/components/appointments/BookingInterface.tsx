'use client';

import { GoogleCalendarLink } from './GoogleCalendarLink';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { AppointmentType } from '@/types/database';

interface BookingInterfaceProps {
  locale?: 'en' | 'es';
  appointmentTypes: AppointmentType[];
}

/**
 * Simplified booking interface that directs users to Google Calendar.
 * This is a temporary replacement for the full multi-step booking flow.
 *
 * Original component archived at: _archived/BookingInterface.original.tsx
 */
export function BookingInterface({ locale = 'en', appointmentTypes }: BookingInterfaceProps) {
  const text = {
    typesTitle: locale === 'es' ? 'Tipos de Citas' : 'Appointment Types',
    typesDescription: locale === 'es'
      ? 'Ofrecemos diferentes duraciones de citas para satisfacer sus necesidades. Todas las citas se realizan por telesalud.'
      : 'We offer different appointment durations to meet your needs. All appointments are conducted via telehealth.',
    duration: (minutes: number) => locale === 'es' ? `${minutes} minutos` : `${minutes} minutes`,
    suitable: locale === 'es'
      ? 'Adecuado para consultas y citas de seguimiento'
      : 'Suitable for consultations and follow-up appointments',
    bookingTitle: locale === 'es' ? 'Reserve Su Cita' : 'Book Your Appointment',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Appointment Types Information */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{text.typesTitle}</h2>
        <p className="text-muted-foreground mb-6">{text.typesDescription}</p>

        <div className="grid gap-4 md:grid-cols-3">
          {appointmentTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  {locale === 'es' && type.display_name_es ? type.display_name_es : type.display_name}
                </CardTitle>
                <CardDescription>
                  {text.duration(type.duration_minutes)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {text.suitable}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Google Calendar Link */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{text.bookingTitle}</h2>
        <GoogleCalendarLink locale={locale} />
      </div>
    </div>
  );
}
