import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stableShuffle } from './stable-shuffle.ts';
import { relationshipDuration } from './relationship-duration.ts';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { scanPhotos } from '../scripts/photo-inventory.mjs';
test('shuffle is deterministic, complete, non-mutating and not source order', () => {
  const original = Array.from({length:48}, (_,i)=>i);
  const shuffled = stableShuffle(original);
  assert.deepEqual(shuffled, stableShuffle(original));
  assert.notDeepEqual(shuffled, original);
  assert.deepEqual([...shuffled].sort((a,b)=>a-b), original);
  assert.equal(original[0], 0);
});
test('new anniversary rolls over correctly', () => {
  assert.deepEqual(relationshipDuration('2023-10-07T00:00:00+03:00', new Date('2026-10-07T00:00:00+03:00')), {years:3,months:0,days:0,hours:0,minutes:0});
});
test('every album entry has two valid web image files and no invented story', async () => {
  const photos = JSON.parse(await readFile(new URL('../data/photos.json', import.meta.url), 'utf8'));
  assert.equal(photos.length, (await scanPhotos('public/photos', photos)).photos.length);
  assert.equal(new Set(photos.map(p=>p.id)).size, photos.length);
  for (const photo of photos) {
    assert.equal(photo.description, '');
    for (const source of [photo.photo, photo.thumbnail]) {
      const bytes = await readFile(new URL('../public'+decodeURIComponent(source), import.meta.url));
      assert.ok((await sharp(bytes).metadata()).width > 0);
    }
  }
});
