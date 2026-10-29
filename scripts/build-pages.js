import './export-local.js';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('docs/', root), { recursive: true });
await copyFile(new URL('dist/Wipe-Radar.html', root), new URL('docs/index.html', root));
await writeFile(new URL('docs/.nojekyll', root), '');
console.log('GitHub Pages hazır: docs/index.html');
