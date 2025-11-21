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

interface AppointmentReminderEmailProps {
  patientName: string;
  appointmentType: string;
  appointmentDate: Date;
  appointmentTime: string;
  timezone: string;
  manageUrl: string;
  locale?: 'en' | 'es';
  isTelehealth?: boolean;
}

export const AppointmentReminderEmail = ({
  patientName = 'John Doe',
  appointmentType = 'Follow-up Appointment',
  appointmentDate = new Date('2025-11-20T14:00:00'),
  appointmentTime = '2:00 PM - 2:50 PM',
  timezone = 'America/New_York',
  manageUrl = 'https://bergenmindwellness.com/appointments/manage?token=abc123',
  locale = 'en',
  isTelehealth = false,
}: AppointmentReminderEmailProps) => {
  const dateLocale = locale === 'es' ? es : enUS;
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy', {
    locale: dateLocale,
  });

  const content = {
    en: {
      preview: 'Reminder: Your appointment is tomorrow',
      heading: 'Appointment Reminder',
      greeting: `Dear ${patientName},`,
      reminder: 'This is a friendly reminder about your upcoming appointment.',
      tomorrow: 'Your appointment is scheduled for tomorrow.',
      detailsHeading: 'Appointment Details:',
      type: 'Type',
      date: 'Date',
      time: 'Time',
      timezoneLabel: 'Timezone',
      preparation: 'Preparation',
      arriveEarly: '• Please arrive 10 minutes early',
      bringItems:
        '• Bring a valid photo ID and insurance card (if applicable)',
      medications: '• Have a list of current medications ready',
      telehealthNote:
        '• You will receive a secure video link 30 minutes before your appointment',
      confirmButton: 'Confirm Appointment',
      needToReschedule: 'Need to reschedule or cancel?',
      manageLink: 'Click here to manage your appointment',
      cancelPolicy:
        'If you need to cancel or reschedule, please do so at least 24 hours in advance.',
    },
    es: {
      preview: 'Recordatorio: Su cita es mañana',
      heading: 'Recordatorio de Cita',
      greeting: `Estimado/a ${patientName},`,
      reminder: 'Este es un recordatorio amistoso sobre su próxima cita.',
      tomorrow: 'Su cita está programada para mañana.',
      detailsHeading: 'Detalles de la Cita:',
      type: 'Tipo',
      date: 'Fecha',
      time: 'Hora',
      timezoneLabel: 'Zona Horaria',
      preparation: 'Preparación',
      arriveEarly: '• Por favor llegue 10 minutos antes',
      bringItems:
        '• Traiga una identificación con foto válida y tarjeta de seguro (si aplica)',
      medications: '• Tenga lista una lista de medicamentos actuales',
      telehealthNote:
        '• Recibirá un enlace de video seguro 30 minutos antes de su cita',
      confirmButton: 'Confirmar Cita',
      needToReschedule: '¿Necesita reprogramar o cancelar?',
      manageLink: 'Haga clic aquí para administrar su cita',
      cancelPolicy:
        'Si necesita cancelar o reprogramar, hágalo con al menos 24 horas de anticipación.',
    },
  };

  const t = content[locale];

  return (
    <EmailLayout preview={t.preview} locale={locale}>
      <Section style={reminderBanner}>
        <Text style={reminderText}>⏰ {t.tomorrow}</Text>
      </Section>

      <Heading style={h1}>{t.heading}</Heading>

      <Text style={text}>{t.greeting}</Text>

      <Text style={text}>{t.reminder}</Text>

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
          {t.confirmButton}
        </Button>
      </Section>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>
        {t.preparation}
      </Heading>

      <Text style={text}>{t.arriveEarly}</Text>
      <Text style={text}>{t.bringItems}</Text>
      <Text style={text}>{t.medications}</Text>
      {isTelehealth && <Text style={text}>{t.telehealthNote}</Text>}

      <Hr style={hr} />

      <Section style={warningBox}>
        <Text style={text}>{t.cancelPolicy}</Text>
      </Section>

      <Text style={linkText}>
        {t.needToReschedule}{' '}
        <Link href={manageUrl} style={link}>
          {t.manageLink}
        </Link>
      </Text>
    </EmailLayout>
  );
};

AppointmentReminderEmail.PreviewProps = {
  patientName: 'Jane Smith',
  appointmentType: 'Follow-up Appointment',
  appointmentDate: new Date('2025-11-21T14:00:00'),
  appointmentTime: '2:00 PM - 2:50 PM',
  timezone: 'America/New_York (EST)',
  manageUrl:
    'https://bergenmindwellness.com/appointments/manage?token=abc123xyz',
  locale: 'en' as const,
  isTelehealth: true,
} as AppointmentReminderEmailProps;

export default AppointmentReminderEmail;

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

const text = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
};

const reminderBanner = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  border: '2px solid #fbbf24',
  padding: '16px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const reminderText = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0',
};

const detailsBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #93c5fd',
  padding: '20px',
  margin: '24px 0',
};

const detailText = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
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

const warningBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  border: '1px solid #fcd34d',
  padding: '16px',
  margin: '16px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
};
