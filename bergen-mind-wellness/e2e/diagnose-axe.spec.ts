import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import * as fs from 'fs'

test('diagnose homepage violations', async ({ page }) => {
  await page.goto('/en')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const report = {
    url: page.url(),
    violations: results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
        any: n.any.map(a => ({ message: a.message, data: a.data })),
        all: n.all.map(a => ({ message: a.message, data: a.data })),
        none: n.none.map(a => ({ message: a.message, data: a.data }))
      }))
    }))
  }

  fs.writeFileSync('/tmp/homepage-violations.json', JSON.stringify(report, null, 2))
})

test('diagnose appointments violations', async ({ page }) => {
  await page.goto('/en/appointments')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const report = {
    url: page.url(),
    violations: results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
        any: n.any.map(a => ({ message: a.message, data: a.data })),
        all: n.all.map(a => ({ message: a.message, data: a.data })),
        none: n.none.map(a => ({ message: a.message, data: a.data }))
      }))
    }))
  }

  fs.writeFileSync('/tmp/appointments-violations.json', JSON.stringify(report, null, 2))
})

test('diagnose color contrast violations', async ({ page }) => {
  await page.goto('/en/appointments')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .include('button, a, input, label, p, h1, h2, h3')
    .analyze()

  const contrastViolations = results.violations.filter(v => v.id === 'color-contrast')

  const report = {
    url: page.url(),
    violations: contrastViolations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
        any: n.any.map(a => ({ message: a.message, data: a.data })),
        all: n.all.map(a => ({ message: a.message, data: a.data })),
        none: n.none.map(a => ({ message: a.message, data: a.data }))
      }))
    }))
  }

  fs.writeFileSync('/tmp/contrast-violations.json', JSON.stringify(report, null, 2))
})
