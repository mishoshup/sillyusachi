import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { NODE_FILES } from './source-files.ts';

/**
Node globals for scripts and configs; scripts may print to the console.
*/
export const node = defineConfig(
	{
		files: NODE_FILES,
		languageOptions: { globals: globals.node },
	},
	{
		files: ['apps/api/scripts/**'],
		rules: { 'no-console': 'off' },
	},
);
