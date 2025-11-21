# Testing Guide for Bergen Mind & Wellness

This project uses a comprehensive testing strategy with three test types:

1. **Unit Tests** - Fast, mocked tests for business logic
2. **Integration Tests** - Real database tests with local Supabase
3. **E2E Tests** - Browser automation tests with Playwright

## Table of Contents

- [Quick Start](#quick-start)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [E2E Tests](#e2e-tests)
- [Test Organization](#test-organization)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

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

---

## Unit Tests

**Purpose**: Fast, isolated tests using mocks. Test business logic without external dependencies.

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Watch mode (re-runs on file changes)
pnpm test:watch

# With coverage report
pnpm test:coverage

# Interactive UI
pnpm test:ui
```

### What Unit Tests Cover

- Business logic functions
- Component rendering
- Form validation
- Data transformation
- Utility functions

### Unit Test Characteristics

- ✅ **Fast** (~100ms per test)
- ✅ **No external dependencies** (database, APIs mocked)
- ✅ **Consistent** (same result every time)
- ❌ **Don't test** real database constraints, RLS policies, or integrations

### Configuration

- Config: `vitest.config.ts`
- Setup: `vitest.setup.ts` (includes Supabase mocks)
- Location: `src/__tests__/unit/`

---

## Integration Tests

**Purpose**: Test real database operations, constraints, and RLS policies using local Supabase instance.

### Prerequisites

1. **Docker Desktop** must be installed and running
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

2. **Local Supabase instance** must be started

### First-Time Setup

```bash
# 1. Start local Supabase (downloads Docker images on first run)
pnpm supabase:start

# This will output something like:
# API URL: http://127.0.0.1:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Copy .env.test.example to .env.test
cp .env.test.example .env.test

# 3. Edit .env.test and paste the keys from `pnpm supabase:status`
# Update these lines:
# SUPABASE_TEST_URL=http://127.0.0.1:54321
# SUPABASE_TEST_ANON_KEY=<paste anon key>
# SUPABASE_TEST_SERVICE_KEY=<paste service_role key>

# 4. Verify connection
pnpm supabase:status
```

### Running Integration Tests

```bash
# Make sure Supabase is running first!
pnpm supabase:start

# Run integration tests
pnpm test:integration

# Watch mode
pnpm test:integration:watch
```

### What Integration Tests Cover

- ✅ **Real database operations** (INSERT, UPDATE, DELETE, SELECT)
- ✅ **Foreign key constraints** (referential integrity)
- ✅ **Row Level Security (RLS)** policies
- ✅ **Database-generated values** (UUIDs, timestamps)
- ✅ **Unique constraints** and check constraints
- ✅ **Transaction isolation** and concurrency
- ✅ **Real Supabase client behavior**

### Integration Test Characteristics

- ⚠️ **Slower** (~500ms-2s per test)
- ⚠️ **Requires Docker** (Supabase runs in containers)
- ✅ **Tests real behavior** (catches constraint violations, RLS bugs)
- ⚠️ **Run sequentially** (to avoid race conditions)

### Configuration

- Config: `vitest.integration.config.ts`
- Setup: `vitest.integration.setup.ts` (real Supabase clients)
- Location: `src/__tests__/integration/*.integration.test.ts`

### Managing Supabase

```bash
# Start local Supabase
pnpm supabase:start

# Stop local Supabase
pnpm supabase:stop

# Reset database (deletes all data, re-runs migrations)
pnpm supabase:reset

# Check status and get connection info
pnpm supabase:status
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { supabaseService, testDataTracker } from '../../../vitest.integration.setup'

describe('Availability Management - Real DB', () => {
  it('should create availability in real database', async () => {
    const { data, error } = await supabaseService
      .from('availability')
      .insert({
        doctor_id: 'test-doctor-123',
        day_of_week: 1,
        start_time: '10:00:00',
        end_time: '18:00:00',
      })
      .select()
      .single()

    expect(error).toBeNull()
    expect(data!.id).toMatch(/^[0-9a-f-]{36}$/) // Real UUID, not 'mock-id-1'!

    // Track for cleanup
    testDataTracker.trackAvailability(data!.id)

    // Verify it's actually in the database
    const { data: refetched } = await supabaseService
      .from('availability')
      .select()
      .eq('id', data!.id)
      .single()

    expect(refetched).toEqual(data)
  })
})
```

### Test Data Cleanup

Integration tests automatically clean up data using:

- **`beforeEach`**: Deletes all test data before each test
- **`afterEach`**: Deletes tracked IDs created during test
- **`testDataTracker`**: Helper to track created records

```typescript
// In your test
const { data } = await supabaseService.from('appointments').insert({...})
testDataTracker.trackAppointment(data!.id) // Auto-cleanup after test
```

---

## E2E Tests

**Purpose**: Test user flows in a real browser with Playwright.

### Running E2E Tests

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run with browser visible
pnpm test:e2e:headed

# Interactive UI mode
pnpm test:e2e:ui

# Debug mode (step through tests)
pnpm test:e2e:debug

# View last test report
pnpm test:e2e:report
```

### What E2E Tests Cover

- Full user journeys (booking flow, form submissions)
- Accessibility (WCAG 2.1 AA compliance)
- Mobile responsiveness
- Multi-language support
- Cross-browser compatibility

### Configuration

- Config: `playwright.config.ts`
- Location: `e2e/**/*.spec.ts`

---

## Test Organization

```
bergen-mind-wellness/
├── src/
│   └── __tests__/
│       ├── unit/              # Unit tests with mocks (FAST)
│       │   ├── database/      # Database logic unit tests
│       │   └── components/    # Component unit tests
│       └── integration/       # Integration tests with real DB (SLOW)
│           ├── *.integration.test.ts
│           └── helpers.ts
├── e2e/                       # Playwright E2E tests
│   ├── accessibility.spec.ts
│   ├── booking-flow.spec.ts
│   └── multilingual.spec.ts
├── vitest.config.ts           # Unit test config
├── vitest.integration.config.ts  # Integration test config
├── vitest.setup.ts            # Unit test setup (mocks)
└── vitest.integration.setup.ts   # Integration setup (real DB)
```

### Naming Conventions

- **Unit tests**: `*.test.ts`
- **Integration tests**: `*.integration.test.ts`
- **E2E tests**: `*.spec.ts`

---

## Troubleshooting

### Integration Tests Fail with "Cannot connect to test database"

**Problem**: Docker or Supabase not running

**Solution**:
```bash
# 1. Verify Docker is running
docker --version

# 2. Start Supabase
pnpm supabase:start

# 3. Verify .env.test exists and has correct credentials
cat .env.test

# 4. Get current credentials
pnpm supabase:status
```

### "Docker daemon not running" Error

**Problem**: Docker Desktop is not started

**Solution**:
1. Open Docker Desktop application
2. Wait for it to fully start (green icon in menu bar/system tray)
3. Retry: `pnpm supabase:start`

### Integration Tests Hang or Timeout

**Problem**: Tests running in parallel, causing race conditions

**Solution**: Integration tests MUST run sequentially (already configured in `vitest.integration.config.ts`)

```typescript
// vitest.integration.config.ts
export default defineConfig({
  test: {
    threads: false,           // ✅ No parallel threads
    fileParallelism: false,  // ✅ No parallel files
  },
})
```

### "Missing environment variable" Error

**Problem**: `.env.test` not configured

**Solution**:
```bash
# Copy example file
cp .env.test.example .env.test

# Get credentials
pnpm supabase:status

# Edit .env.test with real values
```

### Integration Test Data Persists Between Tests

**Problem**: Test cleanup not working

**Solution**:
- Use `testDataTracker.trackAppointment(id)` to register IDs for cleanup
- Or manually delete in test: `await supabaseService.from('table').delete().eq('id', id)`
- Nuclear option: `pnpm supabase:reset` (deletes everything)

### Unit Tests Failing After Adding Integration Tests

**Problem**: Global mocks interfering

**Solution**: Integration tests should NOT import `vitest.setup.ts` (which has mocks). They use `vitest.integration.setup.ts` instead.

Verify correct config:
```typescript
// vitest.integration.config.ts
setupFiles: ['./vitest.integration.setup.ts'], // ✅ No mocks
```

### Can't Run Tests: "pnpm: command not found"

**Solution**:
```bash
npm install -g pnpm
```

Or use npm equivalents:
```bash
npm run test:unit
npm run test:integration
```

---

## Best Practices

### When to Write Unit Tests

- Testing business logic functions
- Testing data transformations
- Testing component rendering
- Testing error handling
- When you need fast feedback (< 100ms)

### When to Write Integration Tests

- Testing database constraints (foreign keys, unique, check)
- Testing Row Level Security (RLS) policies
- Testing multi-table operations
- Testing real Supabase client behavior
- Testing transaction isolation

### When to Write E2E Tests

- Testing complete user flows
- Testing accessibility compliance
- Testing cross-browser compatibility
- Testing real user interactions

### Writing Good Integration Tests

```typescript
// ✅ DO: Track created IDs for cleanup
const { data } = await supabaseService.from('appointments').insert({...})
testDataTracker.trackAppointment(data!.id)

// ✅ DO: Test real constraints
expect(error.code).toBe('23503') // Foreign key violation

// ✅ DO: Verify real database state
const { data: refetched } = await supabaseService.from('table').select().eq('id', id)
expect(refetched).toBeDefined()

// ❌ DON'T: Mock anything in integration tests
vi.mock('@supabase/supabase-js') // ❌ NO! Use real client!

// ❌ DON'T: Use fake IDs
const fakeId = 'mock-id-123' // ❌ NO! Use real UUIDs from database!
```

---

## CI/CD Integration

Integration tests can run in GitHub Actions with Supabase CLI:

```yaml
# .github/workflows/integration-tests.yml
- name: Start Supabase
  run: |
    npx supabase start
    npx supabase status

- name: Run Integration Tests
  run: pnpm test:integration
  env:
    SUPABASE_TEST_URL: http://127.0.0.1:54321
    # ... other env vars from `supabase status`
```

---

## Summary

| Test Type | Speed | Setup | Purpose |
|-----------|-------|-------|---------|
| **Unit** | ⚡️ Fast (100ms) | None | Business logic |
| **Integration** | 🐢 Slow (1-2s) | Docker + Supabase | Database, RLS, constraints |
| **E2E** | 🐌 Very Slow (10s+) | None | User flows, accessibility |

**Recommendation**: Write mostly unit tests, some integration tests for critical database logic, and E2E tests for key user journeys.

---

## Questions?

- Vitest Docs: https://vitest.dev/
- Supabase Local Development: https://supabase.com/docs/guides/cli/local-development
- Playwright Docs: https://playwright.dev/
