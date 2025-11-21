import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'bergen-mind-wellness',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // ONLY run unit tests (files in unit/ directory), NOT integration tests
    include: ['src/__tests__/unit/**/*.test.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'e2e',
      '**/playwright/**',
      // Explicitly exclude integration tests (they have their own config)
      'src/__tests__/integration/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/*.spec.{js,ts,jsx,tsx}',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/mockData/**',
        '**/types/**'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
