import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // fail loudly instead of silently drifting to 5174/5175/... when 5173 is busy
    proxy: {
      '/api': {
        // jithe localhost:4000 asel te change kr ... ha url tak - https://ipo-new-server.onrender.com/
        target: 'https://ipo-new-server.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
})
