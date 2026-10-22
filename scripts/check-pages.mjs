// Prüft alle Seiten der Sitemap im lokalen Build: JS-Fehler, fehlerhafte Anfragen, Anfragen an fremde Server,
// Bilder, die unscharf sind, obwohl eine größere Variante bereitstand.
// Aufruf: node scripts/check-pages.mjs   (Vorschau muss laufen; BASE_URL, Standard http://localhost:4321)
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const xml = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const paths = [...xml.matchAll(/<loc>https:\/\/dicular-records\.com([^<]+)<\/loc>/g)].map((m) => m[1]);
const browser = await chromium.launch();
let problems = 0;
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobil', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  for (const p of paths) {
    const page = await ctx.newPage(); const out = [];
    page.on('pageerror', (e) => out.push('JS: ' + e.message.slice(0, 100)));
    page.on('response', (r) => { if (r.status() >= 400) out.push(r.status() + ' ' + r.url().replace(BASE, '')); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('https://dicular-records.com/wp-content/uploads/')) out.push('extern: ' + u.slice(0, 80)); });
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    await page.waitForTimeout(800);
    const blurry = await page.evaluate(() => [...document.images].filter((i) => i.currentSrc.includes('/_img/') && i.complete && i.offsetWidth > 40)
      .map((i) => { const file = parseInt(i.currentSrc.match(/\/_img\/(\d+)\//)[1]); return { file, need: Math.round(i.getBoundingClientRect().width * devicePixelRatio), src: i.currentSrc.split('/').pop().slice(0, 40) }; })
      .filter((x) => x.need > x.file * 1.1 && x.max > x.file)); // nur wenn eine größere Variante bereitstand
    for (const b of blurry) out.push(`unscharf: ${b.src} Datei ${b.file}px, angezeigt ${b.need}px`);
    if (out.length) { problems += out.length; console.log(vp.name, p, '\n   ' + [...new Set(out)].join('\n   ')); }
    await page.close();
  }
  await ctx.close();
}
console.log(`${paths.length} Seiten × 2 geprüft, ${problems} Befunde`);
await browser.close();
