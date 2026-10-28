/**
Identifier casing; property keys are free because specs, headers and SQL columns fix them.
*/
export const namingConvention = [
	{
		format: ['camelCase'],
		leadingUnderscore: 'forbid',
		selector: 'default',
		trailingUnderscore: 'forbid',
	},
	{ format: ['camelCase', 'UPPER_CASE', 'PascalCase'], modifiers: ['const'], selector: 'variable' },
	{
		format: ['camelCase'],
		leadingUnderscore: 'require',
		modifiers: ['unused'],
		selector: 'parameter',
	},
	{ format: null, modifiers: ['destructured'], selector: 'variable' },
	{ format: ['camelCase', 'PascalCase'], selector: ['function', 'import'] },
	{ format: ['PascalCase'], selector: 'typeLike' },
	{
		format: null,
		selector: ['objectLiteralProperty', 'objectLiteralMethod', 'typeProperty', 'typeMethod'],
	},
];
