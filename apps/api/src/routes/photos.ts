import { Hono } from 'hono';

import type { AppEnvironment } from '../environment.ts';

import { getConfig } from '../config/get-config.ts';
import { readImageUpload } from '../content/image-upload.ts';
import { parsePageInput } from '../content/page-input.ts';
import { doesBookExist } from '../db/books.ts';
import { insertPage } from '../db/pages.ts';
import { purgeBook } from '../http/edge-cache.ts';
import { requireArtist } from '../middleware/require-artist.ts';
import { deletePhotoQuietly, storePhoto } from '../storage/photos.ts';

/**
Returns a form field as a string, or undefined when absent.
*/
const textField = (form: FormData, name: string): string | undefined => {
	const value = form.get(name);
	return typeof value === 'string' ? value : undefined;
};

export const photoRoutes = new Hono<AppEnvironment>()
	.get('/photos/:key{.+}', async (context) => {
		const object = await context.env.PHOTOS.get(context.req.param('key'), {
			onlyIf: context.req.raw.headers,
			range: context.req.raw.headers,
		});
		if (!object) {
			return context.json({ error: 'not found' }, 404);
		}
		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('ETag', object.httpEtag);
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
		return 'body' in object
			? new Response(object.body, { headers })
			: new Response(null, { headers, status: 304 });
	})
	.post('/api/books/:slug/photos', requireArtist, async (context) => {
		const slug = context.req.param('slug');
		const config = getConfig(context.env);
		const declared = Number(context.req.header('content-length') ?? 0);
		if (declared > config.maxUploadBytes * 2) {
			return context.json({ error: 'image too large' }, 413);
		}
		if (!(await doesBookExist(context.env.DB, slug))) {
			return context.json({ error: 'book not found' }, 404);
		}

		const form = await context.req.formData();
		const upload = readImageUpload(form, config.maxUploadBytes);
		if ('error' in upload) {
			return context.json({ error: upload.error }, upload.status);
		}
		const input = parsePageInput(config.content, {
			body: textField(form, 'body'),
			title: textField(form, 'title'),
		});

		const key = await storePhoto(context.env.PHOTOS, slug, upload);
		try {
			const page = await insertPage(context.env.DB, slug, {
				body: input.body ?? null,
				imageKey: key,
				kind: 'photo',
				title: input.title ?? null,
			});
			purgeBook(context, slug);
			return context.json(page, 201);
		} catch (error) {
			await deletePhotoQuietly(context.env.PHOTOS, key);
			throw error;
		}
	});
