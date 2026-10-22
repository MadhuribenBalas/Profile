import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' makes the build work on any GitHub Pages repo name (and any other static host)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: { include: ['tests/unit/**/*.test.ts'] },
})
