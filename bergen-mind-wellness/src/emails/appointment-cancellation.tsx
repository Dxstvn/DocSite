import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface AppointmentCancellationEmailProps {
  patientName: string;
  appointmentType: string;
  appointmentDate: Date;
  appointmentTime: string;
  timezone: string;
  cancelledBy: 'patient' | 'doctor';
  cancellationReason?: string;
  bookNewUrl: string;
  locale?: 'en' | 'es';
}

export const AppointmentCancellationEmail = ({
  patientName = 'John Doe',
  appointmentType = 'Initial Psychiatric Evaluation',
  appointmentDate = new Date('2025-11-20T14:00:00'),
  appointmentTime = '2:00 PM - 2:50 PM',
  timezone = 'America/New_York',
  cancelledBy = 'patient',
  cancellationReason,
  bookNewUrl = 'https://bergenmindwellness.com/appointments',
  locale = 'en',
}: AppointmentCancellationEmailProps) => {
  const dateLocale = locale === 'es' ? es : enUS;
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy', {
    locale: dateLocale,
  });

  const content = {
    en: {
      preview: 'Your appointment has been cancelled',
      heading: 'Appointment Cancelled',
      greeting: `Dear ${patientName},`,
      confirmationPatient:
        'This email confirms that your appointment has been cancelled as requested.',
      confirmationDoctor:
        'We regret to inform you that your appointment has been cancelled by our office.',
      cancelledDetails: 'Cancelled Appointment Details:',
      type: 'Type',
      date: 'Date',
      time: 'Time',
      timezoneLabel: 'Timezone',
      reason: 'Reason',
      noReason: 'No reason provided',
      nextSteps: 'What to Do Next',
      reschedulePatient:
        'If you would like to schedule a new appointment, you can do so using the button below.',
      rescheduleDoctor:
        'We apologize for any inconvenience. Please use the button below to schedule a new appointment at a time that works for you.',
      urgent:
        'If you are experiencing a mental health crisis, please contact 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room.',
      bookButton: 'Book New Appointment',
      questions: 'Questions?',
      contactUs:
        'If you have any questions about this cancellation, please contact our office during business hours.',
      bookLink: 'Click here to book a new appointment',
    },
    es: {
      preview: 'Su cita ha sido cancelada',
      heading: 'Cita Cancelada',
      greeting: `Estimado/a ${patientName},`,
      confirmationPatient:
        'Este correo confirma que su cita ha sido cancelada según lo solicitado.',
      confirmationDoctor:
        'Lamentamos informarle que su cita ha sido cancelada por nuestra oficina.',
      cancelledDetails: 'Detalles de la Cita Cancelada:',
      type: 'Tipo',
      date: 'Fecha',
      time: 'Hora',
      timezoneLabel: 'Zona Horaria',
      reason: 'Razón',
      noReason: 'No se proporcionó razón',
      nextSteps: 'Qué Hacer a Continuación',
      reschedulePatient:
        'Si desea programar una nueva cita, puede hacerlo usando el botón a continuación.',
      rescheduleDoctor:
        'Pedimos disculpas por cualquier inconveniente. Use el botón a continuación para programar una nueva cita en un horario que le convenga.',
      urgent:
        'Si está experimentando una crisis de salud mental, comuníquese con el 988 (Línea de Vida para Crisis y Suicidio) o acuda a la sala de emergencias más cercana.',
      bookButton: 'Reservar Nueva Cita',
      questions: '¿Preguntas?',
      contactUs:
        'Si tiene alguna pregunta sobre esta cancelación, comuníquese con nuestra oficina durante el horario de atención.',
      bookLink: 'Haga clic aquí para reservar una nueva cita',
    },
  };

  const t = content[locale];

  return (
    <EmailLayout preview={t.preview} locale={locale}>
      <Section style={cancellationBanner}>
        <Text style={bannerText}>❌ {t.heading}</Text>
      </Section>

      <Text style={text}>{t.greeting}</Text>

      <Text style={text}>
        {cancelledBy === 'patient'
          ? t.confirmationPatient
          : t.confirmationDoctor}
      </Text>

      <Section style={detailsBox}>
        <Heading as="h2" style={h2}>
          {t.cancelledDetails}
        </Heading>
        <Text style={detailText}>
          <strong>{t.type}:</strong> {appointmentType}
        </Text>
        <Text style={detailText}>
          <strong>{t.date}:</strong> {formattedDate}
        </Text>
        <Text style={detailText}>
          <strong>{t.time}:</strong> {appointmentTime}
        </Text>
        <Text style={detailText}>
          <strong>{t.timezoneLabel}:</strong> {timezone}
        </Text>
        {cancellationReason && (
          <Text style={detailText}>
            <strong>{t.reason}:</strong> {cancellationReason}
          </Text>
        )}
      </Section>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>
        {t.nextSteps}
      </Heading>

      <Text style={text}>
        {cancelledBy === 'patient'
          ? t.reschedulePatient
          : t.rescheduleDoctor}
      </Text>

      <Section style={buttonContainer}>
        <Button href={bookNewUrl} style={button}>
          {t.bookButton}
        </Button>
      </Section>

      <Hr style={hr} />

      <Section style={crisisBox}>
        <Text style={crisisText}>🆘 {t.urgent}</Text>
      </Section>

      <Section style={infoBox}>
        <Heading as="h3" style={h3}>
          {t.questions}
        </Heading>
        <Text style={text}>{t.contactUs}</Text>
      </Section>

      <Text style={linkText}>
        <Link href={bookNewUrl} style={link}>
          {t.bookLink}
        </Link>
      </Text>
    </EmailLayout>
  );
};

AppointmentCancellationEmail.PreviewProps = {
  patientName: 'Jane Smith',
  appointmentType: 'Follow-up Appointment',
  appointmentDate: new Date('2025-11-20T14:00:00'),
  appointmentTime: '2:00 PM - 2:50 PM',
  timezone: 'America/New_York (EST)',
  cancelledBy: 'patient' as const,
  cancellationReason: 'Schedule conflict',
  bookNewUrl: 'https://bergenmindwellness.com/appointments',
  locale: 'en' as const,
} as AppointmentCancellationEmailProps;

export default AppointmentCancellationEmail;

// Styles
const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  margin: '0 0 20px',
};

const h2 = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '24px 0 12px',
};

const h3 = {
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 8px',
};

const text = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
};

const cancellationBanner = {
  backgroundColor: '#fee2e2',
  borderRadius: '8px',
  border: '2px solid #ef4444',
  padding: '16px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const bannerText = {
  color: '#991b1b',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  padding: '20px',
  margin: '24px 0',
};

const detailText = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const crisisBox = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  border: '2px solid #f87171',
  padding: '16px',
  margin: '16px 0',
};

const crisisText = {
  color: '#991b1b',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '20px',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #93c5fd',
  padding: '16px',
  margin: '16px 0',
};

const link = {
  color: '#059669',
  textDecoration: 'underline',
};

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
};
