// Visueller 1:1-Vergleich Live-WordPress ↔ Astro-Nachbau (ganze Seite, Desktop + Mobil, Pixel-Diff).
// Voraussetzung: `npm run build && npm run preview` läuft (Standard http://localhost:4321).
// Aufruf: node scripts/visual-compare.mjs [/pfad/ ...]   → Ergebnis in compare/<pfad>/{live,local,diff}-<viewport>.png + compare/report.json
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';

const LIVE = process.env.LIVE_URL ?? 'https://dicular-records.com';
const LOCAL = process.env.LOCAL_URL ?? 'http://localhost:4321';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const viewports = {
  desktop: { width: 1440, height: 900, isMobile: false },
  mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 },
};
// Cookie-Bar-Zustand und laufende Animationen vereinheitlichen (beide Seiten identisch behandelt)
const settle = async (page) => {
  await page.waitForLoadState('networkidle').catch(() => {});
  // einmal durchscrollen (Waypoint-Animationen, skrollr), dann oben auf geladene Bilder warten
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  await page.waitForTimeout(3000);
};

const browser = await chromium.launch();
const report = [];
for (const p of paths) {
  const dir = new URL(`../compare/${p.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home'}/`, import.meta.url);
  await mkdir(dir, { recursive: true });
  for (const [vpName, vp] of Object.entries(viewports)) {
    const shots = {};
    for (const [side, base] of [['live', LIVE], ['local', LOCAL]]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor ?? 1, userAgent: vp.isMobile ? undefined : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: 'load', timeout: 60000 });
      await settle(page);
      shots[side] = PNG.sync.read(await page.screenshot({ fullPage: true }));
      await writeFile(new URL(`${side}-${vpName}.png`, dir), PNG.sync.write(shots[side]));
      await ctx.close();
    }
    const w = Math.max(shots.live.width, shots.local.width);
    const h = Math.max(shots.live.height, shots.local.height);
    const pad = (img) => { const out = new PNG({ width: w, height: h }); PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0); return out; };
    const a = pad(shots.live), b = pad(shots.local), diff = new PNG({ width: w, height: h });
    const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1 });
    await writeFile(new URL(`diff-${vpName}.png`, dir), PNG.sync.write(diff));
    const entry = { path: p, viewport: vpName, liveSize: [shots.live.width, shots.live.height], localSize: [shots.local.width, shots.local.height], diffPixels: changed, diffPercent: +(100 * changed / (w * h)).toFixed(3) };
    report.push(entry);
    console.log(JSON.stringify(entry));
  }
}
await browser.close();
await writeFile(new URL('../compare/report.json', import.meta.url), JSON.stringify(report, null, 2));
