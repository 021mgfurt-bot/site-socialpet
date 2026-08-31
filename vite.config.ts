import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoPlugin } from './vite.seo.plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin()],
})
