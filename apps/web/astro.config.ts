import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
	adapter: cloudflare({ imageService: 'passthrough' }),
	integrations: [react()],
	output: 'server',
	security: {
		checkOrigin: true,
		csp: {
			directives: [
				"default-src 'self'",
				"img-src 'self' data: blob:",
				"font-src 'self'",
				"connect-src 'self'",
				"base-uri 'none'",
				"form-action 'self'",
				"object-src 'none'",
			],
		},
	},
	session: false,
	site: 'https://sillyusachi.com',
});
