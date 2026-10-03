import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
export default defineConfig({
  // ... your other config
  preview: {
    allowedHosts: true // Or use ['mota-cs49.onrender.com']
  }
})
