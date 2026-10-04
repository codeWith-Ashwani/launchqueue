/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})

