// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

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
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
