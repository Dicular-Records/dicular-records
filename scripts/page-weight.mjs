// Ladegewicht einzelner Seiten (alle Anfragen nach vollständigem Durchscrollen), Desktop + Mobil.
// Aufruf: node scripts/page-weight.mjs [/pfad/ ...]   (BASE_URL, Standard http://localhost:4321)
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/release/dic032-steintekk-milia/', '/artist/tomtron/', '/friends/', '/event/klang-der-essenzen/'];
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 3 } };
const browser = await chromium.launch();
const kb = (b) => (b / 1024 / 1024).toFixed(2).padStart(6) + ' MB';
for (const p of paths) for (const [name, vp] of Object.entries(vps)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  const page = await ctx.newPage();
  const sizes = { img: 0, script: 0, css: 0, other: 0 }; let n = 0;
  page.on('response', async (r) => {
    if (!r.url().startsWith(BASE)) return;
    const b = (await r.body().catch(() => Buffer.alloc(0))).length; n++;
    const t = r.request().resourceType();
    sizes[t === 'image' ? 'img' : t === 'script' ? 'script' : t === 'stylesheet' ? 'css' : 'other'] += b;
  });
  await page.goto(BASE + p, { waitUntil: 'load' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
  await page.waitForLoadState('networkidle').catch(() => {});
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  console.log(`${name.padEnd(7)} ${kb(total)}  Bilder ${kb(sizes.img)}  JS ${kb(sizes.script)}  CSS ${kb(sizes.css)}  Anfragen ${String(n).padStart(3)}  ${p}`);
  await ctx.close();
}
await browser.close();
