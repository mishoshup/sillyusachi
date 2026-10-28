import type { SessionUser } from '@sillyusachi/shared';

export interface AppEnvironment {
	Bindings: Cloudflare.Env;
	Variables: { user: SessionUser };
}
