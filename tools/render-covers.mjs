// Renders a cover image for every course into public/assets/covers/<id>.webp (1125x330).
// Usage (from the project root): node tools/render-covers.mjs [course-id ...]
// Needs Playwright with Chromium (npm i -D playwright). The design lives in tools/covers.html.
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public/assets/covers');
mkdirSync(OUT, { recursive: true });

const src = readFileSync(join(ROOT, 'src/data/courses.ts'), 'utf8');
const data = JSON.parse(src.match(/const DATA: CourseData\[\] = (\[.*?\n\]);/s)[1]);
const only = process.argv.slice(2);

// Same wording as the course cards: "12+ Hours", "28 Days", "30 Min".
const dur = (c) => c.meta.find((m) => /\d+\+?\s*(Hours|Days|Min)/i.test(m)) ?? '';
const info = Object.fromEntries(data.map((c) => [c.id, { price: c.price, was: c.was, dur: dur(c) }]));

const types = { '.html': 'text/html', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const file = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1125, height: 330 }, deviceScaleFactor: 1 });
await page.addInitScript((i) => (window.COURSES = i), info);
const ids = await (async () => {
  await page.goto(`${base}/tools/covers.html#claude-code`);
  return page.evaluate(() => Object.keys(C)); // courses that have a cover design
})();
let n = 0;
for (const id of ids.filter((x) => !only.length || only.includes(x))) {
  await page.goto(`${base}/tools/covers.html#${id}`);
  await page.reload(); // hash-only navigation does not re-run the script
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  // Screenshot, then re-encode as WebP in the page itself (Chromium can encode WebP; Playwright can't).
  const png = (await page.screenshot({ type: 'png' })).toString('base64');
  const webp = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.8).split(',')[1];
  }, png);
  writeFileSync(join(OUT, id + '.webp'), Buffer.from(webp, 'base64'));
  n++;
}
console.log(`Rendered ${n} covers to public/assets/covers/`);
await browser.close();
server.close();
