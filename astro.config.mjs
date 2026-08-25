// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import {
	getAllNoindexPaths,
	getContentLastModified,
} from './scripts/get-noindex-paths.mjs';
import { getAlternatePath } from './src/lib/i18n';

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
			serialize: (item) => {
				const pathname = new URL(item.url).pathname;
				const lastmod = getContentLastModified(
					pathname,
				);
				const fr = getAlternatePath(pathname, 'fr');
				const en = getAlternatePath(pathname, 'en');

				return {
					...item,
					lastmod: lastmod?.toISOString(),
					...(fr && en
						? {
							links: [
								{ lang: 'fr', url: new URL(fr, item.url).href },
								{ lang: 'en', url: new URL(en, item.url).href },
								{ lang: 'x-default', url: new URL(fr, item.url).href },
							],
						}
						: {}),
				};
			},
		}),
	],
});
