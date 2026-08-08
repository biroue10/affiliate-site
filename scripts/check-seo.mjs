import {
	existsSync,
	readdirSync,
	readFileSync,
} from 'node:fs';

import {
	join,
	relative,
	sep,
} from 'node:path';

const DIST_DIR = 'dist';

const SITE_URL =
	process.env.SITE_URL ??
	'https://example.invalid';

const expectedSite = new URL(SITE_URL);

const productionBuild =
	!expectedSite.hostname.endsWith('.invalid');

let failures = [];

function fail(message) {
	failures.push(message);
	console.error(`❌ ${message}`);
}

function walk(directory) {
	if (!existsSync(directory)) {
		return [];
	}

	const result = [];

	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);

		if (entry.isDirectory()) {
			result.push(...walk(path));
		} else {
			result.push(path);
		}
	}

	return result;
}

function routeFromFile(file) {
	const rel = relative(DIST_DIR, file)
		.split(sep)
		.join('/');

	if (rel === 'index.html') {
		return '/';
	}

	if (rel === '404.html') {
		return '/404.html';
	}

	if (rel.endsWith('/index.html')) {
		return `/${rel.slice(0, -'index.html'.length)}`;
	}

	return `/${rel}`;
}

function resolveInternalTarget(pathname) {
	const cleanPath = decodeURIComponent(pathname);

	if (cleanPath === '/') {
		return existsSync(join(DIST_DIR, 'index.html'));
	}

	const relativePath = cleanPath.replace(/^\/+/, '');

	const candidates = [
		join(DIST_DIR, relativePath),
		join(DIST_DIR, relativePath, 'index.html'),
		join(DIST_DIR, `${relativePath}.html`),
	];

	return candidates.some((candidate) =>
		existsSync(candidate),
	);
}

function getJsonLd(html, route) {
	const schemas = [];

	const regex =
		/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

	for (const match of html.matchAll(regex)) {
		try {
			const parsed = JSON.parse(match[1].trim());

			if (Array.isArray(parsed)) {
				schemas.push(...parsed);
			} else {
				schemas.push(parsed);
			}
		} catch (error) {
			fail(
				`${route}: JSON-LD invalide (${error.message})`,
			);
		}
	}

	return schemas;
}

function hasSchemaType(schemas, type) {
	return schemas.some((schema) => {
		const schemaType = schema?.['@type'];

		return Array.isArray(schemaType)
			? schemaType.includes(type)
			: schemaType === type;
	});
}

if (!existsSync(DIST_DIR)) {
	console.error(
		'❌ dist/ absent. Exécute npm run build avant cet audit.',
	);

	process.exit(1);
}

const htmlFiles = walk(DIST_DIR)
	.filter((file) => file.endsWith('.html'));

const pageData = [];

console.log(`SEO audit: ${htmlFiles.length} page(s)\n`);

