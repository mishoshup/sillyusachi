import { z } from 'zod';

export interface ContentLimits {
	maxBodyLength: number;
	maxTitleLength: number;
}

export type PageInput = z.infer<PageInputSchema>;

export type PageInputSchema = z.ZodObject<
	{ body: OptionalText; title: OptionalText },
	z.core.$strict
>;

type OptionalText = z.ZodOptional<z.ZodNullable<z.ZodString>>;

/**
Builds the schema for creating or editing a page's text.
*/
export const createPageInputSchema = ({
	maxBodyLength,
	maxTitleLength,
}: ContentLimits): PageInputSchema =>
	z.strictObject({
		body: z.string().trim().max(maxBodyLength).nullable().optional(),
		title: z.string().trim().max(maxTitleLength).nullable().optional(),
	});

export const reorderSchema = z.strictObject({
	ids: z.array(z.string().min(1)).min(1),
});

export type ReorderInput = z.infer<typeof reorderSchema>;
