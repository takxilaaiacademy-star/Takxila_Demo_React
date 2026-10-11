import { blobUrl } from '../../utils/media';

/** Everything printed on a certificate. */
export interface CertificateData {
  /** Learner's full name */
  name: string;
  /** Course title, printed in bold inside the paragraph */
  course: string;
  /** Course category, e.g. "AI Agents and Agentic AI" */
  category: string;
  /** ISO date the certificate was issued */
  issuedAt: string;
  /** Verifiable certificate ID, e.g. TXC-0ABC12D */
  id: string;
}

export const TEMPLATE_SRC = '/assets/certificate/template.webp';
/** Template size in pixels; every coordinate below is in this space. */
export const CERT_W = 1536;
export const CERT_H = 1024;

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const INK = '#1b2340';
const NAME_INK = '#2f3443';
const BODY_INK = '#3b3f4c';

export const issuedText = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** The template already prints "CERTIFICATE ID: TKX-AIA·"; this is what follows it. */
export const idSuffix = (id: string) => (/^TKX-AIA[·.\-\s]*/i.test(id) ? id.replace(/^TKX-AIA[·.\-\s]*/i, '') : id);

let template: Promise<HTMLImageElement> | null = null;
function loadTemplate(): Promise<HTMLImageElement> {
  template ??= blobUrl(TEMPLATE_SRC)
    .then(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      return img;
    })
    .catch((e: unknown) => {
      template = null; // allow a retry on the next call
      throw e;
    });
  return template;
}

let fonts: Promise<unknown> | null = null;
function loadFonts() {
  fonts ??= Promise.all(
    ['500 20px', '600 20px', '700 20px', '800 20px'].map((f) => document.fonts?.load(`${f} ${FONT}`).catch(() => undefined)),
  ).then(() => document.fonts?.ready);
  return fonts;
}

/** Start fetching the template and fonts early so the first preview or download is instant. */
export const warmCertificate = () => {
  void loadTemplate().catch(() => undefined);
  void loadFonts();
};

type Ctx = CanvasRenderingContext2D;

/** Draws text with manual letter spacing (works in every browser), anchored by `align`. */
function spaced(g: Ctx, text: string, x: number, y: number, spacing: number, align: 'left' | 'center' = 'left') {
  const chars = [...text];
  const width = chars.reduce((w, ch) => w + g.measureText(ch).width, 0) + spacing * (chars.length - 1);
  let cx = align === 'center' ? x - width / 2 : x;
  g.textAlign = 'left';
  for (const ch of chars) {
    g.fillText(ch, cx, y);
    cx += g.measureText(ch).width + spacing;
  }
  return width;
}

/** Largest font size (down to `min`) at which `text` fits `maxW`. */
function fit(g: Ctx, text: string, weight: number, size: number, min: number, maxW: number) {
  let s = size;
  g.font = `${weight} ${s}px ${FONT}`;
  while (s > min && g.measureText(text).width > maxW) {
    s -= 1;
    g.font = `${weight} ${s}px ${FONT}`;
  }
  return s;
}

interface Run {
  text: string;
  bold: boolean;
}

/** Word-wraps mixed regular/bold runs into lines no wider than maxW. */
function wrapRuns(g: Ctx, runs: Run[], size: number, maxW: number) {
  const words: Run[] = runs.flatMap((r) => r.text.split(/\s+/).filter(Boolean).map((t) => ({ text: t, bold: r.bold })));
  const font = (b: boolean) => `${b ? 700 : 500} ${size}px ${FONT}`;
  const width = (w: Run) => {
    g.font = font(w.bold);
    return g.measureText(w.text).width;
  };
  g.font = font(false);
  const space = g.measureText(' ').width;
  const lines: { words: Run[]; width: number }[] = [];
  let cur: Run[] = [];
  let curW = 0;
  for (const w of words) {
    const ww = width(w);
    const next = cur.length ? curW + space + ww : ww;
    if (cur.length && next > maxW) {
      lines.push({ words: cur, width: curW });
      cur = [w];
      curW = ww;
    } else {
      cur.push(w);
      curW = next;
    }
  }
  if (cur.length) lines.push({ words: cur, width: curW });
  return { lines, space, font, width };
}

function paragraph(g: Ctx, course: string) {
  const runs: Run[] = [
    { text: 'For successfully completing the', bold: false },
    { text: course, bold: true },
    { text: 'and demonstrating exceptional skills in Artificial Intelligence, Machine Learning, and innovative AI Applications.', bold: false },
  ];
  const cx = 768;
  const maxW = 640;
  let size = 19;
  let layout = wrapRuns(g, runs, size, maxW);
  while (layout.lines.length > 3 && size > 15) {
    size -= 1;
    layout = wrapRuns(g, runs, size, maxW);
  }
  const lh = Math.round(size * 1.42);
  // Centre the block vertically in the 630-712 band.
  const top = 671 - (layout.lines.length * lh) / 2;
  g.fillStyle = BODY_INK;
  g.textBaseline = 'alphabetic';
  g.textAlign = 'left';
  layout.lines.forEach((line, i) => {
    let x = cx - line.width / 2;
    const y = top + i * lh + size * 1.05;
    line.words.forEach((w, j) => {
      g.font = layout.font(w.bold);
      g.fillStyle = w.bold ? INK : BODY_INK;
      g.fillText(w.text, x, y);
      x += layout.width(w) + (j < line.words.length - 1 ? layout.space : 0);
    });
  });
}

function footField(g: Ctx, value: string, label: string, cx: number, maxW: number) {
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.fillStyle = BODY_INK;
  fit(g, value, 600, 22, 15, maxW);
  g.fillText(value, cx, 808);
  g.fillStyle = INK;
  g.font = `600 24px ${FONT}`;
  g.fillText(label, cx, 858);
}

/**
 * Draws the certificate (template + learner details) onto a new canvas at
 * `scale` x the template size. Used by the preview and by both downloads.
 */
export async function renderCertificate(d: CertificateData, scale = 1): Promise<HTMLCanvasElement> {
  const [img] = await Promise.all([loadTemplate(), loadFonts()]);
  const cv = document.createElement('canvas');
  cv.width = Math.round(CERT_W * scale);
  cv.height = Math.round(CERT_H * scale);
  const g = cv.getContext('2d');
  if (!g) throw new Error('Canvas is not available');
  g.scale(scale, scale);
  g.imageSmoothingQuality = 'high';
  g.drawImage(img, 0, 0, CERT_W, CERT_H);

  // Certificate ID, continuing the printed "CERTIFICATE ID: TKX-AIA·"
  const code = idSuffix(d.id);
  g.fillStyle = INK;
  g.textBaseline = 'middle';
  let idSize = 14;
  let gap = 1.6;
  g.font = `600 ${idSize}px ${FONT}`;
  while (idSize > 10 && g.measureText(code).width + gap * code.length > 1468 - 1354) {
    idSize -= 1;
    gap = Math.max(0.6, gap - 0.3);
    g.font = `600 ${idSize}px ${FONT}`;
  }
  spaced(g, code, 1354, 90.5, gap);

  // Learner name over the gold line
  g.textBaseline = 'alphabetic';
  g.textAlign = 'center';
  g.fillStyle = NAME_INK;
  fit(g, d.name, 800, 64, 30, 640);
  g.fillText(d.name, 768, 585);

  paragraph(g, d.course);
  footField(g, issuedText(d.issuedAt), 'Issued On', 362, 300);
  footField(g, d.category, 'Category', 1126, 250);
  return cv;
}