for (const file of htmlFiles) {
	const html = readFileSync(file, 'utf8');
	const route = routeFromFile(file);

	/*
	 * TITLE
	 */
	const titleMatches = [
		...html.matchAll(/<title>([\s\S]*?)<\/title>/gi),
	];

	if (titleMatches.length !== 1) {
		fail(
			`${route}: ${titleMatches.length} balise(s) <title> trouvée(s)`,
		);
	}

	/*
	 * META DESCRIPTION
	 */
	const descriptions = [
		...html.matchAll(
			/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi,
		),
	];

	if (descriptions.length !== 1) {
		fail(
			`${route}: meta description absente ou dupliquée`,
		);
	}

	/*
	 * CANONICAL
	 */
	const canonicals = [
		...html.matchAll(
			/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
		),
	];

	if (canonicals.length !== 1) {
		fail(
			`${route}: canonical absente ou dupliquée`,
		);
	}

	let canonical = null;

	if (canonicals.length === 1) {
		canonical = canonicals[0][1];

		try {
			const canonicalURL = new URL(canonical);

			if (
				canonicalURL.origin !==
				expectedSite.origin
			) {
				fail(
					`${route}: canonical sur ${canonicalURL.origin} au lieu de ${expectedSite.origin}`,
				);
			}
		} catch {
			fail(
				`${route}: canonical invalide (${canonical})`,
			);
		}
	}

	/*
	 * ROBOTS
	 */
	const robotsMatch = html.match(
		/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i,
	);

	if (!robotsMatch) {
		fail(`${route}: meta robots absente`);
	}

	const robots =
		robotsMatch?.[1] ?? '';

	const noindex =
		robots.toLowerCase().includes('noindex');

	/*
	 * H1
	 */
	const h1Count = (
		html.match(/<h1\b/gi) ?? []
	).length;

	if (h1Count !== 1) {
		fail(
			`${route}: ${h1Count} H1 trouvé(s), exactement 1 attendu`,
		);
	}

	/*
	 * HEADING HIERARCHY
	 */
	const headings = [
		...html.matchAll(/<h([1-6])\b[^>]*>/gi),
	].map((match) => Number(match[1]));

	if (headings.length > 0) {
		if (headings[0] !== 1) {
			fail(
				`${route}: le premier heading est H${headings[0]} et non H1`,
			);
		}

		for (let i = 1; i < headings.length; i++) {
			if (
				headings[i] >
				headings[i - 1] + 1
			) {
				fail(
					`${route}: saut de H${headings[i - 1]} vers H${headings[i]}`,
				);
			}
		}
	}

	/*
	 * JSON-LD
	 */
	const schemas =
		getJsonLd(html, route);

	const isArticle =
		/<meta\b[^>]*property=["']og:type["'][^>]*content=["']article["']/i.test(
			html,
		);

	if (route === '/') {
		if (!hasSchemaType(schemas, 'WebSite')) {
			fail(
				`${route}: schema WebSite absent`,
			);
		}
	} else if (
		isArticle
	) {
		if (!hasSchemaType(schemas, 'Article')) {
			fail(
				`${route}: schema Article absent`,
			);
		}

		if (!hasSchemaType(schemas, 'BreadcrumbList')) {
			fail(
				`${route}: schema BreadcrumbList absent`,
			);
		}
	} else if (
		route !== '/404.html'
	) {
		if (!hasSchemaType(schemas, 'BreadcrumbList')) {
			fail(
				`${route}: schema BreadcrumbList absent`,
			);
		}
	}

	/*
	 * INTERNAL LINKS
	 */
	const internalBase =
		new URL(route, 'https://clairlia.local');

	const hrefs = [
		...html.matchAll(
			/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi,
		),
	].map((match) => match[1]);

	for (const href of hrefs) {
		if (
			href.startsWith('#') ||
			href.startsWith('mailto:') ||
			href.startsWith('tel:') ||
			href.startsWith('javascript:') ||
			href.startsWith('data:')
		) {
			continue;
		}

		let target;

		try {
			target = new URL(
				href,
				internalBase,
			);
		} catch {
			fail(
				`${route}: lien invalide ${href}`,
			);
			continue;
		}

		if (
			target.origin !==
			internalBase.origin
		) {
			continue;
		}

		if (
			!resolveInternalTarget(
				target.pathname,
			)
		) {
			fail(
				`${route}: lien interne cassé vers ${target.pathname}`,
			);
		}
	}

	pageData.push({
		route,
		canonical,
		noindex,
	});
}

/*
 * ROBOTS.TXT
 */
const robotsFile =
	join(DIST_DIR, 'robots.txt');

if (!existsSync(robotsFile)) {
	fail('robots.txt absent');
} else {
	const robots =
		readFileSync(robotsFile, 'utf8');

	const expectedSitemap =
		`${expectedSite.origin}/sitemap-index.xml`;

	if (
		!robots.includes(
			`Sitemap: ${expectedSitemap}`,
		)
	) {
		fail(
			`robots.txt ne référence pas ${expectedSitemap}`,
		);
	}
}

/*
 * SITEMAP
 */
const sitemapFiles = readdirSync(DIST_DIR)
	.filter(
		(file) =>
			/^sitemap-\d+\.xml$/.test(file),
	);

const sitemapURLs = new Set();

for (const sitemapFile of sitemapFiles) {
	const xml = readFileSync(
		join(DIST_DIR, sitemapFile),
		'utf8',
	);

	for (const match of xml.matchAll(
		/<loc>(.*?)<\/loc>/gi,
	)) {
		sitemapURLs.add(match[1]);
	}
}

if (productionBuild) {
	for (const page of pageData) {
		if (
			!page.canonical ||
			page.route === '/404.html'
		) {
			continue;
		}

		if (page.noindex) {
			if (
				sitemapURLs.has(page.canonical)
			) {
				fail(
					`${page.route}: page noindex présente dans le sitemap`,
				);
			}
		} else if (
			!sitemapURLs.has(page.canonical)
		) {
			fail(
				`${page.route}: page indexable absente du sitemap`,
			);
		}
	}
}

console.log('');

if (failures.length > 0) {
	console.error(
		`❌ SEO audit failed: ${failures.length} problème(s).`,
	);

	process.exit(1);
}

console.log('✅ Titles et descriptions');
console.log('✅ Canonicals');
console.log('✅ Robots');
console.log('✅ H1 et hiérarchie des headings');
console.log('✅ JSON-LD');
console.log('✅ Liens internes');
console.log('✅ robots.txt');
console.log('✅ Sitemap / noindex');
console.log('');
console.log('✅ SEO audit passed.');
