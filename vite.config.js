import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Test files sit next to the code they test and end in .test.js or .test.jsx
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 65, statements: 65, functions: 65, branches: 60 },
      reporter: ['text', 'html'], // a table in the terminal + a clickable page
      // Measure EVERY source file, even ones with no test yet, so the percentage is honest
      include: ['src/**/*.{js,jsx}'],
      // Left out on purpose: the app start-up file, the Firebase setup (needs real keys),
      // static drill data, and the test files themselves
      exclude: ['src/main.*', 'src/services/firebase.*', 'src/data/**', 'src/**/*.test.*'],
    },
  },
})
