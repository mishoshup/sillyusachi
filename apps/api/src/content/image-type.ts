const EXTENSIONS: Readonly<Record<string, string>> = {
	'image/avif': 'avif',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
};

/**
Returns the file extension for an allowed image MIME type, or undefined.
*/
export const imageExtension = (mimeType: string): string | undefined => EXTENSIONS[mimeType];
