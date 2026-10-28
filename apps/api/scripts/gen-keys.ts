import { existsSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { runWrangler } from './lib/run-wrangler.ts';
import { generatePepper, generateSigningKey } from './lib/signing-key.ts';

const DEV_VARS_PATH = '.dev.vars';

const { values: options } = parseArgs({
	options: {
		env: { type: 'string' },
		force: { default: false, type: 'boolean' },
		upload: { default: false, type: 'boolean' },
		'with-pepper': { default: false, type: 'boolean' },
	},
});

const { privateJwk, publicJwk } = await generateSigningKey();
const secrets: Record<string, string> = {
	JWT_PRIVATE_JWK: JSON.stringify(privateJwk),
	JWT_PUBLIC_JWKS: JSON.stringify([publicJwk]),
};

if (options.upload) {
	if (options['with-pepper']) {
		const pepper = generatePepper();
		secrets['PASSWORD_PEPPER'] = pepper;
		console.error(`PASSWORD_PEPPER=${pepper}`);
		console.error('Store this pepper in a password manager now. It cannot be read back later.');
	}
	const environmentFlags = options.env === undefined ? [] : ['--env', options.env];
	runWrangler(['secret', 'bulk', ...environmentFlags], JSON.stringify(secrets));
} else {
	if (existsSync(DEV_VARS_PATH) && !options.force) {
		throw new Error(`${DEV_VARS_PATH} exists; pass --force to replace it`);
	}
	secrets['PASSWORD_PEPPER'] = generatePepper();
	const lines = Object.entries(secrets).map(([name, value]) => `${name}='${value}'`);
	writeFileSync(DEV_VARS_PATH, `${lines.join('\n')}\n`, { mode: 0o600 });
	console.log(`wrote ${DEV_VARS_PATH}`);
}
