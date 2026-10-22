// Nachbearbeitung des fertigen Builds (läuft automatisch nach `astro build`, npm-Skript postbuild).
//
// 1. Bilder: Für jedes lokale Bild entstehen verkleinerte WebP-Varianten (dist/_img/<breite>/<pfad>.webp).
//    <img> bekommt ein srcset mit diesen Varianten — der Browser lädt nur die passende Größe (wie live über
//    den WordPress-Bild-CDN i0.wp.com). Hintergrundbilder (data-bgimage, url(...)) werden zu WebP in Originalgröße.
//    Varianten werden in .cache/img zwischengespeichert, spätere Builds erzeugen nur neue.
// 2. Ballast: Plugin-Dateien aus dem WordPress-Rahmen, die eine Seite nicht braucht, werden aus ihr entfernt
//    (Liste OPTIONAL unten; geprüft an allen Seiten, siehe docs/DECISIONS).
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, stat, copyFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const CACHE = join(ROOT, '.cache', 'img');
const IMG = /\.(jpe?g|png|webp)$/i;
const MAX = 2400; // größte ausgelieferte Breite
const STEPS = [480, 768, 1024, 1536, 2048];
const QUALITY = 80;

// ------------------------------------------------------------------ Ballast
// needs: woran man im Seiteninhalt erkennt, dass die Dateien gebraucht werden; ids: id-Attribute der Tags
const OPTIONAL = [
  { name: 'Datei-Upload (WP File Upload + jQuery UI)', needs: /wfu_|file_upload/,
    ids: ['wordpress-file-upload-style-css', 'wordpress-file-upload-style-safe-css', 'wordpress-file-upload-adminbar-style-css',
      'jquery-ui-css-css', 'jquery-ui-timepicker-addon-css-css', 'wordpress_file_upload_script-js', 'jquery-ui-core-js-before',
      'jquery-ui-core-js', 'jquery-ui-datepicker-js', 'jquery-ui-datepicker-js-after', 'jquery-ui-timepicker-addon-js-js'] },
  // Swipebox öffnet Links auf Bilder/YouTube/Vimeo automatisch als Lightbox
  { name: 'Lightbox (Swipebox)', needs: /class="[^"]*(swipebox|gallery|Collage)|<a [^>]*href="[^"]*(\.jpe?g|\.png|\.gif|youtube\.com|youtu\.be|vimeo\.com)/i,
    ids: ['QtswipeStyle-css', 'swipebox-js'] },
  { name: 'Videogalerie (QT Videogalleries)', needs: /data-bgimg=|filterable-grid|vdl-element|filterOptions/,
    ids: ['vdl_css-css', 'qtsubpages_quicksand-js', 'qtsubpages_easing-js', 'qtsubpages_csstransform-js',
      'qtsubpages_jquery-animate-css-rotate-scale-js', 'vdl_subpages_js-js'] },
  // $.fn.slider des Themes stammt aus materialize.js (lädt später und überschreibt jQuery UI)
  { name: 'jQuery-UI-Slider', needs: /ui-slider/, ids: ['jquery-ui-mouse-js', 'jquery-ui-slider-js'] },
  { name: 'Icon-Komponente (Classic Addons)', needs: /caw-/, ids: ['caw-icon-component-css'] },
  // ohne externe Inhalte/Tracking nicht nötig; Text der Leiste war die Plugin-Vorlage (Werbung/Analyse)
  { name: 'Cookie-Leiste (EU Cookies Bar)', needs: null,
    ids: ['eu-cookies-bar-icons-css', 'eu-cookies-bar-style-css', 'eu-cookies-bar-style-inline-css', 'eu-cookies-bar-script-js-extra', 'eu-cookies-bar-script-js'] },
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function prune(html) {
  const content = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/g, '').replace(/<link[^>]*>/g, '');
  const removed = [];
  for (const o of OPTIONAL) {
    if (o.needs?.test(content)) continue;
    for (const id of o.ids) {
      const i = esc(id), q = `['"]${i}['"]`;
      html = html
        .replace(new RegExp(`<noscript><link[^>]*id=${q}[^>]*>\\s*</noscript>\\n?`, 'g'), '')
        .replace(new RegExp(`<link[^>]*id=${q}[^>]*>\\n?`, 'g'), '')
        .replace(new RegExp(`<script[^>]*id=${q}[^>]*>[\\s\\S]*?</script>\\n?`, 'g'), '')
        .replace(new RegExp(`<style[^>]*id=${q}[^>]*>[\\s\\S]*?</style>\\n?`, 'g'), '');
    }
    removed.push(o.name);
  }
  return { html, removed };
}

