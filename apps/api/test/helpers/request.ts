import { exports } from 'cloudflare:workers';

export const ORIGIN = 'https://sillyusachi.test';

export interface JsonRequest {
	body: unknown;
	cookie?: string;
	method: string;
}

/**
Sends a request to the API worker with a same-origin Origin header unless one is given.
*/
export const send = async (path: string, options: RequestInit = {}): Promise<Response> => {
	const headers = new Headers(options.headers);
	if (!headers.has('origin')) {
		headers.set('origin', ORIGIN);
	}
	return exports.default.fetch(new Request(`${ORIGIN}${path}`, { ...options, headers }));
};

/**
Sends a JSON request to the API worker, optionally with a session cookie.
*/
export const sendJson = async (
	path: string,
	{ body, cookie, method }: JsonRequest,
): Promise<Response> =>
	send(path, {
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json', ...(cookie !== undefined && { cookie }) },
		method,
	});

/**
Extracts the cookie pair from a response's Set-Cookie header.
*/
export const sessionCookie = (response: Response): string => {
	const header = response.headers.get('set-cookie');
	if (header === null) {
		throw new Error('response set no cookie');
	}
	const pair = header.split(';', 1)[0];
	if (pair === undefined) {
		throw new Error('malformed set-cookie header');
	}
	return pair;
};
