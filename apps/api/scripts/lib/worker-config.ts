import { unstable_readConfig } from 'wrangler';
import { z } from 'zod';

const d1DatabaseSchema = z.object({ binding: z.string(), database_name: z.string() });

const workerConfigSchema = z
	.object({
		d1_databases: z.array(d1DatabaseSchema),
		vars: z.object({
			ARGON2_MEMORY_KIB: z.number().int().positive(),
			ARGON2_TIME_COST: z.number().int().positive(),
		}),
	})
	.transform((config, context) => {
		const database = config.d1_databases.find((entry) => entry.binding === 'DB');
		if (!database) {
			context.issues.push({ code: 'custom', input: config, message: 'no DB binding' });
			return z.NEVER;
		}
		return {
			databaseName: database.database_name,
			memoryKib: config.vars.ARGON2_MEMORY_KIB,
			timeCost: config.vars.ARGON2_TIME_COST,
		};
	});

/**
Reads the password hashing vars and D1 database name for a wrangler environment.
*/
export const readWorkerConfig = (
	environment: string | undefined,
): z.infer<typeof workerConfigSchema> =>
	workerConfigSchema.parse(unstable_readConfig({ config: 'wrangler.jsonc', env: environment }));
