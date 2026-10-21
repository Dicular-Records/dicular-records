import { chromium } from 'playwright';
const b = await chromium.launch();
const path = process.argv[2];
for (const base of ['https://dicular-records.com', 'http://localhost:4321']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: 'load' });
  await p.waitForTimeout(4000);
  console.log(base, JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('header.qt-header, article, .qt-featimg, .qt-featimg img, .qt-contentwrap, footer.qt-footer, .text-center')].map((e) => `${e.tagName}.${(e.className||'').toString().slice(0,25)} ${Math.round(e.getBoundingClientRect().top + scrollY)}+${Math.round(e.getBoundingClientRect().height)}`))));
  await ctx.close();
}
await b.close();
