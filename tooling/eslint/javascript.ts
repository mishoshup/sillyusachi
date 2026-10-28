import eslintJs from '@eslint/js';
import { defineConfig } from 'eslint/config';

import { ABBREVIATED_NAMES } from './abbreviated-names.ts';
import { SOURCE_FILES } from './source-files.ts';

/**
Core ESLint rules for correctness, clarity and size limits.
*/
export const javascript = defineConfig({
	extends: [eslintJs.configs.recommended],
	files: SOURCE_FILES,
	rules: {
		'array-callback-return': ['error', { checkForEach: true }],
		complexity: ['error', 10],
		'default-case-last': 'error',
		eqeqeq: ['error', 'always'],
		'func-style': ['error', 'expression'],
		'id-denylist': ['error', ...ABBREVIATED_NAMES],
		'id-length': ['error', { min: 2, properties: 'never' }],
		'logical-assignment-operators': ['error', 'always'],
		'max-depth': ['error', 3],
		'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
		'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
		'max-nested-callbacks': ['error', 3],
		'max-statements': ['error', 20],
		'no-await-in-loop': 'error',
		'no-console': ['error', { allow: ['error', 'warn'] }],
		'no-constructor-return': 'error',
		'no-else-return': ['error', { allowElseIf: false }],
		'no-implicit-coercion': 'error',
		'no-lonely-if': 'error',
		'no-nested-ternary': 'error',
		'no-new-wrappers': 'error',
		'no-object-constructor': 'error',
		'no-param-reassign': ['error', { props: true }],
		'no-promise-executor-return': 'error',
		'no-return-assign': ['error', 'always'],
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-template-curly-in-string': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unneeded-ternary': 'error',
		'no-unreachable-loop': 'error',
		'no-useless-computed-key': 'error',
		'no-useless-concat': 'error',
		'no-useless-rename': 'error',
		'no-useless-return': 'error',
		'no-var': 'error',
		'object-shorthand': ['error', 'always'],
		'prefer-arrow-callback': 'error',
		'prefer-const': 'error',
		'prefer-object-spread': 'error',
		'prefer-template': 'error',
		radix: 'error',
		'require-atomic-updates': 'error',
		yoda: 'error',
	},
});