// ------------------------------------------------------------------ Bilder
const meta = new Map();
async function info(url) {
  if (!meta.has(url)) {
    meta.set(url, (async () => {
      const file = join(DIST, decodeURI(url.split(/[?#]/)[0]));
      if (!IMG.test(file)) return null;
      try {
        const m = await sharp(file).metadata();
        // CMYK-JPEGs (Druckvorlagen, meist ohne Farbprofil) stellt der Browser anders dar, als sharp sie umrechnet
        // → Original unverändert lassen, sonst kippen die Farben (getestet: Event-Flyer grün → türkis)
        if (m.space === 'cmyk') return null;
        return { file, width: m.width, height: m.height };
      } catch { return null; }
    })());
  }
  return meta.get(url);
}
let made = 0, reused = 0;
const jobs = new Map();
/** URL der WebP-Variante mit Breite w (nie größer als das Original); erzeugt die Datei bei Bedarf */
function variant(url, src, w) {
  w = Math.min(w, src.width, MAX);
  const rel = `_img/${w}${url.split(/[?#]/)[0].replace(/\.[a-z]+$/i, '.webp')}`;
  if (!jobs.has(rel)) {
    jobs.set(rel, (async () => {
      const out = join(DIST, decodeURI(rel)), cached = join(CACHE, decodeURI(rel));
      const [c, s] = await Promise.all([stat(cached).catch(() => null), stat(src.file)]);
      if (!c || c.mtimeMs < s.mtimeMs) {
        await mkdir(dirname(cached), { recursive: true });
        await sharp(src.file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(cached);
        made++;
      } else reused++;
      await mkdir(dirname(out), { recursive: true });
      await copyFile(cached, out);
    })());
  }
  return '/' + rel;
}
const isLocal = (u) => u.startsWith('/') && !u.startsWith('//') && IMG.test(u.split(/[?#]/)[0]);
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, 'i')); return m ? m[2] : undefined; };
const setAttr = (tag, name, value) => (attr(tag, name) !== undefined
  ? tag.replace(new RegExp(`(\\s${name}=)(["']).*?\\2`, 'i'), `$1"${value}"`)
  : tag.replace(/\s*\/?>$/, (end) => ` ${name}="${value}"${end}`));

async function img(tag) {
  const src = attr(tag, 'src');
  if (!src || !isLocal(src)) return tag;
  const s = await info(src);
  if (!s) return tag;
  const set = attr(tag, 'srcset');
  let candidates;
  if (set) {
    // vorhandenes srcset (aus WordPress): gleiche Breiten, aber echte verkleinerte Dateien.
    // Kleine Kandidaten (< 300 w) waren in WordPress Quadrat-Zuschnitte → weglassen statt verzerren.
    candidates = set.split(',').map((c) => c.trim().split(/\s+/)).filter(([u, d]) => isLocal(u) && /^\d+w$/.test(d ?? ''))
      .map(([, d]) => parseInt(d)).filter((w) => w >= 300);
  }
  if (!candidates?.length) candidates = [...STEPS.filter((w) => w < s.width), s.width];
  const widths = [...new Set(candidates.map((w) => Math.min(w, s.width, MAX)))].sort((a, b) => a - b);
  const srcset = widths.map((w) => `${variant(src, s, w)} ${w}w`).join(', ');
  let out = setAttr(tag, 'srcset', srcset);
  // wie WordPress: höchstens so breit wie das width-Attribut, darunter Bildschirmbreite. Ohne width-Attribut
  // die echte Bildbreite — sonst hält der Browser das Bild für bildschirmbreit und zieht es hoch (Evosonic-Foto)
  const wAttr = parseInt(attr(tag, 'width') ?? '') || s.width;
  if (!attr(tag, 'sizes')) out = setAttr(out, 'sizes', `(max-width: ${wAttr}px) 100vw, ${wAttr}px`);
  return setAttr(out, 'src', variant(src, s, Math.min(s.width, MAX)));
}
async function bg(url) {
  if (!isLocal(url)) return url;
  const s = await info(url);
  return s ? variant(url, s, Math.min(s.width, MAX)) : url;
}
async function replaceAsync(str, re, fn) {
  const parts = await Promise.all([...str.matchAll(re)].map((m) => fn(...m)));
  let i = 0;
  return str.replace(re, () => parts[i++]);
}

// ------------------------------------------------------------------ Durchlauf
async function* pages(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!['admin', '_img', 'wp-content', 'wp-includes', '_thumbs'].includes(e.name)) yield* pages(p); }
    else if (extname(e.name) === '.html') yield p;
  }
}
const stats = {};
let count = 0;
const urls = [];
for await (const file of pages(DIST)) {
  const rel = file.slice(DIST.length).split('\\').join('/');
  if (rel.endsWith('/index.html')) urls.push(rel.slice(0, -'index.html'.length));
  let html = await readFile(file, 'utf8');
  const p = prune(html);
  html = p.html;
  for (const r of p.removed) stats[r] = (stats[r] ?? 0) + 1;
  html = await replaceAsync(html, /<img\b[^>]*>/gi, img);
  html = await replaceAsync(html, /(data-bgimage(?:url)?=)(["'])(.*?)\2/g, async (m, a, q, u) => `${a}${q}${await bg(u)}${q}`);
  html = await replaceAsync(html, /url\((["']?)([^"')]+)\1\)/g, async (m, q, u) => `url(${q}${await bg(u)}${q})`);
  await writeFile(file, html);
  count++;
}
await Promise.all(jobs.values());

// ------------------------------------------------------------------ Sitemap + robots.txt (für Google)
const SITE = 'https://dicular-records.com';
const loc = (u) => SITE + u.split('/').map((s) => encodeURIComponent(decodeURIComponent(s))).join('/');
await writeFile(join(DIST, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.sort().map((u) => `  <url><loc>${loc(u)}</loc></url>`).join('\n') + '\n</urlset>\n');
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`optimize-dist: ${count} Seiten · Bildvarianten ${made} neu, ${reused} aus Cache · Sitemap ${urls.length} Adressen`);
for (const [k, v] of Object.entries(stats)) console.log(`  entfernt auf ${v} Seiten: ${k}`);
