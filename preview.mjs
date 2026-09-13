import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('public');
http.createServer(async (req, res) => {
  if (req.url === '/api/join') { res.writeHead(503, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Campaign signup is not open yet. Please check back soon.' })); }
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try { const content = await readFile(file); res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream' }); res.end(content); } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4188, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4188'));

