// Erzeugt die festen Bild-Zuschnitte des Sonik-Themes (wie WordPress/Jetpack-Photon "resize=W,H": mittiger Beschnitt)
// für alle Bilder unter public/wp-content/uploads und public/images/uploads → public/_thumbs/<größe>/<pfad>.
// Läuft automatisch vor dev/build (npm-Skripte predev/prebuild); vorhandene Zuschnitte werden übersprungen.
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { SIZES } from '../src/lib/thumb-sizes.mjs';

const PUBLIC = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const ROOTS = ['wp-content/uploads', 'images/uploads'];
const exts = /\.(jpe?g|png|webp)$/i;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (exts.test(e.name)) yield p;
  }
}
let made = 0;
for (const root of ROOTS) {
  for await (const file of walk(join(PUBLIC, root))) {
    const rel = relative(PUBLIC, file).split('\\').join('/');
    for (const [name, [w, h]] of Object.entries(SIZES)) {
      const out = join(PUBLIC, '_thumbs', name, rel);
      if (await stat(out).then(() => true, () => false)) continue;
      await mkdir(dirname(out), { recursive: true });
      await sharp(file).resize(w, h, { fit: 'cover', position: 'centre' }).toFile(out);
      made++;
    }
  }
}
console.log(`Zuschnitte: ${made} neu erzeugt`);
