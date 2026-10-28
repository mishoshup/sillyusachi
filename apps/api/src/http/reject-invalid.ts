import type { Context, Env } from 'hono';

import type { Issue } from './invalid-request.ts';

import { invalidRequestBody } from './invalid-request.ts';

type ValidationResult = { error: readonly Issue[]; success: false } | { success: true };

/**
Validator hook that answers 400 with the issues when validation fails.
*/
export const rejectInvalid = <Environment extends Env, Path extends string>(
	result: ValidationResult,
	context: Context<Environment, Path>,
): Response | undefined =>
	result.success ? undefined : context.json(invalidRequestBody(result.error), 400);
