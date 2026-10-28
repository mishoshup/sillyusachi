/**
Every linted source file type.
*/
export const SOURCE_FILES = ['**/*.{ts,tsx,astro}'];

/**
Test files run by vitest.
*/
export const TEST_FILES = ['**/test/**/*.ts', '**/*.test.ts'];

/**
Node-run files: scripts and tool configs.
*/
export const NODE_FILES = ['apps/api/scripts/**', '**/*.config.ts', 'tooling/**'];

/**
Files whose default export is required by their host tool.
*/
export const DEFAULT_EXPORT_FILES = [
	'**/*.config.ts',
	'apps/api/src/index.ts',
	'apps/web/src/**/*.astro',
];
