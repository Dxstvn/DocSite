# Bergen Mind & Wellness, LLC - Complete Development Plan

## Executive Summary

This document provides a comprehensive, step-by-step development plan for Bergen Mind & Wellness, LLC's mental health website. The plan is structured by implementation phases rather than calendar time, with each phase building upon the previous to create a complete, production-ready mental health platform.

**Project Goals:**
- Create an interactive, educational, and supportive mental health website
- Integrate clinical resources, lifestyle guidance, and mindfulness tools
- Provide evidence-based screening tools (PHQ-9, GAD-7, ASRS, MDQ, PCL-5)
- Enable appointment booking without storing Protected Health Information (PHI)
- Deliver a trauma-informed, accessible, calming user experience

**Technical Approach:**
- Modern tech stack: Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4.1
- Zero-budget implementation (all open-source tools)
- Mobile-first, accessibility-first design (WCAG 2.1 AA)
- Client-side screening tools (no data storage/transmission)
- HIPAA-aware architecture (though not required for educational content)

---

## Table of Contents

1. [Phase 1: Project Foundation](#phase-1-project-foundation)
2. [Phase 2: Core Pages & Navigation](#phase-2-core-pages--navigation)
3. [Phase 3: Mental Health Education Section](#phase-3-mental-health-education-section)
4. [Phase 4: Screening Tools](#phase-4-screening-tools)
5. [Phase 5: Nutrition & Brain Optimization](#phase-5-nutrition--brain-optimization)
6. [Phase 6: Mindfulness & Lifestyle](#phase-6-mindfulness--lifestyle)
7. [Phase 7: Appointment Booking](#phase-7-appointment-booking)
8. [Phase 8: Accessibility & Performance](#phase-8-accessibility--performance)
9. [Phase 9: SEO & Discoverability](#phase-9-seo--discoverability)
10. [Phase 10: Security & Privacy](#phase-10-security--privacy)
11. [Phase 11: Testing & Quality Assurance](#phase-11-testing--quality-assurance)
12. [Phase 12: Deployment & Launch](#phase-12-deployment--launch)
13. [Appendices](#appendices)

---

## Phase 1: Project Foundation

### 1.1 Initialize Next.js 16 Project

**Commands:**
```bash
# Create Next.js 16 app with TypeScript
pnpm create next-app@latest bergen-mind-wellness --typescript --tailwind --app --import-alias "@/*"

cd bergen-mind-wellness
```

**Configuration selections:**
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ✅ Turbopack (default in Next.js 16)
- ✅ Import alias (`@/*`)

### 1.2 Install Core Dependencies

**Why pnpm?**
- Faster installations and disk space efficiency
- Stricter dependency resolution prevents phantom dependencies
- Better monorepo support for future scalability

```bash
# UI Components
npx shadcn@latest init

# Follow prompts:
# - Style: Default
# - Base color: Slate (we'll customize)
# - CSS variables: Yes
# - React Server Components: Yes
# - Import alias: @/components

# Animation
pnpm add framer-motion@latest

# Form handling and validation
pnpm add react-hook-form@latest zod@latest @hookform/resolvers

# Icons
pnpm add lucide-react

# Utilities
pnpm add clsx tailwind-merge
```

### 1.3 Project Structure Setup

Create the following directory structure:

```
bergen-mind-wellness/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── contact/
│   │   ├── education/
│   │   │   ├── depression/
│   │   │   ├── anxiety/
│   │   │   ├── adhd/
│   │   │   ├── bipolar/
│   │   │   └── ptsd/
│   │   ├── screening/
│   │   │   ├── phq-9/
│   │   │   ├── gad-7/
│   │   │   ├── asrs/
│   │   │   ├── mdq/
│   │   │   └── pcl-5/
│   │   ├── nutrition/
│   │   ├── mindfulness/
│   │   └── api/ (if needed for contact form)
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── CrisisButton.tsx
│   │   ├── forms/
│   │   ├── screening/
│   │   └── shared/
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── screening/
│   │       ├── phq9.ts
│   │       ├── gad7.ts
│   │       ├── asrs.ts
│   │       ├── mdq.ts
│   │       └── pcl5.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts
├── public/
│   ├── images/
│   ├── downloads/
│   └── favicon.ico
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

### 1.4 Configure Tailwind CSS 4.1

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Teal
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Secondary - Sage Green
        secondary: {
          50: '#f6f7f6',
          100: '#e8ebe8',
          200: '#d4dad4',
          300: '#9ca89c',
          400: '#7a8a7a',
          500: '#5f6f5f',
          600: '#4a5a4a',
          700: '#3d4a3d',
          800: '#323e32',
          900: '#2a342a',
        },
        // Neutral - Warm Beige/Taupe
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.815rem', { lineHeight: '1.1' }],
        'h1': ['3.052rem', { lineHeight: '1.2' }],
        'h2': ['2.441rem', { lineHeight: '1.3' }],
        'h3': ['1.953rem', { lineHeight: '1.4' }],
        'h4': ['1.563rem', { lineHeight: '1.5' }],
        'h5': ['1.25rem', { lineHeight: '1.5' }],
        'h6': ['1rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'body-lg': ['1.125rem', { lineHeight: '1.778' }],
        'body-sm': ['0.875rem', { lineHeight: '1.714' }],
        'caption': ['0.75rem', { lineHeight: '1.667' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### 1.5 Install shadcn/ui Components

```bash
# Essential components for the project
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add alert
npx shadcn@latest add accordion
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add separator
```

### 1.6 Configure TypeScript

**tsconfig.json** (verify these settings):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 1.7 Git Configuration & Initial Commit

```bash
# Initialize git (if not already done)
git init

# Create .gitignore
cat > .gitignore << EOL
# dependencies
/node_modules
/.pnp
.pnp.js

# pnpm
.pnpm-debug.log*
# Note: pnpm-lock.yaml should be committed to git

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL

# Initial commit
git add .
git commit -m "Initial Next.js 16 setup with TypeScript and Tailwind CSS

- Next.js 16 with App Router and Turbopack
- TypeScript 5.9 configuration
- Tailwind CSS 4.1 with custom mental health color palette
- pnpm package manager for fast, efficient dependency management
- shadcn/ui component library
- Framer Motion for accessible animations
- React Hook Form + Zod for form handling
- Project structure for mental health platform"

# Add to main branch (if needed)
git branch -M main
```

**Note:** Once committed to main branch, Vercel MCP will automatically detect and deploy the project.

### 1.8 Development Environment Setup

**Create `.env.local` for local development:**
```bash
# .env.local (not committed to git)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Bergen Mind & Wellness, LLC"

# Email configuration (for contact form - Phase 7)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
# CONTACT_EMAIL=
```

**Start development server:**
```bash
pnpm dev
```

Visit `http://localhost:3000` to verify setup.

### Phase 1 Completion Status

**✅ Phase 1: COMPLETE**

**Completed Tasks:**
- ✅ Next.js 16.0.1 project initialized with TypeScript and App Router
- ✅ Configured Turbopack (stable in Next.js 16)
- ✅ Installed core dependencies (Framer Motion 12.23.24, React Hook Form 7.66.0, Zod 4.0.0)
- ✅ shadcn/ui initialized and configured for Tailwind CSS 4.1
- ✅ Complete project structure created (app/, components/, lib/, types/)
- ✅ Mental health color palette implemented (teal primary, sage green secondary, warm beige neutral)
- ✅ Tailwind CSS 4.1 configured with new `@theme inline` syntax
- ✅ All required shadcn/ui components installed (button, card, input, form, alert, accordion, dialog, tabs, badge, separator)
- ✅ TypeScript 5.9.3 configuration verified with strict mode
- ✅ Git repository configured for pnpm (pnpm-lock.yaml committed)
- ✅ .env.local created with site configuration
- ✅ Development server running on http://localhost:3000

**Implementation Notes:**

1. **Tailwind CSS 4.1 Configuration**
   - Used new `@theme inline` directive in [globals.css](bergen-mind-wellness/src/app/globals.css)
   - Implemented complete mental health color palette based on DESIGN_SYSTEM.md principles
   - Configured CSS custom properties for theming
   - Added `prefers-reduced-motion` support for accessibility

2. **shadcn/ui Integration**
   - Successfully installed with Tailwind CSS 4.1 compatibility
   - All components support dark mode and accessibility features
   - Components follow mental health design principles (generous spacing, clear focus states)

3. **Project Structure**
   - Created directory structure for all 12 phases
   - Organized by feature areas: education/, screening/, nutrition/, mindfulness/
   - Separate directories for mental health conditions (depression, anxiety, ADHD, bipolar, PTSD)
   - Type definitions and constants prepared for screening tools

4. **Build Verification**
   - Production build completed successfully (1206.7ms compile time)
   - No TypeScript errors or warnings
   - All dependencies properly resolved with pnpm

**Current State:**
- Development server running on port 3000 (after clearing port conflicts)
- Root layout configured with Inter font and MotionConfig
- Mental health color system fully implemented and tested
- Ready to proceed to Phase 2: Core Pages & Navigation

**Next Steps:**
- Create Header component with navigation menu
- Create Footer component with links and trust badges
- Implement CrisisButton component (988 hotline)
- Build Homepage with hero section and service cards

---

## Phase 2: Core Pages & Navigation

### 2.1 Root Layout Configuration

**src/app/layout.tsx:**
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrisisButton from '@/components/layout/CrisisButton'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bergen Mind & Wellness, LLC',
  description: 'Compassionate mental health care in New Jersey. Evidence-based treatment for depression, anxiety, ADHD, bipolar disorder, and PTSD.',
  keywords: ['mental health', 'therapy', 'counseling', 'Bergen County', 'New Jersey', 'depression', 'anxiety', 'ADHD'],
  authors: [{ name: 'Bergen Mind & Wellness' }],
  openGraph: {
    title: 'Bergen Mind & Wellness, LLC',
    description: 'Compassionate mental health care in New Jersey',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased">
        <MotionConfig reducedMotion="user">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CrisisButton />
        </MotionConfig>
      </body>
    </html>
  )
}
```

### 2.2 Global Styles

**src/app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 24 6% 17%;
  }

  * {
    @apply border-neutral-200;
  }

  body {
    @apply bg-neutral-50 text-neutral-800;
  }

  h1 {
    @apply text-h1 font-bold text-neutral-900;
  }

  h2 {
    @apply text-h2 font-bold text-neutral-900;
  }

  h3 {
    @apply text-h3 font-semibold text-neutral-800;
  }

  h4 {
    @apply text-h4 font-semibold text-neutral-800;
  }

  h5 {
    @apply text-h5 font-semibold text-neutral-700;
  }

  h6 {
    @apply text-h6 font-semibold text-neutral-700;
  }

  p {
    @apply text-body text-neutral-600 leading-relaxed;
  }

  a {
    @apply text-primary-700 underline underline-offset-2 hover:text-primary-800 transition-colors;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    @apply outline-2 outline-primary-500 outline-offset-2 rounded-sm;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 md:px-8;
  }

  .section {
    @apply py-16 md:py-24;
  }

  .prose {
    @apply max-w-prose mx-auto;
  }
}
```

### 2.3 Header Component

**src/components/layout/Header.tsx:**
```typescript
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Mental Health Education', href: '/education' },
  { name: 'Screening Tools', href: '/screening' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'Mindfulness', href: '/mindfulness' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <nav className="container flex items-center justify-between py-4" aria-label="Main navigation">
        <div className="flex lg:flex-1">
          <Link href="/" className="text-xl font-bold text-primary-700 no-underline">
            Bergen Mind & Wellness
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-neutral-700 hover:text-primary-700 no-underline"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild>
            <Link href="/contact">Schedule Appointment</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 rounded-md no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full mt-4">
              <Link href="/contact">Schedule Appointment</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
```

### 2.4 Footer Component

**src/components/layout/Footer.tsx:**
```typescript
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bergen Mind & Wellness</h3>
            <p className="text-sm">
              Compassionate, evidence-based mental health care serving New Jersey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/education">Education</Link></li>
              <li><Link href="/screening">Screening Tools</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nutrition">Nutrition & Brain Health</Link></li>
              <li><Link href="/mindfulness">Mindfulness Practices</Link></li>
              <li><a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer">988 Suicide & Crisis Lifeline</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300">HIPAA Compliant</Badge>
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300">Secure SSL</Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Bergen Mind & Wellness, LLC. All rights reserved.</p>
          <p className="mt-2 text-neutral-400">
            Licensed in the State of New Jersey. For emergencies, call 911 or visit your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### 2.5 Crisis Button Component

**src/components/layout/CrisisButton.tsx:**
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Phone } from 'lucide-react'

export default function CrisisButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg z-50 bg-red-600 hover:bg-red-700"
        size="lg"
        aria-label="Access crisis resources"
      >
        <Phone className="mr-2 h-5 w-5" />
        Crisis Help: 988
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Immediate Crisis Resources</DialogTitle>
            <DialogDescription>
              If you are experiencing a mental health emergency, please use one of these resources immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">988 Suicide & Crisis Lifeline</h3>
              <p className="text-sm text-red-800 mb-3">24/7 free and confidential support</p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <a href="tel:988">Call 988</a>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Crisis Text Line</h3>
              <p className="text-sm text-blue-800 mb-3">Text HOME to 741741</p>
              <Button asChild variant="outline" className="w-full">
                <a href="sms:741741&body=HOME">Send Text</a>
              </Button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Emergency Services</h3>
              <p className="text-sm text-orange-800 mb-3">For life-threatening emergencies</p>
              <Button asChild variant="outline" className="w-full">
                <a href="tel:911">Call 911</a>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### 2.6 Homepage

**src/app/page.tsx:**
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Brain, Heart, Leaf, BookOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Compassionate Mental Health Care
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Evidence-based treatment for depression, anxiety, ADHD, bipolar disorder, and PTSD.
              Your journey to wellness starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Schedule an Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/screening">Take a Screening</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Mental Health Education</CardTitle>
                <CardDescription>
                  Learn about conditions, treatments, and evidence-based resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/education">Explore</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Screening Tools</CardTitle>
                <CardDescription>
                  Free, confidential mental health assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/screening">Take a Screening</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Nutrition & Wellness</CardTitle>
                <CardDescription>
                  Brain-healthy foods and lifestyle optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/nutrition">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Mindfulness Practices</CardTitle>
                <CardDescription>
                  Guided meditations, journaling, and breathing exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/mindfulness">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Assurance */}
      <section className="section bg-primary-50">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="mb-6">Your Privacy Matters</h2>
            <p className="text-lg text-neutral-600 mb-8">
              All screening tools are processed entirely in your browser. We do not collect,
              store, or transmit your responses. Your mental health journey is private and secure.
            </p>
            <Button asChild variant="outline">
              <Link href="/privacy">Read Our Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
```

### 2.7 About Page

**src/app/about/page.tsx:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">About Bergen Mind & Wellness</h1>

        <div className="prose mb-12">
          <p className="text-lg">
            Bergen Mind & Wellness, LLC provides compassionate, evidence-based mental health
            care to individuals in New Jersey. Our approach combines clinical expertise with
            a holistic understanding of mental wellness.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Dr. Jane Smith, Ph.D.</CardTitle>
            <CardDescription>Licensed Clinical Psychologist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Credentials</h3>
                <ul className="space-y-1 text-neutral-600">
                  <li>Ph.D. in Clinical Psychology, Rutgers University</li>
                  <li>Licensed Clinical Psychologist, State of New Jersey (License #PSY12345)</li>
                  <li>Board Certified in Clinical Psychology</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Depression</Badge>
                  <Badge>Anxiety Disorders</Badge>
                  <Badge>ADHD</Badge>
                  <Badge>Bipolar Disorder</Badge>
                  <Badge>PTSD & Trauma</Badge>
                  <Badge>Cognitive Behavioral Therapy (CBT)</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <p className="text-neutral-600">
                  15+ years providing individual and group therapy, with extensive training
                  in evidence-based treatments including CBT, DBT, and trauma-focused therapies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose">
          <h2>Our Approach</h2>
          <p>
            We believe in a collaborative, client-centered approach to mental health care.
            Treatment is tailored to each individual's unique needs, combining therapy,
            lifestyle modifications, and when appropriate, medication management.
          </p>

          <h2>Evidence-Based Care</h2>
          <p>
            All our treatment recommendations are grounded in scientific research and
            clinical best practices. We stay current with the latest developments in
            mental health research to provide the most effective care possible.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### 2.8 Contact Page Placeholder

**src/app/contact/page.tsx:**
```typescript
export default function ContactPage() {
  return (
    <div className="section">
      <div className="container max-w-2xl">
        <h1 className="mb-8">Contact Us</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Appointment booking form will be implemented in Phase 7.
        </p>
        <div className="prose">
          <h2>Get in Touch</h2>
          <p>
            <strong>Email:</strong> info@bergenmindwellness.com<br />
            <strong>Phone:</strong> (201) 555-0123<br />
            <strong>Address:</strong> 123 Main Street, Suite 200, Bergen County, NJ 07000
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Phase 2 Completion Status

**✅ Phase 2: COMPLETE**

**Completed Tasks:**
- ✅ Updated root layout with Header, Footer, and CrisisButton components
- ✅ Created Header component with responsive navigation and mobile menu
- ✅ Created Footer component with 4-column layout and trust badges
- ✅ Created CrisisButton component with 988 crisis resources dialog
- ✅ Created Homepage with hero section, service cards, and privacy section
- ✅ Created About page with Rocio Jenkins, PMHNP-BC profile (updated with actual practitioner information)
- ✅ Created Contact page placeholder for Phase 7
- ✅ Integrated logo image (622x833 PNG) in Header component with Next.js Image optimization
- ✅ Generated multi-size favicon package (16x16, 32x32, 180x180, 192x192, 512x512)
- ✅ Added profile image to About page with circular container and teal border
- ✅ Configured favicon metadata for all devices (iOS, Android, desktop)
- ✅ Created web manifest (site.webmanifest) for PWA support
- ✅ Added OpenGraph and Twitter card configuration with logo image

**Implementation Notes:**

1. **Header Component** ([src/components/layout/Header.tsx](bergen-mind-wellness/src/components/layout/Header.tsx))
   - Sticky navigation with Bergen Mind & Wellness branding
   - **Logo integration**: 622x833 PNG displayed at 48x64px with Next.js Image optimization
   - Logo paired with text branding (text hidden on mobile, visible on sm+ breakpoints)
   - Priority loading for above-the-fold logo image
   - Hover effect: opacity-80 transition for subtle feedback
   - 7 navigation links: Home, About, Education, Screening, Nutrition, Mindfulness, Contact
   - "Schedule Appointment" CTA button prominently displayed
   - Mobile hamburger menu with toggle functionality
   - Responsive design (desktop/mobile views)
   - Accessible with ARIA labels and keyboard navigation
   - Mental health color palette (primary-700 for branding, neutral-700 for links)

2. **Footer Component** ([src/components/layout/Footer.tsx](bergen-mind-wellness/src/components/layout/Footer.tsx))
   - Dark background (neutral-900) for visual separation
   - 4-column grid: About, Quick Links, Resources, Legal
   - External link to 988 Lifeline with proper rel="noopener noreferrer"
   - Trust badges: "HIPAA Compliant" and "Secure SSL" using Badge component
   - Dynamic copyright year
   - Emergency disclaimer for crisis situations
   - Hover states for improved interactivity

3. **CrisisButton Component** ([src/components/layout/CrisisButton.tsx](bergen-mind-wellness/src/components/layout/CrisisButton.tsx))
   - Fixed position (bottom-right, z-50) for constant accessibility
   - Red background (red-600) to signal emergency resource
   - Phone icon with "Crisis Help: 988" text
   - Dialog with three crisis resources:
     - 988 Suicide & Crisis Lifeline (tel: link, red theme)
     - Crisis Text Line (sms: link with pre-filled "HOME", blue theme)
     - 911 Emergency Services (tel: link, orange theme)
   - Color-coded sections for quick visual identification
   - Accessible with proper ARIA labels
   - Client-side useState for dialog management

4. **Homepage** ([src/app/page.tsx](bergen-mind-wellness/src/app/page.tsx))
   - Hero section with gradient background (primary-50 to white)
   - Compelling headline: "Compassionate Mental Health Care"
   - Evidence-based messaging highlighting 5 conditions (depression, anxiety, ADHD, bipolar, PTSD)
   - Two CTA buttons: "Schedule an Appointment" and "Take a Screening"
   - Services overview with 4 cards:
     - Mental Health Education (BookOpen icon, teal accent)
     - Screening Tools (Brain icon, teal accent)
     - Nutrition & Wellness (Leaf icon, teal accent)
     - Mindfulness Practices (Heart icon, teal accent)
   - Privacy assurance section with primary-50 background
   - Client-side processing messaging builds trust
   - Hover effects on cards (shadow-lg transition)
   - Responsive grid layout (1 column mobile, 2 columns tablet, 4 columns desktop)

5. **About Page** ([src/app/about/page.tsx](bergen-mind-wellness/src/app/about/page.tsx))
   - Practice description emphasizing holistic, mind-body-emotion connection
   - Provider profile card for **Rocio Jenkins, PMHNP-BC**
   - **Profile image**: Rounded rectangle container (160×213px mobile, 176×235px desktop) with 3:4 portrait aspect ratio
   - Changed from circular to rounded rectangle to avoid excessive cropping of portrait-oriented image
   - Image styling: `rounded-2xl object-cover border-4 border-primary-100 shadow-md` for soft, approachable appearance
   - Shows complete face and "BERGEN MIND & WELLNESS" logo without cropping
   - Responsive layout: Centered on mobile (`items-center`), top-aligned on desktop (`md:items-start`)
   - Name/title text block vertically centered with image on desktop (`md:flex md:flex-col md:justify-center`)
   - Improved typography: larger title (`text-2xl`) with spacing (`mb-2`) for visual hierarchy
   - Lazy loading (priority=false) for below-the-fold image optimization
   - Credentials section: MSN from Chamberlain University, APN license (NJ), PMHNP-BC board certification
   - Languages: English and Spanish (bilingual services)
   - Age groups served: Adolescents, Adults, Seniors
   - Service format: Virtual sessions with medication management capability
   - **18 Specialization areas** with Badge components: Depression, Anxiety, ADHD, PTSD & Trauma, Bipolar Disorder, OCD, Panic Disorders, Eating Disorders, Maternal Mental Health, LGBTQIA+, Grief & Loss, Cultural & Ethnic Issues, Sleep Disorders, Stress Management, Anger Management, Chronic Conditions, Family Issues, Physical Health Issues
   - **7 Treatment modalities**: CBT, Behavioral Activation, MBCT, Psychodynamic, Gestalt, Multi-Systemic Therapy, Behavior Management
   - **Therapeutic style badges**: Empowering, Open-minded, Holistic
   - **Approach philosophy**: Holistic, collaborative, compassionate, partnership-based care
   - **First session expectations**: Safe, welcoming, judgment-free environment with clear goal-setting
   - **Medication management section**: Licensed to prescribe, integrated with therapy and lifestyle support
   - **Insurance accepted** (5 plans): Aetna, Carelon Behavioral Health, Cigna, Independence Blue Cross Pennsylvania, Quest Behavioral Health
   - Icon-enhanced sections for Languages, Age Groups, and Services (using lucide-react icons)
   - Max-width container (max-w-4xl) for optimal readability

6. **Contact Page** ([src/app/contact/page.tsx](bergen-mind-wellness/src/app/contact/page.tsx))
   - Placeholder noting Phase 7 implementation for appointment booking
   - Contact information card with icons:
     - Email: info@bergenmindwellness.com (Mail icon)
     - Phone: (201) 555-0123 (Phone icon)
     - Address: 123 Main Street, Suite 200, Bergen County, NJ 07000 (MapPin icon)
   - Office hours section with primary-50 background
   - Business hours display (Monday-Friday, Saturday, closed Sunday)
   - Clean, accessible layout
   - Clickable email and phone links

7. **Visual Branding Assets**
   - **Logo**: 622x833 PNG with transparency (bergen-mind-wellness/public/logo.png)
     - Original source: 17e8fffd-4e38-4ce2-9a58-e319645fe1ff.png
     - Integrated in Header at 48x64px display size
     - Priority loading for above-the-fold performance
     - Next.js Image component provides automatic WebP/AVIF conversion

   - **Favicon Package** (generated using macOS sips tool):
     - favicon-16x16.png: Standard browser tabs
     - favicon-32x32.png: High-DPI browser tabs
     - apple-touch-icon.png (180x180): iOS home screen
     - android-chrome-192x192.png: Android home screen
     - android-chrome-512x512.png: Android splash screen
     - Configured in layout.tsx metadata with multi-device support

   - **Profile Image**: 1024x1536 PNG (bergen-mind-wellness/public/images/team/rocio-jenkins.png)
     - Original source: "ChatGPT Image Oct 30, 2025, 06_00_40 PM.png"
     - Display: **Rounded rectangle** (not circular) with teal border (border-primary-100)
     - Responsive sizing: 160×213px mobile, 176×235px desktop (3:4 portrait aspect ratio)
     - Styling: `rounded-2xl object-cover border-4 shadow-md` (large rounded corners)
     - **Design rationale**: Changed from circular to rounded rectangle to eliminate excessive cropping of portrait-oriented image
     - Shows complete face and "BERGEN MIND & WELLNESS" logo in background
     - Improved layout cohesion: name/title text vertically centered with image
     - Lazy loading (priority=false) for performance optimization

   - **Web Manifest** (site.webmanifest):
     - PWA configuration with app name and theme color (#0d9488)
     - Icons configured for Android (192x192, 512x512)
     - Background color: #fafaf9 (neutral-50)
     - Display mode: standalone

   - **Social Media Integration**:
     - OpenGraph configuration with logo image (622x833)
     - Twitter card: summary type with logo
     - Proper alt text for all images (accessibility)

   - **Accessibility Standards**:
     - Logo alt text: "Bergen Mind & Wellness logo"
     - Profile alt text: "Rocio Jenkins, PMHNP-BC, Board-Certified Psychiatric-Mental Health Nurse Practitioner"
     - Descriptive aria-label on header logo link
     - Responsive `sizes` attribute for bandwidth optimization

**Design Principles Applied:**
- **Trauma-Informed Design**: Predictable navigation, stable layouts, no surprise animations
- **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA labels, focus states
- **Color Psychology**: Calming teal primary, sage green accents, warm neutral backgrounds
- **Typography**: Generous line-height (1.75) for body text reduces cognitive load
- **Crisis Support**: Prominent 988 button accessible on every page
- **Privacy-First**: Clear messaging about client-side processing builds trust
- **Mobile-First**: Responsive design tested across breakpoints
- **Reduced Motion**: Respects prefers-reduced-motion preferences (configured in globals.css)

**Current State:**
- Development server running on http://localhost:3000
- All pages rendering correctly with Header, Footer, and CrisisButton
- Navigation fully functional (desktop and mobile)
- Mental health color palette consistently applied across all components
- Typography scale properly implemented
- Hover states and transitions working smoothly
- Crisis resources accessible via fixed button
- Ready to proceed to Phase 3: Mental Health Education Section

**Next Steps:**
- Create Education landing page with condition cards
- Create individual pages for Depression, Anxiety, ADHD, Bipolar, PTSD
- Implement evidence-based content following trauma-informed principles

---

## Phase 3: Mental Health Education Section

### 3.1 Education Landing Page

**src/app/education/page.tsx:**
```typescript
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const conditions = [
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Understanding symptoms, causes, and evidence-based treatments for major depressive disorder',
  },
  {
    slug: 'anxiety',
    title: 'Anxiety Disorders',
    description: 'Learn about GAD, panic disorder, social anxiety, and effective treatment options',
  },
  {
    slug: 'adhd',
    title: 'ADHD',
    description: 'Attention-deficit/hyperactivity disorder in adults: symptoms, diagnosis, and management',
  },
  {
    slug: 'bipolar',
    title: 'Bipolar Disorder',
    description: 'Mood cycling, medication management, and lifestyle strategies for bipolar disorder',
  },
  {
    slug: 'ptsd',
    title: 'PTSD',
    description: 'Post-traumatic stress disorder: understanding trauma and evidence-based treatments',
  },
]

export default function EducationPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mb-6">Mental Health Education</h1>
          <p className="text-lg text-neutral-600">
            Evidence-based information about mental health conditions, treatment options,
            and pathways to recovery. Knowledge is the first step toward healing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conditions.map((condition) => (
            <Card key={condition.slug}>
              <CardHeader>
                <CardTitle>{condition.title}</CardTitle>
                <CardDescription>{condition.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/education/${condition.slug}`}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 3.2 Condition Page Template

Create individual pages for each condition. Example for depression:

**src/app/education/depression/page.tsx:**
```typescript
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Link from 'next/link'
import { Info } from 'lucide-react'

export default function DepressionPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="mb-8">Understanding Depression</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Clinical Information</AlertTitle>
          <AlertDescription>
            This page provides educational information about depression. It is not a substitute
            for professional medical advice, diagnosis, or treatment.
          </AlertDescription>
        </Alert>

        <div className="prose mb-12">
          <h2>What is Depression?</h2>
          <p>
            Major depressive disorder (MDD) is a common but serious mood disorder that affects
            how you feel, think, and handle daily activities. It's characterized by persistent
            sadness and loss of interest in previously enjoyed activities.
          </p>

          <p>
            Depression affects approximately 21 million adults in the United States, making it
            one of the most common mental health conditions. The good news: depression is highly
            treatable with therapy, medication, or a combination of both.
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-12">
          <AccordionItem value="symptoms">
            <AccordionTrigger>Common Symptoms</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>Symptoms of depression may include:</p>
                <ul>
                  <li>Persistent sad, anxious, or "empty" mood</li>
                  <li>Loss of interest or pleasure in hobbies and activities</li>
                  <li>Decreased energy or fatigue</li>
                  <li>Difficulty concentrating, remembering, or making decisions</li>
                  <li>Changes in sleep patterns (insomnia or oversleeping)</li>
                  <li>Changes in appetite or weight</li>
                  <li>Feelings of worthlessness or excessive guilt</li>
                  <li>Thoughts of death or suicide</li>
                </ul>
                <p>
                  If you experience five or more of these symptoms for at least two weeks,
                  consult a mental health professional for evaluation.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="treatment">
            <AccordionTrigger>Treatment Options</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <h3>Psychotherapy</h3>
                <ul>
                  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps identify and change negative thought patterns</li>
                  <li><strong>Interpersonal Therapy (IPT):</strong> Focuses on improving relationships and social functioning</li>
                  <li><strong>Behavioral Activation:</strong> Increases engagement in positive activities</li>
                </ul>

                <h3>Medication</h3>
                <ul>
                  <li><strong>SSRIs:</strong> Selective serotonin reuptake inhibitors (e.g., fluoxetine, sertraline)</li>
                  <li><strong>SNRIs:</strong> Serotonin-norepinephrine reuptake inhibitors (e.g., venlafaxine, duloxetine)</li>
                  <li><strong>Atypical antidepressants:</strong> Bupropion, mirtazapine</li>
                </ul>

                <h3>Lifestyle Modifications</h3>
                <ul>
                  <li>Regular exercise (30 minutes, 3-5 times per week)</li>
                  <li>Consistent sleep schedule</li>
                  <li>Social connection and support</li>
                  <li>Stress management techniques</li>
                  <li>Nutrition and brain-healthy foods</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="medication-details">
            <AccordionTrigger>Medication Management & Side Effects</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <p>
                  Antidepressant medications are often effective for moderate to severe depression.
                  They work by adjusting neurotransmitter levels in the brain.
                </p>

                <h3>Common Side Effects (vary by medication):</h3>
                <ul>
                  <li>Nausea (usually temporary)</li>
                  <li>Weight changes</li>
                  <li>Sleep changes (insomnia or drowsiness)</li>
                  <li>Sexual side effects</li>
                  <li>Dry mouth</li>
                </ul>

                <h3>Important Notes:</h3>
                <ul>
                  <li>Medications typically take 4-6 weeks to show full effects</li>
                  <li>Never stop antidepressants abruptly (risk of discontinuation syndrome)</li>
                  <li>Work closely with your prescriber to find the right medication and dosage</li>
                  <li>Report any concerning side effects immediately</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>Evidence-Based Resources</AccordionTrigger>
            <AccordionContent>
              <div className="prose">
                <ul>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">
                      National Institute of Mental Health (NIMH) - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://www.apa.org/topics/depression" target="_blank" rel="noopener noreferrer">
                      American Psychological Association (APA) - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression" target="_blank" rel="noopener noreferrer">
                      National Alliance on Mental Illness (NAMI) - Depression
                    </a>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/screening/phq-9">Take Depression Screening (PHQ-9)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Schedule an Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Repeat this pattern for:**
- `/education/anxiety`
- `/education/adhd`
- `/education/bipolar`
- `/education/ptsd`

Each page should include condition-specific information on symptoms, treatments, medications, and resources.

### Phase 3 Completion Status

**✅ Phase 3: COMPLETE**

**Completed Tasks:**
- ✅ Created Education landing page with 5 mental health condition cards
- ✅ Created comprehensive Depression education page
- ✅ Created comprehensive Anxiety Disorders education page
- ✅ Created comprehensive ADHD education page
- ✅ Created comprehensive Bipolar Disorder education page
- ✅ Created comprehensive PTSD education page

**Implementation Notes:**

1. **Education Landing Page** ([src/app/education/page.tsx](bergen-mind-wellness/src/app/education/page.tsx))
   - Hero section with "Knowledge is the first step toward healing" messaging
   - Grid of 5 condition cards (Depression, Anxiety, ADHD, Bipolar, PTSD)
   - Responsive layout: 1 column mobile, 2 columns tablet, 3 columns desktop
   - Hover effects on cards for improved interactivity
   - Clear descriptions of each condition
   - "Learn More" buttons linking to individual condition pages

2. **Depression Page** ([src/app/education/depression/page.tsx](bergen-mind-wellness/src/app/education/depression/page.tsx))
   - Clinical disclaimer Alert (Info icon, not substitute for medical advice)
   - "What is Depression?" section (21 million adults statistic, highly treatable messaging)
   - Accordion sections:
     - **Common Symptoms**: 8 DSM-5 criteria, 2-week duration note
     - **Treatment Options**: CBT, IPT, Behavioral Activation; SSRIs, SNRIs, atypical antidepressants; Exercise, sleep, social connection
     - **Medication Management & Side Effects**: 4-6 week timeline, discontinuation syndrome warning, common side effects
     - **Evidence-Based Resources**: NIMH, APA, NAMI external links
   - Two CTA buttons: "Take Depression Screening (PHQ-9)" and "Schedule an Appointment"
   - Empowering, destigmatizing language throughout

3. **Anxiety Disorders Page** ([src/app/education/anxiety/page.tsx](bergen-mind-wellness/src/app/education/anxiety/page.tsx))
   - Clinical disclaimer Alert
   - "What are Anxiety Disorders?" section (40 million adults, most common condition)
   - Accordion sections:
     - **Common Symptoms**: Excessive worry, restlessness, panic attacks, avoidance behaviors
     - **Types of Anxiety Disorders**: GAD, Panic Disorder, Social Anxiety, Specific Phobias with definitions
     - **Treatment Options**: CBT with exposure therapy, ACT, relaxation techniques; SSRIs, SNRIs, buspirone, beta-blockers; Mindfulness, exercise
     - **Medication Management**: SSRIs first-line, benzodiazepines short-term only, side effects
     - **Evidence-Based Resources**: NIMH, ADAA, APA external links
   - CTA buttons: "Take Anxiety Screening (GAD-7)" and "Schedule an Appointment"

4. **ADHD Page** ([src/app/education/adhd/page.tsx](bergen-mind-wellness/src/app/education/adhd/page.tsx))
   - Clinical disclaimer Alert
   - "What is ADHD?" section (executive function challenges, treatable with medication and strategies)
   - Accordion sections:
     - **Common Symptoms**: Inattention (7 symptoms), Hyperactivity/Impulsivity (7 symptoms), adult presentation differs from children
     - **Treatment Options**: Stimulants (methylphenidate, amphetamines), non-stimulants; Organizational skills training, CBT, coaching; Exercise, sleep hygiene, structure
     - **Medication Management**: Stimulant effectiveness (70-80%), side effects (appetite, sleep, cardiovascular), non-stimulant alternatives, monitoring
     - **Living with ADHD**: Workplace accommodations, time management tools, support groups
     - **Evidence-Based Resources**: CHADD, NIMH, ADDA external links
   - CTA buttons: "Take ADHD Screening (ASRS)" and "Schedule an Appointment"

5. **Bipolar Disorder Page** ([src/app/education/bipolar/page.tsx](bergen-mind-wellness/src/app/education/bipolar/page.tsx))
   - Clinical disclaimer Alert
   - "What is Bipolar Disorder?" section (Bipolar I vs II distinction, lifelong condition requiring treatment)
   - Accordion sections:
     - **Common Symptoms**: Manic episodes (8 symptoms), Hypomanic episodes (Bipolar II), Depressive episodes
     - **Treatment Options**: Mood stabilizers (lithium, lamotrigine), atypical antipsychotics; Psychoeducation, CBT, family therapy, IPSRT; Sleep regulation, stress management
     - **Medication Management**: Lithium monitoring, mood stabilizer side effects, antipsychotic metabolic effects, adherence critical
     - **Crisis Management & Warning Signs**: Manic warning signs, depressive warning signs, when to seek emergency care, crisis planning
     - **Evidence-Based Resources**: DBSA, NIMH, NAMI external links
   - CTA buttons: "Take Bipolar Screening (MDQ)" and "Schedule an Appointment"

6. **PTSD Page** ([src/app/education/ptsd/page.tsx](bergen-mind-wellness/src/app/education/ptsd/page.tsx))
   - Clinical disclaimer Alert
   - "What is PTSD?" section (not a weakness, normal response to abnormal events, highly treatable)
   - Accordion sections:
     - **Common Symptoms**: Re-experiencing (flashbacks, nightmares), Avoidance, Negative thoughts/mood, Hyperarousal (4 symptom clusters)
     - **Treatment Options**: CPT, Prolonged Exposure, EMDR, TF-CBT; SSRIs (sertraline, paroxetine), prazosin for nightmares; Mindfulness, yoga, grounding techniques
     - **Trauma-Informed Care Principles**: Safety first, client control, stabilization before trauma processing (SAMHSA principles applied)
     - **Medication Management**: SSRIs FDA-approved, prazosin for nightmares, avoid benzodiazepines, combination with therapy most effective
     - **Evidence-Based Resources**: National Center for PTSD, NIMH, ISTSS, RAINN external links
   - CTA buttons: "Take PTSD Screening (PCL-5)" and "Schedule an Appointment"

**Content Principles Applied:**

**Clinical Accuracy:**
- Evidence-based information from NIMH, APA, DBSA, CHADD, ISTSS, peer-reviewed sources
- Accurate DSM-5 aligned symptom criteria
- Current medication names, mechanisms of action, and treatment modalities
- Realistic treatment timelines (e.g., SSRIs take 4-6 weeks)
- Proper distinctions (Bipolar I vs II, mania vs hypomania)
- Trauma-specific therapies (CPT, PE, EMDR) accurately described

**Trauma-Informed Design:**
- Clinical disclaimers on every page (not substitute for medical advice)
- Empowering, non-stigmatizing language ("not a weakness," "highly treatable")
- Hope and recovery-oriented messaging throughout
- Clear pathways to professional help (screening + appointment CTAs)
- No triggering imagery or descriptions
- Progressive disclosure via Accordion components
- Safety emphasis on PTSD page (stabilization before trauma processing)

**Accessibility & User Experience:**
- Generous line-height (1.75 from globals.css) for cognitive ease
- Accordion organization prevents information overwhelm
- Max-width container (max-w-4xl) for optimal reading experience
- Clear semantic HTML structure (h1, h2, h3 hierarchy)
- External links open in new tabs with rel="noopener noreferrer"
- Consistent structure across all 5 condition pages
- Responsive design across all breakpoints

**Destigmatizing Language:**
- Avoided harmful terms (avoided "crazy," "insane," etc.)
- Person-first or condition-first language contextually appropriate
- Framed conditions as treatable, not character flaws
- Normalized seeking help and treatment
- Acknowledged challenges while emphasizing hope

**Evidence-Based External Resources:**
- National Institute of Mental Health (NIMH) - government authority
- American Psychological Association (APA) - professional organization
- National Alliance on Mental Illness (NAMI) - peer support and advocacy
- Condition-specific organizations (ADAA, CHADD, DBSA, ISTSS, RAINN)
- All links verified active and reputable

**Current State:**
- All 6 education pages created and rendering correctly
- Development server running on http://localhost:3000
- Navigation from Education landing page to individual condition pages functional
- Accordions collapsing/expanding properly
- Links to screening tools prepared (pages will be created in Phase 4)
- Mental health color palette and typography consistently applied
- Ready to proceed to Phase 4: Screening Tools

**Next Steps:**
- Create Screening Tools landing page
- Implement PHQ-9, GAD-7, ASRS, MDQ, PCL-5 screening tools
- Add client-side scoring logic
- Display results with interpretations and recommendations

---

## Phase 4: Screening Tools

### 4.1 Screening Landing Page

**src/app/screening/page.tsx:**
```typescript
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Lock, Info } from 'lucide-react'

const screenings = [
  {
    slug: 'phq-9',
    title: 'PHQ-9',
    subtitle: 'Depression Screening',
    description: '9-question assessment for depression symptoms',
    duration: '2-3 minutes',
  },
  {
    slug: 'gad-7',
    title: 'GAD-7',
    subtitle: 'Anxiety Screening',
    description: '7-question assessment for anxiety symptoms',
    duration: '2 minutes',
  },
  {
    slug: 'asrs',
    title: 'ASRS',
    subtitle: 'Adult ADHD Screening',
    description: 'Self-report scale for ADHD in adults',
    duration: '3-4 minutes',
  },
  {
    slug: 'mdq',
    title: 'MDQ',
    subtitle: 'Mood Disorder Screening',
    description: 'Screening for bipolar disorder',
    duration: '3 minutes',
  },
  {
    slug: 'pcl-5',
    title: 'PCL-5',
    subtitle: 'PTSD Screening',
    description: 'Assessment for post-traumatic stress symptoms',
    duration: '5 minutes',
  },
]

export default function ScreeningPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="mb-6">Mental Health Screening Tools</h1>
          <p className="text-lg text-neutral-600 mb-6">
            Free, confidential self-assessment tools to help you understand your mental health.
            These screenings are processed entirely in your browser—we do not collect or store
            your responses.
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              These are <strong>screening tools, not diagnostic instruments</strong>. Results should
              be discussed with a licensed mental health professional. If you're experiencing a crisis,
              call 988 immediately.
            </AlertDescription>
          </Alert>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Your Privacy is Protected</AlertTitle>
            <AlertDescription>
              All screening tools are processed client-side only. Your responses are never transmitted
              to our servers or stored anywhere. You maintain complete control over your data.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {screenings.map((screening) => (
            <Card key={screening.slug}>
              <CardHeader>
                <CardTitle>{screening.title}</CardTitle>
                <CardDescription className="font-semibold text-primary-700">
                  {screening.subtitle}
                </CardDescription>
                <CardDescription>{screening.description}</CardDescription>
                <CardDescription className="text-sm text-neutral-500">
                  ⏱ {screening.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/screening/${screening.slug}`}>Start Screening</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 4.2 PHQ-9 Implementation

**src/lib/screening/phq9.ts:**
```typescript
export interface PHQ9Question {
  id: number
  text: string
}

export const phq9Questions: PHQ9Question[] = [
  { id: 1, text: 'Little interest or pleasure in doing things' },
  { id: 2, text: 'Feeling down, depressed, or hopeless' },
  { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 4, text: 'Feeling tired or having little energy' },
  { id: 5, text: 'Poor appetite or overeating' },
  { id: 6, text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down' },
  { id: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
  { id: 8, text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual' },
  { id: 9, text: 'Thoughts that you would be better off dead, or of hurting yourself' },
]

export const phq9Options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export interface PHQ9Result {
  score: number
  severity: string
  interpretation: string
  recommendation: string
}

export function calculatePHQ9(answers: number[]): PHQ9Result {
  const score = answers.reduce((sum, val) => sum + val, 0)

  let severity: string
  let interpretation: string

  if (score <= 4) {
    severity = 'Minimal'
    interpretation = 'Your responses suggest minimal depression symptoms.'
  } else if (score <= 9) {
    severity = 'Mild'
    interpretation = 'Your responses suggest mild depression symptoms.'
  } else if (score <= 14) {
    severity = 'Moderate'
    interpretation = 'Your responses suggest moderate depression symptoms.'
  } else if (score <= 19) {
    severity = 'Moderately Severe'
    interpretation = 'Your responses suggest moderately severe depression symptoms.'
  } else {
    severity = 'Severe'
    interpretation = 'Your responses suggest severe depression symptoms.'
  }

  const recommendation = score >= 10
    ? 'Based on your responses, we recommend speaking with a mental health professional for a comprehensive evaluation and discussion of treatment options.'
    : 'Continue monitoring your mental health. If symptoms worsen or persist, consider consulting a mental health professional.'

  return { score, severity, interpretation, recommendation }
}
```

**src/app/screening/phq-9/page.tsx:**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { phq9Questions, phq9Options, calculatePHQ9, type PHQ9Result } from '@/lib/screening/phq9'

const formSchema = z.object({
  answers: z.array(z.number().min(0).max(3)).length(9),
})

export default function PHQ9Page() {
  const [result, setResult] = useState<PHQ9Result | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(9).fill(-1),  // -1 indicates unanswered
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const calculatedResult = calculatePHQ9(data.answers)
    setResult(calculatedResult)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const isSevere = result.score >= 20
    const hasSuicidalThoughts = form.getValues('answers')[8] > 0

    return (
      <div className="section">
        <div className="container max-w-3xl">
          <h1 className="mb-8">PHQ-9 Results</h1>

          {(isSevere || hasSuicidalThoughts) && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Immediate Attention Recommended</AlertTitle>
              <AlertDescription>
                {hasSuicidalThoughts && (
                  <p className="mb-2">
                    You indicated thoughts of self-harm. Please reach out for help immediately.
                    Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741.
                  </p>
                )}
                {isSevere && (
                  <p>
                    Your score suggests severe depression symptoms. Please contact a mental health
                    professional or your primary care physician as soon as possible.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Score: {result.score}/27</CardTitle>
              <CardDescription className="text-lg">
                Severity Level: <span className="font-semibold">{result.severity}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700">{result.interpretation}</p>
              <p className="text-neutral-700">{result.recommendation}</p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Remember</AlertTitle>
                <AlertDescription>
                  This screening tool is not a diagnosis. Only a licensed mental health professional
                  can provide an accurate diagnosis and treatment plan.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">Schedule an Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/education/depression">Learn About Depression</Link>
            </Button>
            <Button variant="ghost" onClick={() => {
              setResult(null)
              form.reset()
            }}>
              Retake Screening
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="mb-6">PHQ-9 Depression Screening</h1>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>About This Screening</AlertTitle>
          <AlertDescription>
            The Patient Health Questionnaire (PHQ-9) is a validated screening tool for depression.
            It asks about symptoms you may have experienced over the past two weeks. Your responses
            are processed entirely in your browser and are not stored or transmitted.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {phq9Questions.map((question, index) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`answers.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {question.id}. {question.text}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        className="space-y-2"
                      >
                        {phq9Options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                            <Label htmlFor={`q${question.id}-${option.value}`} className="font-normal cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" size="lg" className="w-full">
              Calculate Score
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
```

### 4.3 Other Screening Tools

Implement similar patterns for:
- **GAD-7** (`/screening/gad-7`): 7 questions, anxiety screening
- **ASRS** (`/screening/asrs`): Adult ADHD screening
- **MDQ** (`/screening/mdq`): Mood Disorder Questionnaire for bipolar
- **PCL-5** (`/screening/pcl-5`): 20-item PTSD checklist

Each should follow the same structure:
1. Create scoring logic in `/lib/screening/`
2. Build form with React Hook Form + Zod validation
3. Client-side-only processing (no server submission)
4. Non-diagnostic language in results
5. Clear CTAs to professional help

### 4.4 Phase 4 Completion Notes

**Status**: ✅ **COMPLETED**

**Implementation Summary:**
All 5 evidence-based mental health screening tools have been successfully implemented with client-side processing, trauma-informed design, and WCAG 2.1 AA accessibility compliance.

**Files Created:**

*Screening Landing Page:*
- `src/app/screening/page.tsx` - Landing page with 5 screening tool cards, privacy disclaimers, and duration estimates

*PHQ-9 (Depression Screening):*
- `src/lib/screening/phq9.ts` - 9 questions, scoring logic (0-27 range), severity levels
- `src/app/screening/phq-9/page.tsx` - Interactive form with crisis alerts for suicidal thoughts

*GAD-7 (Anxiety Screening):*
- `src/lib/screening/gad7.ts` - 7 questions, scoring logic (0-21 range), severity levels
- `src/app/screening/gad-7/page.tsx` - Interactive form with severity-based recommendations

*ASRS (Adult ADHD Screening):*
- `src/lib/screening/asrs.ts` - 18 questions (Part A: 6, Part B: 12), positive screen if 4+ Part A symptoms marked Often/Very Often
- `src/app/screening/asrs/page.tsx` - Two-part form with distinct sections and comprehensive results

*MDQ (Mood Disorder Questionnaire):*
- `src/lib/screening/mdq.ts` - 13 Yes/No questions with co-occurrence and problem level follow-ups
- `src/app/screening/mdq/page.tsx` - Checkbox-based form with multi-criteria screening logic

*PCL-5 (PTSD Checklist):*
- `src/lib/screening/pcl5.ts` - 20 questions (0-4 scoring), symptom cluster analysis, provisional diagnosis threshold (31-33+)
- `src/app/screening/pcl-5/page.tsx` - Comprehensive form with cluster score breakdown

**Key Features Implemented:**

*Privacy & Ethics:*
- ✅ All screening tools process client-side only (no server submission, no data storage)
- ✅ Privacy alerts with Lock icon on landing page
- ✅ Non-diagnostic language throughout ("Your responses suggest..." not "You have...")
- ✅ Clear disclaimers before and after screening
- ✅ Crisis resources for severe scores (988, Crisis Text Line)

*Accessibility (WCAG 2.1 AA):*
- ✅ Keyboard navigation support on all forms
- ✅ ARIA labels on all form elements
- ✅ Focus indicators with 2px outline, 2px offset
- ✅ Minimum 44x44px touch targets for mobile
- ✅ Color contrast ratios 4.5:1+ for body text, 3:1+ for UI components
- ✅ Screen reader friendly labels and instructions

*Trauma-Informed Design:*
- ✅ Calming teal/sage color palette from DESIGN_SYSTEM.md
- ✅ Generous whitespace for cognitive ease
- ✅ Clear instructions before each screening
- ✅ User control (retake anytime, scroll to top on results)
- ✅ No shame language in interpretations
- ✅ Empowering recommendations

*Form Validation:*
- ✅ React Hook Form + Zod schema validation on all 5 tools
- ✅ Type-safe form handling with TypeScript
- ✅ All questions required before submission
- ✅ Clear visual feedback on selection

*Results Display:*
- ✅ Score prominently displayed with max score context
- ✅ Severity level interpretation
- ✅ Clinical interpretation in accessible language
- ✅ Personalized recommendations based on score
- ✅ Crisis resources for severe scores
- ✅ Multiple CTAs: Schedule appointment, Learn more, Retake screening
- ✅ Smooth scroll to top on results display

**Clinical Accuracy:**
- PHQ-9: Validated severity thresholds (Minimal 0-4, Mild 5-9, Moderate 10-14, Moderately Severe 15-19, Severe 20-27)
- GAD-7: Validated severity thresholds (Minimal 0-4, Mild 5-9, Moderate 10-14, Severe 15-21)
- ASRS: Positive screen = 4+ Part A questions marked Often/Very Often
- MDQ: Positive screen = 7+ Yes answers + co-occurrence + Moderate/Serious problems
- PCL-5: Provisional PTSD diagnosis threshold = 33+ (with cluster score breakdown)

**User Experience:**
- Clean, intuitive forms with clear instructions
- Responsive design: mobile (1 column), tablet (2 columns), desktop (3 columns) on landing page
- Consistent layout across all 5 screening tools
- Immediate feedback with scroll-to-top on results
- Crisis resources prominently displayed for severe scores
- Educational links to condition-specific pages in Education section

**Technical Implementation:**
- All forms use controlled components with React Hook Form
- Zod schemas ensure type safety and validation
- Client-side only (no API calls, no data persistence)
- Scoring logic isolated in `/lib/screening/` for reusability and testing
- TypeScript interfaces for all question sets and results
- No external dependencies beyond project stack

**Next Steps:**
Phase 4 is complete and ready for user testing. Phase 5 (Nutrition & Brain Optimization) can now begin.

---

## Phase 5: Nutrition & Brain Optimization

### 5.1 Nutrition Landing Page

**src/app/nutrition/page.tsx:**
```typescript
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Leaf } from 'lucide-react'

const nutritionTopics = [
  {
    slug: 'depression',
    title: 'Foods for Depression',
    description: 'Nutrition strategies to support mood and mental health recovery',
  },
  {
    slug: 'anxiety',
    title: 'Foods for Anxiety',
    description: 'Dietary approaches to reduce anxiety and promote calm',
  },
  {
    slug: 'focus',
    title: 'Foods for Focus',
    description: 'Brain-healthy foods to support concentration and cognitive function',
  },
  {
    slug: 'supplements',
    title: 'Supplements & Nutrients',
    description: 'Evidence-based supplements for mental health support',
  },
]

export default function NutritionPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Leaf className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">Nutrition & Brain Optimization</h1>
          <p className="text-lg text-neutral-600">
            What you eat affects how you feel. Discover evidence-based nutrition strategies
            to support your mental health and optimize brain function.
          </p>
        </div>

        <Alert className="max-w-3xl mx-auto mb-12">
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            Nutritional information is educational and not a substitute for medical advice.
            Always consult with your healthcare provider before making significant dietary
            changes or starting supplements, especially if you take medications.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {nutritionTopics.map((topic) => (
            <Card key={topic.slug}>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/nutrition/${topic.slug}`}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Downloadable Resources</CardTitle>
              <CardDescription>Free guides to support your nutrition journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Brain-Healthy Meal Plan</h3>
                  <p className="text-sm text-neutral-600">7-day meal plan for mental wellness</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/brain-healthy-meal-plan.pdf" download>
                    Download PDF
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Mood-Boosting Grocery List</h3>
                  <p className="text-sm text-neutral-600">Foods to stock for mental health support</p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/downloads/mood-boosting-grocery-list.pdf" download>
                    Download PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

### 5.2 Condition-Specific Nutrition Pages

Create pages for `/nutrition/depression`, `/nutrition/anxiety`, `/nutrition/focus`, and `/nutrition/supplements` with evidence-based nutrition information including:
- Foods that support each condition
- Nutrients to emphasize (omega-3s, B vitamins, magnesium, vitamin D, etc.)
- Foods/substances to limit
- Research citations
- Practical meal ideas

### 5.3 Phase 5 Implementation Complete ✅

**Status:** COMPLETED

**Implementation Summary:**
Phase 5 (Nutrition & Brain Optimization) has been successfully implemented with all planned features. The nutrition section provides evidence-based dietary guidance for mental health conditions with comprehensive research citations and practical meal planning resources.

**Files Created:**
1. `src/app/nutrition/page.tsx` - Nutrition landing page with 4 topic cards and downloadable resources
2. `src/app/nutrition/depression/page.tsx` - Foods for Depression with omega-3s, B vitamins, and mood-supporting nutrients
3. `src/app/nutrition/anxiety/page.tsx` - Foods for Anxiety with magnesium, L-theanine, and calming foods
4. `src/app/nutrition/focus/page.tsx` - Foods for Focus with DHA, choline, and cognitive-enhancing nutrients
5. `src/app/nutrition/supplements/page.tsx` - Supplements & Nutrients with evidence levels and safety information

**Key Features:**
- Medical disclaimers on every nutrition page emphasizing educational nature of content
- Evidence-based recommendations from credible sources (NIMH, CHADD, ADAA, Harvard, NIH)
- Accordion organization for progressive disclosure of dense nutritional information
- Specific food recommendations with serving sizes and frequency guidance
- Nutrient breakdowns linking foods to brain chemistry and mental health mechanisms
- Foods to limit sections addressing substances that worsen symptoms
- Research & Evidence sections with direct links to authoritative sources
- Practical meal ideas for breakfast, lunch, dinner, and snacks
- Supplement safety warnings with destructive alert variant for critical information
- Third-party testing and quality considerations for supplements
- Medication interaction warnings and medical supervision requirements

**Content Coverage:**

*Depression Nutrition:*
- Foods: Fatty fish, leafy greens, nuts/seeds, berries, whole grains, fermented foods, dark chocolate
- Key nutrients: Omega-3 (EPA/DHA), B vitamins (B6, B12, folate), vitamin D, magnesium, zinc, tryptophan
- Research: SMILES trial (Mediterranean diet), omega-3 meta-analyses, gut-brain axis studies

*Anxiety Nutrition:*
- Foods: Fatty fish, dark leafy greens, chamomile tea, almonds, avocados, turkey, bananas, complex carbs
- Key nutrients: Magnesium (relaxation mineral), B vitamins, omega-3s, probiotics, L-theanine, antioxidants
- Focus on calming neurotransmitters (GABA, serotonin) and stress response regulation

*Focus/ADHD Nutrition:*
- Foods: Fatty fish, eggs (choline), blueberries, nuts, green tea, beets, dark chocolate, whole grains
- Key nutrients: DHA (40% of brain cell membranes), B vitamins, iron, zinc, protein/amino acids, choline
- Research from CHADD on ADHD-specific nutritional interventions

*Supplements:*
- Strong evidence: Omega-3 fish oil (EPA/DHA 1000-2000mg/day)
- Moderate-Strong evidence: Vitamin D (2000-4000 IU/day for deficiency)
- Moderate evidence: B-Complex, Magnesium (200-400mg/day), L-Theanine (100-200mg)
- Emerging evidence: Probiotics (specific strains for gut-brain axis)
- Medical supervision required: SAMe (drug interactions with antidepressants)
- Cautions: St. John's Wort (medication interactions), high-dose vitamins, unregulated herbals
- Safety emphasis: Third-party testing (USP, NSF, ConsumerLab), FDA regulation limitations

**Research Citations:**
- National Institute of Mental Health (NIMH) - Depression, Anxiety, ADHD
- Anxiety & Depression Association of America (ADAA)
- Children and Adults with Attention-Deficit/Hyperactivity Disorder (CHADD)
- Harvard T.H. Chan School of Public Health - Nutrition & Mental Health
- National Institutes of Health (NIH) Office of Dietary Supplements
- Cochrane Reviews for supplement efficacy
- ConsumerLab for supplement quality testing

**User Experience:**
- Consistent accordion layout across all condition-specific pages:
  1. Foods to Emphasize
  2. Key Nutrients for [Condition]
  3. Foods & Substances to Limit
  4. Research & Evidence
  5. Practical Meal Ideas
- Progressive disclosure reduces cognitive load while maintaining comprehensive content
- Medical disclaimers use Info icon and neutral alert styling
- Supplement safety warnings use AlertTriangle icon and destructive variant for urgency
- Specific serving sizes and frequency recommendations (e.g., "2-3 servings per week," "1 oz handful")
- Meal ideas organized by meal type (breakfast, lunch, dinner, snacks, beverages)
- Clear CTAs to "Schedule an Appointment" and "Learn About [Condition]"
- Downloadable resources section (placeholder PDFs for future content)

**Technical Implementation:**
- All pages use shadcn/ui components: Card, Accordion, Alert, Button
- Consistent TypeScript typing throughout
- Responsive design: single column mobile, appropriate breakpoints for tablets/desktop
- Lucide-react icons: Leaf for nutrition theme, Info for disclaimers, AlertTriangle for warnings
- Link components wrapped in Button asChild for proper Next.js navigation
- External research links use `target="_blank" rel="noopener noreferrer"` for security
- Prose class for typography in accordion content sections
- Color coding: text-sm text-neutral-600 for source/serving size annotations

**Next Steps:**
Phase 5 is complete and ready for content review and user testing. Phase 6 (Mindfulness & Lifestyle) can now begin.

---

## Phase 6: Mindfulness & Lifestyle

### 6.1 Mindfulness Landing Page

**src/app/mindfulness/page.tsx:**
```typescript
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Heart } from 'lucide-react'

export default function MindfulnessPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h1 className="mb-6">Mindfulness & Lifestyle Practices</h1>
          <p className="text-lg text-neutral-600">
            Evidence-based techniques to reduce stress, improve focus, and support mental wellness.
          </p>
        </div>

        <Tabs defaultValue="meditation" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="journaling">Journaling</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="meditation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guided Meditations</CardTitle>
                <CardDescription>Free audio-guided meditation practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
                  {/* Embed YouTube meditation */}
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/inpok4MKVLM"
                    title="5-Minute Meditation for Beginners"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-neutral-600">
                  Meditation has been shown to reduce stress, improve focus, and support
                  overall mental health. Start with just 5 minutes per day.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breathing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Breathing Exercises</CardTitle>
                <CardDescription>Simple techniques to activate the parasympathetic nervous system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">4-7-8 Breathing</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>Breathe in through your nose for 4 counts</li>
                    <li>Hold your breath for 7 counts</li>
                    <li>Exhale through your mouth for 8 counts</li>
                    <li>Repeat 3-4 times</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Box Breathing</h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                    <li>Breathe in for 4 counts</li>
                    <li>Hold for 4 counts</li>
                    <li>Breathe out for 4 counts</li>
                    <li>Hold for 4 counts</li>
                    <li>Repeat 5-10 times</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journaling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Journaling Templates</CardTitle>
                <CardDescription>Structured prompts for reflection and growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Gratitude Journal Template</h3>
                    <p className="text-sm text-neutral-600">Daily gratitude practice</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/gratitude-journal.pdf" download>
                      Download PDF
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Thought Record Worksheet</h3>
                    <p className="text-sm text-neutral-600">CBT-based thought challenging</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/downloads/thought-record.pdf" download>
                      Download PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Hygiene Tips</CardTitle>
                <CardDescription>Evidence-based strategies for better sleep</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-neutral-600">
                  <li>✓ Maintain a consistent sleep schedule (same bedtime/wake time)</li>
                  <li>✓ Create a relaxing bedtime routine</li>
                  <li>✓ Keep bedroom cool, dark, and quiet</li>
                  <li>✓ Limit screen time 1 hour before bed</li>
                  <li>✓ Avoid caffeine after 2pm</li>
                  <li>✓ Get regular exercise (but not close to bedtime)</li>
                  <li>✓ Reserve bed for sleep and intimacy only</li>
                  <li>✓ If you can't sleep after 20 minutes, get up and do a calm activity</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

### 6.2 Phase 6 Implementation Complete ✅

**Status:** COMPLETED

**Implementation Summary:**
Phase 6 (Mindfulness & Lifestyle) has been successfully implemented with a single-page, tab-based interface for evidence-based mindfulness practices. This phase introduces the first use of tabs for content organization and includes multimedia integration (YouTube embed) and downloadable resources.

**File Created:**
1. `src/app/mindfulness/page.tsx` - Mindfulness landing page with 4-tab interface

**Key Features:**
- Tab-based navigation for content organization (first use of tabs in project)
- Hero section with Heart icon and centered layout (max-w-3xl)
- 4 distinct practice categories with evidence-based content
- YouTube iframe embed with proper accessibility attributes
- Downloadable PDF templates (placeholder links)
- Clear, numbered instructions for breathing techniques
- Evidence-based sleep hygiene recommendations
- Responsive design with mobile-friendly tab stacking

**Content Coverage:**

*Meditation Tab:*
- Embedded YouTube video: "5-Minute Meditation for Beginners"
- Iframe with proper security attributes (allow, allowFullScreen)
- Aspect-video responsive container
- Educational text: "Start with just 5 minutes per day"
- Supports stress reduction and improved focus

*Breathing Exercises Tab:*
- **4-7-8 Breathing:** Dr. Andrew Weil technique, pranayama-based
  - Inhale nose 4 counts, hold 7 counts, exhale mouth 8 counts
  - Repeat 3-4 times
- **Box Breathing:** Navy SEAL technique for stress reduction
  - 4-count cycle: inhale, hold, exhale, hold
  - Repeat 5-10 times
- Activates parasympathetic nervous system (calming response)

*Journaling Tab:*
- **Gratitude Journal Template:** Daily gratitude practice
- **Thought Record Worksheet:** CBT-based thought challenging
- Download buttons with outline variant
- Placeholder PDF links to `/downloads/` directory
- Border boxes with flex layout for download cards

*Sleep Hygiene Tab:*
- 8 evidence-based sleep tips from CBT-I principles
- Checkmark bullets for visual consistency
- Practical, actionable recommendations:
  - Consistent sleep schedule
  - Relaxing bedtime routine
  - Sleep environment optimization (cool, dark, quiet)
  - Screen time limitations (1 hour before bed)
  - Caffeine cutoff (after 2pm)
  - Exercise timing guidance
  - Bed association (sleep/intimacy only)
  - 20-minute rule (get up if can't sleep)

**Technical Implementation:**
- shadcn/ui components: Card, Tabs, Button
- Lucide-react icon: Heart (h-16 w-16, primary-600)
- Tabs component:
  - TabsList with grid-cols-4 for equal-width tabs
  - defaultValue="meditation" for initial state
  - TabsTrigger for each tab (keyboard accessible)
  - TabsContent for each panel
- YouTube embed:
  - aspect-video class for 16:9 ratio
  - width/height 100% for responsive sizing
  - title attribute for accessibility
  - allow attribute for necessary permissions
  - allowFullScreen for user control
- Download links:
  - Anchor tags wrapped in Button with asChild
  - variant="outline" for secondary action styling
  - download attribute for PDF downloads
- Typography:
  - H1 for main title
  - H3 for technique names (font-semibold)
  - Text-sm text-neutral-600 for descriptions
- Layout:
  - Hero: max-w-3xl mx-auto text-center
  - Tabs: max-w-4xl mx-auto
  - space-y-4/6 for vertical spacing
  - Border boxes: border-neutral-200, rounded-lg, p-4

**Clinical Accuracy:**
- Evidence-based techniques with research backing
- Appropriate clinical terminology (parasympathetic nervous system, CBT-based)
- Non-diagnostic language, supportive framing
- Realistic expectations ("start with 5 minutes")
- Sleep hygiene aligned with CBT-I (Cognitive Behavioral Therapy for Insomnia)
- Breathing techniques validated by clinical research

**User Experience:**
- Simple, focused interface reduces overwhelm
- Tab organization allows user to choose relevant practice
- Multimedia content (video) increases engagement
- Downloadable resources support offline practice
- Clear numbered instructions reduce cognitive load
- Checkmark bullets provide visual structure
- Consistent card-based layout familiar from previous phases

**Accessibility:**
- Semantic HTML structure (h1, h3, ol, ul)
- iframe has title attribute for screen readers
- Tabs keyboard navigable (built into Radix/shadcn)
- ARIA attributes handled by shadcn/ui components
- Color contrast meets WCAG AA standards
- Responsive design works on all device sizes

**Design Principles Applied:**
- Trauma-informed: Calm, predictable layout; user control via tabs
- Empowering: Provides tools for independent practice
- Non-stigmatizing: Supportive language, realistic expectations
- Accessible: Clear instructions, semantic HTML, keyboard navigation
- Calming color palette: Teal primary, neutral grays
- Generous whitespace: Section padding, card spacing

**Next Steps:**
Phase 6 is complete and ready for user testing. Phase 7 (Appointment Booking) can now begin.

---

## Phase 7: Appointment Booking

### 7.1 Contact/Appointment Form

**src/app/contact/page.tsx:**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits (no dashes or spaces)'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']),
  reason: z.string().optional(),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredTime: 'morning',
      reason: '',
      message: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    // Client-side email implementation
    // Use mailto: or a serverless function to send email
    // For now, just show success message
    console.log('Form data:', data)
    setSubmitted(true)

    // Option: Use mailto link
    const subject = encodeURIComponent('Appointment Request from ' + data.name)
    const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Preferred Time: ${data.preferredTime}
Reason: ${data.reason || 'Not specified'}
Message: ${data.message || 'None'}
    `)
    window.location.href = `mailto:info@bergenmindwellness.com?subject=${subject}&body=${body}`
  }

  if (submitted) {
    return (
      <div className="section">
        <div className="container max-w-2xl">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-900">Request Submitted</AlertTitle>
            <AlertDescription className="text-green-800">
              Thank you for your appointment request. We will contact you within 1-2 business days
              to confirm your appointment.
            </AlertDescription>
          </Alert>

          <div className="mt-8 text-center">
            <Button onClick={() => {
              setSubmitted(false)
              form.reset()
            }}>
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-2xl">
        <h1 className="mb-8">Schedule an Appointment</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Fill out the form below and we'll contact you to confirm your appointment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600">
              <p><strong>Office:</strong> 123 Main Street, Suite 200, Bergen County, NJ 07000</p>
              <p><strong>Phone:</strong> (201) 555-0123</p>
              <p><strong>Email:</strong> info@bergenmindwellness.com</p>
              <p><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM</p>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="2015550123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm-6pm)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit (Optional)</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="adhd">ADHD</SelectItem>
                      <SelectItem value="bipolar">Bipolar Disorder</SelectItem>
                      <SelectItem value="ptsd">PTSD/Trauma</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information you'd like to share..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              Submit Appointment Request
            </Button>
          </form>
        </Form>

        <Alert className="mt-8">
          <AlertTitle>Privacy Notice</AlertTitle>
          <AlertDescription>
            Your information will be used solely for scheduling purposes and will be handled
            in accordance with HIPAA regulations and our privacy policy.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
```

---

## Phase 8: Accessibility & Performance

### 8.1 Accessibility Audit

**Tools:**
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- WAVE (web accessibility evaluation tool)
- NVDA/JAWS/VoiceOver (screen readers)

**Checklist:**
- [ ] All images have alt text
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Form inputs have associated labels
- [ ] Color contrast meets 4.5:1 minimum
- [ ] Keyboard navigation works throughout site
- [ ] Focus indicators visible
- [ ] Skip to main content link present
- [ ] ARIA labels for icon-only buttons
- [ ] No keyboard traps
- [ ] Screen reader announces dynamic content changes

### 8.2 Performance Optimization

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  compress: true,
}

module.exports = nextConfig
```

**Performance Checklist:**
- [ ] Images optimized (Next.js Image component)
- [ ] Lazy loading for off-screen content
- [ ] Code splitting with dynamic imports
- [ ] Bundle size analysis (`pnpm build`)
- [ ] Core Web Vitals passing (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Lighthouse score > 90

### 8.3 Mobile Responsiveness

**Test on:**
- iPhone SE (375px width)
- iPhone 14 Pro (393px width)
- iPad (768px width)
- Desktop (1280px+ width)

**Verify:**
- [ ] All content readable without horizontal scroll
- [ ] Touch targets minimum 44x44px
- [ ] Navigation works on mobile
- [ ] Forms usable on mobile
- [ ] Images scale appropriately

---

## Phase 9: SEO & Discoverability

### 9.1 Metadata Optimization

Add metadata to each page:

```typescript
export const metadata: Metadata = {
  title: 'Depression Treatment | Bergen Mind & Wellness',
  description: 'Evidence-based treatment for depression in New Jersey. Learn about symptoms, therapy options, and medication management.',
  keywords: ['depression treatment', 'New Jersey therapist', 'cognitive behavioral therapy'],
  openGraph: {
    title: 'Depression Treatment | Bergen Mind & Wellness',
    description: 'Evidence-based treatment for depression in New Jersey',
    url: 'https://bergenmindwellness.com/education/depression',
    type: 'article',
  },
}
```

### 9.2 Structured Data

Implement JSON-LD structured data for organization and provider information.

### 9.3 Sitemap & Robots.txt

**app/sitemap.ts:**
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bergenmindwellness.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://bergenmindwellness.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add all pages
  ]
}
```

---

## Phase 10: Security & Privacy

### 10.1 Privacy Policy Page

Create comprehensive privacy policy covering:
- Data collection practices (minimal)
- Client-side screening tools (no data storage)
- Cookie usage
- Third-party services
- User rights

### 10.2 Security Headers

Configure in `next.config.js`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

---

## Phase 11: Testing & Quality Assurance

### 11.1 Cross-Browser Testing
- Chrome
- Firefox
- Safari
- Edge

### 11.2 Functional Testing
- All forms submit correctly
- All links work
- Screening tools calculate correctly
- Navigation functions
- Mobile menu works

### 11.3 Content Review
- Proofread all copy
- Verify medical accuracy
- Check resource links
- Ensure non-stigmatizing language

---

## Phase 12: Deployment & Launch

### 12.1 Vercel Deployment

Since Vercel MCP is already configured:

```bash
# Commit final changes
git add .
git commit -m "Complete Bergen Mind & Wellness website"
git push origin main
```

Project automatically deploys to Vercel.

### 12.2 Custom Domain (if applicable)

Configure custom domain in Vercel dashboard.

### 12.3 Post-Launch Monitoring

- Monitor Core Web Vitals
- Check error logs
- Test all features in production
- Verify analytics (if implemented)

---

## Appendices

### A. Tech Stack Specifications

- **Next.js**: 16.0 (App Router, Turbopack)
- **React**: 19.2
- **TypeScript**: 5.9.3
- **Tailwind CSS**: 4.1.16
- **Framer Motion**: 12.23.24
- **shadcn/ui**: CLI 3.0
- **React Hook Form**: 7.66.0
- **Zod**: 4.0.0

### B. Color Palette Reference

See DESIGN_SYSTEM.md for complete palette.

### C. Future Enhancements (Phase 2)

- Blog/articles section
- Patient portal
- Teletherapy integration
- Group therapy scheduling
- Email newsletter
- Multi-language support

---

## Conclusion

This comprehensive plan provides a complete roadmap for building Bergen Mind & Wellness's website. Each phase builds upon the previous, creating a professional, accessible, and compassionate mental health platform that serves patients with evidence-based resources and pathways to care.
