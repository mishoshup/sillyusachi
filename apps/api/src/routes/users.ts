import { sValidator } from '@hono/standard-validator';
import { newUserSchema } from '@sillyusachi/shared';
import { Hono } from 'hono';

import type { AppEnvironment } from '../environment.ts';

import { getArgon2 } from '../auth/argon2.ts';
import { hashPassword } from '../auth/password.ts';
import { getConfig } from '../config/get-config.ts';
import { insertUser } from '../db/users.ts';
import { rejectInvalid } from '../http/reject-invalid.ts';
import { jsonBodyLimit } from '../middleware/json-body-limit.ts';
import { requireArtist } from '../middleware/require-artist.ts';

export const userRoutes = new Hono<AppEnvironment>().post(
	'/',
	jsonBodyLimit,
	requireArtist,
	sValidator('json', newUserSchema, rejectInvalid),
	async (context) => {
		const { password, username } = context.req.valid('json');
		const hash = await hashPassword(await getArgon2(), getConfig(context.env).password, password);
		const user = await insertUser(context.env.DB, username, hash);
		return user ? context.json(user, 201) : context.json({ error: 'username taken' }, 409);
	},
);
