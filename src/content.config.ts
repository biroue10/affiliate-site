import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
	}),

	schema: ({ image }) =>
		z.object({
			title: z
				.string()
				.min(10, 'Le titre est trop court.')
				.max(70, 'Le titre dépasse 70 caractères.'),

			description: z
				.string()
				.min(50, 'La meta description est trop courte.')
				.max(170, 'La meta description dépasse 170 caractères.'),

			pubDate: z.coerce.date(),

			updatedDate: z.coerce.date().optional(),

			author: z.string().default('Équipe éditoriale'),

			category: z
				.enum([
					'avis',
					'comparatifs',
					'guides',
					'rencontres',
					'ai',
				])
				.default('guides'),

			tags: z.array(z.string()).default([]),

			heroImage: z.optional(image()),

			draft: z.boolean().default(false),

			affiliate: z.boolean().default(false),

			adultContent: z.boolean().default(false),

			noindex: z.boolean().default(false),

			canonical: z.url().optional(),
		}),
});

export const collections = { blog };
