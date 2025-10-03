import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/rhem-design/' : '/', // GitHub Pages base path only for production
  server: {
    port: 3000,
  },
}))