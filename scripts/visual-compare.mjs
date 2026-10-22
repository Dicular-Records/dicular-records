// Visueller 1:1-Vergleich Live-WordPress ↔ Astro-Nachbau (ganze Seite, Desktop + Mobil, Pixel-Diff).
// Voraussetzung: `npm run build && npm run preview` läuft (Standard http://localhost:4321).
// Aufruf: node scripts/visual-compare.mjs [/pfad/ ...]   oder   --all (alle Seiten aus docs/SEITENINVENTAR.md, Abschnitt A)
// Ergebnis: compare/report.json; Bilder (live/local/diff) nur bei Einzelpfaden oder Abweichung > KEEP % (Standard 0,3)
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const LIVE = process.env.LIVE_URL ?? 'https://dicular-records.com';
const LOCAL = process.env.LOCAL_URL ?? 'http://localhost:4321';
const KEEP = Number(process.env.KEEP ?? 0.3);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);
const args = process.argv.slice(2);
const all = args.includes('--all');
let paths = args.filter((a) => !a.startsWith('--'));
if (all) {
  const inv = await readFile(new URL('../docs/SEITENINVENTAR.md', import.meta.url), 'utf8');
  paths = [...inv.slice(0, inv.indexOf('## B.')).matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
}
if (!paths.length) paths = ['/'];
const keepAll = !all;

const viewports = {
  desktop: { width: 1440, height: 900, isMobile: false },
  mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 },
};
// Durchscrollen (Waypoint-Animationen, skrollr), dann oben auf geladene Bilder warten — beide Seiten identisch
const settle = async (page) => {
  // Cookie-Leiste (fixiert, identischer Zustand auf beiden Seiten, aber zeitlich schwankend) für den Vergleich ausblenden
  await page.addStyleTag({ content: ".eu-cookies-bar-cookies-bar-wrap,.eu-cookies-bar-cookies-settings-call-container{visibility:hidden!important}" }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
  });
  await page.waitForTimeout(3000);
  // Headless-Chromium zeichnet Bilder mit srcset im Ganzseiten-Screenshot teils schwarz, obwohl sie im Browser
  // sichtbar sind (geprüft). Einmal neu zuweisen (beide Seiten gleich) → werden korrekt gezeichnet.
  await page.evaluate(async () => {
    for (const i of document.images) if (i.srcset) { const s = i.srcset; i.srcset = ''; i.srcset = s; }
    await new Promise((r) => setTimeout(r, 1500));
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
};
const dirName = (p) => (decodeURIComponent(p).replace(/^\/|\/$/g, '').replace(/[\/\\:*?"<>|]/g, '_') || 'home');

const browser = await chromium.launch();
const report = [];
async function shoot(base, p, vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor ?? 1, userAgent: vp.isMobile ? undefined : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
  try {
    const page = await ctx.newPage();
    const res = await page.goto(base + p, { waitUntil: 'load', timeout: 60000 });
    await settle(page);
    return { status: res?.status(), png: PNG.sync.read(await page.screenshot({ fullPage: true })) };
  } finally { await ctx.close(); }
}
async function compare(p) {
  for (const [vpName, vp] of Object.entries(viewports)) {
    try {
      const [live, local] = await Promise.all([shoot(LIVE, p, vp), shoot(LOCAL, p, vp)]);
      const w = Math.max(live.png.width, local.png.width), h = Math.max(live.png.height, local.png.height);
      const pad = (img) => { const out = new PNG({ width: w, height: h }); PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0); return out; };
      const a = pad(live.png), b = pad(local.png), diff = new PNG({ width: w, height: h });
      const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1 });
      const entry = { path: p, viewport: vpName, status: [live.status, local.status], liveSize: [live.png.width, live.png.height], localSize: [local.png.width, local.png.height], diffPercent: +(100 * changed / (w * h)).toFixed(3) };
      if (keepAll || entry.diffPercent > KEEP || entry.liveSize[1] !== entry.localSize[1]) {
        const dir = new URL(`../compare/${dirName(p)}/`, import.meta.url);
        await mkdir(dir, { recursive: true });
        await writeFile(new URL(`live-${vpName}.png`, dir), PNG.sync.write(live.png));
        await writeFile(new URL(`local-${vpName}.png`, dir), PNG.sync.write(local.png));
        await writeFile(new URL(`diff-${vpName}.png`, dir), PNG.sync.write(diff));
      }
      report.push(entry);
      console.log(JSON.stringify(entry));
    } catch (e) {
      report.push({ path: p, viewport: vpName, error: String(e).slice(0, 200) });
      console.log(JSON.stringify({ path: p, viewport: vpName, error: String(e).slice(0, 200) }));
    }
  }
}
const queue = [...paths];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await compare(queue.shift()); }));
await browser.close();
report.sort((x, y) => (y.diffPercent ?? 999) - (x.diffPercent ?? 999));
await mkdir(new URL('../compare/', import.meta.url), { recursive: true });
await writeFile(new URL('../compare/report.json', import.meta.url), JSON.stringify(report, null, 2));
