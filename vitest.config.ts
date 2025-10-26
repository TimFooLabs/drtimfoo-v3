import { defineConfig } from 'vitest/config'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, './src'),
    },
  },
})
