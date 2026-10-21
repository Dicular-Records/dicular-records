// Sortierung und Verknüpfungen wie im Sonik-Theme (aus dem Live-Verhalten abgeleitet, siehe docs/DECISIONS).
import { getCollection, type CollectionEntry } from 'astro:content';
import taxonomies from '../data/taxonomies.json';

type WithOrder = { data: { listOrder?: number; date?: Date } };
/** Live-Reihenfolge (listOrder); neue Einträge ohne listOrder davor, neueste zuerst */
export function byListOrder<T extends WithOrder>(a: T, b: T): number {
  const ao = a.data.listOrder, bo = b.data.listOrder;
  if (ao === undefined && bo === undefined) return (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
  if (ao === undefined) return -1;
  if (bo === undefined) return 1;
  return ao - bo;
}

export const releasesSorted = async () => (await getCollection('releases')).sort(byListOrder);
export const artistsSorted = async () => (await getCollection('artists')).sort(byListOrder);
export const friendsSorted = async () => (await getCollection('friends')).sort(byListOrder);
/** Events: aufsteigend nach Datum (wie /gigs/) */
export const eventsSorted = async () => (await getCollection('events')).sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
/** News: Live-Reihenfolge (neueste zuerst; gleiches Datum wie im Original), neue Beiträge vorne */
export const newsSorted = async () => (await getCollection('news')).sort(byListOrder);

/** Related Releases: gleiche Genres (ohne sich selbst); ohne Genre die ersten 16 der Release-Liste */
export async function relatedReleases(r: CollectionEntry<'releases'>) {
  const all = await releasesSorted();
  if (r.data.genres.length) return all.filter((x) => x.id !== r.id && x.data.genres.some((g) => r.data.genres.includes(g)));
  return all.slice(0, 16);
}

/**
 * Related Artists wie WordPress (tax_query mit include_children): Artists mit einem der eigenen Genres
 * oder einem Unter-Genre davon (ohne sich selbst). Ohne Genre: alle Artists (inkl. sich selbst).
 */
export async function relatedArtists(a: CollectionEntry<'artists'>) {
  const all = await artistsSorted();
  if (!a.data.genres.length) return all;
  const parents = taxonomies.artistgenreParents as Record<string, string>;
  const matches = (g: string) => a.data.genres.includes(g) || a.data.genres.includes(parents[g]);
  return all.filter((x) => x.id !== a.id && x.data.genres.some(matches));
}

/** Related News: gleiche Kategorie (ohne sich selbst), Reihenfolge wie News-Liste, max. 9 */
export async function relatedNews(n: CollectionEntry<'news'>) {
  const all = await newsSorted();
  return all.filter((x) => x.id !== n.id && x.data.categories.some((c) => n.data.categories.includes(c))).slice(0, 9);
}

/** Datumsformate des Themes */
export const fmtLong = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }); // July 3, 2026
export const fmtDayMonth = (d: Date) => d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }); // 10 June 2026
export const fmtShort = (d: Date) => d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); // 22 Apr 2023

/** WordPress-Auszug (55 Wörter + [&hellip;]) für neue Inhalte ohne gespeicherten Auszug */
export function autoExcerpt(html: string, words = 55): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
  return `<p>${text.slice(0, words).join(' ')}${text.length > words ? ' [&hellip;]' : ''}</p>`;
}
