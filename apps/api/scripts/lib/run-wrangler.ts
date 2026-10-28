import { spawnSync } from 'node:child_process';

/**
Runs a wrangler command, optionally piping input to it, and fails on a non-zero exit.
*/
export const runWrangler = (commandArguments: string[], input?: string): void => {
	const result = spawnSync('wrangler', commandArguments, {
		input,
		stdio: [input === undefined ? 'inherit' : 'pipe', 'inherit', 'inherit'],
	});
	if (result.status !== 0) {
		throw new Error(`wrangler ${commandArguments.join(' ')} failed`);
	}
};
