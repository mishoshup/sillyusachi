import { defineConfig } from 'eslint/config';

import { commentRules } from './tooling/eslint/comments.ts';
import { formatting } from './tooling/eslint/formatting.ts';
import { ignores } from './tooling/eslint/ignores.ts';
import { imports } from './tooling/eslint/imports.ts';
import { javascript } from './tooling/eslint/javascript.ts';
import { linterOptions } from './tooling/eslint/linter-options.ts';
import { node } from './tooling/eslint/node.ts';
import { regexpRules } from './tooling/eslint/regexp.ts';
import { sorting } from './tooling/eslint/sorting.ts';
import { tests } from './tooling/eslint/tests.ts';
import { typescript } from './tooling/eslint/typescript.ts';
import { unicornRules } from './tooling/eslint/unicorn.ts';
import { web } from './tooling/eslint/web.ts';

export default defineConfig(
	ignores,
	linterOptions,
	javascript,
	typescript,
	imports,
	sorting,
	unicornRules,
	regexpRules,
	commentRules,
	tests,
	node,
	web,
	formatting,
);
