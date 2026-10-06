import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { assetPath, productionBasePath } from '../lib/asset-path.ts';

const html = await readFile('out/index.html', 'utf8');
const urls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
const nextAssets = urls.filter(url => url.includes('/_next/'));
assert.ok(nextAssets.some(url => url.endsWith('.js')), 'Export must contain JavaScript');
assert.ok(nextAssets.some(url => url.endsWith('.css')), 'Export must contain CSS');
const music = assetPath('/music/our-song.mp3', productionBasePath);
assert.ok(urls.includes(music), 'Exported audio must use the Pages prefix');
const photos = JSON.parse(await readFile('data/photos.json', 'utf8'));
const publicUrls = photos.flatMap(photo => [photo.photo, photo.thumbnail]).map(url => assetPath(url, productionBasePath));
for (const url of [...urls.filter(url => url.startsWith('/')), ...publicUrls]) {
  assert.ok(url.startsWith(productionBasePath + '/'), `Missing basePath: ${url}`);
  assert.ok(!url.includes('/_next/image'), 'Static export cannot use the image optimizer');
  const pathname = new URL(url, 'http://localhost').pathname.slice(productionBasePath.length);
  await access('out' + decodeURIComponent(pathname));
}
assert.ok((await readFile('out/music/our-song.mp3')).length > 0);
console.log(`Export verified: ${photos.length} gallery/modal photos, music, ${nextAssets.length} JS/CSS assets under ${productionBasePath}/.`);
