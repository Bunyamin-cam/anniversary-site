// Local preview of the exact Pages artifact, mounted at its production basePath.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { productionBasePath } from '../lib/asset-path.ts';

const root = path.resolve('out');
const port = Number(process.env.PORT || 3001);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };

createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/' || pathname === productionBasePath) {
      response.writeHead(302, { Location: productionBasePath + '/' }).end(); return;
    }
    if (!pathname.startsWith(productionBasePath + '/')) { response.writeHead(404).end(); return; }
    let file = path.resolve(root, '.' + pathname.slice(productionBasePath.length));
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const { size } = await stat(file);
    const headers = { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    let start = 0, end = size - 1;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2])) { response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return; }
      start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
      if (start > end || start >= size) { response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    response.writeHead(request.headers.range ? 206 : 200, { ...headers, 'Content-Length': Math.max(0, end - start + 1) });
    if (request.method === 'HEAD' || !size) response.end();
    else createReadStream(file, { start, end }).on('error', () => response.destroy()).pipe(response);
  } catch { response.writeHead(404).end(); }
}).listen(port, '127.0.0.1', () => console.log(`Static Pages preview: http://localhost:${port}${productionBasePath}/`));
