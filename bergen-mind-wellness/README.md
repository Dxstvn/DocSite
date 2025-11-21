# Bergen Mind & Wellness

A modern, bilingual mental health platform built with Next.js 16, providing evidence-based education, validated screening tools, and online appointment booking for mental health services in Bergen County, NJ.

## Features

### Core Functionality
- **Bilingual Support** (English/Spanish) - Full i18n implementation with automatic locale detection
- **Mental Health Screening Tools** - 5 validated assessments (PHQ-9, GAD-7, ASRS, MDQ, PCL-5)
- **Educational Resources** - Evidence-based content on depression, anxiety, ADHD, bipolar disorder, and PTSD
- **Nutrition & Brain Optimization** - Science-backed dietary recommendations for mental health
- **Mindfulness Resources** - Guided practices, breathing exercises, and meditation guides
- **Online Appointment Booking** - FullCalendar-based scheduling with email confirmations
- **WCAG 2.1 AA Compliant** - Fully accessible design

### Technical Stack
- **Framework**: Next.js 16.0.1 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1 with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **Internationalization**: react-i18next with next-i18n-router
- **Calendar**: FullCalendar 6.1.19 with interaction support
- **Forms**: React Hook Form 7.66 + Zod 4.0 validation
- **Database**: Supabase (PostgreSQL with RLS)
- **Email**: Resend + React Email templates
- **Analytics**: Vercel Analytics & Speed Insights
- **Animation**: Framer Motion 12

## Getting Started

### Prerequisites
- **Node.js**: 20.x or higher
- **pnpm**: 10.19.0 (managed by Corepack)
- **Supabase Account**: For database and auth
- **Resend Account**: For email sending

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bergen-mind-wellness.git
cd bergen-mind-wellness
```

2. **Enable Corepack** (for pnpm)
```bash
corepack enable
```

3. **Install dependencies**
```bash
pnpm install
```

4. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- Supabase project URL and keys (from https://app.supabase.com)
- Resend API key (from https://resend.com/api-keys)
- Site URL and name

5. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Database Setup

The project uses Supabase for data storage. Required tables:

**`profiles` table:**
- `id` (uuid, primary key, references auth.users)
- `role` (text: 'patient' | 'doctor' | 'admin')
- `created_at` (timestamptz)

**`appointments` table:**
- `id` (uuid, primary key)
- `patient_id` (uuid, references profiles)
- `doctor_id` (uuid, references profiles)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `status` (text: 'pending' | 'confirmed' | 'cancelled')
- `appointment_type` (text)
- `patient_name` (text)
- `patient_email` (text)
- `patient_phone` (text)
- `notes` (text, optional)
- `booking_token` (text, unique)
- `created_at` (timestamptz)

**`appointment_types` table:**
- `id` (uuid, primary key)
- `display_name` (text)
- `display_name_es` (text)
- `duration_minutes` (integer)
- `price` (numeric)
- `active` (boolean)

Run migrations from `supabase/migrations/` directory.

## Project Structure

```
bergen-mind-wellness/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Localized routes (en, es)
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── about/          # About page
│   │   │   ├── contact/        # Contact & booking
│   │   │   ├── education/      # Mental health education
│   │   │   ├── screening/      # Assessment tools
│   │   │   ├── nutrition/      # Nutrition resources
│   │   │   ├── mindfulness/    # Mindfulness practices
│   │   │   ├── privacy/        # Privacy policy
│   │   │   └── terms/          # Terms of service
│   │   ├── api/
│   │   │   └── appointments/   # Booking API routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── robots.ts           # SEO: robots.txt
│   │   └── sitemap.ts          # SEO: sitemap.xml
│   ├── components/
│   │   ├── appointments/       # Booking components
│   │   ├── layout/             # Header, Footer, Nav
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── LanguageSwitcher.tsx
│   │   ├── StructuredData.tsx  # Schema.org markup
│   │   └── TranslationsProvider.tsx
│   ├── emails/                 # React Email templates
│   │   ├── appointment-confirmation.tsx
│   │   ├── appointment-reminder.tsx
│   │   └── appointment-cancellation.tsx
│   ├── lib/
│   │   ├── appointments/       # Booking logic
│   │   ├── email/              # Email sending
│   │   ├── screening/          # Assessment calculators
│   │   ├── supabase/           # Database clients
│   │   └── i18n.ts             # Translation utilities
│   ├── locales/
│   │   ├── en/                 # English translations
│   │   └── es/                 # Spanish translations
│   ├── types/                  # TypeScript types
│   ├── i18nConfig.ts           # i18n configuration
│   └── middleware.ts           # Routing & auth
├── public/                     # Static assets
├── .env.example                # Environment template
├── .env.local                  # Your local config (gitignored)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Development

