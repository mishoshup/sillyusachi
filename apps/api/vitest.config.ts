import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

import { generatePepper, generateSigningKey } from './scripts/lib/signing-key.ts';

export default defineConfig({
	plugins: [
		cloudflareTest(async () => {
			const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'));
			const { privateJwk, publicJwk } = await generateSigningKey();
			return {
				miniflare: {
					bindings: {
						ARGON2_MEMORY_KIB: 1024,
						ARGON2_TIME_COST: 1,
						JWT_PRIVATE_JWK: JSON.stringify(privateJwk),
						JWT_PUBLIC_JWKS: JSON.stringify([publicJwk]),
						PASSWORD_PEPPER: generatePepper(),
						TEST_MIGRATIONS: migrations,
					},
				},
				wrangler: { configPath: './wrangler.jsonc' },
			};
		}),
	],
	test: {
		setupFiles: ['./test/apply-migrations.ts'],
	},
});
