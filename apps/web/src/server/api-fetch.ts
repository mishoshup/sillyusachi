import { env } from 'cloudflare:workers';

/**
Sends a GET request for an API path to the API worker over the service binding.
*/
export const apiFetch = async (path: string, origin: string): Promise<Response> =>
	env.API.fetch(new Request(new URL(path, origin)));
