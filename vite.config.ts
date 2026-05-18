/// <reference types="vitest" />
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		...(process.env.VITEST ? [svelteTesting()] : []),
	],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
	},
	server: {
		allowedHosts: [true,'nasuha.cloud-miso.top', 'openclaw-personal.tailf76c68.ts.net']
	}
});