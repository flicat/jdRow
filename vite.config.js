import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  plugins: [
    Vue()
  ],
  build: {
    outDir: 'docs'
  }
})
