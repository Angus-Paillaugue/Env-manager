import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
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
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
