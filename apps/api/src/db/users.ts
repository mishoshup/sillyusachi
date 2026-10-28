import type { SessionUser } from '@sillyusachi/shared';

export interface UserRow {
	id: string;
	password_hash: string;
	session_version: number;
	username: string;
}

const USER_COLUMNS = 'id, username, password_hash, session_version';

/**
Finds a user by case-insensitive username.
*/
export const findUserByUsername = async (
	database: D1Database,
	username: string,
): Promise<null | UserRow> =>
	database
		.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE username = ?`)
		.bind(username)
		.first<UserRow>();

/**
Finds a user by id.
*/
export const findUserById = async (database: D1Database, id: string): Promise<null | UserRow> =>
	database.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`).bind(id).first<UserRow>();

/**
Creates a user, or returns null when the username is taken.
*/
export const insertUser = async (
	database: D1Database,
	username: string,
	passwordHash: string,
): Promise<null | SessionUser> =>
	database
		.prepare(
			`INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)
			 ON CONFLICT (username) DO NOTHING
			 RETURNING id, username`,
		)
		.bind(crypto.randomUUID(), username, passwordHash)
		.first<SessionUser>();

/**
Replaces a user's password hash and bumps their session version, returning the new version.
*/
export const updatePassword = async (
	database: D1Database,
	id: string,
	passwordHash: string,
): Promise<number> => {
	const row = await database
		.prepare(
			`UPDATE users
			 SET password_hash = ?2, session_version = session_version + 1, updated_at = unixepoch()
			 WHERE id = ?1
			 RETURNING session_version`,
		)
		.bind(id, passwordHash)
		.first<{ session_version: number }>();
	if (!row) {
		throw new Error('password update matched no user');
	}
	return row.session_version;
};
