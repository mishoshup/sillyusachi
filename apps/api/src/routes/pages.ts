import { sValidator } from '@hono/standard-validator';
import { reorderSchema } from '@sillyusachi/shared';
import { Hono } from 'hono';

import type { AppEnvironment } from '../environment.ts';

import { getConfig } from '../config/get-config.ts';
import { parsePageInput } from '../content/page-input.ts';
import { doesBookExist } from '../db/books.ts';
import { deletePage, insertPage, listPageIds, reorderPages, updatePageText } from '../db/pages.ts';
import { purgeBook } from '../http/edge-cache.ts';
import { readJson } from '../http/read-json.ts';
import { rejectInvalid } from '../http/reject-invalid.ts';
import { jsonBodyLimit } from '../middleware/json-body-limit.ts';
import { requireArtist } from '../middleware/require-artist.ts';
import { deletePhotoQuietly } from '../storage/photos.ts';

export const pageRoutes = new Hono<AppEnvironment>()
	.post('/books/:slug/pages', jsonBodyLimit, requireArtist, async (context) => {
		const slug = context.req.param('slug');
		const input = parsePageInput(getConfig(context.env).content, await readJson(context));
		if (!(await doesBookExist(context.env.DB, slug))) {
			return context.json({ error: 'book not found' }, 404);
		}
		const page = await insertPage(context.env.DB, slug, {
			body: input.body ?? null,
			imageKey: null,
			kind: 'text',
			title: input.title ?? null,
		});
		purgeBook(context, slug);
		return context.json(page, 201);
	})
	.patch('/pages/:id', jsonBodyLimit, requireArtist, async (context) => {
		const input = parsePageInput(getConfig(context.env).content, await readJson(context));
		const updated = await updatePageText(context.env.DB, context.req.param('id'), input);
		if (!updated) {
			return context.json({ error: 'not found' }, 404);
		}
		purgeBook(context, updated.bookSlug);
		return context.json(updated.page);
	})
	.delete('/pages/:id', requireArtist, async (context) => {
		const deleted = await deletePage(context.env.DB, context.req.param('id'));
		if (!deleted) {
			return context.json({ error: 'not found' }, 404);
		}
		if (deleted.imageKey !== null) {
			await deletePhotoQuietly(context.env.PHOTOS, deleted.imageKey);
		}
		purgeBook(context, deleted.bookSlug);
		return context.body(null, 204);
	})
	.put(
		'/books/:slug/order',
		jsonBodyLimit,
		requireArtist,
		sValidator('json', reorderSchema, rejectInvalid),
		async (context) => {
			const slug = context.req.param('slug');
			const { ids } = context.req.valid('json');
			const existing = new Set(await listPageIds(context.env.DB, slug));
			const unique = new Set(ids);
			if (
				unique.size !== ids.length ||
				ids.length !== existing.size ||
				ids.some((id) => !existing.has(id))
			) {
				return context.json({ error: 'ids must list every page in the book exactly once' }, 400);
			}
			await reorderPages(context.env.DB, slug, ids);
			purgeBook(context, slug);
			return context.body(null, 204);
		},
	);
