import { bodyLimit } from 'hono/body-limit';
import { createMiddleware } from 'hono/factory';

import type { AppEnvironment } from '../environment.ts';

import { getConfig } from '../config/get-config.ts';

/**
Rejects JSON bodies larger than the configured limit with 413.
*/
export const jsonBodyLimit = createMiddleware<AppEnvironment>(async (context, next) =>
	bodyLimit({
		maxSize: getConfig(context.env).maxJsonBytes,
		onError: () => context.json({ error: 'payload too large' }, 413),
	})(context, next),
);
