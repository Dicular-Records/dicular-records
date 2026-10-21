// Lädt alle Seiten aus docs/SEITENINVENTAR.md (Abschnitt A) als Server-HTML nach .cache/live/<pfad>.html
// und schreibt pro Seite den Inhaltsbereich (zwischen "end header.php" und <footer>) nach .cache/main/.
// Grundlage für den Inhalts-Import (scripts/import-live.mjs). Aufruf: node scripts/cache-live.mjs [--force]
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';

const SITE = 'https://dicular-records.com';
const force = process.argv.includes('--force');
const inv = await readFile(new URL('../docs/SEITENINVENTAR.md', import.meta.url), 'utf8');
const partA = inv.slice(0, inv.indexOf('## B.'));
const paths = [...partA.matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);

export const fileKey = (p) => (p.replace(/^\/|\/$/g, '') || 'home').replace(/\//g, '__');

for (const dir of ['live', 'main']) await mkdir(new URL(`../.cache/${dir}/`, import.meta.url), { recursive: true });
let n = 0;
for (const p of paths) {
  const file = new URL(`../.cache/live/${fileKey(p)}.html`, import.meta.url);
  let html;
  if (!force && (await access(file).then(() => true, () => false))) html = await readFile(file, 'utf8');
  else {
    const res = await fetch(SITE + p, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    html = await res.text();
    await writeFile(file, html);
    n++;
  }
  const start = html.indexOf('end header.php');
  const end = html.indexOf('<footer class="qt-footer">');
  const main = html.slice(html.indexOf('\n', start) + 1, end);
  await writeFile(new URL(`../.cache/main/${fileKey(p)}.html`, import.meta.url), main);
}
console.log(`${paths.length} Seiten, ${n} neu geladen`);
