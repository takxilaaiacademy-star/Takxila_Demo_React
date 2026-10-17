import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import type { Course, Order, StoredUser, UserData } from '../types';
import { load } from './storage';

/**
 * Numbers for the admin's Dashboard and Users tabs, read from every account saved in this browser
 * (tx_users + tx_user_<email>). Frontend-only: with a server, replace collectStats() with one API call.
 */

export type EnrolHow = 'bought' | 'given' | 'free';

export interface Enrolment {
  id: string;
  title: string;
  at: string;
  how: EnrolHow;
  /** Lessons done / total, and % */
  done: number;
  total: number;
  pct: number;
  /** Days the learner has to finish, days left (negative = overdue), and the deadline */
  days: number;
  left: number;
  due: string;
  status: 'completed' | 'on-track' | 'due-soon' | 'overdue';
}

export interface LearnerRow {
  user: StoredUser;
  enrolments: Enrolment[];
  spent: number;
  orders: number;
  orderList: Order[];
  lastSeen: string | null;
  activeDays: number;
}

export interface MonthPoint {
  key: string;
  label: string;
  bought: number;
  given: number;
  free: number;
  signups: number;
  revenue: number;
  /** Learners who enrolled in at least one course that month */
  learners: number;
}

const DAY = 86_400_000;

/** How many days a course gives a learner: set by the admin, else read from the card ("28 Days", "4 Weeks"), else 30. */
export function courseDays(c: Course | undefined): number {
  if (!c) return 30;
  if (c.days && c.days > 0) return c.days;
  const text = c.meta.join(' ');
  const d = /(\d+)\s*-?\s*days?/i.exec(text);
  if (d) return Math.max(1, Number(d[1]));
  const w = /(\d+)\s*-?\s*weeks?/i.exec(text);
  if (w) return Number(w[1]) * 7;
  const m = /(\d+)\s*-?\s*months?/i.exec(text);
  if (m) return Number(m[1]) * 30;
  return 30;
}

const monthKey = (iso: string) => iso.slice(0, 7);

export function collectStats(users: StoredUser[], grants: Record<string, string[]>, now = Date.now()) {
  const rows: LearnerRow[] = [];
  for (const user of users) {
    if (user.role === 'admin') continue;
    const d = load<Partial<UserData>>('user_' + user.email, {});
    const owned = d.owned ?? [];
    const orders = d.orders ?? [];
    const enrolledAt = d.enrolledAt ?? {};
    const lessons = d.lessons ?? {};
    const boughtAt: Record<string, string> = {};
    for (const o of orders) for (const i of o.items) boughtAt[i.id] ??= o.at;
    const given = new Set(grants[user.email] ?? []);
    const enrolments: Enrolment[] = owned.map((id) => {
      const c = courseById(id);
      const at = enrolledAt[id] ?? boughtAt[id] ?? user.createdAt;
      const total = c ? lessonsFor(c).length : 1;
      const done = Math.min(lessons[id] ?? 0, total);
      const days = courseDays(c);
      const dueMs = new Date(at).getTime() + days * DAY;
      const left = Math.ceil((dueMs - now) / DAY);
      const complete = done >= total;
      return {
        id, title: c?.title ?? id, at,
        how: boughtAt[id] ? 'bought' : given.has(id) ? 'given' : 'free',
        done, total, pct: Math.round((100 * done) / total), days, left, due: new Date(dueMs).toISOString(),
        status: complete ? 'completed' : left < 0 ? 'overdue' : left <= 7 ? 'due-soon' : 'on-track',
      };
    });
    enrolments.sort((a, b) => b.at.localeCompare(a.at));
    const visits = d.visits ?? [];
    rows.push({
      user,
      enrolments,
      spent: orders.reduce((n, o) => n + o.total, 0),
      orders: orders.length,
      orderList: orders,
      lastSeen: user.lastLoginAt ?? (visits.length ? visits[visits.length - 1] : null),
      activeDays: visits.length,
    });
  }
  return rows;
}

/** The last `n` months (oldest first), filled from the learner rows. */
export function monthly(rows: LearnerRow[], n: number, now = new Date()): MonthPoint[] {
  const out: MonthPoint[] = [];
  const idx: Record<string, MonthPoint> = {};
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const p: MonthPoint = { key, label: d.toLocaleDateString('en-GB', { month: 'short' }) + (d.getMonth() === 0 || i === n - 1 ? ' ' + String(d.getFullYear()).slice(2) : ''), bought: 0, given: 0, free: 0, signups: 0, revenue: 0, learners: 0 };
    out.push(p);
    idx[key] = p;
  }
  for (const r of rows) {
    const s = idx[monthKey(r.user.createdAt)];
    if (s) s.signups++;
    const seen = new Set<string>();
    for (const e of r.enrolments) {
      const p = idx[monthKey(e.at)];
      if (!p) continue;
      p[e.how]++;
      if (!seen.has(p.key)) {
        seen.add(p.key);
        p.learners++;
      }
    }
    for (const o of r.orderList) {
      const p = idx[monthKey(o.at)];
      if (p) p.revenue += o.total;
    }
  }
  return out;
}

/** Courses ranked by enrolments, with revenue. */
export function topCourses(rows: LearnerRow[], limit = 6) {
  const m: Record<string, { id: string; title: string; enrolled: number; bought: number; completed: number }> = {};
  for (const r of rows)
    for (const e of r.enrolments) {
      const x = (m[e.id] ??= { id: e.id, title: e.title, enrolled: 0, bought: 0, completed: 0 });
      x.enrolled++;
      if (e.how === 'bought') x.bought++;
      if (e.status === 'completed') x.completed++;
    }
  return Object.values(m).sort((a, b) => b.enrolled - a.enrolled).slice(0, limit);
}

export function csv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function download(name: string, text: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const ago = (iso: string | null | undefined, now = Date.now()) => {
  if (!iso) return 'never';
  const s = Math.round((now - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
