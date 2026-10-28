import { HTTPException } from 'hono/http-exception';

export interface InvalidRequestBody {
	error: string;
	issues: { message: string; path: string[] }[];
}

export interface Issue {
	readonly message: string;
	readonly path?: readonly (PropertyKey | { readonly key: PropertyKey })[] | undefined;
}

/**
Builds the 400 response body for failed validation.
*/
export const invalidRequestBody = (issues: readonly Issue[]): InvalidRequestBody => ({
	error: 'invalid request',
	issues: issues.map(({ message, path }) => ({
		message,
		path: (path ?? []).map((part) => String(typeof part === 'object' ? part.key : part)),
	})),
});

/**
Builds an HTTPException that answers 400 with the validation issues.
*/
export const invalidRequest = (issues: readonly Issue[]): HTTPException =>
	new HTTPException(400, { res: Response.json(invalidRequestBody(issues), { status: 400 }) });
