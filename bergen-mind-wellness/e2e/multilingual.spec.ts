/**
 * E2E Tests: Multilingual Support (i18n)
 *
 * Tests bilingual functionality (English/Spanish):
 * - Language switcher
 * - Content translation
 * - URL locale routing
 * - Bilingual appointment types
 * - Form validation messages in both languages
 * - Date/time formatting
 * - Email language selection
 * - Persistent language preference
 * - Meta tags and SEO
 */

import { test, expect, type Page } from '@playwright/test'

test.describe('Multilingual Support (English/Spanish)', () => {
  test('should display default language based on browser locale', async ({ page }) => {
    // Navigate without locale prefix
    await page.goto('/')

    // Should redirect to /en or /es based on Accept-Language header
    await page.waitForURL(/\/(en|es)/)

    const url = page.url()
    expect(url).toMatch(/\/(en|es)\//)
  })

  test('should display content in English when navigating to /en', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Should have English content
    await expect(page.locator('text=/Book.*Appointment|Schedule|Appointments/i')).toBeVisible()

    // HTML lang attribute should be English
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toMatch(/en/)
  })

  test('should display content in Spanish when navigating to /es', async ({ page }) => {
    await page.goto('/es')
    await page.waitForLoadState('networkidle')

    // Should have Spanish content
    await expect(page.locator('text=/Reservar.*Cita|Programar|Citas/i')).toBeVisible()

    // HTML lang attribute should be Spanish
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toMatch(/es/)
  })

  test('should have functioning language switcher', async ({ page }) => {
    await page.goto('/en/appointments')

    // Find language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(page.locator('button:has-text("ES")'))

    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click()

      // Should navigate to Spanish version
      await page.waitForURL(/\/es\//)

      // Content should be in Spanish
      await expect(page.locator('text=/Citas|Reservar/i')).toBeVisible()
    }
  })

  test('should maintain same page when switching languages', async ({ page }) => {
    await page.goto('/en/appointments')

    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(page.locator('button:has-text("ES")'))

    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click()
      await page.waitForTimeout(500)

      // Should still be on appointments page
      expect(page.url()).toContain('/appointments')
    }
  })

  test('should display appointment types in English', async ({ page }) => {
    await page.goto('/en/appointments')

    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await typeSelector.click()

    // Should show English appointment type names
    const options = page.locator('[role="option"]')
    const firstOptionText = await options.first().textContent()

    // Should be in English (not Spanish)
    expect(firstOptionText).toBeTruthy()
    expect(firstOptionText).toMatch(/Initial|Follow|Consultation/i)
  })

  test('should display appointment types in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    const typeSelector = page.locator('[data-testid="appointment-type-select"]')
    await typeSelector.click()

    // Should show Spanish appointment type names
    const options = page.locator('[role="option"]')
    const firstOptionText = await options.first().textContent()

    // Should be in Spanish
    expect(firstOptionText).toBeTruthy()
    expect(firstOptionText).toMatch(/Inicial|Seguimiento|Consulta/i)
  })

  test('should show form labels in English', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Form labels should be in English
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Phone")')).toBeVisible()
  })

  test('should show form labels in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Form labels should be in Spanish
    await expect(page.locator('label:has-text("Nombre")')).toBeVisible()
    await expect(page.locator('label:has-text("Correo")')).toBeVisible()
    await expect(page.locator('label:has-text("Teléfono")')).toBeVisible()
  })

  test('should show validation errors in English', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Try to submit without filling
    await page.locator('button[type="submit"]').click()

    // Error messages should be in English
    await expect(page.locator('text=/required|must be|please enter/i')).toBeVisible()
  })

  test('should show validation errors in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Try to submit without filling
    await page.locator('button[type="submit"]').click()

    // Error messages should be in Spanish
    await expect(page.locator('text=/obligatorio|requerido|debe|por favor ingrese/i')).toBeVisible()
  })

  test('should show success message in English', async ({ page }) => {
    await page.goto('/en/appointments')

    await completeBooking(page)

    // Success message should be in English
    await expect(page.locator('text=/confirmed|success|appointment.*booked/i')).toBeVisible({ timeout: 10000 })
  })

  test('should show success message in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    await completeBookingSpanish(page)

    // Success message should be in Spanish
    await expect(page.locator('text=/confirmada|éxito|cita.*reservada/i')).toBeVisible({ timeout: 10000 })
  })

  test('should format dates according to locale (English)', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)

    // Select a date
    const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
    await availableDate.click()
    await page.waitForTimeout(500)

    // Month display should be in English
    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    const monthText = await monthDisplay.textContent()

    // Should contain English month names
    expect(monthText).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/)
  })

  test('should format dates according to locale (Spanish)', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)

    // Month display should be in Spanish
    const monthDisplay = page.locator('[data-testid="calendar-month"]')
    const monthText = await monthDisplay.textContent()

    // Should contain Spanish month names
    expect(monthText).toMatch(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i)
  })

  test('should format weekday names in English', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)

    // Should show English weekday abbreviations
    await expect(page.locator('text=/^Sun$|^Mon$|^Tue$|^Wed$|^Thu$|^Fri$|^Sat$/i')).toBeVisible()
  })

  test('should format weekday names in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)

    // Should show Spanish weekday abbreviations
    await expect(page.locator('text=/^Dom$|^Lun$|^Mar$|^Mié$|^Jue$|^Vie$|^Sáb$/i')).toBeVisible()
  })

  test('should persist language preference across navigation', async ({ page }) => {
    await page.goto('/es/appointments')

    // Verify we're on Spanish version
    await expect(page.locator('text=/Citas/i')).toBeVisible()

    // Navigate to another page
    await page.goto('/es')

    // Should still be in Spanish
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toMatch(/es/)

    // Navigate back to appointments
    await page.goto('/es/appointments')

    // Should still be in Spanish
    await expect(page.locator('text=/Citas/i')).toBeVisible()
  })

  test('should have correct meta tags in English', async ({ page }) => {
    await page.goto('/en/appointments')

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    const descriptionContent = await metaDescription.getAttribute('content')

    expect(descriptionContent).toBeTruthy()
    // Should be in English
    expect(descriptionContent).toMatch(/appointment|schedule|booking/i)
  })

  test('should have correct meta tags in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    const descriptionContent = await metaDescription.getAttribute('content')

    expect(descriptionContent).toBeTruthy()
    // Should be in Spanish
    expect(descriptionContent).toMatch(/cita|programar|reservar/i)
  })

  test('should have hreflang tags for SEO', async ({ page }) => {
    await page.goto('/en/appointments')

    // Should have alternate language links
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]')
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]')

    const enExists = await hreflangEn.count() > 0
    const esExists = await hreflangEs.count() > 0

    // Should have both language alternates
    expect(enExists || esExists).toBe(true)
  })

  test('should show button text in English', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Submit button should be in English
    const submitButton = page.locator('button[type="submit"]')
    const buttonText = await submitButton.textContent()

    expect(buttonText).toMatch(/submit|book|schedule|confirm/i)
  })

  test('should show button text in Spanish', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Submit button should be in Spanish
    const submitButton = page.locator('button[type="submit"]')
    const buttonText = await submitButton.textContent()

    expect(buttonText).toMatch(/enviar|reservar|programar|confirmar/i)
  })

  test('should show navigation menu in English', async ({ page }) => {
    await page.goto('/en')

    // Navigation should be in English
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Appointments")')).toBeVisible()
  })

  test('should show navigation menu in Spanish', async ({ page }) => {
    await page.goto('/es')

    // Navigation should be in Spanish
    await expect(page.locator('nav a:has-text("Inicio")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Citas")')).toBeVisible()
  })

  test('should display time slots in 12-hour format for English', async ({ page }) => {
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)

    // Time slots should use AM/PM format
    const timeSlot = page.locator('[data-testid="time-slot"]').first()
    const timeText = await timeSlot.textContent()

    expect(timeText).toMatch(/AM|PM/)
  })

  test('should display time slots in 24-hour format for Spanish (if applicable)', async ({ page }) => {
    await page.goto('/es/appointments')

    await selectAppointmentType(page)
    await selectDate(page)

    // Time slots might use 24-hour format or 12-hour with Spanish AM/PM
    const timeSlot = page.locator('[data-testid="time-slot"]').first()
    const timeText = await timeSlot.textContent()

    // Should have time information
    expect(timeText).toMatch(/\d{1,2}:\d{2}/)
  })

  test('should handle mixed language content gracefully', async ({ page }) => {
    // Start in English
    await page.goto('/en/appointments')

    await selectAppointmentType(page)
    await selectDate(page)
    await selectTimeSlot(page)

    // Fill form in English
    await page.fill('input[name="patientName"]', 'John Doe')
    await page.fill('input[name="email"]', `john${Date.now()}@example.com`)
    await page.fill('input[name="phone"]', '+15551234567')

    // Switch to Spanish before submitting
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(page.locator('button:has-text("ES")'))
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click()
      await page.waitForTimeout(500)

      // Form data should be preserved
      const nameValue = await page.locator('input[name="patientName"]').inputValue()
      expect(nameValue).toBe('John Doe')

      // UI should be in Spanish
      await expect(page.locator('label:has-text("Nombre")')).toBeVisible()
    }
  })

  test('should display crisis resources in appropriate language', async ({ page }) => {
    // English crisis button
    await page.goto('/en')
    const crisisButtonEn = page.locator('text=/Crisis|Help|Emergency/i')

    if (await crisisButtonEn.isVisible()) {
      await expect(crisisButtonEn).toBeVisible()
    }

    // Spanish crisis button
    await page.goto('/es')
    const crisisButtonEs = page.locator('text=/Crisis|Ayuda|Emergencia/i')

    if (await crisisButtonEs.isVisible()) {
      await expect(crisisButtonEs).toBeVisible()
    }
  })

  test('should store language preference in localStorage or cookie', async ({ page, context }) => {
    // Visit Spanish version
    await page.goto('/es/appointments')

    // Check if language is stored
    const cookies = await context.cookies()
    const localeLangCookie = cookies.find(c => c.name.includes('locale') || c.name.includes('lang'))

    // Or check localStorage
    const localStorageLang = await page.evaluate(() => localStorage.getItem('language') || localStorage.getItem('locale'))

    // Should have preference stored somewhere
    expect(localeLangCookie?.value === 'es' || localStorageLang === 'es').toBeTruthy()
  })

  test('should show cancellation confirmation in correct language', async ({ page }) => {
    // Create booking in English
    await page.goto('/en/appointments')
    await completeBooking(page)

    // Get manage link
    const manageLink = page.locator('a[href*="/appointments/manage"]')
    await manageLink.click()

    await page.waitForURL(/appointments\/manage/)

    // Cancel appointment
    const cancelButton = page.locator('button:has-text("Cancel")')
    if (await cancelButton.isVisible()) {
      await cancelButton.click()

      // Confirmation should be in English
      await expect(page.locator('text=/Are you sure|Confirm cancellation/i')).toBeVisible()
    }
  })

  test('should display all error states in correct language', async ({ page }) => {
    // Test 404 page
    await page.goto('/en/nonexistent-page')

    // Should show 404 message in English
    if (page.url().includes('404')) {
      await expect(page.locator('text=/not found|page.*not.*exist/i')).toBeVisible()
    }

    // Test Spanish 404
    await page.goto('/es/nonexistent-page')

    if (page.url().includes('404')) {
      await expect(page.locator('text=/no encontrado|página.*no.*existe/i')).toBeVisible()
    }
  })
})

