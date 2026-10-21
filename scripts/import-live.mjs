// Importiert die Inhalte der Live-WordPress-Seite wörtlich in die Content-Collections (src/content/*).
// Quelle: .cache/live/*.html (vorher `node scripts/cache-live.mjs` ausführen).
// Fließtexte bleiben HTML (Frontmatter `format: html`), damit nichts durch Markdown verändert wird.
// Aufruf: node scripts/import-live.mjs   → schreibt src/content/** und .cache/media.txt (benötigte Uploads)
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import * as cheerio from 'cheerio';
import YAML from 'yaml';
import { localizeUrls, localImage } from './lib/localize.mjs';

const LIVE = new URL('../.cache/live/', import.meta.url);
const CONTENT = new URL('../src/content/', import.meta.url);
const media = new Set();
const warnings = [];

const load = async (key) => cheerio.load(await readFile(new URL(`${key}.html`, LIVE), 'utf8'), { decodeEntities: false });
const text = (el) => cheerio.load(`<x>${el ?? ''}</x>`, null, false)('x').text().replace(/\s+/g, ' ').trim();
const img = (url) => { const p = localImage(url); if (p?.startsWith('/wp-content/uploads/')) media.add(p); return p; };
const html = (s) => {
  const out = localizeUrls((s ?? '').replace(/^\s*\n/, '').replace(/\s+$/, ''));
  for (const m of out.matchAll(/(?:src|href)="(\/wp-content\/uploads\/[^"?#]+)/g)) media.add(m[1]);
  return out;
};
const wpId = ($el) => Number(($el.attr('class') ?? '').match(/\bpost-(\d+)\b/)?.[1]);
const terms = ($el, tax) => [...($el.attr('class') ?? '').matchAll(new RegExp(`\\b${tax}-([a-z0-9-]+)`, 'g'))].map((m) => m[1]);
const isoDate = (s) => {
  const d = new Date(`${s.trim()} UTC`);
  if (Number.isNaN(+d)) throw new Error(`Datum nicht lesbar: ${s}`);
  return d.toISOString().slice(0, 10);
};
const slugOf = (key, prefix) => key.slice(prefix.length);
const clean = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === '' || v === undefined || (Array.isArray(v) && v.length === 0) ? undefined : v)));

async function write(collection, slug, data, body) {
  const dir = new URL(`${collection}/`, CONTENT);
  await mkdir(dir, { recursive: true });
  const fm = YAML.stringify(clean(data), { lineWidth: 0 });
  await writeFile(new URL(`${slug}.md`, dir), `---\n${fm}---\n${body ? body + '\n' : ''}`);
}

const keys = (await readdir(LIVE)).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
// Vorher importierte Dateien entfernen (Startseite pages/home.md bleibt, ist handgepflegt)
for (const c of ['releases', 'artists', 'news', 'events', 'friends']) await rm(new URL(`${c}/`, CONTENT), { recursive: true, force: true });

// ---------- Listen-Daten, die nur auf Übersichtsseiten stehen (Auszüge, Socials) ----------
const excerpts = { news: {}, artists: {}, friends: {} };
for (const k of keys.filter((k) => /^dicular-rec-news/.test(k))) {
  const $ = await load(k);
  $('.ms-item').each((_, el) => { excerpts.news[wpId($(el))] = html($(el).find('.qt-small').html()); });
}
for (const k of keys.filter((k) => /^artists(__page__\d+)?$/.test(k))) {
  const $ = await load(k);
  $('.qt-artist-listing').each((_, el) => {
    const href = $(el).find('a').last().attr('href') ?? '';
    excerpts.artists[href.replace(/.*\/artist\/|\/$/g, '')] = $(el).find('figcaption p').first().html();
  });
}
const friendsList = await load('friends');
friendsList('.qt-archivemembers-item').each((_, el) => {
  const $el = friendsList(el);
  excerpts.friends[wpId($el)] = {
    excerpt: html($el.find('.text-small').html()),
    socials: $el.find('.qt-socials a').map((_, a) => ({ icon: friendsList(a).find('i').attr('class'), url: friendsList(a).attr('href') })).get(),
    listImage: img($el.find('img').attr('src')),
  };
});

