import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss(), viteCompression()],
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: [
        'text', // For the terminal
        'lcov' // For the VSCode extension and browser
      ]
    }
  },
  server: {
    fs: {
      allow: ['uploads', 'docs']
    }
  },
  resolve: process.env.VITEST ? {
        conditions: ['browser']
      } : undefined
});
