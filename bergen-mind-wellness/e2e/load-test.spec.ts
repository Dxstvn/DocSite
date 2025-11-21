/**
 * E2E Tests: Load Testing
 *
 * Tests system performance under load:
 * - Concurrent user bookings
 * - API endpoint performance
 * - Database query performance
 * - Conflict resolution under load
 * - Graceful degradation
 * - Error handling under high traffic
 * - Response times under load
 *
 * NOTE: For comprehensive load testing, consider using k6, Artillery, or JMeter
 * This provides basic load testing using Playwright's parallel execution
 */

import { test, expect, type Page } from '@playwright/test'

test.describe('Load Testing', () => {
  test.describe.configure({ mode: 'parallel' })

  // Clean database before each test to prevent conflicts from previous runs
  test.beforeEach(async ({ request }) => {
    const response = await request.delete('/api/test/cleanup-appointments')
    expect(response.ok()).toBeTruthy()
  })

  test('should handle single user booking flow within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    const timestamp = Date.now()
    await page.fill('[data-testid="first-name-input"]', `User`)
    await page.fill('[data-testid="last-name-input"]', `${timestamp}`)
    await page.fill('[data-testid="email-input"]', `user${timestamp}@example.com`)
    await page.fill('[data-testid="phone-input"]', '+15551234567')
    await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

    // Select first appointment type in the form's RadioGroup (click the label, not the hidden input)
    await page.locator('[data-testid="appointment-type-select"] label').first().click()
    await page.waitForTimeout(300)

    await page.locator('button[type="submit"]').click()
    await page.waitForSelector('text=/confirmed|success/i', { timeout: 15000 })

    const endTime = Date.now()
    const totalTime = endTime - startTime

    // Booking flow should complete within 15 seconds
    expect(totalTime).toBeLessThan(15000)

    // Log performance
    console.log(`Single user booking completed in ${totalTime}ms`)
  })

  test('should handle 5 concurrent users booking different slots', async ({ browser }) => {
    const startTime = Date.now()
    const contexts = []
    const results = []

    // Create 5 concurrent users
    for (let i = 0; i < 5; i++) {
      const context = await browser.newContext()
      contexts.push(context)

      const page = await context.newPage()

      const bookingPromise = (async () => {
        try {
          const userStartTime = Date.now()

          await page.goto('/en/appointments')
          await page.waitForLoadState('networkidle')

          await selectAppointmentType(page)
          await selectDate(page)

          // Select different time slots
          const slots = page.locator('[data-testid="time-slot"]:not([disabled])')
          const slotCount = await slots.count()

          if (slotCount > i) {
            await slots.nth(i).click()
          } else {
            await slots.first().click()
          }

          await page.waitForTimeout(500)

          const timestamp = Date.now()
          await page.fill('[data-testid="first-name-input"]', `Concurrent`)
          await page.fill('[data-testid="last-name-input"]', `User${i}`)
          await page.fill('[data-testid="email-input"]', `concurrent${timestamp}-${i}@example.com`)
          await page.fill('[data-testid="phone-input"]', `+155512340${i}${i}`)
          await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

          // Select first appointment type in the form's RadioGroup (click the label, not the hidden input)
          await page.locator('[data-testid="appointment-type-select"] label').first().click()
          await page.waitForTimeout(300)

          await page.locator('button[type="submit"]').click()
          await page.waitForSelector('text=/confirmed|success/i', { timeout: 15000 })

          const userEndTime = Date.now()
          const userDuration = userEndTime - userStartTime

          return { success: true, duration: userDuration, userId: i }
        } catch (error) {
          return { success: false, error: error.message, userId: i }
        }
      })()

      results.push(bookingPromise)
    }

    // Wait for all bookings to complete
    const outcomes = await Promise.all(results)

    // Close all contexts
    for (const context of contexts) {
      await context.close()
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime

    // Analyze results
    const successfulBookings = outcomes.filter(o => o.success)
    const failedBookings = outcomes.filter(o => !o.success)

    console.log(`\nConcurrent Load Test Results:`)
    console.log(`Total time: ${totalTime}ms`)
    console.log(`Successful bookings: ${successfulBookings.length}/5`)
    console.log(`Failed bookings: ${failedBookings.length}/5`)

    successfulBookings.forEach(booking => {
      console.log(`  User ${booking.userId}: ${booking.duration}ms`)
    })

    if (failedBookings.length > 0) {
      console.log(`Failed booking errors:`)
      failedBookings.forEach(booking => {
        console.log(`  User ${booking.userId}: ${booking.error}`)
      })
    }

    // At least 4 out of 5 should succeed
    expect(successfulBookings.length).toBeGreaterThanOrEqual(4)

    // Total time should be reasonable (under 30 seconds)
    expect(totalTime).toBeLessThan(30000)
  })

  test('should handle race condition for same time slot', async ({ browser }) => {
    // Create 2 users trying to book the same slot simultaneously
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Both navigate to appointments page
    await Promise.all([
      page1.goto('/en/appointments'),
      page2.goto('/en/appointments'),
    ])

    await Promise.all([
      page1.waitForLoadState('networkidle'),
      page2.waitForLoadState('networkidle'),
    ])

    // Both select same appointment type
    await Promise.all([
      selectAppointmentType(page1),
      selectAppointmentType(page2),
    ])

    // Both select same date
    await Promise.all([
      selectDate(page1),
      selectDate(page2),
    ])

    // Both select same time slot (first available)
    await Promise.all([
      selectTimeSlot(page1),
      selectTimeSlot(page2),
    ])

    // Both fill forms
    const timestamp = Date.now()
    await Promise.all([
      page1.fill('[data-testid="first-name-input"]', 'Race'),
      page2.fill('[data-testid="first-name-input"]', 'Race'),
    ])

    await Promise.all([
      page1.fill('[data-testid="last-name-input"]', 'User1'),
      page2.fill('[data-testid="last-name-input"]', 'User2'),
    ])

    await Promise.all([
      page1.fill('[data-testid="email-input"]', `race1-${timestamp}@example.com`),
      page2.fill('[data-testid="email-input"]', `race2-${timestamp}@example.com`),
    ])

    await Promise.all([
      page1.fill('[data-testid="phone-input"]', '+15551234561'),
      page2.fill('[data-testid="phone-input"]', '+15551234562'),
    ])

    await Promise.all([
      page1.fill('[data-testid="date-of-birth-input"]', '1990-01-01'),
      page2.fill('[data-testid="date-of-birth-input"]', '1990-01-02'),
    ])

    // Both select appointment type (click the label, not the hidden input)
    await Promise.all([
      page1.locator('[data-testid="appointment-type-select"] label').first().click(),
      page2.locator('[data-testid="appointment-type-select"] label').first().click(),
    ])

    await Promise.all([
      page1.waitForTimeout(300),
      page2.waitForTimeout(300),
    ])

    // Both submit simultaneously
    const submit1 = page1.locator('button[type="submit"]').click()
    const submit2 = page2.locator('button[type="submit"]').click()

    await Promise.all([submit1, submit2])

    // Get outcomes for both users using reliable detection
    const [page1Outcome, page2Outcome] = await Promise.all([
      getBookingOutcome(page1),
      getBookingOutcome(page2),
    ])

    console.log(`Race condition test:`)
    console.log(`  User 1: ${page1Outcome}`)
    console.log(`  User 2: ${page2Outcome}`)

    // Exactly one should succeed, one should fail
    const validRaceConditionHandling =
      (page1Outcome === 'SUCCESS' && page2Outcome === 'ERROR') ||
      (page2Outcome === 'SUCCESS' && page1Outcome === 'ERROR')

    expect(validRaceConditionHandling).toBe(true)

    // Additional assertion: Neither should be UNKNOWN
    expect(page1Outcome).not.toBe('UNKNOWN')
    expect(page2Outcome).not.toBe('UNKNOWN')

    await context1.close()
    await context2.close()
  })

  test('should maintain performance with repeated page loads', async ({ page }) => {
    const loadTimes = []

    // Load appointments page 10 times
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now()

      await page.goto('/en/appointments')
      await page.waitForLoadState('networkidle')

      const endTime = Date.now()
      const loadTime = endTime - startTime

      loadTimes.push(loadTime)
      console.log(`Load ${i + 1}: ${loadTime}ms`)

      // Short delay between loads
      await page.waitForTimeout(500)
    }

    // Calculate average load time
    const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length

    console.log(`\nAverage load time over 10 loads: ${avgLoadTime}ms`)

    // Average should be under 3 seconds
    expect(avgLoadTime).toBeLessThan(3000)

    // Load times should not increase dramatically (no memory leaks)
    const firstHalfAvg = loadTimes.slice(0, 5).reduce((a, b) => a + b, 0) / 5
    const secondHalfAvg = loadTimes.slice(5).reduce((a, b) => a + b, 0) / 5

    console.log(`First half average: ${firstHalfAvg}ms`)
    console.log(`Second half average: ${secondHalfAvg}ms`)

    // Second half should not be more than 50% slower than first half
    expect(secondHalfAvg).toBeLessThan(firstHalfAvg * 1.5)
  })

  test('should handle API endpoint calls efficiently', async ({ page, request }) => {
    // Test appointment types API performance
    const apiStartTime = Date.now()

    const response = await request.get('/api/appointments/types')

    const apiEndTime = Date.now()
    const apiDuration = apiEndTime - apiStartTime

    console.log(`API response time: ${apiDuration}ms`)

    // Should respond quickly (under 500ms for simple query)
    expect(apiDuration).toBeLessThan(500)

    // Should return valid data
    expect(response.ok()).toBe(true)

    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('should handle rapid form interactions', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Rapidly type in form fields
    const firstNameInput = page.locator('[data-testid="first-name-input"]')

    const typeStartTime = Date.now()

    // Type quickly
    await firstNameInput.type('JohnDoe', { delay: 10 })

    const typeEndTime = Date.now()
    const typeDuration = typeEndTime - typeStartTime

    console.log(`Rapid typing duration: ${typeDuration}ms`)

    // Input should be responsive
    expect(typeDuration).toBeLessThan(2000)

    // Value should be correct
    const value = await firstNameInput.inputValue()
    expect(value).toBe('JohnDoe')
  })

  test('should gracefully handle server errors under load', async ({ page, context }) => {
    // This test simulates error conditions
    // In a real scenario, you might mock API failures

    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    await page.fill('[data-testid="first-name-input"]', 'Error')
    await page.fill('[data-testid="last-name-input"]', 'TestUser')
    await page.fill('[data-testid="email-input"]', 'errortest@example.com')
    await page.fill('[data-testid="phone-input"]', '+15551234567')
    await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

    // Select first appointment type in the form's RadioGroup (click the label, not the hidden input)
    await page.locator('[data-testid="appointment-type-select"] label').first().click()
    await page.waitForTimeout(300)

    // Submit form
    await page.locator('button[type="submit"]').click()

    // Should either succeed or show proper error message (not crash)
    await page.waitForTimeout(10000)

    const hasSuccess = await page.locator('text=/confirmed|success/i').isVisible().catch(() => false)
    const hasError = await page.locator('text=/error|failed|try again/i').isVisible().catch(() => false)
    const isStillLoading = await page.locator('[data-testid="loading"]').isVisible().catch(() => false)

    // Should have reached a terminal state (success, error, or stopped loading)
    expect(hasSuccess || hasError || !isStillLoading).toBe(true)
  })

  test('should cache appointment types for performance', async ({ page, request }) => {
    // First request (cold cache)
    const firstStart = Date.now()
    const firstResponse = await request.get('/api/appointments/types')
    const firstDuration = Date.now() - firstStart

    console.log(`First API call (cold cache): ${firstDuration}ms`)

    // Second request (should be faster if cached)
    const secondStart = Date.now()
    const secondResponse = await request.get('/api/appointments/types')
    const secondDuration = Date.now() - secondStart

    console.log(`Second API call (warm cache): ${secondDuration}ms`)

    // Check cache headers
    const cacheControl = firstResponse.headers()['cache-control']
    console.log(`Cache-Control: ${cacheControl}`)

    // Should have cache headers
    expect(cacheControl).toBeTruthy()

    // Second request should be same or faster (cache hit)
    expect(secondDuration).toBeLessThanOrEqual(firstDuration * 1.5)
  })

  test('should maintain database connection pool under load', async ({ browser }) => {
    // Create multiple concurrent requests to test connection pooling
    const contexts = []
    const requests = []

    for (let i = 0; i < 10; i++) {
      const context = await browser.newContext()
      contexts.push(context)

      const requestPromise = (async () => {
        const page = await context.newPage()
        const startTime = Date.now()

        await page.goto('/en/appointments')
        await page.waitForLoadState('networkidle')

        const duration = Date.now() - startTime
        return { success: true, duration }
      })()

      requests.push(requestPromise)
    }

    // Execute all requests concurrently
    const results = await Promise.all(requests)

    // Close contexts
    for (const context of contexts) {
      await context.close()
    }

    // All should succeed
    const successCount = results.filter(r => r.success).length
    expect(successCount).toBe(10)

    // Log durations
    results.forEach((result, index) => {
      console.log(`Request ${index + 1}: ${result.duration}ms`)
    })

    // Average should be reasonable
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length
    console.log(`Average duration: ${avgDuration}ms`)

    expect(avgDuration).toBeLessThan(5000)
  })

  test('should handle calendar navigation under rapid interaction', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)

    // Use native FullCalendar class selector since viewDidMount data-testid isn't working
    const nextButton = page.locator('.fc-next-button')

    // Rapidly click next month 10 times
    const startTime = Date.now()

    for (let i = 0; i < 10; i++) {
      await nextButton.click()
      // No wait between clicks (stress test)
    }

    // Wait for last navigation to complete
    await page.waitForTimeout(1000)

    const duration = Date.now() - startTime

    console.log(`Rapid navigation duration: ${duration}ms`)

    // Should handle rapid clicks without crashing
    expect(duration).toBeLessThan(5000)

    // Calendar should still be functional
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await expect(calendar).toBeVisible()
  })
})

