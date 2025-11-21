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

interface AppointmentConfirmationEmailProps {
  patientName: string;
  appointmentType: string;
  appointmentDate: Date;
  appointmentTime: string;
  timezone: string;
  manageUrl: string;
  locale?: 'en' | 'es';
}

export const AppointmentConfirmationEmail = ({
  patientName = 'John Doe',
  appointmentType = 'Initial Psychiatric Evaluation',
  appointmentDate = new Date('2025-11-20T14:00:00'),
  appointmentTime = '2:00 PM - 2:50 PM',
  timezone = 'America/New_York',
  manageUrl = 'https://bergenmindwellness.com/appointments/manage?token=abc123',
  locale = 'en',
}: AppointmentConfirmationEmailProps) => {
  const dateLocale = locale === 'es' ? es : enUS;
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy', {
    locale: dateLocale,
  });

  const content = {
    en: {
      preview: 'Your appointment has been confirmed',
      heading: 'Appointment Confirmed',
      greeting: `Dear ${patientName},`,
      confirmation: 'Your appointment has been successfully scheduled.',
      detailsHeading: 'Appointment Details:',
      type: 'Type',
      date: 'Date',
      time: 'Time',
      timezoneLabel: 'Timezone',
      nextSteps: 'Next Steps',
      confirmationNote:
        'You will receive a reminder email 24 hours before your appointment.',
      prepNote:
        'Please arrive 10 minutes early to complete any necessary paperwork.',
      telehealth:
        'If this is a telehealth appointment, you will receive a secure video link via email 30 minutes before your appointment time.',
      manageButton: 'Manage Appointment',
      manageText: 'Need to reschedule or cancel?',
      manageLink: 'Click here to manage your appointment',
      questions: 'Questions?',
      contactInfo:
        'If you have any questions, please contact our office during business hours.',
      important: 'Important',
      cancellationPolicy:
        'Please provide at least 24 hours notice if you need to cancel or reschedule your appointment.',
    },
    es: {
      preview: 'Su cita ha sido confirmada',
      heading: 'Cita Confirmada',
      greeting: `Estimado/a ${patientName},`,
      confirmation: 'Su cita ha sido programada exitosamente.',
      detailsHeading: 'Detalles de la Cita:',
      type: 'Tipo',
      date: 'Fecha',
      time: 'Hora',
      timezoneLabel: 'Zona Horaria',
      nextSteps: 'Próximos Pasos',
      confirmationNote:
        'Recibirá un correo de recordatorio 24 horas antes de su cita.',
      prepNote:
        'Por favor llegue 10 minutos antes para completar cualquier papeleo necesario.',
      telehealth:
        'Si esta es una cita de telesalud, recibirá un enlace de video seguro por correo electrónico 30 minutos antes de su cita.',
      manageButton: 'Administrar Cita',
      manageText: '¿Necesita reprogramar o cancelar?',
      manageLink: 'Haga clic aquí para administrar su cita',
      questions: '¿Preguntas?',
      contactInfo:
        'Si tiene alguna pregunta, comuníquese con nuestra oficina durante el horario de atención.',
      important: 'Importante',
      cancellationPolicy:
        'Por favor proporcione al menos 24 horas de aviso si necesita cancelar o reprogramar su cita.',
    },
  };

  const t = content[locale];

  return (
    <EmailLayout preview={t.preview} locale={locale}>
      <Heading style={h1}>{t.heading}</Heading>

      <Text style={text}>{t.greeting}</Text>

      <Text style={text}>{t.confirmation}</Text>

      <Section style={detailsBox}>
        <Heading as="h2" style={h2}>
          {t.detailsHeading}
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
      </Section>

      <Section style={buttonContainer}>
        <Button href={manageUrl} style={button}>
          {t.manageButton}
        </Button>
      </Section>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>
        {t.nextSteps}
      </Heading>

      <Text style={text}>• {t.confirmationNote}</Text>
      <Text style={text}>• {t.prepNote}</Text>
      <Text style={text}>• {t.telehealth}</Text>

      <Hr style={hr} />

      <Section style={infoBox}>
        <Heading as="h3" style={h3}>
          {t.questions}
        </Heading>
        <Text style={text}>{t.contactInfo}</Text>
      </Section>

      <Section style={importantBox}>
        <Heading as="h3" style={h3}>
          ⚠️ {t.important}
        </Heading>
        <Text style={text}>{t.cancellationPolicy}</Text>
      </Section>

      <Text style={linkText}>
        {t.manageText}{' '}
        <Link href={manageUrl} style={link}>
          {t.manageLink}
        </Link>
      </Text>
    </EmailLayout>
  );
};

AppointmentConfirmationEmail.PreviewProps = {
  patientName: 'Jane Smith',
  appointmentType: 'Initial Psychiatric Evaluation',
  appointmentDate: new Date('2025-11-20T14:00:00'),
  appointmentTime: '2:00 PM - 2:50 PM',
  timezone: 'America/New_York (EST)',
  manageUrl:
    'https://bergenmindwellness.com/appointments/manage?token=abc123xyz',
  locale: 'en' as const,
} as AppointmentConfirmationEmailProps;

export default AppointmentConfirmationEmail;

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

const detailsBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  border: '1px solid #86efac',
  padding: '20px',
  margin: '24px 0',
};

const detailText = {
  color: '#166534',
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

const infoBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #93c5fd',
  padding: '16px',
  margin: '16px 0',
};

const importantBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  border: '1px solid #fcd34d',
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
