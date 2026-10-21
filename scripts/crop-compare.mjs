// Schneidet einen Bereich aus live-/local-Screenshot aus und stellt ihn untereinander (oben live, unten local).
// Aufruf: node scripts/crop-compare.mjs <compare-dir> <viewport> <x> <y> <w> <h>
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';
const [dir, vp, x, y, w, h] = process.argv.slice(2).map((v, i) => (i > 1 ? +v : v));
const out = new PNG({ width: w, height: h * 2 + 6 });
out.data.fill(255);
['live', 'local'].forEach((side, i) => {
  const img = PNG.sync.read(readFileSync(`${dir}/${side}-${vp}.png`));
  PNG.bitblt(img, out, x, y, Math.min(w, img.width - x), Math.min(h, img.height - y), 0, i * (h + 6));
});
writeFileSync(`${dir}/crop-${vp}-${x}-${y}.png`, PNG.sync.write(out));
