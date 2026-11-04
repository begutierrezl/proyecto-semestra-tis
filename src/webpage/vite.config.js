import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 9000
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
    watch: {
      usePolling: true,
      interval: 500
    },
    // AQUÍ ESTÁ EL PUENTE HACIA DJANGO
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})