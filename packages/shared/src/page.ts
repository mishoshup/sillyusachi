export interface Page {
	body: null | string;
	id: string;
	imageKey: null | string;
	kind: PageKind;
	position: number;
	title: null | string;
}

export type PageKind = 'photo' | 'text';
