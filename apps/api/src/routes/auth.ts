import type { SessionUser } from '@sillyusachi/shared';

import { sValidator } from '@hono/standard-validator';
import { changePasswordSchema, loginSchema } from '@sillyusachi/shared';
import { Hono } from 'hono';

import type { AppEnvironment } from '../environment.ts';

import { getArgon2 } from '../auth/argon2.ts';
import { getDummyHash } from '../auth/dummy-hash.ts';
import { hashPassword, isPasswordCorrect } from '../auth/password.ts';
import { isAttemptAllowed } from '../auth/rate-limit.ts';
import { getConfig } from '../config/get-config.ts';
import { findUserById, findUserByUsername, updatePassword } from '../db/users.ts';
import { clientIp } from '../http/client-ip.ts';
import { rejectInvalid } from '../http/reject-invalid.ts';
import { jsonBodyLimit } from '../middleware/json-body-limit.ts';
import { requireArtist } from '../middleware/require-artist.ts';
import { clearSessionCookie, writeSessionCookie } from '../session/cookie.ts';
import { signSession } from '../session/token.ts';

export const authRoutes = new Hono<AppEnvironment>()
	.post(
		'/login',
		jsonBodyLimit,
		sValidator('json', loginSchema, rejectInvalid),
		async (context) => {
			const { password, username } = context.req.valid('json');
			const attemptKey = `login:${clientIp(context)}:${username.toLowerCase()}`;
			if (!(await isAttemptAllowed(context.env.LOGIN_LIMITER, attemptKey))) {
				return context.json({ error: 'too many attempts' }, 429);
			}

			const config = getConfig(context.env);
			const argon2 = await getArgon2();
			const user = await findUserByUsername(context.env.DB, username);
			const hash = user?.password_hash ?? (await getDummyHash(argon2, config.password));
			const isValid = await isPasswordCorrect(argon2, {
				encoded: hash,
				password,
				pepper: config.password.pepper,
			});
			if (!user || !isValid) {
				return context.json({ error: 'invalid username or password' }, 401);
			}

			const token = await signSession(config.jwt, { sub: user.id, ver: user.session_version });
			writeSessionCookie(context, token, config.jwt.ttlSeconds);
			return context.json<SessionUser>({ id: user.id, username: user.username });
		},
	)
	.post('/logout', (context) => {
		clearSessionCookie(context);
		return context.body(null, 204);
	})
	.get('/me', requireArtist, (context) => {
		context.header('Cache-Control', 'private, no-store');
		return context.json(context.var.user);
	})
	.put(
		'/password',
		jsonBodyLimit,
		requireArtist,
		sValidator('json', changePasswordSchema, rejectInvalid),
		async (context) => {
			const { currentPassword, newPassword } = context.req.valid('json');
			const { id } = context.var.user;
			if (!(await isAttemptAllowed(context.env.LOGIN_LIMITER, `password:${id}`))) {
				return context.json({ error: 'too many attempts' }, 429);
			}

			const config = getConfig(context.env);
			const argon2 = await getArgon2();
			const user = await findUserById(context.env.DB, id);
			if (!user) {
				return context.json({ error: 'unauthorized' }, 401);
			}
			const isValid = await isPasswordCorrect(argon2, {
				encoded: user.password_hash,
				password: currentPassword,
				pepper: config.password.pepper,
			});
			if (!isValid) {
				return context.json({ error: 'current password is wrong' }, 403);
			}

			const hash = await hashPassword(argon2, config.password, newPassword);
			const version = await updatePassword(context.env.DB, id, hash);
			const token = await signSession(config.jwt, { sub: id, ver: version });
			writeSessionCookie(context, token, config.jwt.ttlSeconds);
			return context.body(null, 204);
		},
	);
