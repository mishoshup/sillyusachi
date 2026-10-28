export type Jwk = Readonly<Record<string, string | undefined>>;

export interface SigningKey {
	privateJwk: Jwk;
	publicJwk: Jwk;
}

/**
Generates an RS256 signing key pair as JWKs that share a fresh kid.
*/
export const generateSigningKey = async (): Promise<SigningKey> => {
	const pair = await crypto.subtle.generateKey(
		{
			hash: 'SHA-256',
			modulusLength: 2048,
			name: 'RSASSA-PKCS1-v1_5',
			publicExponent: new Uint8Array([1, 0, 1]),
		},
		true,
		['sign', 'verify'],
	);
	const exported = await crypto.subtle.exportKey('jwk', pair.privateKey);
	const publicJwk = {
		alg: 'RS256',
		e: exported.e,
		kid: crypto.randomUUID(),
		kty: 'RSA',
		n: exported.n,
	};
	const privateJwk = {
		...publicJwk,
		d: exported.d,
		dp: exported.dp,
		dq: exported.dq,
		p: exported.p,
		q: exported.q,
		qi: exported.qi,
	};
	return { privateJwk, publicJwk };
};

/**
Generates a random pepper encoded as base64.
*/
export const generatePepper = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return btoa(String.fromCodePoint(...bytes));
};
