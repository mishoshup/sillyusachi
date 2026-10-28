import { configs } from 'eslint-plugin-regexp';
import { defineConfig } from 'eslint/config';

import { SOURCE_FILES } from './source-files.ts';

/**
Every eslint-plugin-regexp rule.
*/
export const regexpRules = defineConfig({
	extends: [configs['flat/all']],
	files: SOURCE_FILES,
});
