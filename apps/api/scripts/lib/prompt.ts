import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';

/**
Asks a question on the terminal and returns the typed answer.
*/
export const promptText = async (question: string): Promise<string> => {
	const reader = createInterface({ input: stdin, output: stdout });
	try {
		return await reader.question(question);
	} finally {
		reader.close();
	}
};

/**
Asks a question on the terminal without echoing the typed answer.
*/
export const promptSecret = async (question: string): Promise<string> => {
	stdout.write(question);
	const silentOutput = new Writable({
		write: (_chunk, _encoding, callback) => {
			callback();
		},
	});
	const reader = createInterface({ input: stdin, output: silentOutput, terminal: true });
	try {
		return await reader.question('');
	} finally {
		reader.close();
		stdout.write('\n');
	}
};
