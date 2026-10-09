import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const { VITE_API_PROXY_TARGET = 'http://localhost:5000' } = loadEnv(mode, process.cwd(), 'VITE_')
  const proxy = {
    '/api': {
      target: VITE_API_PROXY_TARGET,
      changeOrigin: true,
    },
    '/uploads': {
      target: VITE_API_PROXY_TARGET,
      changeOrigin: true,
    },
  }

  return {
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
  }
})
