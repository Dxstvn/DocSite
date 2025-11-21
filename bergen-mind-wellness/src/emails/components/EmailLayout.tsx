import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  locale?: 'en' | 'es';
}

export const EmailLayout = ({
  preview,
  children,
  locale = 'en',
}: EmailLayoutProps) => (
  <Html lang={locale}>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo */}
        <Section style={header}>
          <Img
            src={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://bergenmindwellness.com'}/logo-200.png`}
            width="180"
            height="60"
            alt="Bergen Mind & Wellness, LLC"
            style={logo}
          />
        </Section>

        {/* Main content */}
        <Section style={content}>{children}</Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            <strong>Bergen Mind & Wellness, LLC</strong>
            <br />
            {locale === 'en'
              ? 'Compassionate mental health care in Northern New Jersey'
              : 'Atención de salud mental compasiva en el norte de Nueva Jersey'}
          </Text>
          <Text style={footerText}>
            {locale === 'en'
              ? 'This email contains confidential information. If you received this in error, please delete it immediately.'
              : 'Este correo electrónico contiene información confidencial. Si lo recibió por error, elimínelo inmediatamente.'}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Calming color palette for mental health (sage green and soft blues)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 32px 20px',
  borderBottom: '1px solid #e6e9ec',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '32px',
};

const footer = {
  padding: '20px 32px',
  borderTop: '1px solid #e6e9ec',
  backgroundColor: '#f9fafb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '8px 0',
};
