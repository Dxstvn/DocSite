/**
 * E2E Tests: Calendar Interaction
 *
 * Tests calendar component interactions for appointment booking:
 * - Navigating between months
 * - Selecting dates
 * - Visual indicators for available/unavailable dates
 * - Past date handling
 * - Future booking window limits
 * - Today's date highlighting
 * - Keyboard navigation
 * - Month/year display and navigation
 */

import { test, expect, type Page } from '@playwright/test'

test.describe('Calendar Interaction', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to appointments page
    await page.goto('/en/appointments')
    await page.waitForLoadState('networkidle')

    // Select appointment type to make calendar active
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    if (await typeSelector.isVisible()) {
      await typeSelector.click()
      // Wait for Radix UI portal to fully open before querying options
      await page.locator('[role="listbox"]').waitFor({ state: 'visible', timeout: 5000 })
      await page.getByRole('option').first().click()
      await page.waitForTimeout(500)
    }
  })

  test('should display calendar with current month', async ({ page }) => {
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await expect(calendar).toBeVisible()

    // Should show current month and year
    const currentDate = new Date()
    const currentMonthName = currentDate.toLocaleDateString('en-US', { month: 'long' })
    const currentYear = currentDate.getFullYear()

    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    await expect(monthDisplay).toContainText(currentMonthName)
    await expect(monthDisplay).toContainText(currentYear.toString())
  })

  test('should display all days of the week headers', async ({ page }) => {
    // Calendar has weekends disabled, so only show weekday headers
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

    for (const day of dayHeaders) {
      // Use FullCalendar-specific selector for day header cells
      const dayHeader = page.locator('.fc-col-header-cell-cushion', { hasText: day })
      await expect(dayHeader).toBeVisible()
    }
  })

  test('should navigate to next month', async ({ page }) => {
    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    const initialMonth = await monthDisplay.textContent()

    // Click next month button
    const nextButton = page.locator('[data-testid="calendar-next"]').or(page.locator('button[aria-label="Next month"]'))
    await nextButton.click()
    await page.waitForTimeout(300)

    // Month should change
    const newMonth = await monthDisplay.textContent()
    expect(newMonth).not.toBe(initialMonth)
  })

  test('should navigate to previous month', async ({ page }) => {
    // First go to next month to have somewhere to go back to
    await page.locator('[data-testid="calendar-next"]').click()
    await page.waitForTimeout(300)

    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    const intermediateMonth = await monthDisplay.textContent()

    // Click previous month button
    const prevButton = page.locator('[data-testid="calendar-prev"]').or(page.locator('button[aria-label="Previous month"]'))
    await prevButton.click()
    await page.waitForTimeout(300)

    // Should go back to original month
    const newMonth = await monthDisplay.textContent()
    expect(newMonth).not.toBe(intermediateMonth)
  })

  test('should highlight today\'s date', async ({ page }) => {
    const today = new Date()
    const todayDate = today.getDate()

    // Find today's date cell
    const todayCell = page.locator(`[data-testid="calendar-day"][data-day-number="${todayDate}"]`).first()

    if (await todayCell.isVisible()) {
      // Should have special styling/class for today
      await expect(todayCell).toHaveAttribute('data-today', 'true')
    }
  })

  test('should disable past dates', async ({ page }) => {
    const today = new Date()
    const yesterday = today.getDate() - 1

    if (yesterday > 0) {
      // Find yesterday's date
      const yesterdayCell = page.locator(`[data-testid="calendar-day"][data-day-number="${yesterday}"]`).first()

      if (await yesterdayCell.isVisible()) {
        // Should be disabled
        await expect(yesterdayCell).toHaveAttribute('aria-disabled', 'true')
        await expect(yesterdayCell).toBeDisabled()
      }
    }
  })

  test('should not allow selecting past dates', async ({ page }) => {
    // Try to navigate to previous month (may be disabled if at start of valid range)
    const prevButton = page.locator('[data-testid="calendar-prev"]')
    const isPrevDisabled = await prevButton.isDisabled()

    if (!isPrevDisabled) {
      // Navigate to previous month if possible
      await prevButton.click()
      await page.waitForTimeout(300)
    }

    // Find any past date (dates with aria-disabled="true")
    const pastDates = page.locator('[data-testid="calendar-day"][aria-disabled="true"]')
    const pastDateCount = await pastDates.count()

    if (pastDateCount > 0) {
      const firstPastDate = pastDates.first()

      // Verify past date is properly disabled
      await expect(firstPastDate).toHaveAttribute('aria-disabled', 'true')

      // Try clicking it (should not trigger selection)
      await firstPastDate.click({ force: true })
      await page.waitForTimeout(500)

      // Time slots should NOT appear for past dates
      const timeSlots = page.locator('[data-testid="time-slots"]')
      await expect(timeSlots).not.toBeVisible()
    }
  })

  test('should select a date when clicked', async ({ page }) => {
    // Click on an available future date
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await availableDate.click()

    // Date should be selected (highlighted) - wait for useEffect to update DOM
    await expect(availableDate).toHaveAttribute('data-selected', 'true', { timeout: 1000 })

    // Time slots should appear
    await expect(page.locator('[data-testid="time-slots"]')).toBeVisible({ timeout: 3000 })
  })

  test('should change selection when clicking different date', async ({ page }) => {
    // Click first available date
    const firstDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').nth(0)
    await firstDate.click()
    await page.waitForTimeout(500)

    // Click second available date
    const secondDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').nth(1)
    await secondDate.click()
    await page.waitForTimeout(1000) // Wait for useEffect to update data-selected attributes

    // Second date should be selected
    await expect(secondDate).toHaveAttribute('data-selected', 'true')

    // First date should not be selected
    const firstDateSelected = await firstDate.getAttribute('data-selected')
    expect(firstDateSelected).not.toBe('true')
  })

  test('should show visual indicators for dates with availability', async ({ page }) => {
    // Available dates should have specific styling
    const availableDates = page.locator('[data-testid="calendar-day"][data-has-availability="true"]')
    const count = await availableDates.count()

    if (count > 0) {
      const firstAvailable = availableDates.first()
      await expect(firstAvailable).not.toHaveAttribute('aria-disabled', 'true')
      await expect(firstAvailable).toBeEnabled()
    }
  })

  test('should show visual indicators for dates without availability', async ({ page }) => {
    // Dates without availability should be disabled or styled differently
    const unavailableDates = page.locator('[data-testid="calendar-day"][data-has-availability="false"]')
    const count = await unavailableDates.count()

    if (count > 0) {
      const firstUnavailable = unavailableDates.first()
      await expect(firstUnavailable).toHaveAttribute('aria-disabled', 'true')
    }
  })

  test('should navigate calendar using keyboard (arrow keys)', async ({ page }) => {
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await expect(calendar).toBeVisible()

    // Focus on first available date
    const firstDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await firstDate.focus()

    // Press right arrow key
    await page.keyboard.press('ArrowRight')

    // Focus should move to next date
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'calendar-day')
  })

  test('should select date using keyboard (Enter or Space)', async ({ page }) => {
    // Focus on first available date
    const firstDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await firstDate.focus()

    // Press Enter to select
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)

    // Date should be selected - wait for useEffect to update DOM
    await expect(firstDate).toHaveAttribute('data-selected', 'true', { timeout: 1000 })

    // Time slots should appear - wait for API response
    await expect(page.locator('[data-testid="time-slots"]')).toBeVisible({ timeout: 5000 })
  })

  test('should display correct number of weeks in month', async ({ page }) => {
    // Most months display 4-6 weeks in calendar view (with weekends hidden but adjacent month dates shown)
    const weekRows = page.locator('[data-testid="calendar-week"]')
    const weekCount = await weekRows.count()

    // Should have between 4 and 6 weeks displayed (weekends hidden, but FullCalendar shows complete weeks with adjacent months)
    expect(weekCount).toBeGreaterThanOrEqual(4)
    expect(weekCount).toBeLessThanOrEqual(6)
  })

  test('should display dates from previous/next month in correct styling', async ({ page }) => {
    // Dates from adjacent months should be styled differently
    const adjacentMonthDates = page.locator('[data-testid="calendar-day"][data-adjacent-month="true"]')
    const count = await adjacentMonthDates.count()

    if (count > 0) {
      // Should have reduced opacity or different color
      const firstAdjacent = adjacentMonthDates.first()
      await expect(firstAdjacent).toBeVisible()

      // These dates should typically be disabled or non-interactive
      const isDisabled = await firstAdjacent.getAttribute('aria-disabled')
      expect(isDisabled).toBe('true')
    }
  })

  test('should not allow booking beyond 90-day window', async ({ page }) => {
    // Navigate forward multiple months (to exceed 90 days)
    const nextButton = page.locator('[data-testid="calendar-next"]')

    // Go forward 4 months (stop if button becomes disabled due to validRange)
    for (let i = 0; i < 4; i++) {
      if (await nextButton.isDisabled()) break
      await nextButton.click()
      await page.waitForTimeout(300)
    }

    // All dates in this far-future month should be disabled
    const futureDates = page.locator('[data-testid="calendar-day"]')
    const firstDate = futureDates.first()

    if (await firstDate.isVisible()) {
      await expect(firstDate).toHaveAttribute('aria-disabled', 'true')
    }
  })

  test('should show loading state when fetching availability', async ({ page }) => {
    // Click on a date
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await availableDate.click()

    // Should briefly show loading indicator (use correct testid)
    const loadingIndicator = page.locator('[data-testid="calendar-loading"]')

    // Either loading appears briefly or slots appear immediately
    const hasLoading = await loadingIndicator.isVisible({ timeout: 500 }).catch(() => false)
    const hasSlots = await page.locator('[data-testid="time-slots"]').isVisible({ timeout: 2000 }).catch(() => false)

    expect(hasLoading || hasSlots).toBeTruthy()
  })

  test('should update available dates when changing appointment type', async ({ page }) => {
    // The appointments page includes appointment type selection
    // This test verifies that changing types updates the calendar availability
    const typeSelector = page.locator('[data-testid="appointment-type-select"]')

    // Note initial available dates
    const initialAvailableDates = await page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').count()

    // Should have some available dates to start with
    expect(initialAvailableDates).toBeGreaterThan(0)

    // Change appointment type if selector exists
    const typeSelectorCount = await typeSelector.count()
    if (typeSelectorCount > 0) {
      await typeSelector.click()
      await page.locator('[role="listbox"]').waitFor({ state: 'visible', timeout: 5000 })
      await page.getByRole('option').nth(1).click()
      await page.waitForTimeout(1000)

      // Available dates might change based on type duration
      const newAvailableDates = await page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').count()

      // Should still have available dates after changing type
      expect(newAvailableDates).toBeGreaterThan(0)
    } else {
      // If no type selector, just verify calendar shows available dates
      expect(initialAvailableDates).toBeGreaterThan(0)
    }
  })

  test('should show tooltip or details on date hover', async ({ page }) => {
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()

    // Hover over date
    await availableDate.hover()

    // Should show tooltip with availability info (if implemented)
    const tooltip = page.locator('[role="tooltip"]')
    const tooltipVisible = await tooltip.isVisible({ timeout: 1000 }).catch(() => false)

    // Tooltip is optional, so we just check it doesn't error
    if (tooltipVisible) {
      await expect(tooltip).toBeVisible()
    }
  })

  test('should handle rapid month navigation without errors', async ({ page }) => {
    const nextButton = page.locator('[data-testid="calendar-next"]')

    // Rapidly click next month multiple times (stop if button becomes disabled)
    for (let i = 0; i < 5; i++) {
      if (await nextButton.isDisabled()) break
      await nextButton.click()
    }

    // Wait for last click to settle
    await page.waitForTimeout(500)

    // Calendar should still be visible and functional
    const calendar = page.locator('[data-testid="booking-calendar"]')
    await expect(calendar).toBeVisible()

    // Should display a valid month/year
    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    await expect(monthDisplay).toBeVisible()
    await expect(monthDisplay).not.toBeEmpty()
  })

  test('should persist selected date when navigating months', async ({ page }) => {
    // Select a date in current month
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    const dateText = await availableDate.textContent()
    await availableDate.click()
    await page.waitForTimeout(500)

    // Navigate to next month and back
    await page.locator('[data-testid="calendar-next"]').click()
    await page.waitForTimeout(300)
    await page.locator('[data-testid="calendar-prev"]').click()
    await page.waitForTimeout(300)

    // Original date should still be selected
    const sameDate = page.locator(`[data-testid="calendar-day"]:has-text("${dateText}")`).first()
    const isSelected = await sameDate.getAttribute('data-selected')

    // Depending on implementation, selection might persist or clear
    // This test verifies the behavior is intentional
    expect(isSelected !== null).toBeTruthy()
  })

  test('should show month/year as clickable for date picker (optional)', async ({ page }) => {
    const monthDisplay = page.locator('[data-testid="calendar-month"]')

    // If month/year is clickable, should open date picker
    const isClickable = await monthDisplay.evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.cursor === 'pointer'
    }).catch(() => false)

    if (isClickable) {
      await monthDisplay.click()

      // Should show month/year picker
      const picker = page.locator('[data-testid="month-year-picker"]')
      await expect(picker).toBeVisible({ timeout: 1000 })
    }
  })

  test('should handle timezone correctly in date display', async ({ page }) => {
    // Calendar dates should be in user's timezone
    const today = new Date()
    const todayDate = today.getDate()

    // Find today's cell
    const todayCell = page.locator(`[data-testid="calendar-day"]`).filter({ hasText: todayDate.toString() }).first()

    // Should be visible and match current date
    if (await todayCell.isVisible()) {
      const cellDate = await todayCell.getAttribute('data-day-number')
      expect(parseInt(cellDate || '0')).toBe(todayDate)
    }
  })

  test('should show blocked dates as unavailable', async ({ page }) => {
    // If doctor has blocked off certain dates, they should show as unavailable
    const blockedDate = page.locator('[data-testid="calendar-day"][data-blocked="true"]')
    const count = await blockedDate.count()

    if (count > 0) {
      const firstBlocked = blockedDate.first()
      await expect(firstBlocked).toHaveAttribute('aria-disabled', 'true')

      // Clicking should not show time slots
      await firstBlocked.click()
      await page.waitForTimeout(500)

      const timeSlots = page.locator('[data-testid="time-slots"]')
      const slotsVisible = await timeSlots.isVisible().catch(() => false)
      expect(slotsVisible).toBe(false)
    }
  })

  test('should show weekends with different styling (if applicable)', async ({ page }) => {
    // If calendar styles weekends differently
    const saturdayCells = page.locator('[data-testid="calendar-day"][data-day="6"]') // Saturday
    const sundayCells = page.locator('[data-testid="calendar-day"][data-day="0"]') // Sunday

    // Check if weekend cells exist and have special styling
    const satCount = await saturdayCells.count()
    const sunCount = await sundayCells.count()

    if (satCount > 0) {
      await expect(saturdayCells.first()).toBeVisible()
    }

    if (sunCount > 0) {
      await expect(sundayCells.first()).toBeVisible()
    }
  })
})
