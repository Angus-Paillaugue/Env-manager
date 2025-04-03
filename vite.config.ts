import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
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
      allow: ['uploads']
    }
  },
  resolve: process.env.VITEST
    ? {
        conditions: ['browser']
      }
    : undefined
});
