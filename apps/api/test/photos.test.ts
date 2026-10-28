import type { Page } from '@sillyusachi/shared';

import { photoUrl } from '@sillyusachi/shared';
import { describe, expect, it } from 'vitest';

import { loginAsArtist } from './helpers/artist.ts';
import { send } from './helpers/request.ts';

const PNG_BYTES = Uint8Array.from(
	atob(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
	),
	(character) => character.codePointAt(0) ?? 0,
);

/**
Uploads a file as a photo page using a multipart form.
*/
const upload = async (cookie: string, file: File): Promise<Response> => {
	const form = new FormData();
	form.set('file', file);
	form.set('title', 'a photo');
	return send('/api/books/artist/photos', {
		body: form,
		headers: { cookie },
		method: 'POST',
	});
};

describe('photos', () => {
	it('uploads a photo page and serves the image', async () => {
		const { cookie } = await loginAsArtist();
		const response = await upload(cookie, new File([PNG_BYTES], 'dot.png', { type: 'image/png' }));
		expect(response.status).toBe(201);
		const page = await response.json<Page>();
		expect(page.kind).toBe('photo');
		expect(page.imageKey).toBeTypeOf('string');
		const imageUrl = photoUrl(page.imageKey ?? '');

		const image = await send(imageUrl);
		expect(image.status).toBe(200);
		expect(image.headers.get('content-type')).toBe('image/png');
		expect(new Uint8Array(await image.arrayBuffer())).toStrictEqual(PNG_BYTES);

		const cached = await send(imageUrl, {
			headers: { 'if-none-match': image.headers.get('etag') ?? '' },
		});
		expect(cached.status).toBe(304);
	});

	it('rejects files that are not images', async () => {
		const { cookie } = await loginAsArtist();
		const response = await upload(cookie, new File(['hello'], 'note.txt', { type: 'text/plain' }));
		expect(response.status).toBe(415);
	});

	it('rejects cross-site uploads', async () => {
		const { cookie } = await loginAsArtist();
		const form = new FormData();
		form.set('file', new File([PNG_BYTES], 'dot.png', { type: 'image/png' }));
		const response = await send('/api/books/artist/photos', {
			body: form,
			headers: { cookie, origin: 'https://evil.test' },
			method: 'POST',
		});
		expect(response.status).toBe(403);
	});
});
