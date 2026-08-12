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

			seoTitle: z
				.string()
				.min(10, 'Le title SEO est trop court.')
				.max(70, 'Le title SEO dépasse 70 caractères.')
				.optional(),

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

			editorialType: z
				.enum(['avis'])
				.optional(),

			tags: z.array(z.string()).default([]),

			heroImage: z.optional(image()),

			heroAlt: z.string().min(10).max(180).optional(),

			draft: z.boolean().default(false),

			affiliate: z.boolean().default(false),

			adultContent: z.boolean().default(false),

			noindex: z.boolean().default(false),

			verdict: z.string().max(600).optional(),

			pros: z.array(z.string()).max(10).default([]),

			cons: z.array(z.string()).max(10).default([]),

			faq: z.array(
				z.object({
					question: z.string().min(5),
					answer: z.string().min(10),
				}),
			).max(12).default([]),

			sources: z.array(
				z.object({
					name: z.string(),
					url: z.url(),
				}),
			).max(20).default([]),

			sourcesTitle: z.string().min(5).max(80).optional(),


			canonical: z.url().optional(),
		}),
});

export const collections = { blog };
