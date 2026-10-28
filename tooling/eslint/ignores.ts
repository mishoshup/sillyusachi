import { defineConfig } from 'eslint/config';

/**
Paths that are generated, vendored or not source code.
*/
export const ignores = defineConfig({
	ignores: [
		'**/node_modules/**',
		'**/dist/**',
		'**/.astro/**',
		'**/.wrangler/**',
		'**/worker-configuration.d.ts',
		'reports/**',
		'research_notes/**',
	],
});
