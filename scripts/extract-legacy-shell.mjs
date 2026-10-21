// Extrahiert die seitenübergreifenden Theme-Bausteine (Styles, Scripts, Cookie-Bar) wörtlich
// aus den Live-WordPress-Seiten (.cache/live, vorher `node scripts/cache-live.mjs`) nach src/legacy/.
//
// Zwei Kopf-Varianten wie im Original:
//   boost/  — Jetpack Boost: Critical-CSS inline, Stylesheets asynchron (media="not all" → beim load-Event aktiviert)
//   plain/  — Tag- und Autoren-Archive: normale, synchrone Stylesheets
// Critical-CSS je Seitentyp → src/legacy/critical/<typ>.css (Boost erzeugt es pro Vorlage).
// Das Ladeverhalten beeinflusst die Initialisierung von WPBakery-Parallax, skrollr und Masonry — daher beibehalten.
//
// Entfernt: Tracking (Jetpack Stats, Google jsapi/Maps, Site Kit), seitenspezifisches CSS (vc_shortcodes-custom-css).
// Aufruf: node scripts/extract-legacy-shell.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { localizeUrls } from './lib/localize.mjs';

const LIVE = new URL('../.cache/live/', import.meta.url);
const OUT = new URL('../src/legacy/', import.meta.url);
const read = (k) => readFile(new URL(`${k}.html`, LIVE), 'utf8');

// Seitentyp → repräsentative Live-Seite (gleiches Critical-CSS innerhalb eines Typs, geprüft per Hash)
const CRITICAL = {
  home: 'home', page: 'about', post: 'dic032-steintekk-milia', release: 'release__polar', artist: 'artist__yoka',
  event: 'event__liebelei', members: 'members__szenekonzept', category: 'category__news', genre: 'genre__progressive-trance',
  membertype: 'membertype__iot',
};
const VARIANTS = { boost: 'home', plain: 'tag__dj' };

const banner = (what, src) => `<!-- ${what}: extrahiert aus ${src} via scripts/extract-legacy-shell.mjs — nicht von Hand ändern -->\n`;

function extract(html) {
  const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
  const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  const headParts = [];
  const tokenRe = /<noscript>\s*<link[^>]+>\s*<\/noscript>|<link[^>]+stylesheet[^>]*>|<noscript>\s*<style[\s\S]*?<\/noscript>|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>/g;
  for (const m of head.matchAll(tokenRe)) {
    const tok = m[0];
    // Critical-CSS kommt je Seitentyp separat; seitenspezifisches CSS aus dem Content; Tracking weg
    if (/jetpack-boost-critical-css|vc_shortcodes-custom-css|jetpack-stats|google\.com\/jsapi|googletagmanager|gtag\(/.test(tok)) continue;
    headParts.push(tok);
  }
  const cbStart = body.indexOf('<div class="eu-cookies-bar-cookies-bar-wrap');
  // Ende der Cookie-Bar: WPBakery-Marker (nur auf Seiten mit WPBakery), sonst erstes folgendes <script>
  let cbEnd = body.indexOf('<script type="text/html" id="wpb-modifications">');
  if (cbEnd < 0) cbEnd = body.indexOf('<script', cbStart);
  const scripts = [];
  for (const m of body.slice(cbEnd).matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)) {
    const s = m[0];
    if (/stats\.wp\.com|_stq|maps\.googleapis|speculationrules|type="text\/html"/.test(s)) continue;
    scripts.push(s.replace(/\n\/\/# sourceURL=[^\n]*/, ''));
  }
  return { head: headParts.join('\n'), scripts: scripts.join('\n'), cookieBar: body.slice(cbStart, cbEnd).trim() };
}

for (const [variant, key] of Object.entries(VARIANTS)) {
  const { head, scripts, cookieBar } = extract(await read(key));
  await mkdir(new URL(`${variant}/`, OUT), { recursive: true });
  await writeFile(new URL(`${variant}/head.html`, OUT), banner('Theme-Styles/Head-Scripts', key) + localizeUrls(head) + '\n');
  await writeFile(new URL(`${variant}/scripts.html`, OUT), banner('Footer-Scripts', key) + localizeUrls(scripts) + '\n');
  if (variant === 'boost') await writeFile(new URL('cookiebar.html', OUT), banner('EU-Cookie-Bar', key) + localizeUrls(cookieBar) + '\n');
  console.log(`${variant}: head ${head.length}, scripts ${scripts.length}`);
}
await mkdir(new URL('critical/', OUT), { recursive: true });
for (const [type, key] of Object.entries(CRITICAL)) {
  const css = (await read(key)).match(/<style id="jetpack-boost-critical-css">([\s\S]*?)<\/style>/)?.[1] ?? '';
  await writeFile(new URL(`critical/${type}.css`, OUT), localizeUrls(css));
  console.log(`critical/${type}.css: ${css.length}`);
}
