import eslintReact from '@eslint-react/eslint-plugin';
import { configs as astroConfigs } from 'eslint-plugin-astro';
import jsxA11yX from 'eslint-plugin-jsx-a11y-x';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

/**
React island and Astro component rules, including strict accessibility.
*/
export const web = defineConfig(
	{
		extends: [eslintReact.configs['strict-type-checked'], jsxA11yX.configs.strict],
		files: ['apps/web/**/*.tsx'],
		languageOptions: { globals: globals.browser },
	},
	{
		extends: [astroConfigs.recommended, astroConfigs['jsx-a11y-strict']],
		files: ['apps/web/**/*.astro'],
	},
);
