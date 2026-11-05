// V2: gemeinsame Helfer der Seiten (Titelgröße, Farbe eines Artists)
import type { CollectionEntry } from 'astro:content';
import { coverColor } from './cover-color';

/** Katalognummer steht schon in der Zeile darüber, WordPress-Dekor (### News ###) stört nur */
export const cleanTitle = (t: string) => t.replace(/^DIC[\s_-]?\d+[\s_:-]*/i, '').replace(/\s+DIC\d+$/i, '').replace(/_/g, ' ').replace(/#{2,}/g, '').replace(/\s{2,}/g, ' ').trim();

/** Klasse nach Länge: lange Titel werden kleiner gesetzt */
export const titleClass = (t: string) => {
  const n = cleanTitle(t).length;
  return n > 70 ? 'v2-title longer' : n > 34 ? 'v2-title long' : 'v2-title';
};

/** --w: längstes Wort, damit der Titel nie mitten im Wort bricht */
export const titleFit = (t: string) => `--w:${Math.max(...cleanTitle(t).split(/\s+/).map((w) => w.length))}`;

/** Farbe eines Artists: sein neuestes Release, sonst sein Foto. `releases` neueste zuerst. */
export async function artistColor(artist: CollectionEntry<'artists'>, releases: CollectionEntry<'releases'>[]) {
  const own = releases.find((r) => r.data.artists.some((ref) => ref.id === artist.id));
  return coverColor(own?.data.cover ?? artist.data.photo);
}
