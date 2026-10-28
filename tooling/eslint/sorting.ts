import { configs } from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

import { SOURCE_FILES } from './source-files.ts';

/**
Natural sort order for imports, exports, objects, types, unions and JSX props.
*/
export const sorting = defineConfig({
	extends: [configs['recommended-natural']],
	files: SOURCE_FILES,
});
