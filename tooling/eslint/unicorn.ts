import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

import { SOURCE_FILES } from './source-files.ts';

/**
eslint-plugin-unicorn recommended rules with kebab-case file names.
*/
export const unicornRules = defineConfig(
	{
		extends: [unicorn.configs.recommended],
		files: SOURCE_FILES,
		rules: {
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
			'unicorn/name-replacements': ['error', { allowList: { Env: true, Props: true } }],
			'unicorn/no-null': 'off',
		},
	},
	{
		files: ['apps/web/src/components/**/*.{tsx,astro}', 'apps/web/src/layouts/**/*.astro'],
		rules: {
			'unicorn/filename-case': [
				'error',
				{
					case: 'pascalCase',
					directoryRoots: ['apps/web/src/components', 'apps/web/src/layouts'],
				},
			],
		},
	},
);
