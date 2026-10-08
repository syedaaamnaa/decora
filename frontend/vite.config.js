import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const proxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
  '/uploads': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy,
  },
  preview: {
    port: 4173,
    proxy,
  },
})
