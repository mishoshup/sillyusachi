import type { Book } from '@sillyusachi/shared';

/**
Lists every book in shelf order with its page count.
*/
export const listBooks = async (database: D1Database): Promise<Book[]> => {
	const { results } = await database
		.prepare(
			`SELECT b.slug, b.title, b.cover, COUNT(p.id) AS pageCount
			 FROM books b LEFT JOIN pages p ON p.book_slug = b.slug
			 GROUP BY b.slug ORDER BY b.position`,
		)
		.all<Book>();
	return results;
};

/**
Finds one book without its pages.
*/
export const findBook = async (
	database: D1Database,
	slug: string,
): Promise<null | Omit<Book, 'pageCount'>> =>
	database
		.prepare('SELECT slug, title, cover FROM books WHERE slug = ?')
		.bind(slug)
		.first<Omit<Book, 'pageCount'>>();

/**
Reports whether a book exists.
*/
export const doesBookExist = async (database: D1Database, slug: string): Promise<boolean> => {
	const row = await database.prepare('SELECT 1 FROM books WHERE slug = ?').bind(slug).first();
	return row !== null;
};
