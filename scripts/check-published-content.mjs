import { existsSync } from 'node:fs';

const forbiddenPaths = [
	'dist/blog/_seed/index.html',
];

let failed = false;

for (const path of forbiddenPaths) {
	if (existsSync(path)) {
		console.error(`❌ Forbidden draft route generated: ${path}`);
		failed = true;
	}
}

if (failed) {
	process.exit(1);
}

console.log('✅ No forbidden draft routes generated.');