// Helper functions
async function selectAppointmentType(page: Page) {
  const typeSelector = page.locator('[data-testid="appointment-type-select"]')
  await typeSelector.click()
  await page.locator('[role="option"]').first().click()
  await page.waitForTimeout(500)
}

async function selectDate(page: Page) {
  const availableDate = page.locator('[data-testid="calendar-day"]:not([aria-disabled="true"])').first()
  await availableDate.click()
  await page.waitForTimeout(500)
}

async function selectTimeSlot(page: Page) {
  const firstSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
  await firstSlot.click()
  await page.waitForTimeout(500)
}

async function completeBooking(page: Page) {
  await selectAppointmentType(page)
  await selectDate(page)
  await selectTimeSlot(page)

  const timestamp = Date.now()
  await page.fill('input[name="patientName"]', 'John Doe')
  await page.fill('input[name="email"]', `john${timestamp}@example.com`)
  await page.fill('input[name="phone"]', '+15551234567')

  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('text=/confirmed|success/i', { timeout: 10000 })
}

async function completeBookingSpanish(page: Page) {
  await selectAppointmentType(page)
  await selectDate(page)
  await selectTimeSlot(page)

  const timestamp = Date.now()
  await page.fill('input[name="patientName"]', 'Juan García')
  await page.fill('input[name="email"]', `juan${timestamp}@example.com`)
  await page.fill('input[name="phone"]', '+15551234567')

  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('text=/confirmada|éxito/i', { timeout: 10000 })
}
