import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths, so the built site works both locally and on GitHub Pages
  // (which serves it from /<repository-name>/). Safe because we have no router.
  base: './',
})