### Available Scripts

```bash
# Development
pnpm dev                  # Start dev server with Turbopack
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint

# Testing
pnpm test:unit            # Run unit tests (fast, uses mocks)
pnpm test:integration     # Run integration tests (requires local Supabase)
pnpm test:e2e             # Run E2E tests (Playwright)
pnpm test:all             # Run all test suites

# Supabase Local Development
pnpm supabase:start       # Start local Supabase instance
pnpm supabase:stop        # Stop local Supabase
pnpm supabase:reset       # Reset database and re-run migrations
pnpm supabase:status      # Show connection details

# Email Development
pnpm email:dev            # Preview email templates
pnpm email:build          # Build email templates
pnpm email:export         # Export email HTML
```

### Testing Email Templates

Preview and test email templates locally:

```bash
pnpm email:dev
```

Opens email preview at http://localhost:3000 showing all templates with hot reload.

### Adding New Translations

1. Add translation keys to `/src/locales/en/[namespace].json`
2. Add Spanish translations to `/src/locales/es/[namespace].json`
3. Use in components:
```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation('namespace')
return <h1>{t('key.path')}</h1>
```

### Creating New Screening Tools

1. Create scoring logic in `/src/lib/screening/[tool].ts`
2. Export interface with `...Key` properties for translation
3. Create page in `/src/app/[locale]/screening/[tool]/page.tsx`
4. Add translations to `screening.json` (both locales)
5. Add to screening hub in `/src/app/[locale]/screening/page.tsx`

## Testing

This project uses a comprehensive testing strategy with three distinct test types:

### Test Types

**1. Unit Tests** - Fast, isolated tests with mocks
- Test business logic, components, and utilities
- Run in ~100ms per test
- No external dependencies

**2. Integration Tests** - Real database tests with local Supabase
- Test actual database constraints, RLS policies, and foreign keys
- Require Docker and local Supabase instance
- Run in ~1-2s per test

**3. E2E Tests** - Browser automation with Playwright
- Test complete user journeys and accessibility compliance
- Run in headless or visible browser
- Test cross-browser compatibility

### Quick Start

```bash
# Run all unit tests (fast, uses mocks)
pnpm test:unit

# Run integration tests (requires Docker + Supabase)
pnpm test:integration

# Run E2E tests (browser automation)
pnpm test:e2e

# Run everything
pnpm test:all
```

### Integration Test Setup

Integration tests require a local Supabase instance:

```bash
# 1. Start Docker Desktop

# 2. Start local Supabase (first time downloads images)
pnpm supabase:start

# 3. Copy .env.test.example to .env.test
cp .env.test.example .env.test

# 4. Get credentials and update .env.test
pnpm supabase:status

# 5. Run integration tests
pnpm test:integration
```

### Detailed Documentation

For comprehensive testing documentation including setup, troubleshooting, and best practices, see:

📖 **[TESTING.md](./TESTING.md)** - Full testing guide

## Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables** in project settings
3. **Configure build settings:**
   - Framework: Next.js
   - Root Directory: `bergen-mind-wellness`
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
4. **Deploy**

The `vercel.json` file is already configured with correct settings.

### Environment Variables for Production

Set these in Vercel dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `NEXT_PUBLIC_SITE_NAME` - Bergen Mind & Wellness
- `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Production service role key (secret)
- `RESEND_API_KEY` - Production Resend API key (secret)
- `RESEND_FROM_EMAIL` - Verified sender email

## Accessibility

This site follows WCAG 2.1 Level AA standards:

- Semantic HTML throughout
- ARIA labels and landmarks
- Keyboard navigation support
- Focus management
- Color contrast ratios ≥4.5:1
- Screen reader optimization
- `prefers-reduced-motion` support
- Form validation with clear error messages

Test with:
```bash
npx axe https://yourdomain.com
```

## Performance

Target Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

Monitor with Vercel Analytics and Speed Insights.

## Security

- All user inputs validated with Zod schemas
- SQL injection protection via Supabase parameterized queries
- XSS prevention through React's built-in escaping
- CSRF protection via SameSite cookies
- Row Level Security (RLS) policies in Supabase
- Secure environment variable handling
- HTTPS enforced in production

## Support

For issues or questions:
- **Email**: info@bergenmindwellness.com
- **Phone**: (201) 555-0123

## License

Proprietary - All rights reserved by Bergen Mind & Wellness

---

**Built with care for mental health.**
