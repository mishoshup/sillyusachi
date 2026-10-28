import type { Context } from 'hono';

import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

const NAME = 'session';

/**
Reads the session token from the __Host- cookie.
*/
export const readSessionCookie = (context: Context): string | undefined =>
	getCookie(context, NAME, 'host');

/**
Writes the session token as a __Host- cookie that lives as long as the token.
*/
export const writeSessionCookie = (context: Context, token: string, maxAge: number): void => {
	setCookie(context, NAME, token, {
		httpOnly: true,
		maxAge,
		path: '/',
		prefix: 'host',
		sameSite: 'Lax',
		secure: true,
	});
};

/**
Clears the session cookie.
*/
export const clearSessionCookie = (context: Context): void => {
	deleteCookie(context, NAME, { path: '/', prefix: 'host', secure: true });
};
