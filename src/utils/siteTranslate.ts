import type { Lang } from '../types';

/**
 * Translates the whole website into the language picked in the menu.
 *
 * Menus and buttons have hand-written labels (src/data/i18n.ts). Everything else on screen, including course
 * content, announcements and pages added later, is translated live by Google's free website translator, which
 * loads only when a language other than English is chosen. Mark anything that must stay as it is (brand names,
 * code, certificate IDs) with className="notranslate" or translate="no".
 */

/** Our language codes to Google's. */
const GOOGLE: Record<Lang, string> = {
  en: 'en', hi: 'hi', bn: 'bn', mr: 'mr', gu: 'gu', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', pa: 'pa',
  es_ar: 'es', es: 'es', fr_ca: 'fr', fr: 'fr', ru: 'ru', ko: 'ko', ja: 'ja', zh_cn: 'zh-CN',
};
/** For <html lang>, so the browser picks the right fonts and screen readers the right voice. */
const HTML_LANG: Partial<Record<Lang, string>> = { es_ar: 'es-AR', fr_ca: 'fr-CA', zh_cn: 'zh-CN' };

const SCRIPT = 'https://translate.google.com/translate_a/element.js?cb=txGoogleTranslateInit';
const STORE_KEY = 'tx_lang';

declare global {
  interface Window {
    txGoogleTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: Record<string, unknown>, id: string) => unknown } };
  }
}

let loading: Promise<void> | null = null;

function loadWidget(): Promise<void> {
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const host = document.createElement('div');
    host.id = 'google_translate_element';
    host.style.display = 'none';
    document.body.appendChild(host);
    window.txGoogleTranslateInit = () => {
      try {
        new window.google!.translate!.TranslateElement({ pageLanguage: 'en', autoDisplay: false, includedLanguages: [...new Set(Object.values(GOOGLE))].join(',') }, host.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onerror = () => {
      loading = null;
      reject(new Error('The translator could not be loaded.'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

function setCookie(value: string | null) {
  const host = location.hostname;
  const domains = ['', host, '.' + host.split('.').slice(-2).join('.')];
  for (const d of domains) {
    const domain = d ? `;domain=${d}` : '';
    document.cookie = value ? `googtrans=${value};path=/${domain}` : `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domain}`;
  }
}

/** Wait for Google's hidden language select to appear, then pick the language on it. */
function pick(code: string, tries = 40) {
  const sel = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (!sel) {
    if (tries > 0) setTimeout(() => pick(code, tries - 1), 150);
    return;
  }
  sel.value = code;
  sel.dispatchEvent(new Event('change'));
}

let current: Lang = 'en';

/** Remember the language for pages shown before login. */
export const savedLanguage = (): Lang => {
  try {
    return (localStorage.getItem(STORE_KEY) as Lang | null) || 'en';
  } catch {
    return 'en';
  }
};

export function applySiteLanguage(lang: Lang) {
  try {
    localStorage.setItem(STORE_KEY, lang);
  } catch {
    /* private mode */
  }
  document.documentElement.lang = HTML_LANG[lang] ?? GOOGLE[lang] ?? 'en';
  const code = GOOGLE[lang] ?? 'en';
  const was = current;
  current = lang;
  if (code === 'en') {
    // Back to English: Google's translator can only undo itself fully with a fresh page load.
    setCookie(null);
    if (was !== 'en' && GOOGLE[was] !== 'en' && loading) location.reload();
    return;
  }
  setCookie(`/en/${code}`);
  loadWidget()
    .then(() => pick(code))
    .catch((e) => console.warn('Site translation unavailable:', e));
}

/**
 * Google's translator replaces text nodes, and React then fails to remove or insert next to the nodes it
 * remembers ("Failed to execute 'removeChild'"). These guards let React carry on instead of crashing.
 */
export function guardDomForTranslation() {
  if (typeof Node !== 'function' || !Node.prototype) return;
  const remove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return remove.call(this, child) as T;
  };
  const insert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return insert.call(this, node, null) as T;
    return insert.call(this, node, ref) as T;
  };
}
