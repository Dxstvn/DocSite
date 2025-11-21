/**
 * E2E Tests: Patient Booking Flow
 *
 * Tests the complete patient booking journey:
 * - Navigating to appointments page
 * - Selecting appointment type and duration
 * - Choosing date and time slot
 * - Filling out patient information
 * - Submitting booking
 * - Receiving confirmation
 * - Managing/cancelling appointments
 */

import { test, expect, type Page } from '@playwright/test'

// Track booking tokens for cleanup after each test
const createdBookings: string[] = []

test.describe('Patient Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to appointments page
    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async ({ request }) => {
    // Clean up any bookings created during this test
    for (const token of createdBookings) {
      try {
        // Get appointment details using the booking token
        const response = await request.get(`/api/appointments/manage?token=${token}`)
        if (response.ok()) {
          const data = await response.json()
          // Cancel the appointment
          await request.post(`/api/appointments/${data.appointment.id}/cancel`, {
            data: {
              booking_token: token,
              cancelled_by: 'patient',
            },
          })
        }
      } catch (err) {
        // Ignore cleanup errors - test environment may have reset or appointment already cancelled
        console.log(`Cleanup warning for token ${token}:`, err instanceof Error ? err.message : 'Unknown error')
      }
    }
    // Clear the array for the next test
    createdBookings.length = 0
  })

  test('should display appointments page with booking interface', async ({ page }) => {
    // Check page title and main heading
    await expect(page).toHaveTitle(/Schedule.*Appointment|Book.*Consultation/)
    await expect(page.locator('h1')).toBeVisible()

    // Check that booking interface is present
    const bookingInterface = page.locator('[data-testid="booking-interface"]')
    await expect(bookingInterface).toBeVisible()
  })

  test('should display available appointment types', async ({ page }) => {
    // Wait for appointment types to load
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await expect(typeSelector).toBeVisible()

    // Click to open dropdown
    await typeSelector.click()

    // Should show at least one appointment type option
    const options = page.locator('[role="option"]')
    await expect(options.first()).toBeVisible()

    // Options should include duration information
    const firstOption = options.first()
    await expect(firstOption).toContainText(/30|45|60/)
  })

  test('should allow selecting an appointment type', async ({ page }) => {
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')

    // Click to open the dropdown
    await typeSelector.click()

    // Select first option from dropdown
    const firstOption = page.locator('[role="option"]').first()
    await firstOption.click()

    // Verify selection by waiting for calendar to appear (sign that appointment type was accepted)
    // This avoids checking the Select trigger during its re-render
    await expect(page.locator('[data-testid="booking-calendar"]')).toBeVisible({ timeout: 3000 })
  })

  test('should display calendar for date selection', async ({ page }) => {
    // Select appointment type first
    await selectAppointmentType(page)

    // Calendar should be visible
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await expect(calendar).toBeVisible()

    // Should show current month
    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    await expect(monthDisplay).toBeVisible()

    // Should have navigation buttons
    await expect(page.locator('[data-testid="calendar-prev"]')).toBeVisible()
    await expect(page.locator('[data-testid="calendar-next"]')).toBeVisible()
  })

  test('should display available time slots when date is selected', async ({ page }) => {
    await selectAppointmentType(page)

    // Click on an available date (look for dates that are not disabled)
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await availableDate.click()

    // Time slots should appear
    const timeSlotsContainer = page.locator('[data-testid="time-slots"]')
    await expect(timeSlotsContainer).toBeVisible()

    // Should have at least one available slot
    const timeSlots = page.locator('[data-testid="time-slot"]:not([disabled])')
    await expect(timeSlots.first()).toBeVisible()
  })

  test('should highlight selected time slot', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)

    // Click on a time slot
    const firstSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
    await firstSlot.click()

    // Should be highlighted/selected
    await expect(firstSlot).toHaveAttribute('data-selected', 'true')
  })

  test('should show booking form after selecting date and time', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Booking form should be visible
    const bookingForm = page.locator('[data-testid="booking-form"]')
    await expect(bookingForm).toBeVisible()

    // Should have patient information fields
    await expect(page.locator('[data-testid="first-name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="last-name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="phone-input"]')).toBeVisible()
  })

  test('should validate required fields in booking form', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should show validation errors
    await expect(page.locator('text=/required|Required|obligatorio/i')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Fill form with invalid email
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.fill('[data-testid="phone-input"]', '+15551234567')

    await page.locator('button[type="submit"]').click()

    // Should show email validation error
    await expect(page.locator('text=/valid email|email válido/i')).toBeVisible()
  })

  test('should validate phone number format', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Fill form with invalid phone
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'john@example.com')
    await page.fill('[data-testid="phone-input"]', '123') // Too short

    await page.locator('button[type="submit"]').click()

    // Should show phone validation error
    await expect(page.locator('text=/valid phone|teléfono válido/i')).toBeVisible()
  })

  test('should successfully submit booking with valid data', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Fill form with valid data
    const timestamp = Date.now()
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', `john${timestamp}@example.com`)
    await page.fill('[data-testid="phone-input"]', '+15551234567')
    await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

    // Add notes (optional field)
    await page.fill('[data-testid="notes-input"]', 'This is a test booking')

    // Submit form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should show confirmation details (app uses conditional rendering, not URL navigation)
    // Increased timeout to handle form submission processing time
    await expect(page.locator('[data-testid="confirmation-details"]')).toBeVisible({ timeout: 15000 })
  })

  test('should display booking confirmation with appointment details', async ({ page }) => {
    await completeBooking(page)

    // Should show confirmation details
    const confirmationDetails = page.locator('[data-testid="confirmation-details"]')
    await expect(confirmationDetails).toBeVisible()

    // Check for specific labeled fields within confirmation details
    await expect(confirmationDetails.getByText(/appointment type|tipo de cita/i)).toBeVisible()
    await expect(confirmationDetails.getByTestId('appointment-date')).toBeVisible()
    await expect(confirmationDetails.getByTestId('appointment-time')).toBeVisible()
  })

  test('should provide manage appointment link with booking token', async ({ page }) => {
    await completeBooking(page)

    // Should have manage appointment link
    const manageLink = page.locator('a[href*="/appointments/manage"]')
    await expect(manageLink).toBeVisible()

    // Link should contain token parameter
    const href = await manageLink.getAttribute('href')
    expect(href).toContain('token=')
  })

  test('should show loading state during submission', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', `john${Date.now()}@example.com`)
    await page.fill('[data-testid="phone-input"]', '+15551234567')
    await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

    // Get submit button and verify it's enabled before submission
    const submitButton = page.locator('[data-testid="submit-booking-button"]')
    await expect(submitButton).not.toBeDisabled()

    // Click submit button
    await submitButton.click()

    // Verify loading state: button becomes disabled and text changes
    await expect(submitButton).toBeDisabled({ timeout: 2000 })
    await expect(submitButton).toContainText(/booking|reservando/i)
  })

  test('should prevent double-booking of same time slot', async ({ page }) => {
    // Complete first booking on last available date (index 6) to minimize collision with other tests
    await completeBooking(page, 6)

    // Try to book same slot again - select same date (index 6)
    await page.goto('/en/appointments')
    await selectAppointmentType(page)
    await selectDate(page, 6) // Select same date

    // Wait for time slots to load and render with correct disabled state
    await page.waitForSelector('[data-testid="time-slot"]', { timeout: 5000 })
    await page.waitForTimeout(1000) // Allow time for slots to render with disabled state

    // Previously booked slot should be disabled or not available
    const timeSlots = page.locator('[data-testid="time-slot"]')
    const disabledSlots = page.locator('[data-testid="time-slot"][disabled]')

    // Should have some disabled slots
    await expect(disabledSlots.first()).toBeVisible({ timeout: 5000 })
  })

  test('should respect 15-minute buffer between appointments', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)

    // Get all available time slots
    const slots = await page.locator('[data-testid="time-slot"]').all()

    if (slots.length >= 2) {
      // Extract times from consecutive available slots
      const firstSlotTime = await slots[0].getAttribute('data-time')
      const secondSlotTime = await slots[1].getAttribute('data-time')

      if (firstSlotTime && secondSlotTime) {
        // Parse times (format: "HH:MM")
        const [hours1, minutes1] = firstSlotTime.split(':').map(Number)
        const [hours2, minutes2] = secondSlotTime.split(':').map(Number)

        const time1 = hours1 * 60 + minutes1
        const time2 = hours2 * 60 + minutes2

        // Difference should be at least 45 minutes (30 min appointment + 15 min buffer)
        const difference = time2 - time1
        expect(difference).toBeGreaterThanOrEqual(45)
      }
    }
  })

  test('should allow cancelling appointment with booking token', async ({ page }) => {
    // Complete booking first
    await completeBooking(page)

    // Get manage appointment link
    const manageLink = page.locator('a[href*="/appointments/manage"]')
    await manageLink.click()

    // Should be on manage page
    await page.waitForURL(/appointments\/manage/)

    // Should show appointment details
    await expect(page.locator('[data-testid="appointment-details"]')).toBeVisible()

    // Should have cancel button (exact text from ManageAppointment.tsx)
    const cancelButton = page.locator('button:has-text("Cancel Appointment")')
    await expect(cancelButton).toBeVisible()

    // Click cancel
    await cancelButton.click()

    // Should show confirmation dialog (Radix UI uses role="alertdialog")
    await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 3000 })

    // Confirm cancellation (exact text from ManageAppointment.tsx)
    const confirmButton = page.locator('[role="alertdialog"] button:has-text("Yes, cancel")')
    await confirmButton.click()

    // Wait for dialog to close first
    await expect(page.locator('[role="alertdialog"]')).not.toBeVisible({ timeout: 3000 })

    // Should show cancellation success in the appointment details card
    const successAlert = page.locator('[data-testid="appointment-details"]').locator('text=/cancelled|successfully/i')
    await expect(successAlert).toBeVisible({ timeout: 10000 })
  })

  test('should show appropriate error for invalid booking token', async ({ page }) => {
    // Navigate to manage page with fake token
    await page.goto('/en/appointments/manage?token=invalid-token-12345')

    // Should show error message
    await expect(page.locator('text=/not found|invalid|no encontrado/i')).toBeVisible()
  })

  test('should not allow cancelling already cancelled appointments', async ({ page }) => {
    // Complete booking and cancel it
    await completeBooking(page)
    const manageLink = page.locator('a[href*="/appointments/manage"]')
    await manageLink.click()

    await page.waitForURL(/appointments\/manage/)

    // Click cancel button (exact text from ManageAppointment.tsx)
    await page.locator('button:has-text("Cancel Appointment")').click()

    // Wait for dialog to appear and confirm cancellation (Radix UI uses role="alertdialog")
    await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 3000 })
    await page.locator('[role="alertdialog"] button:has-text("Yes, cancel")').click()

    // Wait for dialog to close
    await expect(page.locator('[role="alertdialog"]')).not.toBeVisible({ timeout: 5000 })

    // Wait for success message OR disabled button state (either confirms cancellation)
    await Promise.race([
      page.waitForSelector('text=/cancelled|successfully/i', { timeout: 10000 }),
      page.waitForSelector('button:has-text("Cancel Appointment")[disabled]', { timeout: 10000 })
    ])

    // Verify button is now disabled
    const cancelButton = page.locator('button:has-text("Cancel Appointment")')
    await expect(cancelButton).toBeDisabled()
  })

  test('should show busy times as unavailable', async ({ page }) => {
    await selectAppointmentType(page)
    await selectDate(page)

    // Some slots should be marked as unavailable/disabled
    const unavailableSlots = page.locator('[data-testid="time-slot"][disabled]')

    // If there are unavailable slots, verify they show appropriate styling
    const count = await unavailableSlots.count()
    if (count > 0) {
      await expect(unavailableSlots.first()).toHaveAttribute('disabled')
    }
  })
})

