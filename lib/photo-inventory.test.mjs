import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rename, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { scanPhotos, filenameDetails } from '../scripts/photo-inventory.mjs';

test('public rename updates path/title without reintroducing old files; thumbnails are not cards', async () => {
  const root = await mkdtemp(path.join(tmpdir(),'anniversary-photos-'));
  try {
    const image = await sharp({create:{width:8,height:10,channels:3,background:'#89a482'}}).webp().toBuffer();
    await writeFile(path.join(root,'eski-ad.webp'),image);
    await writeFile(path.join(root,'eski-ad-thumb.webp'),image);
    const before = await scanPhotos(root);
    assert.equal(before.photos.length,1);
    await rename(path.join(root,'eski-ad.webp'),path.join(root,'İlk Kahvemiz 07.10.2023.WEBP'));
    const after = await scanPhotos(root,before.photos);
    assert.equal(after.photos.length,1);
    assert.equal(after.photos[0].title,'İlk Kahvemiz 07.10.2023');
    assert.equal(after.photos[0].date,'07.10.2023');
    assert.ok(after.photos[0].photo.includes('%C4%B0lk%20Kahvemiz'));
    assert.ok(!after.photos.some(photo=>photo.photo.includes('eski-ad')));
  } finally { await rm(root,{recursive:true,force:true}); }
});
test('filename parsing keeps Turkish and rejects impossible dates',()=>{
  assert.deepEqual(filenameDetails('ilk_çiçeğim-2024-02-29.JPG'),{title:'İlk çiçeğim 2024 02 29',date:'29.02.2024'});
  assert.equal(filenameDetails('anı-2023-02-29.png').date,'');
});
