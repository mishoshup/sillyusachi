import { defineConfig } from 'eslint/config';
import { configs } from 'typescript-eslint';

import { namingConvention } from './naming-convention.ts';
import { ROOT_DIRECTORY } from './root-directory.ts';
import { SOURCE_FILES } from './source-files.ts';

/**
typescript-eslint strict and stylistic type-checked rules plus extra strict rules.
*/
export const typescript = defineConfig({
	extends: [configs.strictTypeChecked, configs.stylisticTypeChecked],
	files: SOURCE_FILES,
	languageOptions: {
		parserOptions: {
			extraFileExtensions: ['.astro'],
			project: ['./tsconfig.json', './apps/*/tsconfig*.json', './packages/*/tsconfig.json'],
			tsconfigRootDir: ROOT_DIRECTORY,
		},
	},
	rules: {
		'@typescript-eslint/consistent-return': 'error',
		'@typescript-eslint/consistent-type-exports': 'error',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/default-param-last': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/max-params': ['error', { max: 3 }],
		'@typescript-eslint/method-signature-style': 'error',
		'@typescript-eslint/naming-convention': ['error', ...namingConvention],
		'@typescript-eslint/no-import-type-side-effects': 'error',
		'@typescript-eslint/no-loop-func': 'error',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/no-unnecessary-qualifier': 'error',
		'@typescript-eslint/no-use-before-define': 'error',
		'@typescript-eslint/no-useless-empty-export': 'error',
		'@typescript-eslint/prefer-readonly': 'error',
		'@typescript-eslint/promise-function-async': 'error',
		'@typescript-eslint/require-array-sort-compare': 'error',
		'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
		'@typescript-eslint/strict-boolean-expressions': 'error',
		'@typescript-eslint/switch-exhaustiveness-check': 'error',
	},
});
