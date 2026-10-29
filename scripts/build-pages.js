import './export-local.js';
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('docs/assets/', root), { recursive: true });
const html = await readFile(new URL('dist/Wipe-Radar.html', root), 'utf8');
await writeFile(new URL('docs/index.html', root), html.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, './assets/rust-landscape.png'));
await copyFile(new URL('assets/rust-landscape.png', root), new URL('docs/assets/rust-landscape.png', root));
await writeFile(new URL('docs/.nojekyll', root), '');
console.log('GitHub Pages hazır: docs/index.html');
