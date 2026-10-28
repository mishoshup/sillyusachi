import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';

import { SOURCE_FILES } from './source-files.ts';

/**
Turns off rules Prettier owns, then restores curly which is safe with Prettier in "all" mode.
*/
export const formatting = defineConfig(eslintConfigPrettier, {
	files: SOURCE_FILES,
	rules: { curly: ['error', 'all'] },
});
