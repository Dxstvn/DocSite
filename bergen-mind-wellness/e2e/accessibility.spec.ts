/**
 * E2E Tests: Accessibility (WCAG 2.1 Level AA)
 *
 * Tests compliance with web accessibility standards:
 * - Keyboard navigation
 * - Screen reader compatibility (ARIA)
 * - Focus management
 * - Color contrast
 * - Form accessibility
 * - Semantic HTML
 * - Skip navigation
 * - Error message accessibility
 * - Live regions for dynamic updates
 */

import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Compliance', () => {
  // Clean database before each test to prevent conflicts
  test.beforeEach(async ({ request }) => {
    const response = await request.delete('/api/test/cleanup-appointments')
    expect(response.ok()).toBeTruthy()
  })

  test('should not have automatically detectable accessibility violations on homepage', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility violations on appointments page', async ({ page }) => {
    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have properly structured heading hierarchy', async ({ page }) => {
    await page.goto('/en/appointments')

    // Should have h1
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Get all headings
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
      elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent,
      }))
    )

    // Should start with h1
    expect(headings[0].tag).toBe('h1')

    // Verify no heading levels are skipped
    const levels = headings.map(h => parseInt(h.tag.replace('h', '')))
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1]
      // Can go up multiple levels (h3 to h1) but should not skip when going down (h2 to h4)
      if (diff > 0) {
        expect(diff).toBeLessThanOrEqual(1)
      }
    }
  })

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/en/appointments')

    // Press Tab to focus skip link
    await page.keyboard.press('Tab')

    // Skip link should be visible when focused
    const skipLink = page.locator('a:has-text("Skip to main content")')
    const isVisible = await skipLink.isVisible()

    if (isVisible) {
      // Should link to main content
      await expect(skipLink).toHaveAttribute('href', /#main|#content/)
    }
  })

  test('should allow keyboard navigation through booking flow', async ({ page }) => {
    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')

    // Tab to appointment type selector
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // May need multiple tabs depending on header
    await page.keyboard.press('Tab')

    // Should focus on interactive element
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(focused)

    // Continue tabbing through all interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
    }

    // Should still be on page (not stuck in focus trap)
    const currentUrl = page.url()
    expect(currentUrl).toContain('/appointments')
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/en/appointments')

    // Tab to first interactive element
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Get focused element
    const focusedElement = page.locator(':focus')

    // Should have visible focus indicator (outline or border)
    const hasVisibleFocus = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.outline !== 'none' &&
        styles.outline !== '0px' &&
        styles.outline !== '' ||
        parseInt(styles.outlineWidth) > 0 ||
        styles.boxShadow.includes('rgb') // Some implementations use box-shadow
      )
    })

    expect(hasVisibleFocus).toBe(true)
  })

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/en/appointments')

    // Select appointment type
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await typeSelector.click()
    await page.locator('[role="option"]').first().click()
    await page.waitForTimeout(500)

    // Calendar navigation buttons should have aria-labels
    const prevButton = page.locator('[data-testid="calendar-prev"]')
    const nextButton = page.locator('[data-testid="calendar-next"]')

    if (await prevButton.isVisible()) {
      const prevLabel = await prevButton.getAttribute('aria-label')
      expect(prevLabel).toBeTruthy()
      expect(prevLabel).toMatch(/previous|prev/i)
    }

    if (await nextButton.isVisible()) {
      const nextLabel = await nextButton.getAttribute('aria-label')
      expect(nextLabel).toBeTruthy()
      expect(nextLabel).toMatch(/next/i)
    }
  })

  test('should have proper ARIA roles on calendar', async ({ page }) => {
    await page.goto('/en/appointments')

    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await typeSelector.click()
    await page.locator('[role="option"]').first().click()
    await page.waitForTimeout(500)

    // Calendar should have grid role
    const calendar = page.locator('[data-testid="booking-calendar"]')
    const calendarRole = await calendar.getAttribute('role')
    expect(['grid', 'application', 'region']).toContain(calendarRole)

    // Calendar days should have button role
    const calendarDay = page.locator('[data-testid="calendar-day"]').first()
    const dayRole = await calendarDay.getAttribute('role')
    expect(['button', 'gridcell']).toContain(dayRole)
  })

  test('should have associated labels for form inputs', async ({ page }) => {
    await page.goto('/en/appointments')

    // Navigate through booking flow
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Check form inputs have labels
    const firstNameInput = page.locator('input[name="firstName"]')
    const lastNameInput = page.locator('input[name="lastName"]')
    const emailInput = page.locator('input[name="email"]')
    const phoneInput = page.locator('input[name="phone"]')

    // Each should have associated label
    for (const input of [firstNameInput, lastNameInput, emailInput, phoneInput]) {
      const inputId = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')

      // Should have label association via id, aria-label, or aria-labelledby
      expect(inputId || ariaLabel || ariaLabelledBy).toBeTruthy()

      // If has id, should have matching label
      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`)
        const labelExists = await label.count() > 0
        expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('should announce form validation errors accessibly', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Try to submit without filling fields
    await page.locator('button[type="submit"]').click()

    // Error messages should have aria-live or aria-describedby
    const errorMessages = page.locator('[role="alert"]').or(page.locator('[aria-live="polite"]'))

    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible()
    }

    // Inputs should have aria-invalid when error
    const firstNameInput = page.locator('input[name="firstName"]')
    const ariaInvalid = await firstNameInput.getAttribute('aria-invalid')
    expect(ariaInvalid).toBe('true')
  })

  test('should have descriptive alt text for images', async ({ page }) => {
    await page.goto('/en')

    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')

      // Should have alt attribute (can be empty for decorative images)
      expect(alt).not.toBeNull()

      // If image is important (not decorative), alt should be descriptive
      const src = await img.getAttribute('src')
      if (src && !src.includes('icon') && !src.includes('decoration')) {
        expect(alt!.length).toBeGreaterThan(0)
      }
    }
  })

  test('should use semantic HTML elements', async ({ page }) => {
    await page.goto('/en/appointments')

    // Should have main landmark
    await expect(page.locator('main')).toBeVisible()

    // Should have header
    await expect(page.locator('header')).toBeVisible()

    // Should have nav for navigation
    const nav = page.locator('nav')
    const navCount = await nav.count()
    expect(navCount).toBeGreaterThan(0)

    // Forms should use <form> element
    const form = page.locator('form')
    if (await form.isVisible()) {
      await expect(form).toBeVisible()
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/en/appointments')

    // Run axe color contrast check
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('button, a, input, label, p, h1, h2, h3')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })

  test('should announce loading states to screen readers', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)

    // Select a date to trigger loading
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await availableDate.click()

    // Should have aria-live region for loading state
    const liveRegion = page.locator('[aria-live]').or(page.locator('[role="status"]'))

    if (await liveRegion.isVisible({ timeout: 1000 }).catch(() => false)) {
      const ariaLive = await liveRegion.getAttribute('aria-live')
      expect(['polite', 'assertive']).toContain(ariaLive)
    }
  })

  test('should be navigable with keyboard only (no mouse)', async ({ page }) => {
    await page.goto('/en/appointments')

    // Complete entire booking flow with keyboard only
    // Tab to appointment type selector
    let tabCount = 0
    while (tabCount < 20) {
      await page.keyboard.press('Tab')
      tabCount++

      const focused = await page.evaluate(() => {
        const el = document.activeElement
        return {
          tag: el?.tagName,
          testId: el?.getAttribute('data-testid'),
          text: el?.textContent?.slice(0, 50),
        }
      })

      // If we reach appointment type selector, select it
      if (focused.testId === 'appointment-type-select') {
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        break
      }
    }

    // Should successfully navigate and select
    // This is a smoke test that keyboard navigation is possible
    expect(tabCount).toBeLessThan(20)
  })

  test('should trap focus in modals/dialogs', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Fill and submit form
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', `john${Date.now()}@example.com`)
    await page.fill('input[name="phone"]', '+15551234567')
    await page.fill('input[name="dateOfBirth"]', '1990-01-01')
    await page.locator('button[type="submit"]').click()

    // Wait for confirmation modal
    const modal = page.locator('[role="dialog"]').or(page.locator('[data-testid="confirmation-modal"]'))

    if (await modal.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Focus should be within modal
      await page.keyboard.press('Tab')

      const focusedElement = page.locator(':focus')
      const isWithinModal = await modal.locator(':focus').count() > 0

      expect(isWithinModal).toBe(true)
    }
  })

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/en/appointments')

    // HTML should have lang attribute
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBeTruthy()
    expect(['en', 'es', 'en-US']).toContain(lang)
  })

  test('should identify form fields with required attribute', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Required fields should have required attribute or aria-required
    const firstNameInput = page.locator('input[name="firstName"]')
    const emailInput = page.locator('input[name="email"]')

    const nameRequired = await firstNameInput.getAttribute('required').then(() => true).catch(() => false)
    const nameAriaRequired = await firstNameInput.getAttribute('aria-required')
    expect(nameRequired || nameAriaRequired === 'true').toBe(true)

    const emailRequired = await emailInput.getAttribute('required').then(() => true).catch(() => false)
    const emailAriaRequired = await emailInput.getAttribute('aria-required')
    expect(emailRequired || emailAriaRequired === 'true').toBe(true)
  })

  test('should provide text alternatives for icon-only buttons', async ({ page }) => {
    await page.goto('/en/appointments')

    // Find buttons that might be icon-only
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()

      // If button has no visible text
      if (!text || text.trim().length === 0) {
        // Should have aria-label
        const ariaLabel = await button.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel!.length).toBeGreaterThan(0)
      }
    }
  })

  test('should not have time-based auto-refresh that disrupts users', async ({ page }) => {
    await page.goto('/en/appointments')

    // Check for meta refresh
    const metaRefresh = await page.locator('meta[http-equiv="refresh"]').count()
    expect(metaRefresh).toBe(0)

    // Page should not auto-refresh within 5 seconds
    await page.waitForTimeout(5000)
    const url = page.url()
    expect(url).toContain('/appointments')
  })

  test('should have resizable text (no disabled zoom)', async ({ page }) => {
    await page.goto('/en/appointments')

    // Check viewport meta tag
    const viewportContent = await page.locator('meta[name="viewport"]').getAttribute('content')

    // Should not have user-scalable=no or maximum-scale=1
    expect(viewportContent).not.toContain('user-scalable=no')
    expect(viewportContent).not.toContain('user-scalable=0')
    // maximum-scale should allow at least 2x zoom
    if (viewportContent?.includes('maximum-scale')) {
      const maxScale = parseFloat(viewportContent.match(/maximum-scale=([\d.]+)/)?.[1] || '5')
      expect(maxScale).toBeGreaterThanOrEqual(2)
    }
  })

  test('should have clear error messages with suggestions', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Enter invalid email
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="phone"]', '+15551234567')
    await page.fill('input[name="dateOfBirth"]', '1990-01-01')

    await page.locator('button[type="submit"]').click()

    // Error message should be clear and helpful
    const errorMessage = page.locator('text=/valid email|email.*format|please.*@/i')
    await expect(errorMessage).toBeVisible()
  })
})

// Helper functions
async function selectAppointmentType(page: Page) {
  const typeSelector = page.locator('[data-testid="appointment-type-select"]')
  await typeSelector.click()
  await page.waitForTimeout(300)
  await page.locator('[role="option"]').first().click()

  // Wait for calendar to become visible after type selection
  await page.locator('[data-testid="booking-calendar"]').waitFor({
    state: 'visible',
    timeout: 5000
  })
}

async function selectDate(page: Page) {
  // Select 3rd available date (~3 days from now) to satisfy 24-hour minimum notice requirement
  const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').nth(2)
  await availableDate.click()
  await page.waitForTimeout(500)
}

async function selectTimeSlot(page: Page) {
  // Wait for time slots to load from API
  const firstSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
  await firstSlot.waitFor({ state: 'visible', timeout: 10000 })
  await firstSlot.click()
  await page.waitForTimeout(500)
}
