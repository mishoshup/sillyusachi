import { z } from 'zod';

const username = z
	.string()
	.trim()
	.min(3)
	.max(32)
	.regex(/^[\w\-.]+$/v);

const newPassword = z.string().min(12).max(256);

export const loginSchema = z.strictObject({
	password: z.string().min(1).max(256),
	username,
});

export const changePasswordSchema = z.strictObject({
	currentPassword: z.string().min(1).max(256),
	newPassword,
});

export const newUserSchema = z.strictObject({
	password: newPassword,
	username,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateUserInput = z.infer<typeof newUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
