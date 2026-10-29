import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { communityLogos } from '../directory.js';
const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const [html, css, directory, data, app] = await Promise.all(['index.html','style.css','directory.js','data.js','app.js'].map(read));
// Inline the app so file:// works without module requests or a local server.
const image = await readFile(new URL('assets/rust-landscape.png', root));
const localCss = css.replace(/^@import\s+url\([^;]+;\s*/gm, '').replace("url('./assets/rust-landscape.png')", () => `url('data:image/png;base64,${image.toString('base64')}')`);
let embeddedDirectory = directory;
for (const logo of Object.values(communityLogos)) {
  if (!logo.url.startsWith('./assets/logos/')) continue;
  const bytes = await readFile(new URL(logo.url, root));
  embeddedDirectory = embeddedDirectory.replaceAll(JSON.stringify(logo.url), JSON.stringify('data:image/png;base64,' + bytes.toString('base64')));
}
const localScript = embeddedDirectory.replace(/^export /gm, '') + '\n' + data.replace(/^import .*?;\s*/gm, '').replace(/^export /gm, '') + '\n' + app.replace(/^import .*?;\s*/m, '');
const output = html
  .replace('<link rel="stylesheet" href="/style.css">', () => `<style>${localCss}</style>`)
  .replaceAll('href="/"', 'href="#"')
  .replace('<script type="module" src="/app.js"></script>', () => `<script>${localScript.replaceAll('</script', '<\\/script')}</script>`);
await mkdir(new URL('dist/', root), { recursive:true });
await writeFile(new URL('dist/Wipe-Radar.html', root), output);
console.log('Hazır: dist/Wipe-Radar.html — tarayıcıda çift tıklayarak açabilirsin.');
