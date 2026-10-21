import { SIZES } from './thumb-sizes.mjs';
import site from '../data/site.json';

export type ThumbSize = keyof typeof SIZES;

/** Pfad zum vorberechneten Zuschnitt (scripts/thumbs.mjs) eines lokalen Bildes */
export function thumb(src: string | undefined, size: ThumbSize): string | undefined {
  if (!src) return undefined;
  return src.startsWith('/wp-content/uploads/') || src.startsWith('/images/uploads/') ? `/_thumbs/${size}${src}` : src;
}

/** Audio liegt (vorerst) extern — siehe docs/DECISIONS (642 MB, nicht im Repo) */
export function audio(src: string | undefined): string | undefined {
  if (!src) return undefined;
  return src.startsWith('/') && site.audioBase ? site.audioBase.replace(/\/$/, '') + src : src;
}

/**
 * Anzeigegröße wie WordPress/Photon "fit=W,H": proportional in die Box verkleinert, nie vergrößert.
 * Liefert die width/height-Attribute, die das Original im HTML hatte.
 */
const sizeCache = new Map<string, [number, number]>();
export async function fitSize(src: string | undefined, maxW: number, maxH: number): Promise<[number, number]> {
  if (!src?.startsWith('/')) return [maxW, maxH];
  let dims = sizeCache.get(src);
  if (!dims) {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(`public${decodeURI(src)}`).metadata().catch(() => null);
    dims = meta?.width && meta?.height ? [meta.width, meta.height] : [maxW, maxH];
    sizeCache.set(src, dims);
  }
  const [w, h] = dims;
  const scale = Math.min(1, maxW / w, maxH / h);
  return [Math.round(w * scale), Math.round(h * scale)];
}
