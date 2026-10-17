/**
 * Cleans HTML written in the admin's text editor before it is saved or shown.
 * Keeps formatting, links, images, tables and YouTube / Vimeo / Drive embeds; drops scripts, event handlers,
 * styles that could hide or overlay the page, and javascript: links.
 * (Learners only ever see admin-written HTML, but a pasted page can carry anything, so it is always cleaned.)
 */

const TAGS = new Set([
  'p', 'br', 'hr', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'sub', 'sup',
  'small', 'mark', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot',
  'tr', 'th', 'td', 'caption', 'colgroup', 'col', 'iframe', 'video', 'audio', 'source',
]);
const ATTRS = new Set(['href', 'src', 'alt', 'title', 'width', 'height', 'colspan', 'rowspan', 'dir', 'style', 'target', 'controls', 'poster', 'allowfullscreen', 'loading', 'class']);
// Inline styles the editor itself produces. Anything else (position, z-index, url(...)) is removed.
const STYLES = new Set(['text-align', 'color', 'background-color', 'font-weight', 'font-style', 'text-decoration', 'margin-left', 'padding-left', 'width', 'max-width', 'height', 'border', 'border-collapse', 'vertical-align', 'font-size']);
// Players allowed inside an iframe.
const FRAME_HOSTS = /^(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com|drive\.google\.com|academy\.takxila\.in|docs\.google\.com|loom\.com|www\.loom\.com)$/;

const safeUrl = (v: string, forFrame = false) => {
  const t = v.trim();
  if (/^(#|\/(?!\/)|mailto:|tel:)/i.test(t)) return forFrame ? '' : t;
  if (/^data:image\/(png|jpe?g|gif|webp);/i.test(t)) return forFrame ? '' : t;
  try {
    const u = new URL(t);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
    if (forFrame && (u.protocol !== 'https:' || !FRAME_HOSTS.test(u.hostname))) return '';
    return u.href;
  } catch {
    return '';
  }
};

function cleanStyle(v: string) {
  return v
    .split(';')
    .map((d) => d.split(':').map((x) => x.trim()))
    .filter(([k, val]) => k && val && STYLES.has(k.toLowerCase()) && !/url\(|expression|javascript/i.test(val))
    .map(([k, val]) => `${k.toLowerCase()}: ${val}`)
    .join('; ');
}

function walk(node: Element) {
  for (const el of [...node.children]) {
    const tag = el.tagName.toLowerCase();
    if (!TAGS.has(tag)) {
      // Unknown wrappers (font, section, article...) keep their text; dangerous ones go completely.
      if (/^(script|style|object|embed|form|input|button|textarea|select|link|meta|base|svg|math|template|noscript)$/.test(tag)) el.remove();
      else {
        walk(el);
        el.replaceWith(...el.childNodes);
      }
      continue;
    }
    for (const a of [...el.attributes]) {
      const name = a.name.toLowerCase();
      if (!ATTRS.has(name)) el.removeAttribute(a.name);
      else if (name === 'href' || name === 'src' || name === 'poster') {
        const ok = safeUrl(a.value, tag === 'iframe' && name === 'src');
        if (ok) el.setAttribute(a.name, ok);
        else el.removeAttribute(a.name);
      } else if (name === 'style') {
        const st = cleanStyle(a.value);
        if (st) el.setAttribute('style', st);
        else el.removeAttribute('style');
      }
    }
    if (tag === 'a' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
    if (tag === 'iframe') {
      if (!el.getAttribute('src')) {
        el.remove();
        continue;
      }
      el.setAttribute('loading', 'lazy');
      el.setAttribute('allowfullscreen', '');
    }
    if (tag === 'img') el.setAttribute('loading', 'lazy');
    walk(el);
  }
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild as Element | null;
  if (!root) return '';
  walk(root);
  return root.innerHTML.trim();
}

/** Plain text of some HTML: for word counts, search and fallbacks. */
export function htmlToText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('br').forEach((b) => b.replaceWith('\n'));
  doc.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr,blockquote').forEach((b) => b.append('\n'));
  return (doc.body.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
}

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The old one-paragraph-per-line description as HTML, so the editor can open it. Lines starting with "• " become a list. */
export function linesToHtml(lines: string[]): string {
  let out = '';
  let list = false;
  for (const l of lines) {
    if (l.startsWith('• ')) {
      if (!list) out += '<ul>';
      list = true;
      out += `<li>${escapeHtml(l.slice(2))}</li>`;
    } else {
      if (list) out += '</ul>';
      list = false;
      out += `<p>${escapeHtml(l)}</p>`;
    }
  }
  return out + (list ? '</ul>' : '');
}
