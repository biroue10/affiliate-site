import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST_DIR = 'dist';
const JS_GZIP_BUDGET = 260000;

if (!existsSync(DIST_DIR)) {
	console.error('❌ dist/ absent. Exécute npm run build avant ce contrôle.');
	process.exit(1);
}

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
		} else {
			files.push(fullPath);
		}
	}

	return files;
}

const files = await walk(DIST_DIR);

const jsFiles = files.filter((file) => file.endsWith('.js'));

let totalGzipBytes = 0;

for (const file of jsFiles) {
	const content = await readFile(file);
	const gzipBytes = gzipSync(content).length;

	totalGzipBytes += gzipBytes;

	console.log(`${file}: ${gzipBytes} bytes gzip`);
}

console.log('');
console.log(
	`Total JS gzip: ${totalGzipBytes} / ${JS_GZIP_BUDGET} bytes`,
);

if (totalGzipBytes > JS_GZIP_BUDGET) {
	console.error(
		`❌ Performance budget exceeded by ${
			totalGzipBytes - JS_GZIP_BUDGET
		} bytes.`,
	);

	process.exit(1);
}

console.log('✅ Performance budget passed.');
