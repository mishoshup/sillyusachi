import type { BookWithPages, Page } from '@sillyusachi/shared';

import { send, sendJson } from './request.ts';

/**
Adds a titled text page to a book as the artist and returns it.
*/
export const addTextPage = async (slug: string, cookie: string, title: string): Promise<Page> => {
	const response = await sendJson(`/api/books/${slug}/pages`, {
		body: { title },
		cookie,
		method: 'POST',
	});
	return response.json<Page>();
};

/**
Reads the page ids of a book in display order.
*/
export const pageIds = async (slug: string): Promise<string[]> => {
	const response = await send(`/api/books/${slug}`);
	const book = await response.json<BookWithPages>();
	return book.pages.map((page) => page.id);
};
