import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/data.js':'data.js','/directory.js':'directory.js','/assets/rust-landscape.png':'assets/rust-landscape.png','/assets/logos/rustafied.png':'assets/logos/rustafied.png'};
const types = {html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript',png:'image/png'};
http.createServer(async (req,res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(file, import.meta.url)); res.writeHead(200, {'Content-Type':types[file.split('.').pop()]}); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load file'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Wipe Radar listening on port ' + (process.env.PORT || 3000)));
