import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import type { AppEnvironment } from './environment.ts';

import { authRoutes } from './routes/auth.ts';
import { bookRoutes } from './routes/books.ts';
import { pageRoutes } from './routes/pages.ts';
import { photoRoutes } from './routes/photos.ts';
import { userRoutes } from './routes/users.ts';

export const app = new Hono<AppEnvironment>()
	.use(
		secureHeaders({
			contentSecurityPolicy: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
		}),
	)
	.use('/api/*', csrf())
	.route('/api/auth', authRoutes)
	.route('/api/users', userRoutes)
	.route('/api/books', bookRoutes)
	.route('/api', pageRoutes)
	.route('/', photoRoutes)
	.notFound((context) => context.json({ error: 'not found' }, 404))
	.onError((error, context) => {
		if (error instanceof HTTPException) {
			return error.getResponse();
		}
		console.error(error);
		return context.json({ error: 'internal error' }, 500);
	});
