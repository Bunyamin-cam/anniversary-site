import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { assetPath, productionBasePath } from './asset-path.ts';

test('asset paths work at the development root and Pages subdirectory without double prefixes', () => {
  for (const source of ['/photos/album/a.webp', '/music/our-song.mp3']) {
    assert.equal(assetPath(source, ''), source);
    assert.equal(assetPath(source, productionBasePath), productionBasePath + source);
    assert.equal(assetPath(assetPath(source, productionBasePath), productionBasePath), productionBasePath + source);
  }
  for (const source of ['https://example.com/a.jpg', '//example.com/a.jpg', 'data:image/png;base64,abc', '#together']) {
    assert.equal(assetPath(source, productionBasePath), source);
  }
});

test('every gallery/modal photo and music path resolves to an existing public asset under Pages', async () => {
  const photos = JSON.parse(await readFile(new URL('../data/photos.json', import.meta.url), 'utf8'));
  for (const source of [...photos.flatMap(photo => [photo.photo, photo.thumbnail]), '/music/our-song.mp3']) {
    const url = assetPath(source, productionBasePath);
    assert.ok(url.startsWith(productionBasePath + '/'));
    await access(new URL('../public' + url.slice(productionBasePath.length), import.meta.url));
  }
});
