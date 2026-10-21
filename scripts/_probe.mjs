import { chromium } from 'playwright';
const b = await chromium.launch();
const [path, sel] = process.argv.slice(2);
for (const base of ['https://dicular-records.com', 'http://localhost:4321']) {
  const mob = process.env.MOBILE; const ctx = await b.newContext(mob ? { viewport: { width: 390, height: 844 }, isMobile: true } : { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: 'load' });
  await p.waitForTimeout(4000);
  console.log(base, JSON.stringify(await p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => `${e.tagName}.${(e.className||'').toString().slice(0,22)}#${e.id} ${Math.round(e.getBoundingClientRect().top + scrollY)}+${Math.round(e.getBoundingClientRect().height)}`), sel)));
  await ctx.close();
}
await b.close();
