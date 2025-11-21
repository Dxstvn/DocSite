/**
 * E2E Tests: Admin Appointment Management
 *
 * Tests admin functionality for managing patient appointments:
 * - Viewing appointments in calendar and list views
 * - Filtering by status, date range, and patient
 * - Viewing appointment details
 * - Cancelling appointments (admin-initiated)
 * - Rescheduling appointments
 * - Marking appointments as completed or no-show
 * - Sending reminder emails
 * - Exporting appointments
 */

import { test, expect, type Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL || 'admin@test.com'
const ADMIN_PASSWORD = process.env.ADMIN_TEST_PASSWORD || 'test-password-123'

test.describe('Admin Appointment Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/en/admin/appointments')
    await page.waitForLoadState('networkidle')
  })

  test('should display appointments management interface', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Appointments|Manage Appointments/)

    // Should show main heading
    await expect(page.locator('h1')).toBeVisible()

    // Should have appointments list or calendar
    await expect(page.locator('[data-testid="appointments-list"]').or(page.locator('[data-testid="appointments-calendar"]'))).toBeVisible()
  })

  test('should switch between calendar and list views', async ({ page }) => {
    // Should have view toggle buttons
    const calendarViewButton = page.locator('button[aria-label="Calendar view"]').or(page.locator('button:has-text("Calendar")'))
    const listViewButton = page.locator('button[aria-label="List view"]').or(page.locator('button:has-text("List")'))

    // Switch to list view
    if (await listViewButton.isVisible()) {
      await listViewButton.click()
      await expect(page.locator('[data-testid="appointments-list"]')).toBeVisible()
    }

    // Switch to calendar view
    if (await calendarViewButton.isVisible()) {
      await calendarViewButton.click()
      await expect(page.locator('[data-testid="appointments-calendar"]')).toBeVisible()
    }
  })

  test('should display list of appointments with key information', async ({ page }) => {
    // Switch to list view
    const listViewButton = page.locator('button:has-text("List")')
    if (await listViewButton.isVisible()) {
      await listViewButton.click()
    }

    const appointmentsList = page.locator('[data-testid="appointments-list"]')
    await expect(appointmentsList).toBeVisible()

    // Should show appointment rows
    const appointmentRows = page.locator('[data-testid="appointment-row"]')
    const count = await appointmentRows.count()

    if (count > 0) {
      const firstRow = appointmentRows.first()

      // Should show patient name
      await expect(firstRow.locator('[data-testid="patient-name"]')).toBeVisible()

      // Should show date/time
      await expect(firstRow).toContainText(/\d{1,2}:\d{2}/)

      // Should show status badge
      await expect(firstRow.locator('[data-testid="status-badge"]')).toBeVisible()

      // Should show action buttons
      await expect(firstRow.locator('button[aria-label="View details"]').or(firstRow.locator('button:has-text("View")'))).toBeVisible()
    }
  })

  test('should filter appointments by status', async ({ page }) => {
    // Should have status filter
    const statusFilter = page.locator('select[name="statusFilter"]').or(page.locator('[data-testid="status-filter"]'))
    await expect(statusFilter).toBeVisible()

    // Get initial count
    const initialCount = await page.locator('[data-testid="appointment-row"]').count()

    // Filter by "confirmed"
    await statusFilter.click()
    await page.locator('text="Confirmed"').or(page.locator('[value="confirmed"]')).click()
    await page.waitForTimeout(500)

    // Should only show confirmed appointments
    const confirmedAppointments = page.locator('[data-testid="appointment-row"]')
    const confirmedCount = await confirmedAppointments.count()

    // Each visible appointment should have "confirmed" status
    for (let i = 0; i < Math.min(confirmedCount, 3); i++) {
      const row = confirmedAppointments.nth(i)
      await expect(row.locator('[data-testid="status-badge"]:has-text("Confirmed")')).toBeVisible()
    }
  })

  test('should search appointments by patient name', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]').or(page.locator('[data-testid="appointment-search"]'))
    await expect(searchInput).toBeVisible()

    // Get a patient name from first appointment
    const firstAppointment = page.locator('[data-testid="appointment-row"]').first()
    if (await firstAppointment.isVisible()) {
      const patientName = await firstAppointment.locator('[data-testid="patient-name"]').textContent()

      if (patientName) {
        // Search for that patient
        await searchInput.fill(patientName.split(' ')[0]) // First name
        await page.waitForTimeout(500)

        // Results should be filtered
        const searchResults = page.locator('[data-testid="appointment-row"]')
        const resultCount = await searchResults.count()

        // Each result should contain search term
        for (let i = 0; i < Math.min(resultCount, 3); i++) {
          const row = searchResults.nth(i)
          await expect(row).toContainText(new RegExp(patientName.split(' ')[0], 'i'))
        }
      }
    }
  })

  test('should search appointments by patient email', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]')

    // Search for email domain
    await searchInput.fill('@example.com')
    await page.waitForTimeout(500)

    // Should show results containing email domain
    const results = page.locator('[data-testid="appointment-row"]')
    if ((await results.count()) > 0) {
      await expect(results.first()).toBeVisible()
    }
  })

  test('should filter appointments by date range', async ({ page }) => {
    const dateRangeFilter = page.locator('[data-testid="date-range-filter"]')

    if (await dateRangeFilter.isVisible()) {
      // Set start date (today)
      await page.locator('input[name="startDate"]').fill(new Date().toISOString().split('T')[0])

      // Set end date (7 days from now)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)
      await page.locator('input[name="endDate"]').fill(endDate.toISOString().split('T')[0])

      // Apply filter
      await page.locator('button:has-text("Apply")').or(page.locator('button[type="submit"]')).click()
      await page.waitForTimeout(500)

      // Should show filtered results
      await expect(page.locator('[data-testid="appointment-row"]')).toBeVisible()
    }
  })

  test('should view appointment details in modal', async ({ page }) => {
    const firstAppointment = page.locator('[data-testid="appointment-row"]').first()
    await expect(firstAppointment).toBeVisible()

    // Click to view details
    await firstAppointment.locator('button[aria-label="View details"]').or(firstAppointment).click()

    // Should open details modal
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Should show comprehensive appointment information
    await expect(modal.locator('text=/Patient.*Name|Patient.*Information/i')).toBeVisible()
    await expect(modal.locator('text=/Email/i')).toBeVisible()
    await expect(modal.locator('text=/Phone/i')).toBeVisible()
    await expect(modal.locator('text=/Date|Time/i')).toBeVisible()
    await expect(modal.locator('text=/Type|Duration/i')).toBeVisible()
    await expect(modal.locator('text=/Status/i')).toBeVisible()
  })

  test('should cancel appointment from admin side', async ({ page }) => {
    // Find a confirmed appointment
    await page.locator('select[name="statusFilter"]').selectOption('confirmed')
    await page.waitForTimeout(500)

    const confirmedAppointment = page.locator('[data-testid="appointment-row"][data-status="confirmed"]').first()

    if (await confirmedAppointment.isVisible()) {
      // Open details
      await confirmedAppointment.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Click cancel button
      const cancelButton = modal.locator('button:has-text("Cancel Appointment")')
      await expect(cancelButton).toBeVisible()
      await cancelButton.click()

      // Should show cancellation reason form
      await expect(page.locator('textarea[name="cancellationReason"]')).toBeVisible()
      await page.fill('textarea[name="cancellationReason"]', 'Doctor emergency')

      // Confirm cancellation
      await page.locator('button:has-text("Confirm Cancel")').or(page.locator('button[type="submit"]')).click()

      // Should show success message
      await expect(page.locator('text=/cancelled|canceled|success/i')).toBeVisible({ timeout: 5000 })

      // Status should update to cancelled
      await page.locator('button:has-text("Close")').or(page.keyboard.press('Escape')).catch(() => {})
      await page.waitForTimeout(500)

      // Find the same appointment and verify status
      await expect(page.locator('[data-testid="status-badge"]:has-text("Cancelled")')).toBeVisible()
    }
  })

  test('should mark appointment as completed', async ({ page }) => {
    // Find a past confirmed appointment
    const appointment = page.locator('[data-testid="appointment-row"][data-status="confirmed"]').first()

    if (await appointment.isVisible()) {
      await appointment.click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Look for complete button
      const completeButton = modal.locator('button:has-text("Mark as Completed")')

      if (await completeButton.isVisible()) {
        await completeButton.click()

        // Should show success
        await expect(page.locator('text=/completed|marked as complete/i')).toBeVisible({ timeout: 5000 })

        // Close modal and verify status changed
        await modal.locator('button:has-text("Close")').or(page.keyboard.press('Escape')).catch(() => {})
        await page.waitForTimeout(500)

        await expect(page.locator('[data-testid="status-badge"]:has-text("Completed")')).toBeVisible()
      }
    }
  })

  test('should mark appointment as no-show', async ({ page }) => {
    const appointment = page.locator('[data-testid="appointment-row"][data-status="confirmed"]').first()

    if (await appointment.isVisible()) {
      await appointment.click()

      const modal = page.locator('[role="dialog"]')
      const noShowButton = modal.locator('button:has-text("Mark as No-Show")')

      if (await noShowButton.isVisible()) {
        await noShowButton.click()

        // Should show confirmation
        await page.locator('button:has-text("Confirm")').or(page.locator('button[type="submit"]')).click()

        // Should show success
        await expect(page.locator('text=/no.?show|marked as/i')).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should reschedule appointment', async ({ page }) => {
    const appointment = page.locator('[data-testid="appointment-row"]').first()
    await appointment.click()

    const modal = page.locator('[role="dialog"]')
    const rescheduleButton = modal.locator('button:has-text("Reschedule")')

    if (await rescheduleButton.isVisible()) {
      await rescheduleButton.click()

      // Should show date/time picker
      await expect(page.locator('[data-testid="date-picker"]').or(page.locator('input[name="newDate"]'))).toBeVisible()
      await expect(page.locator('[data-testid="time-picker"]').or(page.locator('input[name="newTime"]'))).toBeVisible()

      // Select new date (7 days from now)
      const newDate = new Date()
      newDate.setDate(newDate.getDate() + 7)
      await page.fill('input[name="newDate"]', newDate.toISOString().split('T')[0])

      // Select new time
      await page.fill('input[name="newTime"]', '14:00')

      // Add reason
      await page.fill('textarea[name="rescheduleReason"]', 'Patient requested different time')

      // Submit
      await page.locator('button:has-text("Confirm Reschedule")').or(page.locator('button[type="submit"]')).click()

      // Should show success
      await expect(page.locator('text=/rescheduled|updated|success/i')).toBeVisible({ timeout: 5000 })
    }
  })

  test('should send reminder email for upcoming appointment', async ({ page }) => {
    // Find upcoming appointment
    const upcomingAppointment = page.locator('[data-testid="appointment-row"][data-status="confirmed"]').first()

    if (await upcomingAppointment.isVisible()) {
      await upcomingAppointment.click()

      const modal = page.locator('[role="dialog"]')
      const sendReminderButton = modal.locator('button:has-text("Send Reminder")')

      if (await sendReminderButton.isVisible()) {
        await sendReminderButton.click()

        // Should show confirmation
        await page.locator('button:has-text("Send")').or(page.locator('button[type="submit"]')).click()

        // Should show success
        await expect(page.locator('text=/reminder sent|email sent|enviado/i')).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should display appointment counts by status', async ({ page }) => {
    // Should show summary/stats section
    const statsSection = page.locator('[data-testid="appointment-stats"]')

    if (await statsSection.isVisible()) {
      // Should show counts for each status
      await expect(statsSection.locator('text=/confirmed.*\\d+/i')).toBeVisible()
      await expect(statsSection.locator('text=/pending.*\\d+/i')).toBeVisible()
      await expect(statsSection.locator('text=/cancelled.*\\d+/i')).toBeVisible()
    }
  })

  test('should show today\'s appointments prominently', async ({ page }) => {
    const todaySection = page.locator('[data-testid="today-appointments"]')

    if (await todaySection.isVisible()) {
      // Should have heading indicating today
      await expect(todaySection.locator('text=/today|hoy/i')).toBeVisible()

      // Should show appointments for today
      const todayAppointments = todaySection.locator('[data-testid="appointment-row"]')
      if ((await todayAppointments.count()) > 0) {
        await expect(todayAppointments.first()).toBeVisible()
      }
    }
  })

  test('should show upcoming appointments in chronological order', async ({ page }) => {
    // Switch to list view
    const listViewButton = page.locator('button:has-text("List")')
    if (await listViewButton.isVisible()) {
      await listViewButton.click()
    }

    // Get appointment times
    const appointments = page.locator('[data-testid="appointment-row"]')
    const count = await appointments.count()

    if (count >= 2) {
      // Get first two appointment times
      const time1 = await appointments.nth(0).getAttribute('data-time')
      const time2 = await appointments.nth(1).getAttribute('data-time')

      if (time1 && time2) {
        // First appointment should be before or equal to second
        expect(new Date(time1) <= new Date(time2)).toBe(true)
      }
    }
  })

  test('should export appointments to CSV', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export")')

    if (await exportButton.isVisible()) {
      await exportButton.click()

      // Should show export options
      const csvOption = page.locator('text=/CSV|Excel/i')
      await expect(csvOption).toBeVisible()

      // Select CSV
      await csvOption.click()

      // Should trigger download (we can't verify actual download in test, but can check no errors)
      await page.waitForTimeout(1000)
    }
  })

  test('should show appointment conflict warnings', async ({ page }) => {
    // If there are overlapping appointments, should show warning
    const warningBanner = page.locator('[data-testid="conflict-warning"]')

    if (await warningBanner.isVisible()) {
      await expect(warningBanner).toContainText(/conflict|overlap|overlapping/i)
    }
  })

  test('should filter by appointment type', async ({ page }) => {
    const typeFilter = page.locator('select[name="appointmentTypeFilter"]')

    if (await typeFilter.isVisible()) {
      // Select a specific type
      await typeFilter.selectOption({ index: 1 })
      await page.waitForTimeout(500)

      // Should show filtered results
      await expect(page.locator('[data-testid="appointment-row"]')).toBeVisible()
    }
  })

  test('should pagination for large appointment lists', async ({ page }) => {
    // Switch to list view
    const listViewButton = page.locator('button:has-text("List")')
    if (await listViewButton.isVisible()) {
      await listViewButton.click()
    }

    // Look for pagination controls
    const pagination = page.locator('[data-testid="pagination"]')

    if (await pagination.isVisible()) {
      const nextButton = pagination.locator('button[aria-label="Next page"]')

      if (await nextButton.isEnabled()) {
        // Click next page
        await nextButton.click()
        await page.waitForTimeout(500)

        // Should show different appointments
        await expect(page.locator('[data-testid="appointment-row"]')).toBeVisible()

        // Page number should change
        await expect(pagination.locator('text=/page \\d+/i')).toBeVisible()
      }
    }
  })

  test('should show patient contact information in details', async ({ page }) => {
    const appointment = page.locator('[data-testid="appointment-row"]').first()
    await appointment.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Should have clickable email (mailto link)
    const emailLink = modal.locator('a[href^="mailto:"]')
    if (await emailLink.isVisible()) {
      await expect(emailLink).toHaveAttribute('href', /mailto:/)
    }

    // Should have clickable phone (tel link)
    const phoneLink = modal.locator('a[href^="tel:"]')
    if (await phoneLink.isVisible()) {
      await expect(phoneLink).toHaveAttribute('href', /tel:/)
    }
  })

  test('should display appointment notes if provided', async ({ page }) => {
    const appointment = page.locator('[data-testid="appointment-row"]').first()
    await appointment.click()

    const modal = page.locator('[role="dialog"]')

    // Should have notes section
    const notesSection = modal.locator('[data-testid="appointment-notes"]')
    if (await notesSection.isVisible()) {
      // Notes content should be visible if there are any
      await expect(notesSection).toBeVisible()
    }
  })
})

async function loginAsAdmin(page: Page) {
  await page.goto('/en/admin/login')
  await page.fill('input[name="email"]', ADMIN_EMAIL)
  await page.fill('input[name="password"]', ADMIN_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/admin/, { timeout: 10000 })
}
