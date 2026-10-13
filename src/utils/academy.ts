import cfg from '../data/academy.json';
import { courseById } from '../data/recommend';

/**
 * Links to the Moodle academy (academy.takxila.in): its cart, checkout and Razorpay payment.
 * Course instance numbers live in src/data/academy.json.
 *
 * Why the academy pages open in a tab instead of being called in the background:
 * the academy only accepts cart and payment requests from a learner who is logged in there, and its Pay button
 * needs a one-time "sesskey" that only the academy page itself knows. A tab carries the learner's academy login,
 * so the cart fills up and Razorpay opens on the academy's own checkout page.
 */

type Entry = { courseId: number | null; instance: number | null };
const COURSES = cfg.courses as Record<string, Entry>;
const fill = (path: string, vars: Record<string, string | number>) => cfg.baseUrl + path.replace(/\{(\w+)\}/g, (_, k: string) => encodeURIComponent(String(vars[k] ?? '')));

export const ACADEMY_URL = cfg.baseUrl;
export const academyEntry = (id: string): Entry => COURSES[id] ?? { courseId: null, instance: null };
export const academyAddUrl = (id: string) => {
  const { instance } = academyEntry(id);
  return instance ? fill(cfg.paths.addToCart, { instance }) : null;
};
export const academyCartUrl = () => cfg.baseUrl + cfg.paths.cart;
export const academyCheckoutUrl = () => cfg.baseUrl + cfg.paths.checkout;
export const academyLoginUrl = () => cfg.baseUrl + '/login/index.php';
/** The course on the academy: its page when the id is known, otherwise a search for its title. */
export const academyCourseUrl = (id: string) => {
  const { courseId } = academyEntry(id);
  return courseId ? fill(cfg.paths.course, { courseId }) : fill(cfg.paths.search, { query: courseById(id)?.title ?? id });
};

/**
 * Also add the course to the learner's academy cart, in the background (same request as the academy's own
 * "Add to cart" button). Works when the learner is logged in to the academy and the browser allows its login cookie
 * on this request; otherwise checkout adds it again, so nothing is lost.
 */
export function syncAcademyAdd(id: string) {
  const url = academyAddUrl(id);
  if (!url || !cfg.syncOnAdd) return;
  fetch(url, { mode: 'no-cors', credentials: 'include', keepalive: true }).catch(() => undefined);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Open the academy in a new tab, put every course in its cart, then show its checkout page with the Pay button.
 * Courses without an instance number in academy.json are returned in `missing`.
 */
export async function openAcademyCheckout(ids: string[]): Promise<{ added: string[]; missing: string[] }> {
  const added = ids.filter((id) => academyAddUrl(id));
  const missing = ids.filter((id) => !academyAddUrl(id));
  const tab = window.open('', 'tx-academy');
  if (!tab) throw new Error('Your browser blocked the new tab. Allow pop-ups for this site and try again.');
  try {
    tab.document.title = 'Takxila Academy checkout';
    tab.document.body.innerHTML =
      '<p style="font:600 16px system-ui,sans-serif;text-align:center;margin-top:40vh">Adding your courses to the Takxila Academy cart…</p>';
  } catch {
    /* the tab is already on the academy */
  }
  for (const id of added) {
    tab.location.href = academyAddUrl(id)!;
    await wait(1600);
  }
  tab.location.href = academyCheckoutUrl();
  tab.focus();
  return { added, missing };
}
