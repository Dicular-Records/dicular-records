import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Alle Inhalte als Dateien im Repo (Decap CMS setzt später direkt darauf auf).
// wpId = ID des Originals in WordPress (post-/page-id) — für 1:1-Abgleich und CSS-Klassen wie "post-4605".

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

const releases = defineCollection({
  loader: md('releases'),
  schema: z.object({
    title: z.string(),
    wpId: z.number(),
    catalog: z.string().optional(),
    label: z.string().default('DICULAR RECORDS'),
    date: z.coerce.date(),
    cover: z.string(),
    tracks: z.array(z.object({
      title: z.string(),
      artist: z.string(),
      mp3: z.string().optional(),
      buyUrl: z.string().optional(),
    })).default([]),
  }),
});

const artists = defineCollection({
  loader: md('artists'),
  schema: z.object({
    name: z.string(),
    wpId: z.number().optional(),
    photo: z.string().optional(),
    /** SoundCloud-Track/-Profil-URLs → eingebetteter Player auf der Artist-Seite */
    soundcloud: z.array(z.string().url()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

const news = defineCollection({
  loader: md('news'),
  schema: z.object({
    title: z.string(),
    wpId: z.number().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    categories: z.array(z.string()).default([]),
  }),
});

const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    wpId: z.number().optional(),
    date: z.coerce.date(),
    location: z.string().optional(),
    image: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: md('pages'),
  schema: z.object({
    title: z.string(),
    wpId: z.number(),
    /** seitenspezifisches WPBakery-CSS (vc_shortcodes-custom-css) aus dem Original */
    customCss: z.string().optional(),
    // Startseite
    parallaxImage: z.string().optional(),
    heroLogo: z.string().optional(),
    featuredRelease: reference('releases').optional(),
  }),
});

export const collections = { releases, artists, news, events, pages };
