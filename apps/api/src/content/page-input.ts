import type { PageInput } from '@sillyusachi/shared';

import { createPageInputSchema } from '@sillyusachi/shared';

import type { Config } from '../config/schema.ts';

import { invalidRequest } from '../http/invalid-request.ts';

/**
Validates page text against the configured length limits, throwing a 400 on failure.
*/
export const parsePageInput = (limits: Config['content'], raw: unknown): PageInput => {
	const result = createPageInputSchema(limits).safeParse(raw);
	if (!result.success) {
		throw invalidRequest(result.error.issues);
	}
	return result.data;
};
