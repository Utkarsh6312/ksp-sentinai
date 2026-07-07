import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/catalyst-api': {
        target: 'https://ksp-sentinai-60076496338.development.catalystserverless.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/catalyst-api/, '')
      }
    }
  }
})
