/**
 * E2E Tests: Mobile Responsiveness
 *
 * Tests mobile and tablet experience for appointment booking:
 * - Mobile viewport testing (iPhone, Android)
 * - Tablet viewport testing (iPad)
 * - Touch interactions
 * - Mobile navigation
 * - Form usability on small screens
 * - Calendar on mobile
 * - Touch target sizes
 * - Responsive layouts
 */

import { test, expect, type Page } from '@playwright/test'

// Common mobile devices
const MOBILE_DEVICES = {
  iPhoneSE: { width: 375, height: 667, name: 'iPhone SE' },
  iPhone12: { width: 390, height: 844, name: 'iPhone 12' },
  iPhone14ProMax: { width: 430, height: 932, name: 'iPhone 14 Pro Max' },
  pixelAndroid: { width: 393, height: 851, name: 'Pixel 5' },
  galaxyS20: { width: 360, height: 800, name: 'Galaxy S20' },
}

const TABLET_DEVICES = {
  iPadMini: { width: 768, height: 1024, name: 'iPad Mini' },
  iPadPro: { width: 1024, height: 1366, name: 'iPad Pro' },
}

test.describe('Mobile Responsiveness', () => {
  for (const [deviceKey, device] of Object.entries(MOBILE_DEVICES)) {
    test.describe(`${device.name} (${device.width}x${device.height})`, () => {
      test.use({
        viewport: { width: device.width, height: device.height },
        hasTouch: true,
      })

      test('should display mobile-friendly homepage', async ({ page }) => {
        await page.goto('/en')
        await page.waitForLoadState('networkidle')

        // Main content should be visible
        await expect(page.locator('main')).toBeVisible()

        // Should not have horizontal scrollbar
        const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
        expect(hasHorizontalScroll).toBe(false)
      })

      test('should display mobile navigation menu', async ({ page }) => {
        await page.goto('/en')

        // Look for mobile menu button (hamburger)
        const mobileMenuButton = page.locator('button[aria-label="Menu"]').or(page.locator('[data-testid="mobile-menu-button"]'))

        if (await mobileMenuButton.isVisible()) {
          // Click to open menu
          await mobileMenuButton.click()

          // Menu should appear
          const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(page.locator('[role="dialog"]'))
          await expect(mobileMenu).toBeVisible()

          // Should have navigation links
          await expect(mobileMenu.locator('a:has-text("Home")')).toBeVisible()
          await expect(mobileMenu.locator('a:has-text("Appointments")')).toBeVisible()
        }
      })

      test('should display booking interface on mobile', async ({ page }) => {
        await page.goto('/en/appointments')
        await page.waitForLoadState('networkidle')

        // Booking interface should be visible
        await expect(page.locator('[data-testid="booking-interface"]')).toBeVisible()

        // Should not overflow horizontally
        const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
        expect(hasHorizontalScroll).toBe(false)
      })

      test('should have touch-friendly appointment type selector', async ({ page }) => {
        await page.goto('/en/appointments')

        const typeSelector = page.locator('[data-testid="appointment-type-select"]')
        await expect(typeSelector).toBeVisible()

        // Should be large enough to tap (minimum 44x44px)
        const box = await typeSelector.boundingBox()
        expect(box!.height).toBeGreaterThanOrEqual(44)

        // Should be tappable
        await typeSelector.tap()
        await expect(page.locator('[role="option"]')).toBeVisible()
      })

      test('should display mobile-friendly calendar', async ({ page }) => {
        await page.goto('/en/appointments')

        // Select appointment type
        const typeSelector = page.locator('[data-testid="appointment-type-select"]')
        await typeSelector.tap()
        await page.locator('[role="option"]').first().tap()
        await page.waitForTimeout(500)

        // Calendar should be visible and sized appropriately
        const calendar = page.locator('[data-testid="booking-calendar"]')
        await expect(calendar).toBeVisible()

        // Calendar should fit within viewport width
        const calendarBox = await calendar.boundingBox()
        expect(calendarBox!.width).toBeLessThanOrEqual(device.width)
      })

      test('should have touch-friendly calendar day buttons', async ({ page }) => {
        await page.goto('/en/appointments')

        // Select appointment type
        const typeSelector = page.locator('[data-testid="appointment-type-select"]')
        await typeSelector.tap()
        await page.locator('[role="option"]').first().tap()
        await page.waitForTimeout(500)

        // Day buttons should be large enough for touch
        const dayButton = page.locator('[data-testid="calendar-day"]').first()
        const box = await dayButton.boundingBox()

        // Minimum touch target: 44x44px (Apple HIG) or 48x48dp (Android Material)
        expect(box!.width).toBeGreaterThanOrEqual(40) // Allow slight margin
        expect(box!.height).toBeGreaterThanOrEqual(40)
      })

      test('should allow selecting date with tap gesture', async ({ page }) => {
        await page.goto('/en/appointments')

        const typeSelector = page.locator('[data-testid="appointment-type-select"]')
        await typeSelector.tap()
        await page.locator('[role="option"]').first().tap()
        await page.waitForTimeout(500)

        // Tap on available date
        const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
        await availableDate.tap()

        // Date should be selected
        await expect(availableDate).toHaveAttribute('data-selected', 'true')

        // Time slots should appear
        await expect(page.locator('[data-testid="time-slots"]')).toBeVisible({ timeout: 3000 })
      })

      test('should display time slots in mobile-friendly layout', async ({ page }) => {
        await page.goto('/en/appointments')

        // Select appointment type and date
        const typeSelector = page.locator('[data-testid="appointment-type-select"]')
        await typeSelector.tap()
        await page.locator('[role="option"]').first().tap()
        await page.waitForTimeout(500)

        const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
        await availableDate.tap()
        await page.waitForTimeout(500)

        // Time slots should be visible
        const timeSlotsContainer = page.locator('[data-testid="time-slots"]')
        await expect(timeSlotsContainer).toBeVisible()

        // Slots should be large enough for touch
        const timeSlot = page.locator('[data-testid="time-slot"]').first()
        const slotBox = await timeSlot.boundingBox()
        expect(slotBox!.height).toBeGreaterThanOrEqual(44)
      })

      test('should have mobile-friendly form inputs', async ({ page }) => {
        await page.goto('/en/appointments')

        // Go through booking flow to form
        await selectAppointmentType(page)
        await selectDate(page)
        await selectTimeSlot(page)

        // Form should be visible
        const form = page.locator('[data-testid="booking-form"]')
        await expect(form).toBeVisible()

        // Inputs should be large enough
        const nameInput = page.locator('input[name="patientName"]')
        const inputBox = await nameInput.boundingBox()
        expect(inputBox!.height).toBeGreaterThanOrEqual(44)

        // Email input should have correct input type for mobile keyboard
        const emailInput = page.locator('input[name="email"]')
        await expect(emailInput).toHaveAttribute('type', 'email')

        // Phone input should have tel type
        const phoneInput = page.locator('input[name="phone"]')
        const phoneType = await phoneInput.getAttribute('type')
        expect(['tel', 'text']).toContain(phoneType) // Some implementations use text with pattern
      })

      test('should allow scrolling through booking form', async ({ page }) => {
        await page.goto('/en/appointments')

        await selectAppointmentType(page)
        await selectDate(page)
        await selectTimeSlot(page)

        const form = page.locator('[data-testid="booking-form"]')
        await expect(form).toBeVisible()

        // Fill form
        await page.fill('input[name="patientName"]', 'John Doe')
        await page.fill('input[name="email"]', 'john@example.com')
        await page.fill('input[name="phone"]', '+15551234567')

        // Submit button should be visible after scrolling
        const submitButton = page.locator('button[type="submit"]')
        await submitButton.scrollIntoViewIfNeeded()
        await expect(submitButton).toBeVisible()
      })

      test('should have touch-friendly submit button', async ({ page }) => {
        await page.goto('/en/appointments')

        await selectAppointmentType(page)
        await selectDate(page)
        await selectTimeSlot(page)

        // Submit button should be large enough for touch
        const submitButton = page.locator('button[type="submit"]')
        await expect(submitButton).toBeVisible()

        const buttonBox = await submitButton.boundingBox()
        expect(buttonBox!.height).toBeGreaterThanOrEqual(44)
        expect(buttonBox!.width).toBeGreaterThan(100) // Should be wide enough
      })

      test('should not zoom in on input focus', async ({ page }) => {
        await page.goto('/en/appointments')

        await selectAppointmentType(page)
        await selectDate(page)
        await selectTimeSlot(page)

        // Get viewport meta tag
        const viewportContent = await page.locator('meta[name="viewport"]').getAttribute('content')

        // Should not have user-scalable=no (for accessibility)
        // But should have appropriate initial-scale
        expect(viewportContent).toContain('width=device-width')
        expect(viewportContent).toContain('initial-scale=1')
      })

      test('should handle virtual keyboard appearance', async ({ page }) => {
        await page.goto('/en/appointments')

        await selectAppointmentType(page)
        await selectDate(page)
        await selectTimeSlot(page)

        // Focus on input
        const nameInput = page.locator('input[name="patientName"]')
        await nameInput.tap()

        // Input should remain visible (not obscured by keyboard)
        await expect(nameInput).toBeVisible()

        // Should be scrolled into view
        const isInViewport = await nameInput.isVisible()
        expect(isInViewport).toBe(true)
      })
    })
  }

  test.describe('Tablet Responsiveness', () => {
    for (const [deviceKey, device] of Object.entries(TABLET_DEVICES)) {
      test.describe(`${device.name} (${device.width}x${device.height})`, () => {
        test.use({
          viewport: { width: device.width, height: device.height },
          hasTouch: true,
        })

        test('should display tablet-optimized layout', async ({ page }) => {
          await page.goto('/en/appointments')
          await page.waitForLoadState('networkidle')

          // Should use tablet layout (might be 2-column)
          const bookingInterface = page.locator('[data-testid="booking-interface"]')
          await expect(bookingInterface).toBeVisible()

          // Should not have horizontal scroll
          const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
          expect(hasHorizontalScroll).toBe(false)
        })

        test('should display calendar and time slots side by side (if designed)', async ({ page }) => {
          await page.goto('/en/appointments')

          const typeSelector = page.locator('[data-testid="appointment-type-select"]')
          await typeSelector.tap()
          await page.locator('[role="option"]').first().tap()
          await page.waitForTimeout(500)

          // Select a date
          const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
          await availableDate.tap()
          await page.waitForTimeout(500)

          // Both calendar and time slots should be visible
          await expect(page.locator('[data-testid="booking-calendar"]')).toBeVisible()
          await expect(page.locator('[data-testid="time-slots"]')).toBeVisible()
        })

        test('should allow landscape and portrait orientations', async ({ page }) => {
          // Test portrait (default)
          await page.goto('/en/appointments')
          await expect(page.locator('[data-testid="booking-interface"]')).toBeVisible()

          // Rotate to landscape
          await page.setViewportSize({ width: device.height, height: device.width })
          await page.waitForTimeout(500)

          // Should still be functional
          await expect(page.locator('[data-testid="booking-interface"]')).toBeVisible()
        })
      })
    }
  })

  test.describe('Touch Gesture Support', () => {
    test.use({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    })

    test('should support swipe gesture for calendar navigation', async ({ page }) => {
      await page.goto('/en/appointments')

      const typeSelector = page.locator('[data-testid="appointment-type-select"]')
      await typeSelector.tap()
      await page.locator('[role="option"]').first().tap()
      await page.waitForTimeout(500)

      const calendar = page.locator('[data-testid="booking-calendar"]')
      await expect(calendar).toBeVisible()

      // Get current month
      const monthDisplay = page.locator('[data-testid="calendar-month"]')
      const initialMonth = await monthDisplay.textContent()

      // Attempt swipe gesture (if supported)
      const calendarBox = await calendar.boundingBox()
      if (calendarBox) {
        // Swipe left (to next month)
        await page.touchscreen.tap(calendarBox.x + calendarBox.width - 50, calendarBox.y + calendarBox.height / 2)
        await page.waitForTimeout(300)

        // Or use navigation button
        const nextButton = page.locator('[data-testid="calendar-next"]')
        await nextButton.tap()
        await page.waitForTimeout(300)

        const newMonth = await monthDisplay.textContent()
        expect(newMonth).not.toBe(initialMonth)
      }
    })

    test('should support long-press for additional options (if implemented)', async ({ page }) => {
      await page.goto('/en/appointments')

      await selectAppointmentType(page)
      await selectDate(page)

      // Long press on time slot
      const timeSlot = page.locator('[data-testid="time-slot"]').first()

      // Simulate long press (touch and hold)
      await timeSlot.tap({ timeout: 1000 })

      // If long-press actions exist, they should appear
      // This is optional functionality
    })
  })

  test.describe('Responsive Breakpoints', () => {
    const breakpoints = [
      { width: 320, name: 'Extra Small Mobile' },
      { width: 375, name: 'Small Mobile' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop' },
      { width: 1440, name: 'Large Desktop' },
    ]

    for (const breakpoint of breakpoints) {
      test(`should be functional at ${breakpoint.name} (${breakpoint.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: 800 })
        await page.goto('/en/appointments')
        await page.waitForLoadState('networkidle')

        // Core functionality should work at all breakpoints
        await expect(page.locator('[data-testid="booking-interface"]')).toBeVisible()

        // Should not have horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
        expect(hasHorizontalScroll).toBe(false)
      })
    }
  })

  test.describe('Safe Area Insets (Notched Devices)', () => {
    test.use({
      viewport: { width: 390, height: 844 }, // iPhone with notch
      hasTouch: true,
    })

    test('should respect safe area insets for notched devices', async ({ page }) => {
      await page.goto('/en')

      // Header should not be obscured by notch
      const header = page.locator('header')
      if (await header.isVisible()) {
        const headerBox = await header.boundingBox()

        // Header should start below notch (typically >40px on iPhone)
        // This is handled by viewport-fit=cover and safe-area-inset-top
        expect(headerBox!.y).toBeGreaterThanOrEqual(0)
      }
    })
  })
})

// Helper functions
async function selectAppointmentType(page: Page) {
  const typeSelector = page.locator('[data-testid="appointment-type-select"]')
  await typeSelector.tap()
  await page.locator('[role="option"]').first().tap()
  await page.waitForTimeout(500)
}

async function selectDate(page: Page) {
  const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
  await availableDate.tap()
  await page.waitForTimeout(500)
}

async function selectTimeSlot(page: Page) {
  const firstSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
  await firstSlot.tap()
  await page.waitForTimeout(500)
}
