import { describe, expect, it } from 'vitest';

import { ARTIST_PASSWORD, createArtist, loginAsArtist } from './helpers/artist.ts';
import { send, sendJson, sessionCookie } from './helpers/request.ts';

/**
Sends a login request for the given credentials.
*/
const login = async (username: string, password: string): Promise<Response> =>
	sendJson('/api/auth/login', { body: { password, username }, method: 'POST' });

/**
Returns the status of a /me request made with the given cookie.
*/
const meStatus = async (cookie?: string): Promise<number> => {
	const response = await send('/api/auth/me', cookie === undefined ? {} : { headers: { cookie } });
	return response.status;
};

describe('auth', () => {
	it('logs in with a host-prefixed, http-only session cookie', async () => {
		const user = await createArtist();
		const response = await login(user.username.toUpperCase(), ARTIST_PASSWORD);
		expect(response.status).toBe(200);
		expect(await response.json()).toStrictEqual(user);
		const header = response.headers.get('set-cookie') ?? '';
		expect(header).toMatch(/^__Host-session=/v);
		expect(header).toMatch(/httponly/iv);
		expect(header).toMatch(/secure/iv);
	});

	it('rejects a wrong password and an unknown user with the same error', async () => {
		const user = await createArtist();
		const wrongPassword = await login(user.username, 'not the password');
		const unknownUser = await login('nobody-here', 'not the password');
		expect(wrongPassword.status).toBe(401);
		expect(unknownUser.status).toBe(401);
		expect(await wrongPassword.json()).toStrictEqual(await unknownUser.json());
	});

	it('rate limits repeated login attempts', async () => {
		const user = await createArtist();
		const responses = await Promise.all(
			Array.from({ length: 6 }, async () => login(user.username, 'not the password')),
		);
		expect(responses.map((response) => response.status)).toContain(429);
	});

	it('returns the current user only with a valid session', async () => {
		const { cookie, user } = await loginAsArtist();
		const authorized = await send('/api/auth/me', { headers: { cookie } });
		expect(authorized.status).toBe(200);
		expect(await authorized.json()).toStrictEqual(user);
		expect(await meStatus()).toBe(401);
		expect(await meStatus('__Host-session=forged')).toBe(401);
	});

	it('revokes old sessions when the password changes', async () => {
		const { cookie } = await loginAsArtist();
		const response = await sendJson('/api/auth/password', {
			body: { currentPassword: ARTIST_PASSWORD, newPassword: 'a brand new long password' },
			cookie,
			method: 'PUT',
		});
		expect(response.status).toBe(204);
		expect(await meStatus(cookie)).toBe(401);
		expect(await meStatus(sessionCookie(response))).toBe(200);
	});

	it('refuses a password change with the wrong current password', async () => {
		const { cookie } = await loginAsArtist();
		const response = await sendJson('/api/auth/password', {
			body: { currentPassword: 'wrong password', newPassword: 'a brand new long password' },
			cookie,
			method: 'PUT',
		});
		expect(response.status).toBe(403);
	});

	it('clears the session cookie on logout', async () => {
		const response = await send('/api/auth/logout', { method: 'POST' });
		expect(response.status).toBe(204);
		expect(response.headers.get('set-cookie')).toMatch(/max-age=0/iv);
	});
});
