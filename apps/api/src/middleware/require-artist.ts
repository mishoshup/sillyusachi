import { createMiddleware } from 'hono/factory';

import type { AppEnvironment } from '../environment.ts';

import { getConfig } from '../config/get-config.ts';
import { findUserById } from '../db/users.ts';
import { readSessionCookie } from '../session/cookie.ts';
import { verifySession } from '../session/token.ts';

/**
Admits only requests with a valid, current session and exposes the user as context.var.user.
*/
export const requireArtist = createMiddleware<AppEnvironment>(async (context, next) => {
	const token = readSessionCookie(context);
	const claims =
		token === undefined ? null : await verifySession(getConfig(context.env).jwt, token);
	const user = claims ? await findUserById(context.env.DB, claims.sub) : null;
	if (claims === null || user?.session_version !== claims.ver) {
		return context.json({ error: 'unauthorized' }, 401);
	}
	context.set('user', { id: user.id, username: user.username });
	return next();
});
