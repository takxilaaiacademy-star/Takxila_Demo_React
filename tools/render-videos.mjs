// Renders a 10-second summary video for every course into public/media/videos/<id>.mp4.
// Usage (from the project root): node tools/render-videos.mjs [course-id ...]
// Needs: ffmpeg on PATH and Playwright with Chromium (npm i -D playwright).
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public/media/videos');
const FPS = 20;
const SECONDS = 10;
mkdirSync(OUT, { recursive: true });

// Read the course list straight out of src/data/courses.ts (its data is plain JSON).
const src = readFileSync(join(ROOT, 'src/data/courses.ts'), 'utf8');
const cats = JSON.parse(src.match(/CATS: Record<CatId, string> = (\{.*?\});/s)[1]);
const data = JSON.parse(src.match(/const DATA: CourseData\[\] = (\[.*?\n\]);/s)[1]);
const only = process.argv.slice(2);
const courses = data.map((c) => ({ ...c, catLabel: cats[c.cat] })).filter((c) => !only.length || only.includes(c.id));

const types = { '.html': 'text/html', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((req, res) => {
  const file = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
await page.goto(base + '/tools/video.html');

for (const c of courses) {
  await page.reload();
  await page.evaluate((course) => window.setCourse(course), c);
  const out = join(OUT, c.id + '.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  for (let f = 0; f < FPS * SECONDS; f++) {
    await page.evaluate((t) => window.seek(t), (f * 1000) / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 88 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (code) => (code ? j(new Error('ffmpeg failed for ' + c.id)) : r())));
  // WebM (VP9) copy for browsers without H.264, e.g. open-source Chromium builds.
  const webm = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40',
    '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-an', join(OUT, c.id + '.webm')]);
  await new Promise((r, j) => webm.on('close', (code) => (code ? j(new Error('webm failed for ' + c.id)) : r())));
  console.log('rendered', c.id);
}
await browser.close();
server.close();
