import { readdir, readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import decode from 'heic-decode';

const root = process.cwd();
const source = path.join(root, 'fotoğraflar');
const output = path.join(root, 'public/photos/album');
await mkdir(output, { recursive: true });
const files = (await readdir(source)).filter(name => /\.(jpe?g|png|webp|heic|heif)$/i.test(name));
const photos = [];
const failures = [];
for (const name of files) {
  try {
    const buffer = await readFile(path.join(source, name));
    let input;
    if (/\.hei[cf]$/i.test(name)) {
      const decoded = await decode({ buffer });
      input = sharp(Buffer.from(decoded.data), { raw: { width: decoded.width, height: decoded.height, channels: 4 } });
    } else input = sharp(buffer).rotate();
    const id = createHash('sha256').update(name).digest('hex').slice(0, 12);
    const full = await input.clone().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
    await writeFile(path.join(output, `${id}.webp`), full.data);
    await input.clone().resize({ width: 720, height: 960, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(output, `${id}-thumb.webp`));
    const match = name.match(/(?:^|\D)(20\d{2})[-_.](\d{2})[-_.](\d{2})(?:\D|$)/);
    let date = '';
    if (match) {
      const [, y, m, d] = match;
      const check = new Date(`${y}-${m}-${d}T12:00:00Z`);
      if (!Number.isNaN(check.getTime()) && check.toISOString().slice(0, 10) === `${y}-${m}-${d}`) date = `${d}.${m}.${y}`;
    }
    const rawTitle = /^Screenshot_/i.test(name) ? 'Bir ekran görüntüsü' : name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const title = rawTitle.charAt(0).toLocaleUpperCase('tr-TR') + rawTitle.slice(1);
    photos.push({ id, title, date, description: '', photo: `/photos/album/${id}.webp`, thumbnail: `/photos/album/${id}-thumb.webp`, width: full.info.width, height: full.info.height, sourceFile: name });
  } catch (error) { failures.push({ name, error: String(error) }); }
}
// Publish only a complete manifest, after every referenced file exists.
if (!failures.length) {
  const temporary = path.join(root, 'data/photos.json.tmp');
  await writeFile(temporary, JSON.stringify(photos, null, 2) + '\n');
  await rename(temporary, path.join(root, 'data/photos.json'));
}
console.log(JSON.stringify({ found: files.length, converted: photos.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
