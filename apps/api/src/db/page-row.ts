import type { Page } from '@sillyusachi/shared';

export const PAGE_COLUMNS = 'id, kind, title, body, image_key, position';

export interface PageRow {
	body: null | string;
	id: string;
	image_key: null | string;
	kind: Page['kind'];
	position: number;
	title: null | string;
}

/**
Maps a pages row to the API shape.
*/
export const toPage = (row: PageRow): Page => ({
	body: row.body,
	id: row.id,
	imageKey: row.image_key,
	kind: row.kind,
	position: row.position,
	title: row.title,
});
