import type { AtsSource } from './ats';

/**
 * Pulls plain text out of an uploaded resume, entirely in the browser.
 * PDF via pdf.js (legacy build), DOCX via mammoth with a built-in fallback reader, TXT as is. All load on demand.
 */

export const MAX_BYTES = 5 * 1024 * 1024;
export const ACCEPT = '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';

export class ExtractError extends Error {}

export function sourceOf(file: File): AtsSource | null {
  const n = file.name.toLowerCase();
  if (n.endsWith('.pdf') || file.type === 'application/pdf') return 'pdf';
  if (n.endsWith('.docx') || file.type.includes('wordprocessingml')) return 'docx';
  if (n.endsWith('.txt') || file.type === 'text/plain') return 'txt';
  return null;
}

/** Text of one PDF page, keeping line breaks. */
function pageText(items: unknown[]): string {
  let out = '';
  let lastY: number | null = null;
  for (const item of items as { str?: string; transform?: number[]; hasEOL?: boolean }[]) {
    if (typeof item.str !== 'string') continue;
    const y = item.transform?.[5] ?? 0;
    if (lastY !== null && Math.abs(y - lastY) > 2 && !out.endsWith('\n')) out += '\n';
    out += item.str;
    if (item.hasEOL) out += '\n';
    lastY = y;
  }
  return out;
}

// pdf.js "legacy" build: works in older Chrome, Edge, Safari and Firefox too. The worker is bundled by Vite
// as a normal .js file, so it loads on any web host (some hosts refuse to serve .mjs files as JavaScript).
let pdfjsReady: Promise<typeof import('pdfjs-dist')> | null = null;
function loadPdfjs() {
  pdfjsReady ??= Promise.all([import('pdfjs-dist/legacy/build/pdf.mjs'), import('pdfjs-dist/legacy/build/pdf.worker.mjs?worker')]).then(([pdfjs, W]) => {
    try {
      pdfjs.GlobalWorkerOptions.workerPort = new W.default();
    } catch (e) {
      console.warn('pdf.js worker could not start, reading on the main thread', e);
    }
    return pdfjs as unknown as typeof import('pdfjs-dist');
  });
  return pdfjsReady;
}

async function pdfText(buf: ArrayBuffer): Promise<string> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, useSystemFonts: true });
  let doc;
  try {
    doc = await task.promise;
  } catch (e) {
    console.error('PDF open failed', e);
    const name = (e as { name?: string })?.name ?? '';
    throw new ExtractError(
      name === 'PasswordException' || /password/i.test(String(e))
        ? 'This PDF is password protected. Remove the password and try again.'
        : 'We could not open this PDF. Try exporting it again as PDF from Word or Google Docs.',
    );
  }
  const pages: string[] = [];
  try {
    for (let p = 1; p <= Math.min(doc.numPages, 10); p++) {
      const page = await doc.getPage(p);
      pages.push(pageText((await page.getTextContent()).items));
    }
  } finally {
    void task.destroy();
  }
  return pages.join('\n');
}

/** Reads word/document.xml straight from the .docx zip: paragraphs, bullets and table cells. */
async function docxViaZip(buf: ArrayBuffer): Promise<string> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml')?.async('string');
  if (!xml) throw new Error('word/document.xml missing');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const lines: string[] = [];
  for (const para of Array.from(doc.getElementsByTagNameNS(W, 'p'))) {
    let text = '';
    para.querySelectorAll('*').forEach((n) => {
      if (n.namespaceURI !== W) return;
      if (n.localName === 't') text += n.textContent ?? '';
      else if (n.localName === 'tab') text += ' ';
      else if (n.localName === 'br') text += '\n';
    });
    text = text.replace(/[ \t]+/g, ' ').trim();
    if (!text) continue;
    const bullet = para.getElementsByTagNameNS(W, 'numPr').length > 0;
    lines.push(bullet ? '• ' + text : text);
  }
  return lines.join('\n');
}

async function docxViaMammoth(buf: ArrayBuffer): Promise<string> {
  const mod = (await import('mammoth/mammoth.browser.min.js')) as unknown as { default?: unknown };
  // The UMD bundle can arrive as the module itself, as .default, or (rarely) only on window.
  const pick = (x: unknown) => (x && typeof (x as { convertToHtml?: unknown }).convertToHtml === 'function' ? (x as typeof import('mammoth')) : null);
  const mammoth = pick(mod.default) ?? pick(mod) ?? pick((mod.default as { default?: unknown })?.default) ?? pick((window as unknown as { mammoth?: unknown }).mammoth);
  if (!mammoth) throw new Error('mammoth did not load');
  // HTML keeps list structure (extractRawText drops the bullets), so turn <li> into "• " lines.
  const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
  const html = new DOMParser().parseFromString(value, 'text/html');
  const lines: string[] = [];
  html.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td').forEach((el) => {
    if (el.tagName === 'P' && el.closest('li,td')) return;
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text) lines.push(el.tagName === 'LI' ? '• ' + text : text);
  });
  return lines.join('\n');
}

async function docxText(buf: ArrayBuffer): Promise<string> {
  const head = new Uint8Array(buf.slice(0, 4));
  if (head[0] !== 0x50 || head[1] !== 0x4b)
    throw new ExtractError(head[0] === 0xd0 ? 'This is an old Word .doc file renamed to .docx. Open it in Word and use Save As > .docx.' : 'This file is not a real .docx document.');
  // mammoth first (best structure); if it fails for any reason, read the XML ourselves.
  try {
    const t = await docxViaMammoth(buf);
    if (t.trim()) return t;
  } catch (e) {
    console.warn('mammoth failed, using the built-in DOCX reader', e);
  }
  try {
    return await docxViaZip(buf);
  } catch (e) {
    console.error('DOCX read failed', e);
    throw new ExtractError('We could not read this Word file. Save it again as .docx and retry.');
  }
}

export async function extractText(file: File): Promise<{ text: string; source: AtsSource }> {
  const source = sourceOf(file);
  if (!source) throw new ExtractError('Please upload a PDF, DOCX or TXT file. (Old .doc files are not supported; save as .docx.)');
  if (file.size > MAX_BYTES) throw new ExtractError('That file is larger than 5 MB. Resumes are usually under 1 MB.');
  const buf = await file.arrayBuffer();
  const text = source === 'pdf' ? await pdfText(buf) : source === 'docx' ? await docxText(buf) : new TextDecoder().decode(buf);
  const clean = text.replace(/\u0000/g, '').trim();
  if (clean.replace(/\s/g, '').length < 40)
    throw new ExtractError(
      source === 'pdf'
        ? 'No selectable text found. This looks like a scanned or image-only PDF, which ATS software cannot read either. Export it from Word/Docs or rebuild it here.'
        : 'This file has almost no text in it.',
    );
  return { text: clean, source };
}
