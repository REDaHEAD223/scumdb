import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  base: '/scumdb/',  // Название вашего репозитория
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  // Копируем файлы локализации в папку dist при сборке
  copy: {
    targets: [
      { src: 'src/locales/**/*', dest: 'dist/locales' }
    ]
  }
})
