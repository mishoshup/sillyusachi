import type { Page } from './page.ts';

export interface Book {
	cover: string;
	pageCount: number;
	slug: string;
	title: string;
}

export interface BookWithPages extends Book {
	pages: Page[];
}
