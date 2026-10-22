// Vergleicht Positionen/Größen der Kacheln (Masonry) live ↔ lokal, unabhängig von Pixel-Timing.
// Aufruf: node scripts/layout-diff.mjs /pfad/ [selector] [mobile|desktop]
import { chromium } from 'playwright';
const [p = '/', sel = 'article, .masonry-item, .grid-item', vpName = 'mobile'] = process.argv.slice(2);
const vp = vpName === 'mobile' ? { width: 390, height: 844, isMobile: true } : { width: 1440, height: 900, isMobile: false };
const browser = await chromium.launch();
async function measure(base) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile });
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });
  await page.waitForTimeout(3000);
  const r = await page.evaluate((s) => [...document.querySelectorAll(s)].map((e) => { const b = e.getBoundingClientRect(); return { k: (e.id || e.className).toString().slice(0, 40), x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height),
    inner: [...e.querySelectorAll('img,h1,h2,h3,h4,h5,p,.entry-summary,.post-content')].slice(0, 8).map((c) => { const cb = c.getBoundingClientRect(); return c.tagName + ':' + Math.round(cb.height); }).join(' ') }; }), sel);
  await ctx.close();
  return r;
}
const [a, b] = await Promise.all([measure('https://dicular-records.com'), measure('http://localhost:4321')]);
console.log('live', a.length, 'lokal', b.length);
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const l = a[i], o = b[i];
  const same = l && o && l.x === o.x && l.y === o.y && l.w === o.w && l.h === o.h;
  if (!same) console.log(i, 'LIVE', l && `${l.k} ${l.x},${l.y} ${l.w}x${l.h} [${l.inner}]`, '\n  LOK ', o && `${o.k} ${o.x},${o.y} ${o.w}x${o.h} [${o.inner}]`);
}
await browser.close();
