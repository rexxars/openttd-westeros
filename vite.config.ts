import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/westeros',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
  preview: {
    allowedHosts: ['rubysrealm.net'],
    host: '0.0.0.0',
  }
})
