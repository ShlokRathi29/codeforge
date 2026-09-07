import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/health': {
        target: 'https://codeforge-zdxk.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://codeforge-zdxk.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
