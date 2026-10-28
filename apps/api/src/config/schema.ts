import { z } from 'zod';

import { privateJwkSchema, publicJwksSchema } from '../session/keys.ts';
import { jsonString } from './json-string.ts';

const positiveInt = z.coerce.number().int().positive();

export const configSchema = z
	.object({
		ARGON2_MEMORY_KIB: positiveInt,
		ARGON2_TIME_COST: positiveInt,
		JWT_AUDIENCE: z.string().min(1),
		JWT_ISSUER: z.string().min(1),
		JWT_PRIVATE_JWK: jsonString(privateJwkSchema),
		JWT_PUBLIC_JWKS: jsonString(publicJwksSchema),
		MAX_BODY_LENGTH: positiveInt,
		MAX_JSON_BYTES: positiveInt,
		MAX_TITLE_LENGTH: positiveInt,
		MAX_UPLOAD_BYTES: positiveInt,
		PASSWORD_PEPPER: z.string().min(32),
		PUBLIC_CACHE_SECONDS: positiveInt,
		SESSION_TTL_SECONDS: positiveInt,
	})
	.refine(
		(environment) =>
			environment.JWT_PUBLIC_JWKS.some((key) => key.kid === environment.JWT_PRIVATE_JWK.kid),
		'JWT_PUBLIC_JWKS must contain the signing key kid',
	)
	.transform((environment) => ({
		content: {
			maxBodyLength: environment.MAX_BODY_LENGTH,
			maxTitleLength: environment.MAX_TITLE_LENGTH,
		},
		jwt: {
			audience: environment.JWT_AUDIENCE,
			issuer: environment.JWT_ISSUER,
			privateKey: environment.JWT_PRIVATE_JWK,
			publicKeys: environment.JWT_PUBLIC_JWKS,
			ttlSeconds: environment.SESSION_TTL_SECONDS,
		},
		maxJsonBytes: environment.MAX_JSON_BYTES,
		maxUploadBytes: environment.MAX_UPLOAD_BYTES,
		password: {
			memoryKib: environment.ARGON2_MEMORY_KIB,
			pepper: environment.PASSWORD_PEPPER,
			timeCost: environment.ARGON2_TIME_COST,
		},
		publicCacheSeconds: environment.PUBLIC_CACHE_SECONDS,
	}));

export type Config = z.infer<typeof configSchema>;
