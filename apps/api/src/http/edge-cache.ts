import type { Context } from 'hono';

import { cache } from 'cloudflare:workers';

export const BOOKS_TAG = 'books';

/**
Returns the cache tag for one book.
*/
export const bookTag = (slug: string): string => `book:${slug}`;

/**
Marks a response as edge-cacheable for the given seconds under the given tags.
*/
export const setPublicCache = (
	context: Context,
	seconds: number,
	tags: readonly string[],
): void => {
	context.header(
		'Cache-Control',
		`public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds * 10}`,
	);
	context.header('Cache-Tag', tags.join(','));
};

/**
Purges the given cache tags and logs any failure.
*/
const purgeTags = async (tags: string[]): Promise<void> => {
	try {
		const result = await cache.purge({ tags });
		if (!result.success) {
			console.error('cache purge failed', result.errors);
		}
	} catch (error) {
		console.error('cache purge unavailable', error);
	}
};

/**
Purges the shelf and one book from the edge cache after a write.
*/
export const purgeBook = (context: Context, slug: string): void => {
	context.executionCtx.waitUntil(purgeTags([BOOKS_TAG, bookTag(slug)]));
};
