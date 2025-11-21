import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vitest Configuration for Integration Tests
 *
 * Integration tests connect to a REAL local Supabase database instance.
 * Prerequisites:
 * 1. Docker must be running
 * 2. Run `pnpm supabase:start` to start local Supabase
 * 3. Copy `.env.test.example` to `.env.test` and fill in credentials from `pnpm supabase:status`
 *
 * Run tests: pnpm test:integration
 * Watch mode: pnpm test:integration:watch
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'integration',
    environment: 'jsdom', // For React components and localStorage
    setupFiles: ['./vitest.integration.setup.ts'],
    globals: true,

    // Include only real integration tests (not unit tests with mocks)
    include: ['src/__tests__/integration/**/*.integration.test.ts'],

    // Longer timeouts for database operations
    testTimeout: 30000, // 30 seconds
    hookTimeout: 30000,

    // CRITICAL: Run tests sequentially to avoid race conditions with shared database
    // Each test modifies database state, so parallel execution causes conflicts
    maxConcurrency: 1, // Run one test at a time
    fileParallelism: false, // No parallel file execution

    // Environment variables
    env: {
      VITEST_ENV: 'integration',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
