import type { Book, BookWithPages } from '@sillyusachi/shared';

import { describe, expect, it } from 'vitest';

import { loginAsArtist } from './helpers/artist.ts';
import { addTextPage } from './helpers/pages.ts';
import { send } from './helpers/request.ts';

describe('books', () => {
	it('lists the shelf with edge cache headers', async () => {
		const response = await send('/api/books');
		expect(response.status).toBe(200);
		expect(response.headers.get('cache-control')).toMatch(/s-maxage=\d+/v);
		expect(response.headers.get('cache-tag')).toBe('books');
		const books = await response.json<Book[]>();
		expect(books.map((book) => book.slug)).toStrictEqual(['artist', 'about']);
	});

	it('returns a book with its pages in order', async () => {
		const { cookie } = await loginAsArtist();
		const first = await addTextPage('artist', cookie, 'first');
		const second = await addTextPage('artist', cookie, 'second');
		const response = await send('/api/books/artist');
		expect(response.status).toBe(200);
		const book = await response.json<BookWithPages>();
		expect(book.pages.map((page) => page.id)).toStrictEqual([first.id, second.id]);
	});

	it('returns 404 for an unknown book', async () => {
		const response = await send('/api/books/missing');
		expect(response.status).toBe(404);
	});
});
