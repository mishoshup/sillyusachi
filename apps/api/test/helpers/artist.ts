import type { SessionUser } from '@sillyusachi/shared';

import { env } from 'cloudflare:workers';

import { getArgon2 } from '../../src/auth/argon2.ts';
import { hashPassword } from '../../src/auth/password.ts';
import { getConfig } from '../../src/config/get-config.ts';
import { insertUser } from '../../src/db/users.ts';
import { sendJson, sessionCookie } from './request.ts';

export const ARTIST_PASSWORD = 'correct horse battery staple';

/**
Creates an artist account directly in D1 and returns it.
*/
export const createArtist = async (
	username = `artist-${crypto.randomUUID().slice(0, 8)}`,
): Promise<SessionUser> => {
	const passwordHash = await hashPassword(
		await getArgon2(),
		getConfig(env).password,
		ARTIST_PASSWORD,
	);
	const user = await insertUser(env.DB, username, passwordHash);
	if (!user) {
		throw new Error('artist already exists');
	}
	return user;
};

/**
Creates an artist, logs in, and returns the session cookie.
*/
export const loginAsArtist = async (): Promise<{ cookie: string; user: SessionUser }> => {
	const user = await createArtist();
	const response = await sendJson('/api/auth/login', {
		body: { password: ARTIST_PASSWORD, username: user.username },
		method: 'POST',
	});
	if (response.status !== 200) {
		throw new Error(`login failed with ${response.status}`);
	}
	return { cookie: sessionCookie(response), user };
};
