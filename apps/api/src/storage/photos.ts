/**
Stores an uploaded photo under the book and returns its object key.
*/
export const storePhoto = async (
	bucket: R2Bucket,
	slug: string,
	upload: { extension: string; file: File },
): Promise<string> => {
	const key = `${slug}/${crypto.randomUUID()}.${upload.extension}`;
	await bucket.put(key, upload.file.stream(), {
		httpMetadata: { contentType: upload.file.type },
	});
	return key;
};

/**
Deletes a photo, logging instead of failing when storage errors.
*/
export const deletePhotoQuietly = async (bucket: R2Bucket, key: string): Promise<void> => {
	try {
		await bucket.delete(key);
	} catch (error) {
		console.error('photo delete failed', key, error);
	}
};