// ---------- Reihenfolgen der Übersichten (listOrder) und Taxonomie-Zuordnungen aus den Archivseiten ----------
// WordPress sortiert teils nach Feldern, die im HTML nicht sichtbar sind → Position aus der Live-Liste übernehmen.
const listOrder = { release: {}, artist: {}, members: {}, event: {}, news: {} };
const collectOrder = async (prefix, type) => {
  const pages = keys.filter((k) => k === prefix || k.startsWith(`${prefix}__page__`))
    .sort((a, b) => Number(a.split('__page__')[1] ?? 1) - Number(b.split('__page__')[1] ?? 1));
  let i = 0;
  for (const k of pages) {
    const $ = await load(k);
    $('#itemslist a[href], #masonrycontainer a[href]').each((_, a) => {
      const m = ($(a).attr('href') ?? '').match(new RegExp(`/${type}/([^/]+)/?$`));
      if (m && listOrder[type][m[1]] === undefined) listOrder[type][m[1]] = ++i;
    });
  }
};
await collectOrder('releases', 'release');
await collectOrder('artists', 'artist');
await collectOrder('friends', 'members');
await collectOrder('gigs', 'event');
// News: Reihenfolge der Masonry-Übersicht (gleiches Datum → WordPress sortiert nach Uhrzeit, die im HTML fehlt)
{
  let i = 0;
  for (const k of keys.filter((k) => /^dicular-rec-news(__page__\d+)?$/.test(k)).sort((a, b) => Number(a.split('__page__')[1] ?? 1) - Number(b.split('__page__')[1] ?? 1))) {
    const $ = await load(k);
    $('.ms-item').each((_, el) => { listOrder.news[wpId($(el))] = ++i; });
  }
}
const taxonomy = (prefix, type) => {
  const map = {};
  return Promise.all(keys.filter((k) => k.startsWith(prefix) && !k.includes('__page__')).map(async (k) => {
    const $ = await load(k);
    const term = slugOf(k, prefix);
    $(`a[href*="/${type}/"]`).each((_, a) => {
      const m = ($(a).attr('href') ?? '').match(new RegExp(`/${type}/([^/]+)/?$`));
      if (m) (map[m[1]] ??= new Set()).add(term);
    });
  })).then(() => Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v].sort()])));
};
const releaseGenres = await taxonomy('genre__', 'release');

// ---------- Releases ----------
// Artist-Zuordnung: aus den "Music"-Karussells der Artist-Seiten
const releaseArtists = {};
for (const k of keys.filter((k) => k.startsWith('artist__'))) {
  const $ = await load(k);
  $('#artistReleases .qt-owl-card > a.qw-imgfx').each((_, a) => {
    const slug = ($(a).attr('href') ?? '').replace(/.*\/release\/|\/$/g, '');
    (releaseArtists[slug] ??= []).push(slugOf(k, 'artist__'));
  });
}
for (const k of keys.filter((k) => k.startsWith('release__'))) {
  const $ = await load(k);
  const slug = slugOf(k, 'release__');
  const art = $('article.qt-release-content');
  const metas = art.find('.qt-release-metas').html() ?? '';
  const meta = (icon) => text(metas.split(`<i class="fa fa-${icon}"></i>`)[1]?.split('<i ')[0]);
  const tracks = art.find('.qt-tracklist > li').map((_, li) => {
    const $li = $(li);
    const play = $li.find('a.playable-mp3-link');
    // Video-Link (YouTube o. ä.) steht im Original direkt vor dem <li>; das Theme bettet ihn per JS ein
    const prev = $li.prev();
    return {
      title: text($li.find('h4').html()),
      artist: text($li.find('div > p').html()),
      mp3: localImage(play.attr('data-playtrack') || play.attr('data-mp3url')),
      buyUrl: $li.find('a.qw-track-buylink').attr('href'),
      video: prev.is('a') ? prev.attr('href') : undefined,
      videoLabel: prev.is('a') ? prev.html() : undefined,
    };
  }).get();
  // Kauf-Links des ganzen Releases (oberhalb der Trackliste)
  const buyLinks = art.find('p.qt-buylinks a').map((_, a) => ({ label: text($(a).html()), url: $(a).attr('href') })).get();
  await write('releases', slug, {
    title: text(art.find('h1').html()),
    wpId: wpId(art),
    catalog: meta('folder'),
    label: meta('tag'),
    date: meta('calendar') ? isoDate(meta('calendar')) : undefined,
    cover: img(art.find('img.wp-post-image').attr('src')),
    background: img($('.qt-featuredimage').attr('data-bgimageurl')),
    // 360°-Player im Kopf (Theme-Option je Release); ohne ihn spielen Tracks über den Player in der Kopfleiste
    headerPlayer: art.find('.ui360').length > 0,
    playerTitle: text(art.find('#qtTracktitle').html()),
    buyLinks,
    tracks,
    artists: releaseArtists[slug],
    genres: releaseGenres[slug],
    listOrder: listOrder.release[slug],
    format: 'html',
  }, html(art.find('.qt-thecontent').html()));
}

