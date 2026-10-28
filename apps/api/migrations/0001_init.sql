CREATE TABLE books (
	slug TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	cover TEXT NOT NULL,
	position INTEGER NOT NULL
);

CREATE TABLE pages (
	id TEXT PRIMARY KEY,
	book_slug TEXT NOT NULL REFERENCES books (slug) ON DELETE CASCADE,
	kind TEXT NOT NULL CHECK (kind IN ('text', 'photo')),
	title TEXT,
	body TEXT,
	image_key TEXT,
	position INTEGER NOT NULL,
	created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX pages_book_position ON pages (book_slug, position);
