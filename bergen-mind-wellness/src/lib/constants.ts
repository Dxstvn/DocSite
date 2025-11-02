// Constants for Bergen Mind & Wellness

export const SITE_CONFIG = {
  name: 'Bergen Mind & Wellness, LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Compassionate mental health care in New Jersey. Evidence-based treatment for depression, anxiety, ADHD, bipolar disorder, and PTSD.',
  contact: {
    email: 'info@bergenmindwellness.com',
    phone: '(201) 555-0123',
    address: '123 Main Street, Suite 200, Bergen County, NJ 07000',
  },
  hours: 'Monday-Friday, 9:00 AM - 6:00 PM',
} as const

export const CRISIS_RESOURCES = {
  suicideLifeline: {
    number: '988',
    name: '988 Suicide & Crisis Lifeline',
    description: '24/7 free and confidential support',
  },
  crisisTextLine: {
    number: '741741',
    text: 'HOME',
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741',
  },
  emergency: {
    number: '911',
    name: 'Emergency Services',
    description: 'For life-threatening emergencies',
  },
} as const

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Mental Health Education', href: '/education' },
  { name: 'Screening Tools', href: '/screening' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'Mindfulness', href: '/mindfulness' },
  { name: 'Contact', href: '/contact' },
] as const
