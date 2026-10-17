import { ADMIN_EMAIL } from '../config/site';
import type { StoredUser } from '../types';

/**
 * Who is using the site right now:
 *   learner     an ordinary account
 *   admin       the admin account in Admin mode: every course is free and open, no cart, admin navbar
 *   preview     the admin account in "Preview as learner": a sandbox. The site looks exactly as a learner sees it,
 *               but nothing is saved, no emails go out and nothing is logged. Leaving the preview throws it all away.
 */
type S = { auth: { session: { email: string } | null; users: StoredUser[] }; admin: { mode: 'admin' | 'user' } };

export const isAdminEmail = (email: string | null | undefined) => !!email && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

export function isAdminAccount(s: S): boolean {
  const e = s.auth.session?.email;
  if (!e) return false;
  return isAdminEmail(e) || s.auth.users.some((u) => u.email === e && u.role === 'admin');
}

export const inAdminMode = (s: S) => isAdminAccount(s) && s.admin.mode === 'admin';
export const inPreview = (s: S) => isAdminAccount(s) && s.admin.mode === 'user';