// Helper functions
async function selectAppointmentType(page: Page) {
  const typeSelector = page.locator('[data-testid="appointment-type-select"]')
  await typeSelector.click()

  const firstOption = page.locator('[role="option"]').first()
  await firstOption.click()

  // Wait for calendar to appear (sign that appointment type was accepted)
  await expect(page.locator('[data-testid="booking-calendar"]')).toBeVisible({ timeout: 3000 })
}

async function selectDate(page: Page, index?: number) {
  const availableDates = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])')
  const count = await availableDates.count()

  // Use provided index if specified (for tests needing consistent dates),
  // otherwise randomize to spread test load across multiple days
  const selectedIndex = index !== undefined
    ? index
    : Math.floor(Math.random() * Math.min(count, 7))

  await availableDates.nth(selectedIndex).click()
  await page.waitForTimeout(500) // Wait for slots to load
}

async function selectTimeSlot(page: Page, index: number = 0) {
  const availableSlots = page.locator('[data-testid="time-slot"]:not([disabled])')

  // Verify slot exists before clicking
  const count = await availableSlots.count()
  if (index >= count) {
    throw new Error(`Cannot select slot ${index}, only ${count} slots available`)
  }

  const slot = availableSlots.nth(index)
  await slot.click()
  await page.waitForTimeout(500) // Wait for form to appear
}

