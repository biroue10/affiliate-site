import {
	existsSync,
	readdirSync,
	readFileSync,
} from 'node:fs';

import {
	extname,
	join,
	relative,
} from 'node:path';

const CONTENT_DIR = 'src/content/blog';

export const STATIC_NOINDEX_PATHS = [
	'/contact/',
];

function walk(directory) {
	if (!existsSync(directory)) {
		return [];
	}

	const result = [];

	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const fullPath = join(directory, entry.name);

		if (entry.isDirectory()) {
			result.push(...walk(fullPath));
		} else {
			result.push(fullPath);
		}
	}

	return result;
}

export function getNoindexContentPaths() {
	const files = walk(CONTENT_DIR).filter((file) =>
		['.md', '.mdx'].includes(extname(file)),
	);

	const paths = [];

	for (const file of files) {
		const source = readFileSync(file, 'utf8');

		const frontmatterMatch = source.match(
			/^---\s*\n([\s\S]*?)\n---/,
		);

		if (!frontmatterMatch) {
			continue;
		}

		const frontmatter = frontmatterMatch[1];

		if (!/^noindex:\s*true\s*$/m.test(frontmatter)) {
			continue;
		}

		const categoryMatch = frontmatter.match(
			/^category:\s*["']?([^"'\s]+)["']?\s*$/m,
		);

		if (!categoryMatch) {
			continue;
		}

		const category = categoryMatch[1];

		const slug = relative(CONTENT_DIR, file)
			.replace(/\.(md|mdx)$/i, '')
			.replaceAll('\\', '/');

		paths.push(`/${category}/${slug}/`);
	}

	return paths;
}

export function getAllNoindexPaths() {
	return [
		...new Set([
			...STATIC_NOINDEX_PATHS,
			...getNoindexContentPaths(),
		]),
	];
}

export function getContentLastModified(pathname) {
	const files = walk(CONTENT_DIR).filter((file) =>
		['.md', '.mdx'].includes(extname(file)),
	);

	for (const file of files) {
		const source = readFileSync(file, 'utf8');
		const frontmatterMatch = source.match(
			/^---\s*\n([\s\S]*?)\n---/,
		);

		if (!frontmatterMatch) {
			continue;
		}

		const frontmatter = frontmatterMatch[1];
		const categoryMatch = frontmatter.match(
			/^category:\s*["']?([^"'\s]+)["']?\s*$/m,
		);
		const dateMatch =
			frontmatter.match(
				/^updatedDate:\s*(\d{4}-\d{2}-\d{2})\s*$/m,
			) ??
			frontmatter.match(
				/^pubDate:\s*(\d{4}-\d{2}-\d{2})\s*$/m,
			);

		if (!categoryMatch || !dateMatch) {
			continue;
		}

		const slug = relative(CONTENT_DIR, file)
			.replace(/\.(md|mdx)$/i, '')
			.replaceAll('\\', '/');
		const contentPath = `/${categoryMatch[1]}/${slug}/`;

		if (contentPath === pathname) {
			return new Date(`${dateMatch[1]}T00:00:00.000Z`);
		}
	}

	return undefined;
}
