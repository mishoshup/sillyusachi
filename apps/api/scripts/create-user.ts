import initializeArgon2 from '@phi-ag/argon2/node';
import { newUserSchema } from '@sillyusachi/shared';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { hashPassword } from '../src/auth/password.ts';
import { promptSecret, promptText } from './lib/prompt.ts';
import { runWrangler } from './lib/run-wrangler.ts';
import { sqlLiteral } from './lib/sql-literal.ts';
import { readWorkerConfig } from './lib/worker-config.ts';

const { values: options } = parseArgs({
	options: {
		env: { type: 'string' },
		remote: { default: false, type: 'boolean' },
	},
});

/**
Reads the local pepper from .dev.vars.
*/
const readLocalPepper = (): string => {
	const match = /^PASSWORD_PEPPER='?(?<pepper>[^\n']+)'?$/mv.exec(
		readFileSync('.dev.vars', 'utf8'),
	);
	const pepper = match?.groups?.['pepper'];
	if (pepper === undefined) {
		throw new Error('.dev.vars has no PASSWORD_PEPPER; run gen-keys first');
	}
	return pepper;
};

const config = readWorkerConfig(options.env);
const pepper = options.remote ? await promptSecret('PASSWORD_PEPPER: ') : readLocalPepper();
const username = await promptText('username: ');
const password = await promptSecret('password: ');
if ((await promptSecret('confirm password: ')) !== password) {
	throw new Error('passwords differ');
}

const input = newUserSchema.parse({ password, username });
const passwordHash = await hashPassword(
	await initializeArgon2(),
	{ memoryKib: config.memoryKib, pepper, timeCost: config.timeCost },
	input.password,
);

const statement = `INSERT INTO users (id, username, password_hash) VALUES (${[
	crypto.randomUUID(),
	input.username,
	passwordHash,
]
	.map((value) => sqlLiteral(value))
	.join(', ')});`;

runWrangler([
	'd1',
	'execute',
	config.databaseName,
	options.remote ? '--remote' : '--local',
	...(options.env === undefined ? [] : ['--env', options.env]),
	'--command',
	statement,
]);
console.log(`created ${input.username}`);