// ---------- Artists ----------
for (const k of keys.filter((k) => k.startsWith('artist__'))) {
  const $ = await load(k);
  const slug = slugOf(k, 'artist__');
  const art = $('article.artist');
  const col = art.find('.qt-artist');
  const booking = col.find('.qt-booking p').map((_, p) => ({
    label: text($(p).find('.qw-detTit').html()),
    value: $(p).find('.qw-detail-value').html()?.trim(),
  })).get();
  // frei benannte Zusatz-Sektion ("custom", z. B. Discography)
  const customAnchor = col.find('a#custom');
  let custom;
  if (customAnchor.length) {
    const title = text(customAnchor.next('h3').html());
    const parts = []; let n = customAnchor.next('h3').next();
    while (n.length) { parts.push($.html(n)); n = n.next(); }
    custom = { title, content: html(parts.join('\n')) };
  }
  const musicTitle = text(col.find('a#music').next('h3').html());
  await write('artists', slug, {
    name: text(art.find('h1').html()),
    wpId: wpId(art),
    subtitle: col.find('h4').first().html()?.trim(),
    photo: img(col.find('img.wp-post-image').attr('src')),
    background: img(art.find('.qt-featuredimage').attr('data-bgimageurl')),
    genres: terms(art, 'artistgenre'),
    booking,
    music: musicTitle ? { title: musicTitle } : undefined,
    custom,
    excerpt: excerpts.artists[slug],
    listOrder: listOrder.artist[slug],
    soundcloud: [],
    format: 'html',
  }, html(col.find('.qt-bio').html()));
}

// ---------- News (Beiträge) ----------
const isPost = async (k) => (await readFile(new URL(`${k}.html`, LIVE), 'utf8')).includes('single-post ');
for (const k of keys) {
  if (/__/.test(k) || !(await isPost(k))) continue;
  const $ = await load(k);
  const art = $('article.post');
  const id = wpId(art);
  await write('news', decodeURIComponent(k), {
    // slug explizit: Astro würde Emojis (⚠️) aus dem Dateinamen entfernen
    slug: decodeURIComponent(k),
    title: text(art.find('h1.qt-title').html()),
    wpId: id,
    date: isoDate(text(art.find('.qt-metas').html()).replace(/^admin\s*/, '')),
    author: text(art.find('.qt-metas a[rel=author]').html()),
    // nur echtes Beitragsbild; ohne zeigt das Theme das Standard-Kopfbild (wird in der Vorlage ergänzt)
    image: (art.attr('class') ?? '').includes('has-post-thumbnail') ? img($('.qt-featuredimage').attr('data-bgimageurl')) : undefined,
    categories: terms(art, 'category'),
    tags: terms(art, 'tag'),
    excerpt: excerpts.news[id],
    listOrder: listOrder.news[id],
    format: 'html',
  }, html(art.find('.qt-post-content > .qt-reading-opt').html()));
}

