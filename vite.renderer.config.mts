import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
