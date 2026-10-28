import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

import { TEST_FILES } from './source-files.ts';

/**
vitest recommended rules plus strict test structure rules.
*/
export const tests = defineConfig({
	extends: [vitest.configs.recommended],
	files: TEST_FILES,
	rules: {
		'max-lines-per-function': 'off',
		'max-nested-callbacks': ['error', 4],
		'vitest/consistent-test-it': ['error', { withinDescribe: 'it' }],
		'vitest/max-nested-describe': ['error', { max: 2 }],
		'vitest/no-conditional-expect': 'error',
		'vitest/no-conditional-in-test': 'error',
		'vitest/no-disabled-tests': 'error',
		'vitest/no-duplicate-hooks': 'error',
		'vitest/no-focused-tests': 'error',
		'vitest/no-test-return-statement': 'error',
		'vitest/prefer-each': 'error',
		'vitest/prefer-hooks-on-top': 'error',
		'vitest/prefer-strict-equal': 'error',
		'vitest/prefer-to-be': 'error',
		'vitest/prefer-to-have-length': 'error',
		'vitest/require-to-throw-message': 'error',
		'vitest/require-top-level-describe': 'error',
	},
});
