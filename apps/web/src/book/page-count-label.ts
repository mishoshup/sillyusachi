/**
Formats a page count as "1 page" or "N pages".
*/
export const pageCountLabel = (count: number): string =>
	count === 1 ? '1 page' : `${count} pages`;
