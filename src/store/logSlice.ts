import { createListenerMiddleware, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import { courseById } from '../data/recommend';
import { load } from '../utils/storage';
import { adminActions } from './adminSlice';
import { authActions } from './authSlice';
import { learnerActions } from './learnerSlice';
import { siteActions } from './siteSlice';
import { isAdminAccount, inPreview } from './roles';

/**
 * Activity log for the admin (Admin > Activity): every content change the admin makes, plus sign-ups,
 * log-ins, purchases, enrolments and finished courses.  -> tx_activity_log (newest first, last 500 kept)
 * Frontend-only: it records what happens in this browser.
 */
export type LogKind = 'content' | 'access' | 'site' | 'signup' | 'login' | 'purchase' | 'enroll' | 'complete';

export interface LogEntry {
  id: string;
  at: string;
  kind: LogKind;
  /** Who did it (email), when known */
  who?: string;
  text: string;
}

const MAX = 500;

const logSlice = createSlice({
  name: 'log',
  initialState: { items: load<LogEntry[]>('activity_log', []) },
  reducers: {
    added: {
      reducer: (s, a: PayloadAction<LogEntry>) => {
        s.items.unshift(a.payload);
        if (s.items.length > MAX) s.items.length = MAX;
      },
      prepare: (e: Omit<LogEntry, 'id' | 'at'>) => ({ payload: { ...e, id: Math.random().toString(36).slice(2, 10), at: new Date().toISOString() } }),
    },
    cleared: (s) => {
      s.items = [];
    },
  },
});

export const logActions = logSlice.actions;
export default logSlice.reducer;

const title = (id: string) => courseById(id)?.title ?? id;
const list = (ids: string[]) => (ids.length > 3 ? `${ids.slice(0, 3).map(title).join(', ')} and ${ids.length - 3} more` : ids.map(title).join(', '));

/** Turns store actions into log lines. Added to the store in src/store/index.ts. */
export const logListener = createListenerMiddleware();

type S = {
  auth: { session: { email: string } | null };
  learner: { email: string | null; data: { owned: string[] } };
  admin: { playerUrls: Record<string, string> };
  site: { banner: { show: boolean; text: string; link: string } };
};
const me = (s: S) => s.auth.session?.email;

logListener.startListening({
  matcher: isAnyOf(
    adminActions.accessGranted, adminActions.accessRevoked, adminActions.playerUrlSet,
    siteActions.courseAdded, siteActions.courseRemoved, siteActions.courseRestored, siteActions.visibilitySet, siteActions.openSet,
    siteActions.navHiddenSet, siteActions.navLabelSet, siteActions.bannerSet, siteActions.siteReplaced, siteActions.siteReset,
    authActions.userAdded, authActions.sessionStarted, learnerActions.purchased, learnerActions.enrolled, learnerActions.lessonCompleted,
  ),
  effect: (action, api) => {
    const s = api.getState() as S;
    const before = api.getOriginalState() as S;
    // The learner preview is a sandbox: nothing is logged. The admin's own "learning" is not learner activity either.
    const st = s as unknown as Parameters<typeof inPreview>[0];
    if (inPreview(st) || inPreview(before as unknown as Parameters<typeof inPreview>[0])) return;
    const adminSelf = isAdminAccount(st);
    const add = (kind: LogKind, text: string, who = me(s)) => api.dispatch(logActions.added({ kind, text, who }));

    if (adminActions.accessGranted.match(action)) add('access', `Gave ${action.payload.email} access to ${list(action.payload.ids)}`);
    else if (adminActions.accessRevoked.match(action)) add('access', `Removed ${title(action.payload.id)} from ${action.payload.email}`);
    else if (adminActions.playerUrlSet.match(action)) {
      const was = before.admin.playerUrls[action.payload.id] ?? '';
      const now = s.admin.playerUrls[action.payload.id] ?? '';
      if (was !== now) add('content', `Changed the lesson player of ${title(action.payload.id)}${now ? '' : ' back to the default'}`);
    } else if (siteActions.courseAdded.match(action)) add('content', `Created the course ${action.payload.title}`);
    else if (siteActions.courseRemoved.match(action)) add('content', `Removed ${title(action.payload)} from the catalog`);
    else if (siteActions.courseRestored.match(action)) add('content', `${action.payload.resetEdits ? 'Reset' : 'Showed again'}: ${title(action.payload.id)}`);
    else if (siteActions.visibilitySet.match(action)) add('content', `${action.payload.hidden ? 'Hid' : 'Showed'} ${title(action.payload.id)}`);
    else if (siteActions.openSet.match(action)) add('access', `${action.payload.open ? 'Opened' : 'Closed'} free access: ${list(action.payload.ids)}`);
    else if (siteActions.navHiddenSet.match(action)) add('site', `${action.payload.hidden ? 'Hid' : 'Showed'} the navbar item "${action.payload.key}"`);
    else if (siteActions.navLabelSet.match(action)) add('site', `Renamed the navbar item "${action.payload.key}"${action.payload.label.trim() ? ` to "${action.payload.label.trim()}"` : ' back to its default'}`);
    else if (siteActions.bannerSet.match(action)) {
      const b = before.site.banner;
      const n = s.site.banner;
      if (b.show !== n.show) add('site', `${n.show ? 'Turned on' : 'Turned off'} the announcement banner`);
      if (b.text !== n.text || b.link !== n.link) add('site', `Updated the banner: "${n.text.slice(0, 80)}"`);
    } else if (siteActions.siteReplaced.match(action)) add('site', 'Restored the site from a backup file');
    else if (siteActions.siteReset.match(action)) add('site', 'Reset every site change to the original');
    else if (authActions.userAdded.match(action)) add('signup', `${action.payload.name} signed up${action.payload.provider ? ' with ' + action.payload.provider : ''}`, action.payload.email);
    else if (authActions.sessionStarted.match(action)) add('login', 'Logged in', action.payload.email);
    else if (adminSelf && (learnerActions.purchased.match(action) || learnerActions.enrolled.match(action) || learnerActions.lessonCompleted.match(action))) return;
    else if (learnerActions.purchased.match(action)) {
      const o = action.payload.order;
      add('purchase', `Bought ${list(o.items.map((i) => i.id))} for ₹${o.total.toLocaleString('en-IN')} (order ${o.id})`, s.learner.email ?? undefined);
    } else if (learnerActions.enrolled.match(action)) {
      const fresh = action.payload.ids.filter((id) => !before.learner.data.owned.includes(id));
      if (fresh.length && before.learner.email === s.learner.email) add('enroll', `Enrolled in ${list(fresh)}`, s.learner.email ?? undefined);
    } else if (learnerActions.lessonCompleted.match(action) && action.payload.finished) add('complete', `Finished ${title(action.payload.id)}`, s.learner.email ?? undefined);
  },
});
