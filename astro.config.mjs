// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { getAllNoindexPaths } from './scripts/get-noindex-paths.mjs';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL ?? 'https://example.invalid',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const noindexPaths = new Set(getAllNoindexPaths());
				return !noindexPaths.has(new URL(page).pathname);
			},
		}),
	],
});
