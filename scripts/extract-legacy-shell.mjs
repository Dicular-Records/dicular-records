// Extrahiert die seitenübergreifenden Theme-Bausteine (Styles, Scripts, Cookie-Bar) wörtlich
// aus der Live-WordPress-Startseite nach src/legacy/*.html.
// Entfernt: Tracking (Jetpack Stats, Google jsapi/Maps, Site Kit), WP-Interna (oEmbed, RSD, REST),
// seitenspezifisches CSS (vc_shortcodes-custom-css → kommt pro Seite aus dem Content).
// Aufruf: node scripts/extract-legacy-shell.mjs [url]
import { writeFile, mkdir } from 'node:fs/promises';

const SOURCE = process.argv[2] ?? 'https://dicular-records.com/';
const OUT = new URL('../src/legacy/', import.meta.url);

const html = await (await fetch(SOURCE, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();

export function localizeUrls(s) {
  return s
    .replace(/https:\/\/i[0-9]\.wp\.com\/(?:www\.)?dicular-records\.com\/([^"'\s?)]+)(\?[^"'\s)]*)?/g, '/$1')
    .replace(/https:\/\/c0\.wp\.com\/c\/[^/]+\//g, '/')
    .replace(/https?:\/\/(?:www\.)?dicular-records\.com\//g, '/')
    .replace(/(\.(?:css|js))\?ver=[^"'\s]*/g, '$1');
}

const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));

// --- Head: Stylesheets in Originalreihenfolge (die <noscript>-Varianten sind die "echten" Links),
// head-Scripts, Inline-Styles
const headParts = [];
// Ladeverhalten wie im Original (Jetpack Boost): Critical-CSS inline, Stylesheets asynchron
// (media="not all" → beim load-Event aktiviert, siehe scripts.html), <noscript>-Fallback.
// Das Timing beeinflusst die WPBakery/skrollr-Parallax-Initialisierung (Logo-Einblendung) — daher beibehalten.
const tokenRe = /<noscript>\s*<link[^>]+>\s*<\/noscript>|<link[^>]+stylesheet[^>]*>|<noscript>\s*<style[\s\S]*?<\/noscript>|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>/g;
for (const m of head.matchAll(tokenRe)) {
  const tok = m[0];
  // seitenspezifisches CSS (kommt pro Seite aus dem Content) und Tracking weglassen
  if (/vc_shortcodes-custom-css|jetpack-stats|google\.com\/jsapi|googletagmanager|gtag\(/.test(tok)) continue;
  headParts.push(tok);
}

// --- Cookie-Bar (EU Cookies Bar Plugin) wörtlich
const cbStart = body.indexOf('<div class="eu-cookies-bar-cookies-bar-wrap');
const cbEnd = body.indexOf('<script type="text/html" id="wpb-modifications">');
const cookieBar = body.slice(cbStart, cbEnd).trim();

// --- Footer-Scripts in Originalreihenfolge, ohne Tracking/Maps/Speculation/Boost-Loader
const scripts = [];
for (const m of body.slice(cbEnd).matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)) {
  const s = m[0];
  if (/stats\.wp\.com|_stq|maps\.googleapis|speculationrules|type="text\/html"/.test(s)) continue;
  scripts.push(s.replace(/\n\/\/# sourceURL=[^\n]*/, ''));
}

await mkdir(OUT, { recursive: true });
const banner = (what) => `<!-- ${what}: extrahiert aus ${SOURCE} via scripts/extract-legacy-shell.mjs — nicht von Hand ändern -->\n`;
await writeFile(new URL('head.html', OUT), banner('Theme-Styles/Head-Scripts') + localizeUrls(headParts.join('\n')) + '\n');
await writeFile(new URL('cookiebar.html', OUT), banner('EU-Cookie-Bar') + localizeUrls(cookieBar) + '\n');
await writeFile(new URL('scripts.html', OUT), banner('Footer-Scripts') + localizeUrls(scripts.join('\n')) + '\n');
console.log(`head: ${headParts.length} Teile, scripts: ${scripts.length}, cookiebar: ${cookieBar.length} Zeichen`);
