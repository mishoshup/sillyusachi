import type { Page } from '@sillyusachi/shared';

import { describe, expect, it } from 'vitest';

import { loginAsArtist } from './helpers/artist.ts';
import { addTextPage, pageIds } from './helpers/pages.ts';
import { send, sendJson } from './helpers/request.ts';

describe('pages', () => {
	it('rejects writes without a session', async () => {
		const response = await sendJson('/api/books/artist/pages', {
			body: { title: 'nope' },
			method: 'POST',
		});
		expect(response.status).toBe(401);
	});

	it('adds a text page at the end of a book', async () => {
		const { cookie } = await loginAsArtist();
		const response = await sendJson('/api/books/about/pages', {
			body: { body: 'hello', title: 'new page' },
			cookie,
			method: 'POST',
		});
		expect(response.status).toBe(201);
		const page = await response.json<Page>();
		expect(page).toMatchObject({ body: 'hello', kind: 'text', title: 'new page' });
		const ids = await pageIds('about');
		expect(ids.at(-1)).toBe(page.id);
	});

	it('rejects unknown fields and oversized titles', async () => {
		const { cookie } = await loginAsArtist();
		const unknownField = await sendJson('/api/books/about/pages', {
			body: { colour: 'red' },
			cookie,
			method: 'POST',
		});
		const longTitle = await sendJson('/api/books/about/pages', {
			body: { title: 'x'.repeat(1000) },
			cookie,
			method: 'POST',
		});
		expect(unknownField.status).toBe(400);
		expect(longTitle.status).toBe(400);
	});

	it('edits a page and deletes it', async () => {
		const { cookie } = await loginAsArtist();
		const { id } = await addTextPage('about', cookie, 'draft');
		const edited = await sendJson(`/api/pages/${id}`, {
			body: { title: 'edited' },
			cookie,
			method: 'PATCH',
		});
		expect(edited.status).toBe(200);
		expect(await edited.json<Page>()).toMatchObject({ title: 'edited' });
		const deleted = await send(`/api/pages/${id}`, {
			headers: { cookie },
			method: 'DELETE',
		});
		expect(deleted.status).toBe(204);
		expect(await pageIds('about')).not.toContain(id);
	});

	it('reorders pages only when every id is listed once', async () => {
		const { cookie } = await loginAsArtist();
		await addTextPage('artist', cookie, 'one');
		await addTextPage('artist', cookie, 'two');
		await addTextPage('artist', cookie, 'three');
		const original = await pageIds('artist');
		const reversed = original.toReversed();
		const partial = await sendJson('/api/books/artist/order', {
			body: { ids: reversed.slice(1) },
			cookie,
			method: 'PUT',
		});
		expect(partial.status).toBe(400);
		const full = await sendJson('/api/books/artist/order', {
			body: { ids: reversed },
			cookie,
			method: 'PUT',
		});
		expect(full.status).toBe(204);
		expect(await pageIds('artist')).toStrictEqual(reversed);
	});
});
