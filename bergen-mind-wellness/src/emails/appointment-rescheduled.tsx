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

interface AppointmentRescheduledEmailProps {
  patientName: string;
  appointmentType: string;

  // Old appointment details
  oldAppointmentDate: Date;
  oldAppointmentTime: string;

  // New appointment details
  newAppointmentDate: Date;
  newAppointmentTime: string;

  timezone: string;
  manageUrl: string;
  locale?: 'en' | 'es';
}

export const AppointmentRescheduledEmail = ({
  patientName = 'John Doe',
  appointmentType = 'Initial Psychiatric Evaluation',
  oldAppointmentDate = new Date('2025-11-20T14:00:00'),
  oldAppointmentTime = '2:00 PM - 2:50 PM',
  newAppointmentDate = new Date('2025-11-25T10:00:00'),
  newAppointmentTime = '10:00 AM - 10:50 AM',
  timezone = 'America/New_York',
  manageUrl = 'https://bergenmindwellness.com/appointments/manage?token=abc123',
  locale = 'en',
}: AppointmentRescheduledEmailProps) => {
  const dateLocale = locale === 'es' ? es : enUS;
  const formattedOldDate = format(oldAppointmentDate, 'EEEE, MMMM d, yyyy', {
    locale: dateLocale,
  });
  const formattedNewDate = format(newAppointmentDate, 'EEEE, MMMM d, yyyy', {
    locale: dateLocale,
  });

  const content = {
    en: {
      preview: 'Your appointment has been rescheduled',
      heading: 'Appointment Rescheduled',
      greeting: `Dear ${patientName},`,
      notification: 'Your appointment has been rescheduled by our office.',
      oldDetailsHeading: 'Previous Appointment:',
      newDetailsHeading: 'New Appointment:',
      type: 'Type',
      date: 'Date',
      time: 'Time',
      timezoneLabel: 'Timezone',
      manageButton: 'Manage Appointment',
      apologyNote:
        'We apologize for any inconvenience. If this new time does not work for you, please contact our office or use the link below to reschedule.',
      nextSteps: 'Next Steps',
      confirmationNote:
        'You will receive a reminder email 24 hours before your new appointment.',
      prepNote:
        'Please arrive 10 minutes early to complete any necessary paperwork.',
      telehealth:
        'If this is a telehealth appointment, you will receive a secure video link via email 30 minutes before your appointment time.',
      questions: 'Questions?',
      contactInfo:
        'If you have any questions, please contact our office during business hours.',
      important: 'Important',
      cancellationPolicy:
        'If you need to cancel or reschedule again, please provide at least 24 hours notice.',
    },
    es: {
      preview: 'Su cita ha sido reprogramada',
      heading: 'Cita Reprogramada',
      greeting: `Estimado/a ${patientName},`,
      notification: 'Su cita ha sido reprogramada por nuestra oficina.',
      oldDetailsHeading: 'Cita Anterior:',
      newDetailsHeading: 'Nueva Cita:',
      type: 'Tipo',
      date: 'Fecha',
      time: 'Hora',
      timezoneLabel: 'Zona Horaria',
      manageButton: 'Administrar Cita',
      apologyNote:
        'Pedimos disculpas por cualquier inconveniente. Si este nuevo horario no le funciona, comuníquese con nuestra oficina o use el enlace a continuación para reprogramar.',
      nextSteps: 'Próximos Pasos',
      confirmationNote:
        'Recibirá un correo de recordatorio 24 horas antes de su nueva cita.',
      prepNote:
        'Por favor llegue 10 minutos antes para completar cualquier papeleo necesario.',
      telehealth:
        'Si esta es una cita de telesalud, recibirá un enlace de video seguro por correo electrónico 30 minutos antes de su cita.',
      questions: '¿Preguntas?',
      contactInfo:
        'Si tiene alguna pregunta, comuníquese con nuestra oficina durante el horario de atención.',
      important: 'Importante',
      cancellationPolicy:
        'Si necesita cancelar o reprogramar nuevamente, proporcione al menos 24 horas de aviso.',
    },
  };

  const t = content[locale];

  return (
    <EmailLayout preview={t.preview} locale={locale}>
      <Heading style={h1}>{t.heading}</Heading>

      <Text style={text}>{t.greeting}</Text>

      <Text style={text}>{t.notification}</Text>

      {/* Old Appointment Details - Strikethrough Style */}
      <Section style={oldDetailsBox}>
        <Heading as="h2" style={h2Strikethrough}>
          {t.oldDetailsHeading}
        </Heading>
        <Text style={oldDetailText}>
          <s>
            <strong>{t.type}:</strong> {appointmentType}
          </s>
        </Text>
        <Text style={oldDetailText}>
          <s>
            <strong>{t.date}:</strong> {formattedOldDate}
          </s>
        </Text>
        <Text style={oldDetailText}>
          <s>
            <strong>{t.time}:</strong> {oldAppointmentTime}
          </s>
        </Text>
      </Section>

      <Section style={arrowSection}>
        <Text style={arrowText}>↓</Text>
      </Section>

      {/* New Appointment Details - Highlighted */}
      <Section style={newDetailsBox}>
        <Heading as="h2" style={h2}>
          {t.newDetailsHeading}
        </Heading>
        <Text style={newDetailText}>
          <strong>{t.type}:</strong> {appointmentType}
        </Text>
        <Text style={newDetailText}>
          <strong>{t.date}:</strong> {formattedNewDate}
        </Text>
        <Text style={newDetailText}>
          <strong>{t.time}:</strong> {newAppointmentTime}
        </Text>
        <Text style={newDetailText}>
          <strong>{t.timezoneLabel}:</strong> {timezone}
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <Button href={manageUrl} style={button}>
          {t.manageButton}
        </Button>
      </Section>

      <Text style={apologyText}>{t.apologyNote}</Text>

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
    </EmailLayout>
  );
};

AppointmentRescheduledEmail.PreviewProps = {
  patientName: 'Jane Smith',
  appointmentType: 'Initial Psychiatric Evaluation',
  oldAppointmentDate: new Date('2025-11-20T14:00:00'),
  oldAppointmentTime: '2:00 PM - 2:50 PM',
  newAppointmentDate: new Date('2025-11-25T10:00:00'),
  newAppointmentTime: '10:00 AM - 10:50 AM',
  timezone: 'America/New_York (EST)',
  manageUrl:
    'https://bergenmindwellness.com/appointments/manage?token=abc123xyz',
  locale: 'en' as const,
} as AppointmentRescheduledEmailProps;

export default AppointmentRescheduledEmail;

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

const h2Strikethrough = {
  color: '#991b1b',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '24px 0 12px',
  textDecoration: 'line-through',
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

// Old appointment box - Red/gray tint with reduced opacity
const oldDetailsBox = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  padding: '20px',
  margin: '24px 0',
  opacity: '0.8',
};

const oldDetailText = {
  color: '#991b1b',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

// Arrow section between old and new appointments
const arrowSection = {
  textAlign: 'center' as const,
  margin: '12px 0',
};

const arrowText = {
  color: '#6b7280',
  fontSize: '32px',
  lineHeight: '1',
  margin: '0',
};

// New appointment box - Green tint with emphasis
const newDetailsBox = {
  backgroundColor: '#d1fae5',
  borderRadius: '8px',
  border: '2px solid #86efac',
  padding: '20px',
  margin: '24px 0',
};

const newDetailText = {
  color: '#065f46',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  fontWeight: '600',
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

const apologyText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  fontStyle: 'italic',
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
