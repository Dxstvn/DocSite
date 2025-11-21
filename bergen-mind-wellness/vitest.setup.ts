// Set environment variables BEFORE any imports
// This ensures they're available when modules are loaded
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.SMTP_HOST = 'smtp.test.com'
process.env.SMTP_PORT = '587'
process.env.SMTP_USER = 'test@example.com'
process.env.SMTP_PASSWORD = 'test-password'
process.env.SMTP_FROM_EMAIL = 'noreply@test.com'

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock framer-motion to avoid animation issues in tests
// Using createElement to avoid JSX syntax in .ts file
vi.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: (props: any) => React.createElement('div', props),
      span: (props: any) => React.createElement('span', props),
      button: (props: any) => React.createElement('button', props),
      a: (props: any) => React.createElement('a', props),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Mock nodemailer for email testing
vi.mock('nodemailer', () => {
  const mockSendMail = vi.fn().mockResolvedValue({
    messageId: 'test-message-id',
    accepted: ['recipient@example.com'],
    rejected: [],
    response: '250 Message accepted',
  })

  const mockVerify = vi.fn().mockResolvedValue(true)
  const mockClose = vi.fn().mockResolvedValue(undefined)

  const mockTransporter = {
    sendMail: mockSendMail,
    verify: mockVerify,
    close: mockClose,
  }

  const mockCreateTransport = vi.fn().mockReturnValue(mockTransporter)

  return {
    default: {
      createTransport: mockCreateTransport,
      createTransporter: mockCreateTransport, // Support both variants
    },
    createTransport: mockCreateTransport,
    createTransporter: mockCreateTransport, // Support both variants
  }
})

// Mock Supabase client for database testing
vi.mock('@supabase/supabase-js', () => {
  let idCounter = 1

  // Create chainable query builder mock
  const createQueryBuilder = () => {
    let storedData: any = null
    let isInsertOperation = false
    let isUpdateOperation = false
    let isDeleteOperation = false

    const builder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn((data: any) => {
        isInsertOperation = true
        // Generate mock data with ID
        storedData = Array.isArray(data) ? data : [data]
        storedData = storedData.map((item: any) => ({
          id: `mock-id-${idCounter++}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        }))
        return builder
      }),
      update: vi.fn((data: any) => {
        isUpdateOperation = true
        storedData = [{ id: `mock-id-${idCounter}`, ...data }]
        return builder
      }),
      delete: vi.fn(() => {
        isDeleteOperation = true
        storedData = []
        return builder
      }),
      upsert: vi.fn((data: any) => {
        isInsertOperation = true
        storedData = Array.isArray(data) ? data : [data]
        storedData = storedData.map((item: any) => ({
          id: item.id || `mock-id-${idCounter++}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        }))
        return builder
      }),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(() => Promise.resolve({
        data: storedData && storedData.length > 0 ? storedData[0] : null,
        error: null
      })),
      maybeSingle: vi.fn(() => Promise.resolve({
        data: storedData && storedData.length > 0 ? storedData[0] : null,
        error: null
      })),
      then: vi.fn((resolve) => Promise.resolve(resolve({ data: storedData, error: null }))),
    }
    return builder
  }

  const mockFrom = vi.fn((table: string) => createQueryBuilder())

  const mockClient = {
    from: mockFrom,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
  }

  return {
    createClient: vi.fn(() => mockClient),
  }
})

// Suppress console errors during tests (optional)
// Uncomment if you want cleaner test output
// const originalError = console.error
// beforeAll(() => {
//   console.error = (...args: any[]) => {
//     if (
//       typeof args[0] === 'string' &&
//       (args[0].includes('Warning: ReactDOM.render') ||
//        args[0].includes('Warning: useLayoutEffect'))
//     ) {
//       return
//     }
//     originalError.call(console, ...args)
//   }
// })

// afterAll(() => {
//   console.error = originalError
// })
