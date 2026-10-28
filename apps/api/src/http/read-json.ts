import type { Context } from 'hono';

import { invalidRequest } from './invalid-request.ts';

/**
Reads the request body as JSON, throwing a 400 when it is malformed.
*/
export const readJson = async (context: Context): Promise<unknown> => {
	try {
		return await context.req.json<unknown>();
	} catch {
		throw invalidRequest([{ message: 'body must be valid JSON' }]);
	}
};
