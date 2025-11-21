import { test, expect } from '@playwright/test'

test.describe('Time Slot Diagnostic', () => {
  test.beforeEach(async ({ request }) => {
    // Clean database before test
    const response = await request.delete('/api/test/cleanup-appointments')
    expect(response.ok()).toBeTruthy()
  })

  test('diagnose time slot loading issue', async ({ page }) => {
    // Set up API response logging
    const apiResponses: any[] = []
    page.on('response', async (response) => {
      if (response.url().includes('/api/appointments/available-slots')) {
        const status = response.status()
        let body = null
        try {
          body = await response.json()
        } catch (e) {
          body = await response.text()
        }
        apiResponses.push({ url: response.url(), status, body })
        console.log('API Response:', { url: response.url(), status, body })
      }
    })

    // Set up console logging
    page.on('console', msg => {
      console.log(`Browser console [${msg.type()}]:`, msg.text())
    })

    // Go to appointments page
    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')

    console.log('✅ Page loaded')

    // Select appointment type
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await typeSelector.waitFor({ state: 'visible', timeout: 5000 })
    await typeSelector.click()
    await page.waitForTimeout(300)

    const firstOption = page.locator('[role="option"]').first()
    await firstOption.waitFor({ state: 'visible' })
    await firstOption.click()

    console.log('✅ Appointment type selected')

    // Wait for calendar to be visible
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await calendar.waitFor({ state: 'visible', timeout: 5000 })

    console.log('✅ Calendar is visible')

    // Get the first available calendar day
    const availableDates = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])')
    const count = await availableDates.count()
    console.log(`Found ${count} available calendar days`)

    if (count > 0) {
      const firstDate = availableDates.first()
      const dateText = await firstDate.getAttribute('data-date')
      console.log(`Clicking on date: ${dateText}`)

      // Click the date
      await firstDate.click()
      console.log('✅ Date clicked')

      // Wait a bit for API call to complete
      await page.waitForTimeout(2000)

      // Check for loading state
      const loadingIndicator = page.locator('[data-testid="calendar-loading"]')
      const isLoading = await loadingIndicator.isVisible()
      console.log(`Loading indicator visible: ${isLoading}`)

      // Check for error state
      const errorAlert = page.locator('[data-testid="calendar-error"]')
      const hasError = await errorAlert.isVisible()
      if (hasError) {
        const errorText = await errorAlert.textContent()
        console.log(`❌ Error found: ${errorText}`)
      } else {
        console.log('✅ No error alert')
      }

      // Log API responses
      console.log(`Total API responses captured: ${apiResponses.length}`)
      apiResponses.forEach((resp, i) => {
        console.log(`Response ${i + 1}:`, JSON.stringify(resp, null, 2))
      })

      // Check if time slot picker is visible
      const timeSlotPicker = page.locator('[data-testid="time-slot-picker"]')
      const pickerVisible = await timeSlotPicker.isVisible()
      console.log(`Time slot picker visible: ${pickerVisible}`)

      if (pickerVisible) {
        // Check for no-slots alert
        const noSlotsAlert = page.locator('[data-testid="no-slots-alert"]')
        const hasNoSlots = await noSlotsAlert.isVisible()
        console.log(`No slots alert visible: ${hasNoSlots}`)

        // Check for time slots container
        const slotsContainer = page.locator('[data-testid="time-slots-container"]')
        const containerVisible = await slotsContainer.isVisible()
        console.log(`Time slots container visible: ${containerVisible}`)

        if (containerVisible) {
          const timeSlots = page.locator('[data-testid="time-slot"]')
          const slotCount = await timeSlots.count()
          console.log(`Time slots found: ${slotCount}`)

          if (slotCount > 0) {
            console.log('✅ SUCCESS: Time slots are rendering!')
            const firstSlotText = await timeSlots.first().textContent()
            console.log(`First slot text: ${firstSlotText}`)
          } else {
            console.log('❌ FAILURE: Container visible but no time slot buttons')
          }
        } else {
          console.log('❌ FAILURE: Time slots container not visible')
        }
      } else {
        console.log('❌ FAILURE: Time slot picker not visible')
      }
    } else {
      console.log('❌ No available calendar days found')
    }

    // Force test to pass so we can see the console output
    expect(true).toBe(true)
  })
})
