import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const ORIGIN = process.env.SITE_URL ?? 'https://clairlia.com';
const failures = [];
const fail = (message) => failures.push(message);

function walk(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

function pathFromFile(file) {
	const value = relative(DIST, file).replaceAll('\\', '/');
	return value === 'index.html' ? '/' : `/${value.replace(/index\.html$/, '')}`;
}

if (!existsSync(DIST)) {
	console.error('dist/ is missing; run the production build first.');
	process.exit(1);
}

const pages = new Map(walk(DIST).filter((file) => file.endsWith('.html')).map((file) => [pathFromFile(file), readFileSync(file, 'utf8')]));
const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
let pairs = 0;

for (const [route, html] of pages) {
	if (!route.startsWith('/en/') || route.endsWith('/404.html')) continue;
	const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
	const fr = html.match(/<link rel="alternate" hreflang="fr" href="([^"]+)"/i)?.[1];
	const en = html.match(/<link rel="alternate" hreflang="en" href="([^"]+)"/i)?.[1];
	const xDefault = html.match(/<link rel="alternate" hreflang="x-default" href="([^"]+)"/i)?.[1];
	const expected = `${ORIGIN}${route}`;
	if (!html.includes('<html lang="en">')) fail(`${route}: missing lang=en`);
	if (canonical !== expected) fail(`${route}: canonical is not self-referential`);
	if (!fr || !en || !xDefault || xDefault !== fr || en !== expected) fail(`${route}: invalid hreflang set`);
	const frRoute = fr?.replace(ORIGIN, '');
	const french = frRoute ? pages.get(frRoute) : undefined;
	if (!french || !french.includes(`hreflang="en" href="${expected}"`)) fail(`${route}: hreflang is not reciprocal`);
	if (!sitemap.includes(`<loc>${expected}</loc>`)) fail(`${route}: absent from sitemap`);
	const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
	for (const href of links.filter((href) => href.startsWith('/en/'))) {
		if (!pages.has(href.endsWith('/') ? href : `${href}/`)) fail(`${route}: broken English internal link ${href}`);
	}
	pairs++;
}

if (pairs !== 25) fail(`expected 25 English route pairs, found ${pairs}`);
if (failures.length) {
	console.error(`❌ i18n audit failed:\n${failures.map((item) => `- ${item}`).join('\n')}`);
	process.exit(1);
}

console.log(`✅ ${pairs} reciprocal FR/EN route pairs`);
console.log('✅ English canonicals, hreflang, sitemap and internal links');
