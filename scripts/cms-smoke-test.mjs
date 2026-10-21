// Rundlauf-Test der Redaktionsoberfläche (lokal): Artist öffnen, Text in der Biografie ergänzen, veröffentlichen.
// Voraussetzung: `npm run build && npm run preview` (Port 4321) und `npx decap-server` (Port 8081, schreibt ins Repo!).
// Danach mit `git diff src/content/artists/<slug>.md` prüfen und mit `git checkout` zurücksetzen.
// Aufruf: node scripts/cms-smoke-test.mjs [slug] [zusatztext]
import { chromium } from 'playwright';
const slug = process.argv[2] ?? 'dj-steintekk';
const extra = process.argv[3] ?? ' TESTZUSATZ';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const base = 'http://localhost:4321/admin/index.html';
await p.goto(base);
await p.getByRole('button', { name: 'Login' }).click();
await p.goto(`${base}#/collections/artists/entries/${slug}`);
await p.locator('.dicular-rte').first().waitFor();
await p.locator('.dicular-rte').first().evaluate((r, text) => {
  r.focus();
  const range = document.createRange();
  range.selectNodeContents(r.lastElementChild || r); range.collapse(false);
  getSelection().removeAllRanges(); getSelection().addRange(range);
  document.execCommand('insertText', false, text);
  r.blur();
}, extra);
await p.getByRole('button', { name: 'Veröffentlichen' }).click();
await p.getByText('Jetzt veröffentlichen').click();
await p.waitForTimeout(3000);
const errors = await p.locator('li', { hasText: 'erforderlich' }).allTextContents();
await p.screenshot({ path: 'docs/screens/cms-5-nach-speichern.png' });
console.log(errors.length ? `FEHLER: ${errors.join(' | ')}` : 'gespeichert');
await b.close();
