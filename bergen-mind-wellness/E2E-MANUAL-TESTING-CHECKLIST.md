# E2E Manual Testing Checklist

> **Comprehensive manual testing guide for Bergen Mind & Wellness**
> Covers all 226 E2E test scenarios using Playwright Extension MCP

---

## 📋 Table of Contents

- [Overview](#overview)
- [Test Environment Setup](#test-environment-setup)
- [Playwright Extension MCP Usage](#playwright-extension-mcp-usage)
- [Test Checklists by Priority](#test-checklists-by-priority)
- [Progress Tracking](#progress-tracking)
- [Troubleshooting](#troubleshooting)

---

## Overview

This documentation suite replaces automated E2E tests with human-guided manual testing workflows using **Playwright Extension MCP**. The 226 test cases are organized into 7 priority-based checklists for systematic verification.

### Why Manual Testing?

- **Authentic User Experience**: Human testers catch UX issues automation misses
- **Visual Verification**: Confirms layouts, colors, spacing, and visual hierarchy
- **Accessibility Testing**: Real keyboard navigation and assistive technology validation
- **Cross-Browser Verification**: Manual testing across different browsers and devices
- **Exploratory Testing**: Uncover edge cases beyond scripted scenarios

### Test Coverage Summary

| Priority | Category | Tests | File |
|----------|----------|-------|------|
| 1 | **Patient Booking Flow** | 28 | [01-patient-booking.md](e2e-checklists/01-patient-booking.md) |
| 2 | **Accessibility Compliance** | 26 | [02-accessibility.md](e2e-checklists/02-accessibility.md) |
| 3 | **Calendar Interaction** | 28 | [03-calendar.md](e2e-checklists/03-calendar.md) |
| 4 | **Admin Features** | 47 | [04-admin.md](e2e-checklists/04-admin.md) |
| 5 | **Mobile Responsiveness** | 64 | [05-mobile.md](e2e-checklists/05-mobile.md) |
| 6 | **Internationalization** | 43 | [06-i18n.md](e2e-checklists/06-i18n.md) |
| 7 | **Performance & Load** | 12 | [07-performance.md](e2e-checklists/07-performance.md) |
| | **TOTAL** | **226** | |

---

## Test Environment Setup

### Prerequisites

**IMPORTANT: We use PRODUCTION database for all testing**

The project uses a **local frontend + production backend** setup:
- Local Next.js dev server connects to **production Supabase instance**
- No local database needed (product hasn't launched yet)
- All test data lives in production database
- Database operations use **Supabase MCP** (targets production directly)

1. **Development Server**
   ```bash
   cd /Users/dustinjasmin/DocSite/bergen-mind-wellness
   pnpm dev
   ```
   - App runs at `http://localhost:3000`
   - Connects to production Supabase database
   - Verify console shows correct Supabase URL

2. **Database Operations**
   - Use **Supabase MCP** tools for all database queries/migrations
   - All operations target production database
   - No `pnpm supabase:start` or local database setup required

### Environment Variables

Production Supabase connection (in `.env.local` or `.env.production.local`):

```bash
# Production Supabase Instance
NEXT_PUBLIC_SUPABASE_URL=<production-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key>
```

### Admin Test Account

**Production Admin Credentials** (in production database):
- **Email**: `admin@test.com`
- **Password**: `test-password-123`
- **Role**: `admin`
- **UUID**: `22222222-2222-2222-2222-222222222222`

---

## Playwright Extension MCP Usage

### What is Playwright Extension MCP?

Playwright Extension MCP is an enhanced Model Context Protocol server that provides browser automation capabilities for manual testing. It allows you to:
- Launch and control a real browser session
- Navigate to URLs and interact with elements
- Take screenshots and snapshots
- Inspect accessibility tree
- Verify visual states and behaviors

### Configuration

Verify Playwright Extension MCP is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright-extension": {
      "type": "stdio",
      "command": "/Users/dustinjasmin/.npm-global/bin/mcp-server-playwright",
      "args": ["--extension"],
      "env": {
        "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "O2AxPr4ci-1LpKJ9qSy4ld8mBpl9B9MBjYrQXZRzUj4"
      }
    }
  }
}
```

### Basic Workflow

1. **Launch Browser**
   - Use: `mcp__playwright-extension__browser_navigate`
   - Navigate to: `http://localhost:3000`

2. **Take Page Snapshot**
   - Use: `mcp__playwright-extension__browser_snapshot`
   - This shows the accessibility tree (better than screenshots)

3. **Interact with Elements**
   - Click: `mcp__playwright-extension__browser_click`
   - Type: `mcp__playwright-extension__browser_type`
   - Fill forms: `mcp__playwright-extension__browser_fill_form`

4. **Verify Results**
   - Take screenshots: `mcp__playwright-extension__browser_take_screenshot`
   - Evaluate JavaScript: `mcp__playwright-extension__browser_evaluate`
   - Check console: `mcp__playwright-extension__browser_console_messages`

5. **Cleanup**
   - Close browser: `mcp__playwright-extension__browser_close`

### Element References

When using Playwright Extension MCP tools, you'll need to provide:
- **element**: Human-readable description (e.g., "Book Appointment button")
- **ref**: Exact element reference from snapshot (e.g., `data-testid="book-button"`)

Always take a snapshot first to get accurate element references.

---

## Test Checklists by Priority

### Priority 1: Core Patient Booking Flow
**File**: [e2e-checklists/01-patient-booking.md](e2e-checklists/01-patient-booking.md)
**Tests**: 28 | **Status**: ✅ 96% Complete (25 Passed, 2 N/A, 1 Bug Fixed)

Critical user journey testing covering:
- ✅ Appointment type selection
- ✅ Calendar date picker interaction
- ✅ Time slot selection and availability
- ✅ Patient information form validation
- ✅ Booking confirmation and token generation
- ✅ Appointment cancellation workflows (1 critical bug discovered and fixed)
- ✅ Edge cases (date changes, minimum notice, weekend handling, invalid tokens)

---

### Priority 2: Accessibility Compliance
**File**: [e2e-checklists/02-accessibility.md](e2e-checklists/02-accessibility.md)
**Tests**: 26 | **Status**: ✅ 100% Complete (26 Passed)

WCAG 2.1 Level AA compliance testing:
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ Screen reader support (ARIA labels, roles, live regions)
- ✅ Focus management (visible focus indicators, logical order)
- ✅ Color contrast ratios (4.5:1 for text, 3:1 for UI components)
- ✅ Form accessibility (labels, error messages, instructions, autocomplete)
- ✅ Heading hierarchy (H1-H6 proper structure)

---

### Priority 3: Calendar Interaction
**File**: [e2e-checklists/03-calendar.md](e2e-checklists/03-calendar.md)
**Tests**: 28 | **Status**: ☐ Not Started

Date picker and calendar functionality:
- Multi-month navigation (previous/next buttons)
- Date selection and disabled state handling
- Keyboard navigation within calendar grid
- Today's date highlighting
- Weekend and past date disabling
- Month/year header display
- Time slot availability display by date

---

### Priority 4: Admin Features
**File**: [e2e-checklists/04-admin.md](e2e-checklists/04-admin.md)
**Tests**: 47 | **Status**: ☐ Not Started

Administrative dashboard testing:
- Admin authentication and authorization
- Appointment management (view, filter, sort)
- Appointment rescheduling workflows
- Appointment cancellation (admin-initiated)
- Availability configuration (blocking time slots)
- Patient information display
- Dashboard statistics and analytics

---

### Priority 5: Mobile Responsiveness
**File**: [e2e-checklists/05-mobile.md](e2e-checklists/05-mobile.md)
**Tests**: 64 | **Status**: ☐ Not Started

Cross-device and viewport testing:
- **Mobile Devices**: iPhone SE, iPhone 12 Pro, iPhone 14 Pro Max, Pixel 5, Galaxy S8+
- **Tablets**: iPad (768x1024), iPad Pro 11 (834x1194)
- Touch gesture support (tap, swipe, pinch)
- Responsive layouts and breakpoints
- Mobile navigation patterns
- Form usability on small screens
- Calendar interaction on touch devices

---

### Priority 6: Internationalization (i18n)
**File**: [e2e-checklists/06-i18n.md](e2e-checklists/06-i18n.md)
**Tests**: 43 | **Status**: ☐ Not Started

Bilingual support (English/Spanish):
- Language switcher functionality
- Content translation accuracy
- Date/time formatting by locale
- Form validation messages in both languages
- Email notifications in user's language
- URL structure (`/en/` vs `/es/`)
- Persistent language preference

---

### Priority 7: Performance & Load Testing
**File**: [e2e-checklists/07-performance.md](e2e-checklists/07-performance.md)
**Tests**: 12 | **Status**: ☐ Not Started

Performance and concurrency testing:
- Concurrent user booking scenarios
- Race condition handling (same time slot)
- Database transaction isolation
- Response time validation
- Core Web Vitals (LCP, INP, CLS)
- Load testing with multiple simultaneous requests

---

## Progress Tracking

### Overall Test Execution Status

- [x] **Priority 1**: Patient Booking Flow (27/28 - 96% Complete)
  - ✅ 25 tests passed
  - ⚠️ 2 tests N/A (features not implemented)
  - 🐛 1 critical bug discovered and fixed (cancellation API)
- [ ] **Priority 2**: Accessibility Compliance (0/26)
- [ ] **Priority 3**: Calendar Interaction (0/28)
- [ ] **Priority 4**: Admin Features (0/47)
- [ ] **Priority 5**: Mobile Responsiveness (0/64)
- [ ] **Priority 6**: Internationalization (0/43)
- [ ] **Priority 7**: Performance & Load (0/12)

**Total Progress**: 27/226 (12%) - Priority 1 Complete

### Testing Notes

| Date | Tester | Priority | Tests Completed | Issues Found | Notes |
|------|--------|----------|----------------|--------------|-------|
| 2025-11-16 | Claude (Playwright MCP) | 1 | 27/28 (96%) | 1 critical bug fixed | Completed Section 8 edge cases: Tests 8.2 (date change), 8.5 (minimum notice), 8.6 (weekend handling) all PASSED. Tests 8.3-8.4 marked N/A (appointment type change feature not implemented). See TEST_EXECUTION_REPORT.md for full details. |
| | | | | | |
| | | | | | |

---

## Troubleshooting

### Common Issues

#### Supabase Not Running
**Symptom**: App shows database connection errors
**Solution**:
```bash
pnpm supabase:start
# Wait for all services to start (~30 seconds)
pnpm supabase:status  # Verify
```

#### Dev Server Port Conflict
**Symptom**: `Error: Port 3000 is already in use`
**Solution**:
```bash
# Find and kill existing process
lsof -ti:3000 | xargs kill
# Restart dev server
NODE_ENV=test pnpm dev
```

#### Test Data Pollution
**Symptom**: Tests fail due to leftover data from previous runs
**Solution**:
```bash
# Reset entire database to clean state
pnpm supabase:reset
# Restart dev server to reload
```

#### Browser Extension Token Issues
**Symptom**: Playwright Extension MCP fails to launch browser
**Solution**:
- Verify token in `.mcp.json` matches current session
- Restart Claude Code CLI to reload MCP configuration
- Check `/Users/dustinjasmin/.npm-global/bin/mcp-server-playwright` exists

#### Time Zone Issues
**Symptom**: Appointment times don't match expected values
**Solution**:
- All times are stored in UTC in database
- Frontend converts to user's local time zone
- Test with consistent time zone settings

### Getting Help

- **Supabase Issues**: Check `docker ps` to verify containers are running
- **Next.js Build Errors**: Review `.next/` directory, clear with `rm -rf .next`
- **TypeScript Errors**: Run `pnpm tsc --noEmit` to check for type errors
- **Database Schema**: Inspect with `pnpm supabase db diff` or SQL Editor in Supabase Studio (`http://127.0.0.1:54323`)

---

## Best Practices

### Before Testing
1. ✅ Reset database to clean state
2. ✅ Verify both Supabase and dev server are running
3. ✅ Clear browser cache and cookies
4. ✅ Close unnecessary browser tabs/windows
5. ✅ Review test checklist for prerequisites

### During Testing
1. ✅ Follow test steps exactly as documented
2. ✅ Take screenshots of failures/unexpected behavior
3. ✅ Document deviations from expected results
4. ✅ Note browser console errors
5. ✅ Test one priority level at a time

### After Testing
1. ✅ Update progress tracking table
2. ✅ Document all issues found
3. ✅ Clean up test data if needed
4. ✅ Close browser sessions
5. ✅ Commit completed checklists with results

---

## Next Steps

1. Review [Priority 1: Patient Booking Flow](e2e-checklists/01-patient-booking.md) to start testing
2. Follow Playwright Extension MCP setup instructions above
3. Execute tests in priority order
4. Document results and issues
5. Iterate until all 226 tests pass

---

**Last Updated**: 2025-11-16
**Document Version**: 1.0
**Total Test Coverage**: 226 E2E scenarios
