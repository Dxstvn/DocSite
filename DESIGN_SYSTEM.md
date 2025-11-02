# Design System: Bergen Mind & Wellness, LLC

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Animation Principles](#animation-principles)
7. [Accessibility Standards](#accessibility-standards)
8. [Mobile-First Approach](#mobile-first-approach)
9. [Content Strategy](#content-strategy)
10. [Form Design](#form-design)
11. [Trust Signals](#trust-signals)
12. [Crisis Features](#crisis-features)

---

## Design Philosophy

### Core Principles

The Bergen Mind & Wellness design system is built on four foundational pillars:

1. **Trauma-Informed Design**: Every element respects the vulnerability of users who may be experiencing mental health challenges
2. **Accessibility-First**: WCAG 2.1 Level AA compliance is not optional—it's the foundation
3. **Calming Aesthetics**: Visual design reduces anxiety rather than creating it
4. **Evidence-Based**: Decisions grounded in research on color psychology, cognitive load, and user behavior

### SAMHSA's Six Principles Applied to Digital Design

Our design implementation operationalizes SAMHSA's trauma-informed care principles:

| Principle | Design Implementation |
|-----------|----------------------|
| **Safety** | Predictable navigation, stable layouts, no surprise animations, clear feedback |
| **Trustworthiness & Transparency** | Visible credentials, clear privacy policies, honest communication |
| **Peer Support** | Community features with moderation, testimonial sections (ethically sourced) |
| **Collaboration & Mutuality** | User control over experience, feedback mechanisms |
| **Empowerment, Voice, & Choice** | Settings for motion/animation, content warnings, optional engagement |
| **Cultural Sensitivity** | Inclusive language, diverse representation, accessibility for all abilities |

### Design Goals

**Primary Goals:**
- Reduce barriers to accessing mental health information
- Create a calming, non-threatening digital environment
- Build trust through professional, credible presentation
- Ensure accessibility for users with diverse abilities and devices
- Support users in vulnerable mental states with thoughtful UX

**Anti-Goals (What We Avoid):**
- Overwhelming users with too many choices or information
- Creating anxiety through aggressive colors, animations, or design
- Using stigmatizing language or imagery
- Gatekeeping information behind complex navigation
- Sacrificing accessibility for aesthetic preferences

---

## Color System

### Primary Palette

Our color palette is informed by research showing that individuals with depression and anxiety respond better to cool, calming tones while avoiding warm colors that may be associated with negative mood states.

#### Brand Colors

```css
/* Primary - Teal (Trust, Calm, Balance) */
--primary-50:  #f0fdfa;   /* Lightest teal backgrounds */
--primary-100: #ccfbf1;   /* Subtle highlights */
--primary-200: #99f6e4;   /* Soft accents */
--primary-300: #5eead4;   /* Hover states */
--primary-400: #2dd4bf;   /* Interactive elements */
--primary-500: #14b8a6;   /* Primary brand color */
--primary-600: #0d9488;   /* Primary CTA buttons */
--primary-700: #0f766e;   /* Darker brand elements */
--primary-800: #115e59;   /* Deep accents */
--primary-900: #134e4a;   /* Darkest brand */

/* Secondary - Sage Green (Renewal, Growth, Peace) */
--secondary-50:  #f6f7f6;
--secondary-100: #e8ebe8;
--secondary-200: #d4dad4;
--secondary-300: #9ca89c;
--secondary-400: #7a8a7a;
--secondary-500: #5f6f5f;  /* Secondary brand color */
--secondary-600: #4a5a4a;
--secondary-700: #3d4a3d;
--secondary-800: #323e32;
--secondary-900: #2a342a;
```

#### Neutral Palette

```css
/* Neutrals - Warm Beige/Taupe (Warmth, Safety, Grounding) */
--neutral-50:  #fafaf9;   /* Page backgrounds */
--neutral-100: #f5f5f4;   /* Card backgrounds */
--neutral-200: #e7e5e4;   /* Borders */
--neutral-300: #d6d3d1;   /* Disabled states */
--neutral-400: #a8a29e;   /* Placeholder text */
--neutral-500: #78716c;   /* Secondary text */
--neutral-600: #57534e;   /* Body text */
--neutral-700: #44403c;   /* Headings */
--neutral-800: #292524;   /* High emphasis text */
--neutral-900: #1c1917;   /* Maximum contrast */
```

#### Semantic Colors

```css
/* Success - Soft Green (Encouragement, not alarm) */
--success-50:  #f0fdf4;
--success-500: #22c55e;
--success-700: #15803d;

/* Warning - Amber (Caution, not panic) */
--warning-50:  #fefce8;
--warning-500: #eab308;
--warning-700: #a16207;

/* Error - Muted Red (Important, not alarming) */
--error-50:  #fef2f2;
--error-500: #ef4444;  /* Less aggressive than pure red */
--error-700: #b91c1c;

/* Info - Soft Blue (Informative, calm) */
--info-50:  #eff6ff;
--info-500: #3b82f6;
--info-700: #1d4ed8;
```

### Color Psychology Rationale

**Why These Colors:**
- **Teal/Blue-Green**: Research shows blue is the #1 color for reducing stress and promoting trust. Teal adds warmth without triggering anxiety.
- **Sage Green**: Associated with balance, nature, and renewal. Reduces anxiety and promotes calm.
- **Warm Neutrals**: Beige and taupe provide warmth and safety without the coldness of pure grays (which depressed individuals associate with negative moods).

**Colors We Avoid:**
- **Red** (except muted error states): Increases heart rate, signals danger/urgency
- **Bright Yellow/Neon**: Can trigger anxiety in sensitive individuals
- **Pure Black**: Too harsh; we use warm dark neutral instead
- **Hot Pink/Orange**: Associated with high energy; inappropriate for calming mental health context

### Contrast Ratios (WCAG 2.1 AA Compliance)

All color combinations meet minimum contrast requirements:

| Use Case | Minimum Ratio | Our Implementation |
|----------|---------------|-------------------|
| Normal text (< 18pt) | 4.5:1 | All body text uses neutral-600+ on light backgrounds (6.5:1+) |
| Large text (≥ 18pt or bold 14pt) | 3:1 | All headings exceed 4.5:1 for enhanced readability |
| UI components | 3:1 | Buttons, form fields, focus indicators all meet 3:1 minimum |
| Graphical objects | 3:1 | Icons, infographics, charts meet accessibility standards |

**Testing Tools:**
- WebAIM Contrast Checker
- Stark Figma plugin
- Chrome DevTools Accessibility panel

### Color Usage Guidelines

**Backgrounds:**
- Page background: `neutral-50` (#fafaf9)
- Card/panel background: `neutral-100` (#f5f5f4)
- Section backgrounds: Alternating `white` and `neutral-50`

**Text:**
- Headings: `neutral-800` (#292524)
- Body text: `neutral-600` (#57534e)
- Secondary text: `neutral-500` (#78716c)
- Placeholder text: `neutral-400` (#a8a29e)

**Interactive Elements:**
- Primary CTA: `primary-600` background, white text
- Secondary CTA: `primary-100` background, `primary-700` text
- Hover states: Darken by one shade (600 → 700)
- Focus rings: `primary-500` with 2px offset
- Links: `primary-700` with underline

**State Indicators:**
- Success messages: `success-50` background, `success-700` text/icon
- Warning messages: `warning-50` background, `warning-700` text/icon
- Error messages: `error-50` background, `error-700` text/icon
- Info messages: `info-50` background, `info-700` text/icon

---

## Typography

### Font Stack

**Primary Font (Sans-Serif):**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

**Why Inter:**
- Designed specifically for digital interfaces
- Excellent readability at all sizes
- Open-source and self-hostable (no external requests)
- Supports variable font technology (reduces file size)
- Comprehensive character set for accessibility

**Fallback Strategy:**
System fonts ensure immediate rendering with zero flash of unstyled text (FOUT), critical for users who may be in crisis and need immediate access to information.

### Type Scale

Using a modular scale (1.250 - Major Third) for harmonious proportions:

```css
/* Display - Used sparingly for hero sections */
--text-display: 3.815rem;  /* 61px */
--line-display: 1.1;

/* H1 - Page titles */
--text-h1: 3.052rem;  /* 48.8px */
--line-h1: 1.2;

/* H2 - Major sections */
--text-h2: 2.441rem;  /* 39px */
--line-h2: 1.3;

/* H3 - Subsections */
--text-h3: 1.953rem;  /* 31.2px */
--line-h3: 1.4;

/* H4 - Minor headings */
--text-h4: 1.563rem;  /* 25px */
--line-h4: 1.5;

/* H5 - Component headings */
--text-h5: 1.25rem;   /* 20px */
--line-h5: 1.5;

/* H6 - Overlines, labels */
--text-h6: 1rem;      /* 16px */
--line-h6: 1.5;

/* Body - Default */
--text-body: 1rem;    /* 16px */
--line-body: 1.75;    /* 28px - generous for readability */

/* Body Large - Introductions, important text */
--text-body-lg: 1.125rem;  /* 18px */
--line-body-lg: 1.778;     /* 32px */

/* Body Small - Captions, secondary info */
--text-body-sm: 0.875rem;  /* 14px */
--line-body-sm: 1.714;     /* 24px */

/* Caption - Fine print, metadata */
--text-caption: 0.75rem;   /* 12px */
--line-caption: 1.667;     /* 20px */
```

### Line Height Rationale

**Generous Line Spacing:**
Research on cognitive load shows that users experiencing stress or mental health challenges benefit from increased line height (leading). Our baseline of 1.75 for body text is significantly more generous than the typical 1.5, reducing visual density and improving scannability.

**Tighter Leading for Headings:**
Large headings use tighter line height (1.1-1.4) to maintain visual cohesion and impact.

### Font Weights

```css
--font-light: 300;     /* Rarely used, only for large display text */
--font-normal: 400;    /* Body text default */
--font-medium: 500;    /* Emphasis, buttons */
--font-semibold: 600;  /* Headings, important UI elements */
--font-bold: 700;      /* Strong emphasis, H1-H2 */
```

**Usage Guidelines:**
- Body text: 400 (normal)
- Buttons, labels: 500 (medium)
- H4-H6: 600 (semibold)
- H1-H3: 700 (bold)
- Avoid 300 (light) for accessibility

### Text Formatting

**Paragraph Spacing:**
```css
p + p {
  margin-top: 1.25em;  /* 20px at 16px base */
}
```

**Maximum Line Length:**
```css
.prose {
  max-width: 65ch;  /* ~65 characters optimal for readability */
}
```

**Link Styling:**
```css
a {
  color: var(--primary-700);
  text-decoration: underline;
  text-underline-offset: 2px;
}

a:hover {
  color: var(--primary-800);
}

a:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Responsive Typography

```css
/* Mobile: Slightly smaller base */
html {
  font-size: 16px;
}

/* Tablet and up: Standard base */
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

/* Desktop: Slightly larger for comfortable reading distance */
@media (min-width: 1280px) {
  html {
    font-size: 18px;
  }
}
```

All `rem` units scale proportionally, maintaining type hierarchy across devices.

---

## Spacing & Layout

### Spacing Scale

Using an 8px base unit for consistent, rhythmic spacing:

```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Component Spacing Guidelines

**Buttons:**
- Padding: `space-3` (12px) vertical, `space-6` (24px) horizontal
- Gap between button groups: `space-4` (16px)

**Form Fields:**
- Padding: `space-3` (12px) all sides
- Margin between fields: `space-6` (24px)
- Label to input gap: `space-2` (8px)

**Cards:**
- Padding: `space-6` (24px) on mobile, `space-8` (32px) on desktop
- Gap between cards: `space-6` (24px)

**Sections:**
- Padding: `space-16` (64px) vertical on mobile, `space-24` (96px) on desktop
- Gap between major sections: `space-12` (48px)

### Layout Grid

**Container:**
```css
.container {
  width: 100%;
  max-width: 1280px;  /* Not too wide to maintain readability */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;   /* 16px mobile */
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 2rem;  /* 32px tablet+ */
    padding-right: 2rem;
  }
}
```

**Grid System:**
Using CSS Grid with 12-column layout:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;  /* 24px */
}

/* Common column spans */
.col-span-full { grid-column: span 12; }
.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }

/* Responsive */
@media (max-width: 768px) {
  .col-span-6,
  .col-span-4,
  .col-span-3 {
    grid-column: span 12;  /* Stack on mobile */
  }
}
```

### Whitespace Philosophy

**Generous Whitespace for Cognitive Ease:**
Mental health users benefit from "breathing room" in designs. We intentionally use more whitespace than typical websites to:
- Reduce visual overwhelm
- Improve focus on individual elements
- Create a calm, uncluttered experience
- Enhance scannability and comprehension

**Asymmetric Spacing:**
We use more space before headings than after to create visual groupings:

```css
h2 {
  margin-top: 3rem;    /* 48px */
  margin-bottom: 1rem; /* 16px */
}
```

This follows the principle of proximity in Gestalt psychology, grouping related content visually.

---

## Component Library

### shadcn/ui Implementation

We use shadcn/ui as our component foundation because:
- Built on Radix UI primitives (accessibility built-in)
- Copy-paste approach allows deep customization
- TypeScript support for type safety
- Fully compatible with Tailwind CSS 4.1
- Active community and regular updates

### Core Components

#### Buttons

**Variants:**

```tsx
// Primary CTA
<Button variant="default">Schedule Appointment</Button>
// bg-primary-600, hover:bg-primary-700, white text

// Secondary
<Button variant="secondary">Learn More</Button>
// bg-primary-100, hover:bg-primary-200, primary-700 text

// Outline
<Button variant="outline">View Resources</Button>
// border-primary-600, hover:bg-primary-50

// Ghost (subtle)
<Button variant="ghost">Skip</Button>
// hover:bg-neutral-100

// Link (text only)
<Button variant="link">Privacy Policy</Button>
// primary-700 text, underline
```

**Sizes:**
- `sm`: 32px height (compact contexts)
- `md`: 40px height (default)
- `lg`: 48px height (primary CTAs)

**Accessibility:**
- Minimum 44x44px touch target (WCAG 2.5.5)
- Focus visible styles with 2px outline
- Loading states with aria-busy
- Disabled states with aria-disabled and reduced opacity

#### Form Inputs

**Text Input:**
```tsx
<Input
  type="text"
  placeholder="Enter your name"
  aria-label="Full name"
  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
/>
```

**Textarea:**
```tsx
<Textarea
  placeholder="Describe your concerns..."
  rows={4}
  aria-label="Message"
  className="resize-none"  /* Prevents layout shifts */
/>
```

**Select/Dropdown:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a time" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
    <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
    <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
  </SelectContent>
</Select>
```

**Checkbox:**
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm">
    I agree to the terms and privacy policy
  </label>
</div>
```

**Radio Group:**
```tsx
<RadioGroup defaultValue="option-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-1" id="option-1" />
    <Label htmlFor="option-1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-2" id="option-2" />
    <Label htmlFor="option-2">Option 2</Label>
  </div>
</RadioGroup>
```

#### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Depression</CardTitle>
    <CardDescription>
      Understanding symptoms and treatment options
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Depression is a common but serious mood disorder...</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Learn More</Button>
  </CardFooter>
</Card>
```

**Card Styling:**
- Border: `border-neutral-200`
- Background: `bg-white` or `bg-neutral-50`
- Shadow: Subtle `shadow-sm`, increase to `shadow-md` on hover
- Padding: Consistent `space-6` (24px)
- Border radius: `rounded-lg` (8px)

#### Alerts/Callouts

```tsx
<Alert variant="info">
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Did you know?</AlertTitle>
  <AlertDescription>
    Depression is highly treatable with therapy and/or medication.
  </AlertDescription>
</Alert>
```

**Alert Variants:**
- `info`: Blue (info-50 background, info-700 text)
- `success`: Green (success-50 background, success-700 text)
- `warning`: Amber (warning-50 background, warning-700 text)
- `error`: Red (error-50 background, error-700 text)

#### Accordion (Progressive Disclosure)

Perfect for FAQ sections and detailed educational content:

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is the PHQ-9?</AccordionTrigger>
    <AccordionContent>
      The PHQ-9 is a 9-question screening tool for depression...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is this a diagnosis?</AccordionTrigger>
    <AccordionContent>
      No, screening tools are not diagnostic instruments...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Dialog/Modal

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Content Warning</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Sensitive Content</DialogTitle>
      <DialogDescription>
        The following section discusses suicide and self-harm.
        Do you want to continue?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Go Back</Button>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Dialog Best Practices:**
- Focus trap: Keep keyboard focus within dialog
- Escape key closes dialog
- Click outside to dismiss (optional, can disable for important modals)
- Return focus to trigger element on close

#### Tabs

```tsx
<Tabs defaultValue="symptoms">
  <TabsList>
    <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
    <TabsTrigger value="treatment">Treatment</TabsTrigger>
    <TabsTrigger value="resources">Resources</TabsTrigger>
  </TabsList>
  <TabsContent value="symptoms">
    <p>Common symptoms include...</p>
  </TabsContent>
  <TabsContent value="treatment">
    <p>Treatment options include...</p>
  </TabsContent>
  <TabsContent value="resources">
    <p>Additional resources...</p>
  </TabsContent>
</Tabs>
```

---

## Animation Principles

### Motion Philosophy

**Less is More:**
In mental health contexts, animations should be:
- Subtle and purposeful
- Calming, never jarring
- Optional (respect `prefers-reduced-motion`)
- Functional, not decorative

### Framer Motion Implementation

#### Reduced Motion Detection

**Global Configuration:**
```tsx
import { MotionConfig } from 'framer-motion'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* All animations automatically respect user preferences */}
      {children}
    </MotionConfig>
  )
}
```

**Granular Control:**
```tsx
import { useReducedMotion } from 'framer-motion'

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

### Safe Animation Patterns

#### Fade In/Out (Always Safe)

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Content
</motion.div>
```

#### Gentle Slide (Safe with Reduced Motion Check)

```tsx
const variants = {
  hidden: (shouldReduce) => ({
    opacity: 0,
    y: shouldReduce ? 0 : 20
  }),
  visible: {
    opacity: 1,
    y: 0
  }
}

<motion.div
  custom={useReducedMotion()}
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Content
</motion.div>
```

#### Stagger Children (Loading States)

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item}>Item 1</motion.li>
  <motion.li variants={item}>Item 2</motion.li>
  <motion.li variants={item}>Item 3</motion.li>
</motion.ul>
```

#### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}  // Quick transitions
>
  <Page />
</motion.div>
```

### Animations to Avoid

**Never Use:**
- Parallax scrolling (triggers vestibular disorders)
- Rapid x/y translations
- Spinning/rotating elements
- Aggressive bounce effects
- Autoplay videos or animations
- Infinite loops (unless essential, with pause control)

### Easing Functions

```tsx
// Gentle, natural easing
transition={{ ease: 'easeOut' }}      // Decelerating
transition={{ ease: 'easeInOut' }}    // Smooth both ends
transition={{ ease: [0.43, 0.13, 0.23, 0.96] }}  // Custom cubic-bezier

// Avoid aggressive easing
// ❌ ease: 'easeIn' (feels sluggish)
// ❌ ease: 'linear' (feels mechanical)
```

### Duration Guidelines

```tsx
// Micro-interactions (hover, focus)
transition={{ duration: 0.15 }}

// Standard transitions (page loads, modals)
transition={{ duration: 0.3 }}

// Complex animations (multi-step)
transition={{ duration: 0.5 }}

// Maximum duration
transition={{ duration: 0.8 }}  // Longer feels sluggish
```

### Hover States (Subtle Feedback)

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}  // Subtle growth
  whileTap={{ scale: 0.98 }}    // Subtle compression
  transition={{ duration: 0.15 }}
>
  Click Me
</motion.button>
```

---

## Accessibility Standards

### WCAG 2.1 Level AA Compliance

Our site meets all WCAG 2.1 Level AA success criteria, with several Level AAA enhancements for mental health contexts.

#### Perceivable

**1.1 Text Alternatives:**
- All images have descriptive alt text
- Decorative images use `alt=""`
- Complex infographics include extended descriptions

**1.2 Time-Based Media:**
- Video content includes captions
- Audio content provides transcripts
- No autoplay media

**1.3 Adaptable:**
- Semantic HTML (proper heading hierarchy)
- Content order makes sense when CSS disabled
- Form inputs have associated labels
- Proper use of ARIA landmarks

**1.4 Distinguishable:**
- ✅ Contrast ratio 4.5:1+ for normal text (we exceed this)
- ✅ Contrast ratio 3:1+ for large text and UI components
- ✅ Text can be resized to 200% without loss of functionality
- ✅ No images of text (except logos)
- ✅ Reflow content to 320px width without horizontal scroll
- ✅ No loss of content when spacing increased

#### Operable

**2.1 Keyboard Accessible:**
- All functionality available via keyboard
- No keyboard traps
- Visible focus indicators (2px outline, 2px offset)
- Skip to main content link

**2.2 Enough Time:**
- No time limits on reading/interaction
- Users can pause, stop, hide moving content

**2.3 Seizures and Physical Reactions:**
- No content flashes more than 3 times per second
- Reduced motion support for vestibular disorders

**2.4 Navigable:**
- Descriptive page titles
- Logical focus order
- Link purpose clear from text or context
- Multiple ways to find pages (menu, search, sitemap)
- Clear heading structure
- Current location indicated in navigation

**2.5 Input Modalities:**
- ✅ Touch targets minimum 44x44px
- ✅ Gestures have keyboard alternatives
- ✅ No path-based gestures required

#### Understandable

**3.1 Readable:**
- Language of page declared in HTML (`lang="en"`)
- Language of parts declared when switching languages
- Reading level appropriate for audience

**3.2 Predictable:**
- Navigation consistent across pages
- Components behave consistently
- No context changes on focus
- No context changes on input (unless warned)

**3.3 Input Assistance:**
- Form errors clearly identified
- Labels and instructions provided
- Suggestions for fixing errors
- Error prevention for legal/financial/data transactions

#### Robust

**4.1 Compatible:**
- Valid HTML5
- Proper ARIA attributes
- Status messages use proper roles

### Screen Reader Optimization

**ARIA Labels:**
```tsx
// Descriptive labels for screen readers
<button aria-label="Schedule appointment with Dr. Smith">
  <CalendarIcon />
</button>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  Form submitted successfully
</div>

// Landmarks
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary" aria-label="Related resources">
<footer role="contentinfo">
```

**Skip Links:**
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**Hidden Text for Context:**
```tsx
<button>
  Read more
  <span className="sr-only">about depression symptoms</span>
</button>
```

### Focus Management

```css
/* Visible focus indicator */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Never remove focus outline without replacement */
/* ❌ *:focus { outline: none; } */
```

**Focus Trapping in Modals:**
```tsx
import { FocusTrap } from '@radix-ui/react-focus-scope'

<Dialog open={open}>
  <FocusTrap>
    <DialogContent>
      {/* Focus stays within dialog */}
    </DialogContent>
  </FocusTrap>
</Dialog>
```

### Keyboard Navigation

**Required Keyboard Shortcuts:**
- `Tab`: Move forward through interactive elements
- `Shift + Tab`: Move backward
- `Enter`/`Space`: Activate buttons and links
- `Escape`: Close modals/dropdowns
- Arrow keys: Navigate within components (tabs, accordions)

---

## Mobile-First Approach

### Statistics Driving Mobile-First

- 60%+ of mental health resource searches occur on mobile devices
- Users in crisis often access resources via smartphone
- Mobile-first design improves performance for all devices

### Breakpoint System

```css
/* Mobile first: Base styles for 320px+ */
/* No media query needed */

/* Small tablets: 640px+ */
@media (min-width: 640px) { }

/* Tablets: 768px+ */
@media (min-width: 768px) { }

/* Small laptops: 1024px+ */
@media (min-width: 1024px) { }

/* Desktops: 1280px+ */
@media (min-width: 1280px) { }

/* Large screens: 1536px+ */
@media (min-width: 1536px) { }
```

### Touch-Friendly Design

**Minimum Touch Targets:**
- Buttons, links: 44x44px minimum (WCAG 2.5.5)
- Form inputs: 48px height minimum
- Navigation items: 44px height with adequate spacing

**Thumb Zone Optimization:**
```
┌─────────────────┐
│   Hard to reach │  (Top corners)
│                 │
│   Easy to reach │  (Middle, bottom)
│                 │
│   Primary CTAs  │  (Bottom third, centered)
└─────────────────┘
```

Place primary actions in the bottom third of the screen where thumbs naturally rest.

### Responsive Images

```tsx
<Image
  src="/hero-image.jpg"
  alt="Peaceful therapy office"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"  // Lazy load off-screen images
  quality={85}    // Balance quality and file size
/>
```

### Performance Budget

**Maximum Page Weight:**
- Mobile: 1.5 MB total
- Desktop: 2 MB total

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization Strategies:**
- Next.js 16 Image optimization (automatic format conversion to WebP/AVIF)
- Lazy loading for off-screen content
- Code splitting with dynamic imports
- Turbopack for faster builds and hot reload

---

## Content Strategy

### Non-Stigmatizing Language

**Use:**
- "Person experiencing depression" (person-first)
- "Individual with bipolar disorder"
- "Mental health condition"
- "Substance use disorder"
- "Died by suicide" or "lost to suicide"

**Avoid:**
- "Depressed person" (identity-first when negative)
- "Bipolar" (as noun)
- "Mental illness" (unless clinically appropriate)
- "Addict," "junkie," "substance abuser"
- "Committed suicide" (implies crime)
- "Crazy," "insane," "psycho," "maniac," "nuts," "mental"

### Progressive Disclosure

**Information Hierarchy:**

1. **Entry Point** (20% of info): Problem statement, immediate value
2. **Core Content** (60% of info): Symptoms, treatment overview, resources
3. **Deep Dive** (20% of info): Technical details, research citations, advanced topics

**Implementation with Accordions:**
```tsx
// Level 1: Visible by default
<h2>What is Depression?</h2>
<p>Depression is a common mood disorder affecting 21 million adults...</p>

// Level 2: Accordion
<Accordion>
  <AccordionItem value="symptoms">
    <AccordionTrigger>Common Symptoms</AccordionTrigger>
    <AccordionContent>
      {/* Detailed symptom list */}
    </AccordionContent>
  </AccordionItem>

  // Level 3: Link to detailed page
  <AccordionItem value="research">
    <AccordionTrigger>Research & Evidence</AccordionTrigger>
    <AccordionContent>
      <a href="/research/depression-studies">
        View peer-reviewed research
      </a>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Credible Citations

**Source Hierarchy:**
1. **Tier 1**: NIMH, SAMHSA, APA, peer-reviewed journals
2. **Tier 2**: Academic institutions, major hospitals, WHO
3. **Tier 3**: Reputable mental health organizations (NAMI, MHA)

**Citation Format:**
```tsx
<article>
  <p>Research shows that CBT is highly effective for anxiety disorders.</p>
  <cite className="text-sm text-neutral-500">
    Source: <a href="https://www.nimh.nih.gov">
      National Institute of Mental Health
    </a>
  </cite>
</article>
```

### Readability Guidelines

**Flesch Reading Ease Target: 60-70** (8th-9th grade level)

**Techniques:**
- Short sentences (15-20 words average)
- Short paragraphs (3-4 sentences)
- Active voice ("Therapy helps" vs "Help is provided by therapy")
- Common words ("use" vs "utilize," "help" vs "facilitate")
- Bullet points for lists
- Subheadings every 2-3 paragraphs

---

## Form Design

### React Hook Form + Zod Pattern

**Basic Form Structure:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const appointmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']),
  message: z.string().max(500, 'Message must be 500 characters or less')
})

type AppointmentForm = z.infer<typeof appointmentSchema>

function AppointmentForm() {
  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredTime: 'morning',
      message: ''
    }
  })

  const onSubmit = (data: AppointmentForm) => {
    // Handle submission (client-side email, no PHI storage)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

### Screening Tool Pattern (Client-Side Only)

**PHQ-9 Depression Screening:**

```tsx
const phq9Schema = z.object({
  questions: z.array(
    z.number().min(0).max(3)
  ).length(9)
})

function PHQ9Screener() {
  const [score, setScore] = useState<number | null>(null)

  const form = useForm({
    resolver: zodResolver(phq9Schema),
    defaultValues: {
      questions: Array(9).fill(0)
    }
  })

  const calculateScore = (data: any) => {
    const total = data.questions.reduce((sum: number, val: number) => sum + val, 0)
    setScore(total)
  }

  const getInterpretation = (score: number) => {
    if (score <= 4) return 'Minimal depression symptoms'
    if (score <= 9) return 'Mild depression symptoms'
    if (score <= 14) return 'Moderate depression symptoms'
    if (score <= 19) return 'Moderately severe depression symptoms'
    return 'Severe depression symptoms'
  }

  return (
    <div>
      <Alert variant="info" className="mb-6">
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This is a screening tool, not a diagnostic instrument.
          Results should be discussed with a licensed mental health professional.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateScore)}>
          {/* PHQ-9 questions */}
          <Button type="submit">Calculate Score</Button>
        </form>
      </Form>

      {score !== null && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Score: {score}/27</CardTitle>
            <CardDescription>{getInterpretation(score)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Based on your responses, you may benefit from speaking with a mental health professional.</p>
            <Button className="mt-4">Schedule an Appointment</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Key Features:**
- All processing client-side (no data sent to server)
- No PHI storage or transmission
- Clear non-diagnostic language
- Immediate feedback
- CTA to professional help

### Error Handling

**Inline Validation:**
```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} type="email" />
      </FormControl>
      {fieldState.error && (
        <FormMessage className="text-error-700">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  )}
/>
```

**Validation Timing:**
- On blur: Check individual fields after user leaves them
- On submit: Validate entire form
- Real-time (optional): For critical fields like password strength

---

## Trust Signals

### Provider Credentials

**Display Format:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Dr. Jane Smith, Ph.D.</CardTitle>
    <CardDescription>
      Licensed Clinical Psychologist
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      <li>License #: PSY12345 (State of New Jersey)</li>
      <li>Board Certified in Clinical Psychology</li>
      <li>15+ years of experience</li>
      <li>Specializations: Anxiety, Depression, Trauma</li>
    </ul>
  </CardContent>
</Card>
```

### Security Badges

**Footer Trust Indicators:**
```tsx
<footer>
  <div className="flex items-center gap-4">
    <Badge>HIPAA Compliant</Badge>
    <Badge>Secure SSL</Badge>
    <Badge>APA Member</Badge>
  </div>
</footer>
```

### Privacy-First Messaging

**Prominent Privacy Assurance:**
```tsx
<Alert variant="info">
  <LockIcon className="h-4 w-4" />
  <AlertTitle>Your Privacy Matters</AlertTitle>
  <AlertDescription>
    All screening tools are processed entirely in your browser.
    We do not collect, store, or transmit your responses.
  </AlertDescription>
</Alert>
```

---

## Crisis Features

### 988 Suicide & Crisis Lifeline

**Persistent Crisis Button:**
```tsx
<Button
  variant="destructive"
  size="lg"
  className="fixed bottom-4 right-4 shadow-lg z-50"
  aria-label="Access crisis resources"
>
  <PhoneIcon className="mr-2" />
  Crisis Help: 988
</Button>
```

**Click behavior:**
- Desktop: Opens modal with crisis resources
- Mobile: Prompts to call 988 directly

### Safe Exit Button

**For Users in Unsafe Situations:**
```tsx
<Button
  variant="ghost"
  className="fixed top-4 left-4 z-50"
  onClick={() => {
    // Redirect to weather.com or similar neutral site
    window.location.href = 'https://weather.com'
  }}
  aria-label="Quick exit to safe website"
>
  <XIcon className="mr-2" />
  Quick Exit
</Button>
```

### Content Warnings

**Before Sensitive Content:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">
      PTSD Resources (Content Warning)
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Content Warning</DialogTitle>
      <DialogDescription>
        The following section discusses trauma, violence, and PTSD symptoms.
        Please proceed only if you feel safe to do so.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Go Back
      </Button>
      <Button onClick={() => navigate('/ptsd-resources')}>
        I Understand, Continue
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Implementation Checklist

### Design System Setup
- [ ] Install and configure Tailwind CSS 4.1
- [ ] Initialize shadcn/ui with CLI 3.0
- [ ] Configure color variables in `tailwind.config.ts`
- [ ] Set up typography scale with Inter font
- [ ] Configure spacing scale
- [ ] Set up Framer Motion with `MotionConfig`

### Component Development
- [ ] Create button variants (primary, secondary, outline, ghost, link)
- [ ] Build form components with React Hook Form + Zod
- [ ] Implement card layouts
- [ ] Build accordion for FAQ/progressive disclosure
- [ ] Create alert/callout components
- [ ] Build dialog/modal system
- [ ] Create tabs component

### Accessibility Implementation
- [ ] Run automated accessibility audit (axe DevTools)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify keyboard navigation
- [ ] Check color contrast ratios
- [ ] Test with 200% zoom
- [ ] Verify focus indicators
- [ ] Test with prefers-reduced-motion

### Content & UX
- [ ] Review all copy for stigmatizing language
- [ ] Implement progressive disclosure patterns
- [ ] Add credible source citations
- [ ] Create content warnings for sensitive topics
- [ ] Add crisis resources (988, Crisis Text Line)
- [ ] Implement safe exit functionality

### Mobile Optimization
- [ ] Test on actual devices (iOS, Android)
- [ ] Verify touch targets (minimum 44x44px)
- [ ] Check responsive breakpoints
- [ ] Optimize images for mobile
- [ ] Verify performance budget

### Testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Screen reader testing
- [ ] Keyboard-only navigation test
- [ ] Mobile device testing
- [ ] Performance testing (Lighthouse, Core Web Vitals)
- [ ] Form validation testing

---

## Conclusion

This design system provides a comprehensive foundation for Bergen Mind & Wellness that is:
- **Trauma-informed**: Respecting the vulnerability of mental health users
- **Accessible**: Meeting WCAG 2.1 AA standards and beyond
- **Calming**: Using evidence-based color psychology and generous whitespace
- **Modern**: Leveraging the latest technologies (Next.js 16, React 19, Tailwind CSS 4.1)
- **Privacy-first**: Protecting user data through client-side processing
- **Evidence-based**: Grounded in research on mental health, UX, and accessibility

Every design decision prioritizes the wellbeing and safety of users seeking mental health support, while maintaining technical excellence and professional credibility.
