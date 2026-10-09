import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  server: { proxy: { '/store': { target: 'http://localhost', changeOrigin: true } } },
  build: { outDir: 'dist', emptyOutDir: true, assetsDir: 'assets' }
})
