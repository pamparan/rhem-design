import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/amplify-edge/', // Temporarily disabled for local development
  server: {
    port: 3000,
  },
})