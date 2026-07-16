import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'https://ksp-sentinai-60076496338.development.catalystserverless.in',
        changeOrigin: true
      },
      '/catalyst-api': {
        target: 'https://ksp-sentinai-60076496338.development.catalystserverless.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/catalyst-api/, '')
      },
      '/server': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  }
})
