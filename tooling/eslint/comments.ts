import { recommended } from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig } from 'eslint/config';

import { SOURCE_FILES } from './source-files.ts';

/**
Disable directives must be scoped, paired and explained.
*/
export const commentRules = defineConfig({
	extends: [recommended],
	files: SOURCE_FILES,
	rules: {
		'@eslint-community/eslint-comments/no-unused-disable': 'error',
		'@eslint-community/eslint-comments/require-description': 'error',
	},
});
