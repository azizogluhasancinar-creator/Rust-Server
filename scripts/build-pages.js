import './export-local.js';
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { communityLogos } from '../directory.js';
const root = new URL('../', import.meta.url);
await mkdir(new URL('docs/assets/', root), { recursive: true });
let html = await readFile(new URL('dist/Wipe-Radar.html', root), 'utf8');
const background = await readFile(new URL('assets/rust-landscape.png', root));
html = html.replaceAll('data:image/png;base64,' + background.toString('base64'), './assets/rust-landscape.png');
await mkdir(new URL('docs/assets/logos/', root), { recursive: true });
for (const logo of Object.values(communityLogos)) {
  if (!logo.url.startsWith('./assets/logos/')) continue;
  const bytes = await readFile(new URL(logo.url, root));
  html = html.replaceAll('data:image/png;base64,' + bytes.toString('base64'), logo.url);
  await copyFile(new URL(logo.url, root), new URL('docs/' + logo.url.slice(2), root));
}
await writeFile(new URL('docs/index.html', root), html);
await copyFile(new URL('assets/rust-landscape.png', root), new URL('docs/assets/rust-landscape.png', root));
await writeFile(new URL('docs/.nojekyll', root), '');
console.log('GitHub Pages hazır: docs/index.html');
