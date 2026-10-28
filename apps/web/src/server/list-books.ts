import type { Book } from '@sillyusachi/shared';

import { apiFetch } from './api-fetch.ts';

/**
Loads the bookshelf from the API worker.
*/
export const listBooks = async (origin: string): Promise<Book[]> => {
	const response = await apiFetch('/api/books', origin);
	if (!response.ok) {
		throw new Error(`books request failed with ${response.status}`);
	}
	return response.json<Book[]>();
};
