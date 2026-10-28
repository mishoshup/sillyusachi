import type { Config } from './schema.ts';

import { configSchema } from './schema.ts';

const parsed = new WeakMap<Cloudflare.Env, Config>();

/**
Parses the Worker's vars and secrets into typed config, once per env object.
*/
export const getConfig = (environment: Cloudflare.Env): Config => {
	const cached = parsed.get(environment);
	if (cached) {
		return cached;
	}
	const config = configSchema.parse(environment);
	parsed.set(environment, config);
	return config;
};
