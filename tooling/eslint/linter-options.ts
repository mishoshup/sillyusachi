import { defineConfig } from 'eslint/config';

/**
Fails on stale disable directives and inline configs.
*/
export const linterOptions = defineConfig({
	linterOptions: {
		reportUnusedDisableDirectives: 'error',
		reportUnusedInlineConfigs: 'error',
	},
});
