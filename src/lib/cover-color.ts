// V2: Akzentfarbe aus dem Cover, beim Bauen berechnet. Die kräftigste Farbfamilie des Bildes gewinnt,
// die Helligkeit wird angeglichen, damit sie auf Schwarz lesbar bleibt. Graue Cover bekommen Silber.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const SILVER = '#c4ced6';
const cache = new Map<string, string>();

/** public/ des Projekts: von dieser Datei aus aufwärts suchen, weil Dev-Server und Build von verschiedenen Orten starten */
function publicDir() {
  let dir = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(dir, 'public', 'redesign'))) {
    const up = dirname(dir);
    if (up === dir) return join(process.cwd(), 'public');
    dir = up;
  }
  return join(dir, 'public');
}

function hsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function hex(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export async function coverColor(src: string | undefined): Promise<string> {
  if (!src) return SILVER;
  if (cache.has(src)) return cache.get(src)!;
  const file = join(publicDir(), decodeURI(src));
  let color = SILVER;
  if (existsSync(file)) {
    const data = await sharp(file).resize(64, 64, { fit: 'cover' }).toColourspace('srgb').removeAlpha().raw().toBuffer();
    const bins = Array.from({ length: 24 }, () => ({ w: 0, x: 0, y: 0, s: 0 }));
    let total = 0;
    for (let i = 0; i + 2 < data.length; i += 3) {
      const p = hsl(data[i], data[i + 1], data[i + 2]);
      const w = p.s * p.s * (1 - Math.abs(2 * p.l - 1)); // kräftig und weder fast schwarz noch fast weiß
      const bin = bins[Math.floor(p.h / 15) % 24];
      bin.w += w; bin.s += p.s * w;
      bin.x += Math.cos((p.h * Math.PI) / 180) * w; bin.y += Math.sin((p.h * Math.PI) / 180) * w;
      total += w;
    }
    const best = bins.reduce((a, b) => (b.w > a.w ? b : a));
    if (total / (data.length / 3) > 0.03) {
      const h = (Math.atan2(best.y, best.x) * 180) / Math.PI;
      color = hex((h + 360) % 360, Math.max(0.6, Math.min(0.95, best.s / best.w)), 0.64);
    }
  }
  cache.set(src, color);
  return color;
}