// ---------- Events ----------
// Ort/Stadt/Straße stehen nur in der Kopfzeile der Event-Liste: "Location // City <br> Street // Country"
const gigs = await load('gigs');
const eventList = {};
gigs('.qt-archiveevent-item').each((_, li) => {
  const $li = gigs(li);
  const slug = ($li.find('a.btn-primary').attr('href') ?? '').replace(/.*\/event\/|\/$/g, '');
  const [l1 = '', l2 = ''] = ($li.find('.collapsible-header p.color-main-light').html() ?? '').split(/<br\s*\/?>/);
  const [location, city] = l1.split('//').map((s) => text(s));
  const [street, country] = l2.split('//').map((s) => text(s));
  const excerpt = $li.find('.qt-event-details > p').not(':has(a.btn-primary)').first();
  eventList[slug] = { location, city, street, country, excerpt: excerpt.length ? html(excerpt.html()) : undefined };
});
for (const k of keys.filter((k) => k.startsWith('event__'))) {
  const $ = await load(k);
  const slug = slugOf(k, 'event__');
  const art = $('article.event');
  const row = (label) => art.find('.eventtable tr').filter((_, tr) => text($(tr).find('th').html()) === label).find('td');
  const info = eventList[slug] ?? {};
  await write('events', slug, {
    title: text(art.find('h1').html()),
    wpId: wpId(art),
    date: isoDate(text(row('Date:').html())),
    location: info.location,
    street: info.street,
    city: info.city,
    country: info.country,
    eventUrl: row('Event:').find('a').attr('href'),
    image: img(art.find('img.wp-post-image').attr('src')),
    background: img($('.qt-featuredimage').attr('data-bgimageurl')),
    buyLinks: art.find('.qw-buylinks a').map((_, a) => ({ label: text($(a).html()), url: $(a).attr('href') })).get(),
    excerpt: info.excerpt,
    listOrder: listOrder.event[slug],
    format: 'html',
  }, html(art.find('.qt-event-details').first().children().filter((_, el) => !$(el).is('h3, table, .qw-buylinks')).map((_, el) => $.html(el)).get().join('\n')));
}

// ---------- Friends (Members) ----------
for (const k of keys.filter((k) => k.startsWith('members__'))) {
  const $ = await load(k);
  const art = $('article.members');
  const id = wpId(art);
  await write('friends', slugOf(k, 'members__'), {
    name: text(art.find('h1').html()),
    wpId: id,
    headerImage: img(art.find('header').attr('data-bgimage')),
    profilePic: img(art.find('.qt-profilepic img').attr('src')),
    listImage: excerpts.friends[id]?.listImage,
    memberTypes: terms(art, 'membertype'),
    socials: excerpts.friends[id]?.socials,
    excerpt: excerpts.friends[id]?.excerpt,
    listOrder: listOrder.members[slugOf(k, 'members__')],
    format: 'html',
  }, html(art.find('.qt-reading-opt').html()));
}

// ---------- Seiten (statische Seiten + Einleitungen der Übersichtsseiten) ----------
const DEFAULT_HEADER = '/wp-content/uploads/2023/07/Screenshot-2023-07-27-at-23.24.19.png';
const pageKeys = ['about', 'team', 'sample-page', 'privacy-policy', 'my-charts-2', 'impressum', 'releases', 'dicular-rec-news', 'artists', 'gigs', 'friends'];
for (const k of pageKeys) {
  const raw = await readFile(new URL(`${k}.html`, LIVE), 'utf8');
  const $ = cheerio.load(raw, { decodeEntities: false });
  const template = raw.match(/<html class="no-js qt-template-([a-z-]*)"/)?.[1] || 'default';
  const holder = $('[class*="post-"][class*="type-page"]').first();
  const bg = $('.qt-featuredimage').attr('data-bgimageurl');
  let body = '';
  if (template === 'default') body = $('main .qt-post-content').html();
  else if (template === 'page-composer') body = $('article.qt-content').first().children().filter((_, el) => !$(el).is('header, .qt-featuredimage-container')).map((_, el) => $.html(el)).get().join('\n');
  else {
    const main = $('main').first();
    const parts = [];
    main.children().each((_, el) => { if ($(el).is('#itemslist, .qt-loadmore-container, .qt-pagination')) return false; parts.push($.html(el)); });
    body = parts.join('\n');
  }
  await write('pages', k, {
    title: text($('h1').first().html()),
    wpId: wpId(holder) || Number(raw.match(/page-id-(\d+)/)?.[1]),
    template,
    image: (holder.attr('class') ?? '').includes('has-post-thumbnail') ? img(bg) : undefined,
    headerImage: bg && localImage(bg) !== DEFAULT_HEADER && !(holder.attr('class') ?? '').includes('has-post-thumbnail') ? img(bg) : undefined,
    customCss: raw.match(/<style type="text\/css" data-type="vc_shortcodes-custom-css">([\s\S]*?)<\/style>/)?.[1],
    format: 'html',
  }, html(body));
}
img(DEFAULT_HEADER);

await writeFile(new URL('../.cache/media.txt', import.meta.url), [...media].sort().map((p) => `https://dicular-records.com${p}`).join('\n') + '\n');
console.log(`Import fertig. Medien: ${media.size}`);
for (const w of warnings) console.warn('WARNUNG:', w);
