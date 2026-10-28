import { imageExtension } from './image-type.ts';

export type ImageUpload =
	{ error: string; status: 400 | 413 | 415 } | { extension: string; file: File };

/**
Reads the image file from an upload form and checks its type and size.
*/
export const readImageUpload = (form: FormData, maxBytes: number): ImageUpload => {
	const file = form.get('file');
	if (!(file instanceof File)) {
		return { error: 'file required', status: 400 };
	}
	const extension = imageExtension(file.type);
	if (extension === undefined) {
		return { error: 'unsupported image type', status: 415 };
	}
	if (file.size > maxBytes) {
		return { error: 'image too large', status: 413 };
	}
	return { extension, file };
};
