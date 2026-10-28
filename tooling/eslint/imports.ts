import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import { defineConfig } from 'eslint/config';

import { DEFAULT_EXPORT_FILES, SOURCE_FILES } from './source-files.ts';

/**
Import correctness: resolvable, acyclic, declared, deduplicated, named exports only.
*/
export const imports = defineConfig(
	{
		extends: [importX.flatConfigs.recommended, importX.flatConfigs.typescript],
		files: SOURCE_FILES,
		rules: {
			'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
			'import-x/first': 'error',
			'import-x/newline-after-import': 'error',
			'import-x/no-absolute-path': 'error',
			'import-x/no-cycle': 'error',
			'import-x/no-default-export': 'error',
			'import-x/no-duplicates': 'error',
			'import-x/no-empty-named-blocks': 'error',
			'import-x/no-extraneous-dependencies': 'error',
			'import-x/no-mutable-exports': 'error',
			'import-x/no-relative-packages': 'error',
			'import-x/no-self-import': 'error',
			'import-x/no-unresolved': ['error', { ignore: ['^cloudflare:'] }],
			'import-x/no-useless-path-segments': 'error',
		},
		settings: {
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					noWarnOnMultipleProjects: true,
					project: ['apps/*/tsconfig*.json', 'packages/*/tsconfig.json', 'tsconfig.json'],
				}),
			],
		},
	},
	{
		files: DEFAULT_EXPORT_FILES,
		rules: { 'import-x/no-default-export': 'off' },
	},
);