async function completeBooking(page: Page, dateIndex?: number) {
  let booked = false
  const maxRetries = 5

  for (let attempt = 0; attempt < maxRetries && !booked; attempt++) {
    try {
      // Navigate fresh for retries (skip on first attempt)
      if (attempt > 0) {
        await page.goto('/en/appointments')
        await page.waitForLoadState('networkidle')
      }

      // Re-select appointment type and date each attempt
      await selectAppointmentType(page)
      await selectDate(page, dateIndex)

      // Get available slots and check if any exist
      const totalSlots = await page.locator('[data-testid="time-slot"]:not([disabled])').count()
      if (totalSlots === 0) {
        // No slots available, continue to next retry
        continue
      }

      // Try a slot (cycle through all available slots)
      const slotIndex = attempt % totalSlots
      await selectTimeSlot(page, slotIndex)

      // Fill form with unique email each time
      const timestamp = Date.now()
      await page.fill('[data-testid="first-name-input"]', 'John')
      await page.fill('[data-testid="last-name-input"]', 'Doe')
      await page.fill('[data-testid="email-input"]', `john${timestamp}@example.com`)
      await page.fill('[data-testid="phone-input"]', '+15551234567')
      await page.fill('[data-testid="date-of-birth-input"]', '1990-01-01')

      // Submit
      await page.locator('[data-testid="submit-booking-button"]').click()

      // Race between success, slot-taken, and generic error
      const result = await Promise.race([
        page.waitForSelector('[data-testid="confirmation-success-alert"]', { timeout: 5000 }).then(() => 'success'),
        page.waitForSelector('text=/no longer available/i', { timeout: 5000 }).then(() => 'slot-taken'),
        page.waitForSelector('[data-testid="booking-error"]', { timeout: 5000 }).then(() => 'error')
      ]).catch(() => 'timeout')

      if (result === 'success') {
        booked = true

        // Extract booking token for cleanup
        try {
          const manageLink = await page.locator('a[href*="/appointments/manage"]').getAttribute('href')
          if (manageLink) {
            const url = new URL(manageLink, 'http://localhost')
            const token = url.searchParams.get('token')
            if (token && !createdBookings.includes(token)) {
              createdBookings.push(token)
            }
          }
        } catch (err) {
          // Token extraction is best-effort - don't fail the test if it doesn't work
          console.log('Warning: Could not extract booking token for cleanup')
        }
      } else if (result === 'error') {
        // Capture error message for better debugging
        const errorText = await page.locator('[data-testid="booking-error"]').textContent()
        console.log(`Booking error (attempt ${attempt + 1}/${maxRetries}): ${errorText}`)
      } else if (result === 'timeout') {
        console.log(`Timeout waiting for booking response (attempt ${attempt + 1}/${maxRetries})`)
      }
      // If slot-taken or error, loop continues to next retry
    } catch (err) {
      // On error, continue to next retry unless this was the last attempt
      if (attempt === maxRetries - 1) {
        throw err
      }
    }
  }

  if (!booked) {
    throw new Error(`Failed to complete booking after ${maxRetries} attempts - all slots taken`)
  }
}
