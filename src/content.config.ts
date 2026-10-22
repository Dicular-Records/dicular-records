import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Alle Inhalte als Dateien im Repo (Decap CMS setzt später direkt darauf auf).
// wpId      = ID des Originals in WordPress (für 1:1-Abgleich und CSS-Klassen wie "post-4605")
// format    = "html": Fließtext wörtlich aus WordPress übernommen (wird unverändert ausgegeben);
//             "markdown" (Standard für neue Inhalte): wird als Markdown gerendert
// listOrder = Position in der Live-Übersicht; neue Einträge ohne listOrder stehen vorne (nach Datum)

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });
const format = z.enum(['html', 'markdown']).default('markdown');
const listOrder = z.number().optional();

/**
 * Neue Einträge haben keine WordPress-ID; die Vorlagen brauchen sie für Klassen/IDs wie "post-4605".
 * Ersatz: stabile Zahl aus dem Titel (ab 100000, kollidiert nicht mit WordPress-IDs).
 */
const fallbackId = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return 100000 + (h % 900000);
};
const withId = <T extends { wpId?: number }>(key: (d: T) => string) => (d: T) => ({ ...d, wpId: d.wpId ?? fallbackId(key(d)) });

const releases = defineCollection({
  loader: md('releases'),
  schema: z.object({
    title: z.string(),
    wpId: z.number().optional(),
    catalog: z.string().optional(),
    label: z.string().default('DICULAR RECORDS'),
    date: z.coerce.date().optional(),
    cover: z.string(),
    background: z.string().optional(),
    /** großer 360°-Player im Kopf der Release-Seite (sonst spielen Tracks über den Player in der Kopfleiste) */
    headerPlayer: z.boolean().default(true),
    /** noch nicht erschienen (Platzhalter): „Coming soon“, Shop-Links ohne Adresse erscheinen als Vorschau */
    upcoming: z.boolean().default(false),
    /** Titel über dem 360°-Player (Standard: erster Track) */
    playerTitle: z.string().optional(),
    tracks: z.array(z.object({
      title: z.string().default(''),
      artist: z.string().default(''),
      mp3: z.string().optional(),
      buyUrl: z.string().optional(),
      /** Video zum Track (YouTube-Link, wird vom Theme eingebettet) */
      video: z.string().optional(),
      videoLabel: z.string().optional(),
    })).default([]),
    /** Kauf-Links des ganzen Releases (z. B. Beatport), über der Trackliste */
    buyLinks: z.array(z.object({ label: z.string().default(''), url: z.string() })).default([]),
    artists: z.array(reference('artists')).default([]),
    genres: z.array(z.string()).default([]),
    listOrder,
    format,
  }).transform(withId((d) => d.title)),
});

const artists = defineCollection({
  loader: md('artists'),
  schema: z.object({
    name: z.string(),
    wpId: z.number().optional(),
    /** Zeile unter dem Namen, z. B. "German / " */
    subtitle: z.string().optional(),
    photo: z.string().optional(),
    background: z.string().optional(),
    genres: z.array(z.string()).default([]),
    booking: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    music: z.object({ title: z.string() }).optional(),
    custom: z.object({ title: z.string().optional(), content: z.string().optional() }).optional(),
    excerpt: z.string().optional(),
    /** SoundCloud-Track/-Profil-URLs → eingebetteter Player auf der Artist-Seite */
    soundcloud: z.array(z.string().url()).default([]),
    listOrder,
    format,
  }).transform(withId((d) => d.name)),
});

const news = defineCollection({
  loader: md('news'),
  schema: z.object({
    title: z.string(),
    wpId: z.number().optional(),
    date: z.coerce.date(),
    author: z.string().default('admin'),
    image: z.string().optional(),
    categories: z.array(z.string()).default(['uncategorized']),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    listOrder,
    format,
  }).transform(withId((d) => d.title)),
});

const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    wpId: z.number().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    background: z.string().optional(),
    location: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    /** Link zum Event (z. B. Facebook) */
    eventUrl: z.string().optional(),
    /** Ticket-Links ("VVK Tickets") */
    buyLinks: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    excerpt: z.string().optional(),
    listOrder,
    format,
  }).transform(withId((d) => d.title)),
});

const friends = defineCollection({
  loader: md('friends'),
  schema: z.object({
    name: z.string(),
    wpId: z.number().optional(),
    headerImage: z.string().optional(),
    profilePic: z.string().optional(),
    listImage: z.string().optional(),
    memberTypes: z.array(z.string()).default([]),
    socials: z.array(z.object({ icon: z.string(), url: z.string() })).default([]),
    excerpt: z.string().optional(),
    listOrder,
    format,
  }).transform(withId((d) => d.name)),
});

const pages = defineCollection({
  loader: md('pages'),
  schema: z.object({
    title: z.string(),
    wpId: z.number(),
    template: z.string().default('default'),
    /** Beitragsbild (WordPress "featured image") */
    image: z.string().optional(),
    /** abweichendes Kopfbild ohne Beitragsbild */
    headerImage: z.string().optional(),
    /** seitenspezifisches WPBakery-CSS (vc_shortcodes-custom-css) aus dem Original */
    customCss: z.string().optional(),
    // Startseite
    parallaxImage: z.string().optional(),
    heroLogo: z.string().optional(),
    featuredRelease: reference('releases').optional(),
    format,
  }),
});

export const collections = { releases, artists, news, events, friends, pages };
