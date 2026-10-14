// Every key the app keeps in the browser starts with "tx_".
//   tx_users            registered accounts [{ id, name, email, phone, passHash, createdAt }]
//   tx_session          logged-in user when "Keep me logged in" is ticked (else sessionStorage)
//   tx_theme            'dark' | 'light'
//   tx_last_email       last email used on the login form
//   tx_user_<email>     per-user data: cart, enrolled courses, progress, quiz answers, calculator answers
const PREFIX = 'tx_';

/**
 * Logout clean-up. Removes this app's saved data from the browser.
 *   keep = null      : wipe ALL of localStorage and sessionStorage
 *   keep = ["users"]  : remove every tx_ key except the ones listed (a trailing "_" means "starts with"); sessionStorage is emptied
 */
export function clearBrowserData(keep: string[] | null): void {
  try {
    if (keep === null) {
      localStorage.clear();
      sessionStorage.clear();
      return;
    }
    const kept = (k: string) => keep.some((p) => (p.endsWith('_') ? k.startsWith(PREFIX + p) : k === PREFIX + p));
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) && !kept(k))
      .forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch {
    /* storage blocked: nothing to clear */
  }
}

export function load<T>(key: string, fallback: T, store: Storage = localStorage): T {
  try {
    const raw = store.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown, store: Storage = localStorage): void {
  try {
    if (value === undefined || value === null) store.removeItem(PREFIX + key);
    else store.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

export function remove(key: string, store: Storage = localStorage): void {
  try {
    store.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

// Demo only: passwords are hashed before they are saved, but a frontend-only
// login is never real security. Swap this for a backend before going live.
export async function hashPassword(password: string): Promise<string> {
  const text = 'takxila:' + password;
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return 'djb2-' + h.toString(16);
}