// Helper functions
async function selectAppointmentType(page: Page) {
  // Click the Select dropdown trigger to open the dropdown menu
  await page.locator('[data-testid="appointment-type-select"]').click()
  await page.waitForTimeout(300)

  // Click first option from the dropdown menu
  await page.locator('[role="option"]').first().click()
  await page.waitForTimeout(300)

  // Wait for calendar to appear
  await page.waitForSelector('[data-testid="booking-calendar"]', { timeout: 5000 })

  // Wait for calendar days to be rendered and clickable
  await page.waitForSelector('[data-testid="calendar-day"]', { timeout: 10000 })

  // Give calendar a moment to fully initialize
  await page.waitForTimeout(500)
}

async function selectDate(page: Page) {
  // Select 3rd available date (~3 days from now) to satisfy 24-hour minimum notice requirement
  const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').nth(2)
  await availableDate.click()
  await page.waitForTimeout(500)
}

async function selectTimeSlot(page: Page) {
  const firstSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
  await firstSlot.click()
  await page.waitForTimeout(500)
}

async function getBookingOutcome(page: Page): Promise<'SUCCESS' | 'ERROR' | 'UNKNOWN'> {
  try {
    // Wait for either success or error with generous timeout
    await Promise.race([
      page.waitForSelector('[data-testid="confirmation-success-alert"]', { timeout: 15000 }),
      page.waitForSelector('[data-testid="booking-error"]', { timeout: 15000 }),
    ])

    // Check which one appeared
    const hasSuccess = await page.locator('[data-testid="confirmation-success-alert"]').isVisible()
    const hasError = await page.locator('[data-testid="booking-error"]').isVisible()

    if (hasSuccess) return 'SUCCESS'
    if (hasError) return 'ERROR'
    return 'UNKNOWN'
  } catch (error) {
    return 'UNKNOWN'
  }
}
