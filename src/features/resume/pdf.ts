import type { jsPDF as JsPDFDoc } from 'jspdf';
import { hasContent, type DocEntry, type ResumeDoc } from './model';
import { PAGE, type ResumeTheme } from './themes';

/**
 * Text-based PDF renderer (jsPDF, loaded on demand so it stays out of the main
 * bundle). Real, selectable text in a single column: exactly what an ATS reads.
 * A new page is added only right before something that would overflow, so a
 * short resume is always exactly one page and no blank pages are ever emitted.
 */

type JsPDFCtor = typeof import('jspdf').jsPDF;
let lib: Promise<JsPDFCtor> | null = null;
/** Loads jsPDF once (call early, e.g. on idle, to make the first download instant). */
export const loadJsPdf = () => (lib ??= import('jspdf').then((m) => m.jsPDF));

// The PDF standard fonts use WinAnsi encoding. Map common characters outside it
// and drop anything else, so a stray emoji never turns into garbage glyphs.
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const REPLACE: Record<string, string> = { '₹': 'Rs.', '→': '->', '←': '<-', '✓': '', '✔': '', '★': '*', '≥': '>=', '≤': '<=', '−': '-', '‐': '-', '‑': '-', ' ': ' ', '​': '' };
export function pdfText(s: string): string {
  let out = '';
  for (const ch of s.normalize('NFC')) {
    const c = ch.codePointAt(0)!;
    if ((c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || WIN_ANSI_EXTRA.includes(ch)) out += ch;
    else if (ch in REPLACE) out += REPLACE[ch];
    else if (ch === '\t') out += ' ';
    else {
      // é-style letters outside Latin-1: strip the accent; anything else is dropped
      const plain = ch.normalize('NFKD').replace(/[̀-ͯ]/g, '');
      if (/^[\x20-\x7e]+$/.test(plain)) out += plain;
    }
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

const STYLE = { normal: 'normal', bold: 'bold', italic: 'italic' } as const;

function render(JsPDF: JsPDFCtor, d: ResumeDoc, t: ResumeTheme): JsPDFDoc {
  const pdf = new JsPDF({ unit: 'pt', format: 'a4', compress: true });
  const name = pdfText(d.name);
  pdf.setProperties({ title: `${name || 'Resume'} - Resume`, subject: 'Resume', author: name, creator: 'Takxila AI Academy Resume Builder', keywords: d.role });

  const W = PAGE.w;
  const H = PAGE.h;
  const X = t.margin.x;
  const R = W - X;
  const CW = R - X;
  let y = t.margin.top;
  let dry = false; // measuring pass: advance y without drawing anything

  const font = (style: keyof typeof STYLE, size: number, color: string) => {
    pdf.setFont(t.font, STYLE[style]);
    pdf.setFontSize(size);
    pdf.setTextColor(color);
  };
  const lh = (size: number) => size * t.lh;
  const text = (s: string, x: number, opts: { align?: 'left' | 'center' | 'right' } = {}) => {
    if (!dry) pdf.text(s, x, y, { baseline: 'top', ...opts });
  };
  const wrap = (s: string, width: number): string[] => pdf.splitTextToSize(pdfText(s), width) as string[];
  /** Adds a page only when the next `h` points would not fit. Never on an empty page. */
  const ensure = (h: number) => {
    if (y + h > H - t.margin.bottom && y > t.margin.top + 1) {
      pdf.addPage();
      y = t.margin.top;
    }
  };
  const hr = (x1: number, x2: number, width: number, color: string) => {
    pdf.setDrawColor(color);
    pdf.setLineWidth(width);
    pdf.line(x1, y, x2, y);
  };

  // ---------- Header ----------
  const contact = pdfText(d.contact.join('  |  '));
  const linkParts = d.links.map((l) => ({ text: pdfText(l.url), href: l.href })).filter((l) => l.text);
  const center = t.align === 'center';
  const ax = center ? W / 2 : X;
  const align = center ? 'center' : 'left';

  const drawLinks = (color: string) => {
    if (!linkParts.length) return;
    font('normal', t.size.contact, color);
    const sep = '  |  ';
    const total = linkParts.reduce((w, l, i) => w + pdf.getTextWidth(l.text) + (i ? pdf.getTextWidth(sep) : 0), 0);
    if (total <= CW && dry) y += lh(t.size.contact);
    else if (total <= CW) {
      let x = center ? W / 2 - total / 2 : X;
      linkParts.forEach((l, i) => {
        if (i) {
          pdf.text(sep, x, y, { baseline: 'top' });
          x += pdf.getTextWidth(sep);
        }
        pdf.textWithLink(l.text, x, y, { url: l.href, baseline: 'top' });
        x += pdf.getTextWidth(l.text);
      });
      y += lh(t.size.contact);
    } else
      for (const line of wrap(linkParts.map((l) => l.text).join(sep), CW)) {
        text(line, ax, { align });
        y += lh(t.size.contact);
      }
  };

  const nameText = t.nameUpper ? name.toUpperCase() : name;
  const drawHeader = (nameColor: string, roleColor: string, contactColor: string) => {
    if (nameText) {
      font(t.nameBold ? 'bold' : 'normal', t.size.name, nameColor);
      for (const line of wrap(nameText, CW)) {
        text(line, ax, { align });
        y += t.size.name * 1.12;
      }
      y += 2;
    }
    if (d.role) {
      font('normal', t.size.role, roleColor);
      for (const line of wrap(d.role, CW)) {
        text(line, ax, { align });
        y += lh(t.size.role);
      }
      y += 2;
    }
    if (contact) {
      font('normal', t.size.contact, contactColor);
      for (const line of wrap(contact, CW)) {
        text(line, ax, { align });
        y += lh(t.size.contact);
      }
    }
    drawLinks(contactColor);
  };

  if (t.band) {
    // Measure first, then paint the band and draw the header on top of it.
    const start = y;
    dry = true;
    drawHeader(t.color.band, t.color.band, t.color.band);
    dry = false;
    const bandH = y - start + t.margin.top + 22;
    pdf.setFillColor(t.color.band);
    pdf.rect(0, 0, W, bandH, 'F');
    y = start + 4;
    drawHeader(t.color.name, t.color.role, t.color.bandText);
    y = bandH + 6;
  } else {
    drawHeader(t.color.name, t.color.role, t.color.muted);
  }

  // ---------- Sections ----------
  const heading = (title: string, first: boolean, keepWith: number) => {
    const label = pdfText(t.headingUpper ? title.toUpperCase() : title);
    const hs = t.size.heading;
    ensure((first ? 0 : t.sectionGap) + hs * 1.6 + 8 + keepWith);
    y += first ? t.sectionGap * 0.9 : t.sectionGap;
    switch (t.heading) {
      case 'rule':
        font('bold', hs, t.color.heading);
        text(label, X);
        y += hs * 1.22;
        hr(X, R, 0.8, t.color.rule);
        y += 5;
        break;
      case 'accent':
        font('bold', hs, t.color.heading);
        text(label, X);
        y += hs * 1.45;
        break;
      case 'smallcaps':
        font('bold', hs, t.color.heading);
        text(label, X);
        y += hs * 1.3;
        hr(X, R, 0.6, t.color.rule);
        y += 5;
        break;
      case 'hairline':
        font('normal', hs, t.color.heading);
        text(label, X);
        y += hs * 1.45;
        hr(X, R, 0.4, t.color.rule);
        y += 7;
        break;
      case 'twotone':
        font('bold', hs, t.color.heading);
        text(label, X);
        y += hs * 1.2;
        hr(X + 40, R, 0.6, t.color.rule2);
        hr(X, X + 40, 2.2, t.color.rule);
        y += 6;
        break;
    }
  };

  const bodyLine = lh(t.size.body);
  const bullets = (items: string[]) => {
    const indent = 12;
    for (const item of items) {
      font('normal', t.size.body, t.color.text);
      const lines = wrap(item, CW - indent);
      lines.forEach((line, i) => {
        ensure(bodyLine);
        if (i === 0) text('•', X + 2);
        text(line, X + indent);
        y += bodyLine;
      });
    }
  };

  const entry = (e: DocEntry) => {
    const date = pdfText(e.date);
    font('normal', t.size.meta, t.color.muted);
    const dateW = date ? pdf.getTextWidth(date) + 12 : 0;
    font('bold', t.size.title, t.color.text);
    const titleLines = e.title ? wrap(e.title, CW - dateW) : [];
    const subLines = e.sub ? (font('italic', t.size.body, t.color.sub), wrap(e.sub, titleLines.length ? CW : CW - dateW)) : [];
    // Keep the title, subtitle and first bullet together on one page.
    ensure(titleLines.length * lh(t.size.title) + subLines.length * bodyLine + (e.bullets.length ? bodyLine : 0));
    let dateDrawn = false;
    const drawDate = () => {
      if (!date || dateDrawn) return;
      font('normal', t.size.meta, t.color.muted);
      pdf.text(date, R, y + (t.size.title - t.size.meta) * 0.6, { baseline: 'top', align: 'right' });
      dateDrawn = true;
    };
    titleLines.forEach((line) => {
      drawDate();
      font('bold', t.size.title, t.color.text);
      text(line, X);
      y += lh(t.size.title);
    });
    subLines.forEach((line) => {
      drawDate();
      font('italic', t.size.body, t.color.sub);
      text(line, X);
      y += bodyLine;
    });
    if (!titleLines.length && !subLines.length && date) {
      font('normal', t.size.meta, t.color.muted);
      text(date, X);
      y += bodyLine;
    }
    if (e.bullets.length) {
      y += 1.5;
      bullets(e.bullets);
    }
  };

  d.sections.forEach((s, si) => {
    const b = s.block;
    heading(s.title, si === 0, bodyLine * 2);
    if (b.kind === 'text') {
      font('normal', t.size.body, t.color.text);
      b.text.split(/\n+/).forEach((para, pi) => {
        if (pi) y += bodyLine * 0.35;
        for (const line of wrap(para, CW)) {
          ensure(bodyLine);
          font('normal', t.size.body, t.color.text);
          text(line, X);
          y += bodyLine;
        }
      });
    } else if (b.kind === 'bullets') bullets(b.items);
    else if (b.kind === 'labelled')
      b.items.forEach((it) => {
        const label = pdfText(it.label) + ': ';
        font('bold', t.size.body, t.color.text);
        const lw = pdf.getTextWidth(label);
        font('normal', t.size.body, t.color.text);
        // First line is shorter (the bold label sits in front of it).
        const words = pdfText(it.text).split(' ');
        const lines: string[] = [];
        let cur = '';
        for (const w of words) {
          const next = cur ? cur + ' ' + w : w;
          const max = lines.length ? CW : CW - lw;
          if (cur && pdf.getTextWidth(next) > max) {
            lines.push(cur);
            cur = w;
          } else cur = next;
        }
        if (cur) lines.push(cur);
        lines.forEach((line, i) => {
          ensure(bodyLine);
          if (i === 0) {
            font('bold', t.size.body, t.color.text);
            text(label, X);
          }
          font('normal', t.size.body, t.color.text);
          text(line, i === 0 ? X + lw : X);
          y += bodyLine;
        });
        y += 1.5;
      });
    else
      b.items.forEach((e, i) => {
        if (i) y += t.entryGap;
        entry(e);
      });
  });

  return pdf;
}

const fileName = (name: string) => `${pdfText(name).replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'My'}-Resume.pdf`;

/** Builds and downloads the PDF. Returns the page count. */
export async function downloadResumePdf(d: ResumeDoc, theme: ResumeTheme): Promise<number> {
  if (!hasContent(d)) throw new Error('empty');
  const JsPDF = await loadJsPdf();
  const pdf = render(JsPDF, d, theme);
  await pdf.save(fileName(d.name), { returnPromise: true });
  return pdf.getNumberOfPages();
}

/** Same layout, no download: how many pages the PDF will have. */
export async function countPdfPages(d: ResumeDoc, theme: ResumeTheme): Promise<number> {
  if (!hasContent(d)) return 0;
  const JsPDF = await loadJsPdf();
  return render(JsPDF, d, theme).getNumberOfPages();
}
