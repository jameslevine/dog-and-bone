import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'context/**',
      'admin-server/**',
      'infrastructure/**',
      'android/**',
      '.idea/**',
      '.git/**',
      '.cache/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/content/**',
        'src/types/**',
        'src/globals.css',
        'scripts/**',
        'android/**',
        // Barrel re-export files (no logic to test)
        '**/index.ts',
        '**/index.tsx',
        // Router config (no testable logic beyond imports)
        'src/routes.tsx',
        // App.tsx (root component wiring)
        'src/App.tsx',
        // blog.ts uses import.meta.glob which requires Vite — tested via mocks in page tests
        'src/services/blog.ts',
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
