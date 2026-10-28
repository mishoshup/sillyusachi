import { SITE_NAME } from './site.ts';

const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	alternateName: 'Usachi',
	name: SITE_NAME,
	sameAs: [
		'https://www.tiktok.com/@sillyusachi',
		'https://kirke.social/sillyusachi',
		'https://open.spotify.com/user/31y7ew3vvqq7a7rcm4ugw5hjn2ou',
	],
	url: 'https://sillyusachi.com',
};

/**
Serializes the artist's schema.org Person data for a JSON-LD script tag.
*/
export const personJsonLd = (): string => JSON.stringify(personSchema).replaceAll('<', '<');
