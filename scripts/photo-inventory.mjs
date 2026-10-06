import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

export function filenameDetails(filename) {
  const stem = path.basename(filename).replace(/\.[^.]+$/, '');
  const match = stem.match(/(?:^|\D)(20\d{2})[-_.](\d{2})[-_.](\d{2})(?:\D|$)/) || stem.match(/(?:^|\D)(\d{2})[._-](\d{2})[._-](20\d{2})(?:\D|$)/)?.map((value,index,array)=>index === 1 ? array[3] : index === 3 ? array[1] : value);
  let date = '';
  if (match) {
    const [, year, month, day] = match;
    const candidate = new Date(`${year}-${month}-${day}T12:00:00Z`);
    if (Number.isFinite(candidate.getTime()) && candidate.toISOString().slice(0,10) === `${year}-${month}-${day}`) date = `${day}.${month}.${year}`;
  }
  const clean = /^Screenshot_/i.test(stem) ? 'Bir ekran görüntüsü' : stem.replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  return { title: clean.charAt(0).toLocaleUpperCase('tr-TR') + clean.slice(1), date };
}

export async function scanPhotos(directory, previous = []) {
  async function walk(folder, prefix = '') {
    const files = [];
    for (const entry of await readdir(folder, {withFileTypes:true})) {
      const relative = prefix + entry.name;
      if (entry.isDirectory()) files.push(...await walk(path.join(folder,entry.name),relative+'/'));
      else if (entry.isFile()) files.push(relative);
    }
    return files;
  }
  const files = (await walk(directory)).sort();
  const images = files.filter(file=>/\.(jpe?g|png|webp|avif)$/i.test(file));
  const unsupported = files.filter(file=>/\.hei[cf]$/i.test(file));
  const urlFor = file => '/photos/' + file.split('/').map(encodeURIComponent).join('/');
  const oldByURL = new Map(previous.map(photo=>[photo.photo,photo]));
  const knownThumbnails = new Set(previous.filter(photo=>photo.thumbnail !== photo.photo).map(photo=>photo.thumbnail));
  const photos = [];
  for (const file of images) {
    const url = urlFor(file);
    const isPairedThumb = /-thumb\.[^.]+$/i.test(file) && images.includes(file.replace(/-thumb(?=\.[^.]+$)/i,''));
    if (isPairedThumb || knownThumbnails.has(url)) continue;
    const metadata = await sharp(await readFile(path.join(directory,file))).metadata();
    const old = oldByURL.get(url);
    // Legacy generated hashes have no human title; retain their original filename metadata.
    const legacyHash = /^[a-f0-9]{12}\.webp$/i.test(path.basename(file)) || Boolean(old && path.basename(file).endsWith(`-${old.id}.webp`));
    const details = legacyHash && old ? {title:old.title,date:old.date} : filenameDetails(file);
    const thumb = file.replace(/(\.[^.]+)$/, '-thumb$1');
    photos.push({id:old?.id ?? createHash('sha256').update(url).digest('hex').slice(0,16), ...details, description:'', photo:url, thumbnail:images.includes(thumb) ? urlFor(thumb) : url, width:metadata.width, height:metadata.height, sourceFile:legacyHash && old ? old.sourceFile : file});
  }
  return {photos, imageFiles:images.length, unsupported};
}

export async function syncPhotos() {
  let previous = [];
  try { previous = JSON.parse(await readFile('data/photos.json','utf8')); } catch(error) { if (error.code !== 'ENOENT') throw error; }
  const result = await scanPhotos('public/photos', previous);
  if (!result.photos.length) throw new Error('public/photos contains no supported gallery photos.');
  const json = JSON.stringify(result.photos,null,2)+'\n';
  if (JSON.stringify(previous) !== JSON.stringify(result.photos)) {
    await writeFile('data/photos.json.tmp',json);
    await rename('data/photos.json.tmp','data/photos.json');
  }
  console.log(`Public photos: ${result.imageFiles} files, ${result.photos.length} gallery photos.`);
  if (result.unsupported.length) console.warn(`HEIC/HEIF must be converted before use: ${result.unsupported.join(', ')}`);
  return result;
}


