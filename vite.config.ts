import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'export-vendor';
          }
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs-vendor';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
        }
      }
    }
  }
})
