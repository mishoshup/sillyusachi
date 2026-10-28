import type { Page, PageInput } from '@sillyusachi/shared';

import type { PageRow } from './page-row.ts';

import { PAGE_COLUMNS, toPage } from './page-row.ts';

export interface NewPage {
	body: null | string;
	imageKey: null | string;
	kind: Page['kind'];
	title: null | string;
}

/**
Lists a book's pages in reading order.
*/
export const listPages = async (database: D1Database, slug: string): Promise<Page[]> => {
	const { results } = await database
		.prepare(`SELECT ${PAGE_COLUMNS} FROM pages WHERE book_slug = ? ORDER BY position`)
		.bind(slug)
		.all<PageRow>();
	return results.map((row) => toPage(row));
};

/**
Appends a page to the end of a book.
*/
export const insertPage = async (
	database: D1Database,
	slug: string,
	page: NewPage,
): Promise<Page> => {
	const row = await database
		.prepare(
			`INSERT INTO pages (id, book_slug, kind, title, body, image_key, position)
			 VALUES (?1, ?2, ?3, ?4, ?5, ?6,
			   (SELECT COALESCE(MAX(position), -1) + 1 FROM pages WHERE book_slug = ?2))
			 RETURNING ${PAGE_COLUMNS}`,
		)
		.bind(crypto.randomUUID(), slug, page.kind, page.title, page.body, page.imageKey)
		.first<PageRow>();
	if (!row) {
		throw new Error('page insert returned no row');
	}
	return toPage(row);
};

/**
Updates the provided text fields of a page and returns it with its book slug.
*/
export const updatePageText = async (
	database: D1Database,
	id: string,
	input: PageInput,
): Promise<null | { bookSlug: string; page: Page }> => {
	const row = await database
		.prepare(
			`UPDATE pages SET
			   title = CASE WHEN ?2 THEN ?3 ELSE title END,
			   body = CASE WHEN ?4 THEN ?5 ELSE body END
			 WHERE id = ?1
			 RETURNING ${PAGE_COLUMNS}, book_slug`,
		)
		.bind(
			id,
			input.title === undefined ? 0 : 1,
			input.title ?? null,
			input.body === undefined ? 0 : 1,
			input.body ?? null,
		)
		.first<PageRow & { book_slug: string }>();
	return row ? { bookSlug: row.book_slug, page: toPage(row) } : null;
};

/**
Deletes a page and returns its book slug and stored image key.
*/
export const deletePage = async (
	database: D1Database,
	id: string,
): Promise<null | { bookSlug: string; imageKey: null | string }> => {
	const row = await database
		.prepare('DELETE FROM pages WHERE id = ? RETURNING book_slug, image_key')
		.bind(id)
		.first<{ book_slug: string; image_key: null | string }>();
	return row ? { bookSlug: row.book_slug, imageKey: row.image_key } : null;
};

/**
Lists the ids of a book's pages.
*/
export const listPageIds = async (database: D1Database, slug: string): Promise<string[]> => {
	const { results } = await database
		.prepare('SELECT id FROM pages WHERE book_slug = ?')
		.bind(slug)
		.all<{ id: string }>();
	return results.map((row) => row.id);
};

/**
Rewrites page positions to match the given id order in one batch.
*/
export const reorderPages = async (
	database: D1Database,
	slug: string,
	ids: readonly string[],
): Promise<void> => {
	const statement = database.prepare(
		'UPDATE pages SET position = ? WHERE id = ? AND book_slug = ?',
	);
	await database.batch(ids.map((id, position) => statement.bind(position, id, slug)));
};
