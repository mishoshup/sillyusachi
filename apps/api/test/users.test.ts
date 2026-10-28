import { describe, expect, it } from 'vitest';

import { ARTIST_PASSWORD, loginAsArtist } from './helpers/artist.ts';
import { sendJson } from './helpers/request.ts';

describe('users', () => {
	it('requires a session to create a user', async () => {
		const response = await sendJson('/api/users', {
			body: { password: ARTIST_PASSWORD, username: 'intruder' },
			method: 'POST',
		});
		expect(response.status).toBe(401);
	});

	it('creates a user once and rejects a duplicate username', async () => {
		const { cookie } = await loginAsArtist();
		const body = { password: ARTIST_PASSWORD, username: 'second-artist' };
		const created = await sendJson('/api/users', { body, cookie, method: 'POST' });
		expect(created.status).toBe(201);
		const duplicate = await sendJson('/api/users', {
			body: { ...body, username: 'SECOND-ARTIST' },
			cookie,
			method: 'POST',
		});
		expect(duplicate.status).toBe(409);
	});

	it('rejects a short password', async () => {
		const { cookie } = await loginAsArtist();
		const response = await sendJson('/api/users', {
			body: { password: 'short', username: 'short-password' },
			cookie,
			method: 'POST',
		});
		expect(response.status).toBe(400);
	});
});
