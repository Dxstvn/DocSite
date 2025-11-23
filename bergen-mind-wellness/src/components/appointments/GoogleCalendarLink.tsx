'use client';

import { Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GOOGLE_CALENDAR_URL = 'https://calendar.app.google/rvUA24diHnUoWTi79';
const PHONE_NUMBER = '(201) 690-2182';
const PHONE_LINK = 'tel:+12016902182';

interface GoogleCalendarLinkProps {
  locale?: 'en' | 'es';
}

export function GoogleCalendarLink({ locale = 'en' }: GoogleCalendarLinkProps) {
  const text = {
    title: locale === 'es' ? 'Programe Su Cita' : 'Schedule Your Appointment',
    description: locale === 'es'
      ? 'Vea los horarios disponibles y reserve directamente a través de nuestro calendario.'
      : 'View available times and book directly through our calendar.',
    instructions: locale === 'es'
      ? 'Haga clic en el botón a continuación para ver los horarios de cita disponibles del Dr. Jasmin. Puede reservar un horario que funcione mejor para usted, o llámenos para programar.'
      : "Click the button below to view Dr. Jasmin's available appointment times. You can book a time slot that works best for you, or call us to schedule.",
    viewCalendar: locale === 'es' ? 'Ver Horarios Disponibles' : 'View Available Times',
    viewCalendarLabel: locale === 'es'
      ? 'Abrir calendario para ver horarios de cita disponibles'
      : 'Open calendar to view available appointment times',
    callNow: locale === 'es' ? 'Llamar para Reservar' : 'Call to Book',
    callLabel: locale === 'es'
      ? `Llamar al ${PHONE_NUMBER} para programar una cita`
      : `Call ${PHONE_NUMBER} to schedule an appointment`,
    contactInfoTitle: locale === 'es' ? 'Información de Contacto' : 'Contact Information',
    phone: locale === 'es' ? 'Teléfono' : 'Phone',
    hours: locale === 'es' ? 'Horario de Oficina' : 'Office Hours',
    hoursValue: locale === 'es' ? 'Lunes - Viernes, 9:00 AM - 5:00 PM' : 'Monday - Friday, 9:00 AM - 5:00 PM',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {text.title}
        </CardTitle>
        <CardDescription>
          {text.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {text.instructions}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            size="lg"
            className="flex-1"
          >
            <a
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={text.viewCalendarLabel}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {text.viewCalendar}
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="flex-1"
          >
            <a
              href={PHONE_LINK}
              aria-label={text.callLabel}
            >
              <Phone className="mr-2 h-4 w-4" />
              {text.callNow}
            </a>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium text-sm mb-2">{text.contactInfoTitle}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>{text.phone}:</strong>{' '}
              <a href={PHONE_LINK} className="hover:underline">
                {PHONE_NUMBER}
              </a>
            </p>
            <p>
              <strong>{text.hours}:</strong>{' '}
              {text.hoursValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
