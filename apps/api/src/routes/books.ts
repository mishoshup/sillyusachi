import type { BookWithPages } from '@sillyusachi/shared';

import { Hono } from 'hono';

import type { AppEnvironment } from '../environment.ts';

import { getConfig } from '../config/get-config.ts';
import { findBook, listBooks } from '../db/books.ts';
import { listPages } from '../db/pages.ts';
import { BOOKS_TAG, bookTag, setPublicCache } from '../http/edge-cache.ts';

export const bookRoutes = new Hono<AppEnvironment>()
	.get('/', async (context) => {
		const books = await listBooks(context.env.DB);
		setPublicCache(context, getConfig(context.env).publicCacheSeconds, [BOOKS_TAG]);
		return context.json(books);
	})
	.get('/:slug', async (context) => {
		const slug = context.req.param('slug');
		const book = await findBook(context.env.DB, slug);
		if (!book) {
			return context.json({ error: 'not found' }, 404);
		}
		const pages = await listPages(context.env.DB, slug);
		setPublicCache(context, getConfig(context.env).publicCacheSeconds, [bookTag(slug)]);
		return context.json<BookWithPages>({ ...book, pageCount: pages.length, pages });
	});
