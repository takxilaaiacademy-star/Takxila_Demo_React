import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import type { Activity, Answers, AppNotification, Order, Preferences, Resume, UserData } from '../types';

/**
 * Everything one learner owns or has done: cart, courses, progress, orders, notifications...
 * Saved per user to localStorage (tx_user_<email>) by the store's persistence listener.
 */

export const DEFAULT_PREFS: Preferences = { autoplay: true, reduceMotion: false, pageSize: 9, lang: 'en', notify: true, emails: true };

export const EMPTY_LEARNER: UserData = {
  cart: [], owned: [], lessons: {}, enrolledAt: {}, profile: null, calc: null, recent: [],
  orders: [], activity: [], prefs: DEFAULT_PREFS, annSeen: null,
  favorites: [], visits: [], resume: null, withdrawals: [], refUsed: false,
  notifications: [], dismissedAnns: [],
};

/** Bring older saves up to date (missing fields, progress kept as % in `prog`). */
export function migrateLearner(raw: Partial<UserData> & { prog?: Record<string, number> }): UserData {
  const d: UserData = { ...EMPTY_LEARNER, ...raw, prefs: { ...DEFAULT_PREFS, ...raw.prefs } };
  if (raw.prog && !raw.lessons) {
    d.lessons = {};
    Object.entries(raw.prog).forEach(([id, pct]) => {
      const c = courseById(id);
      if (c) d.lessons[id] = Math.round((pct / 100) * lessonsFor(c).length);
    });
  }
  delete (d as { prog?: unknown }).prog;
  return d;
}

interface LearnerState {
  /** Whose data is loaded (null when logged out) */
  email: string | null;
  data: UserData;
}

const initialState: LearnerState = { email: null, data: EMPTY_LEARNER };
const MAX_ACTIVITY = 400;
const MAX_NOTIFICATIONS = 50;
const log = (d: UserData, items: Activity[]) => {
  d.activity = [...items, ...d.activity].slice(0, MAX_ACTIVITY);
};

const learnerSlice = createSlice({
  name: 'learner',
  initialState,
  reducers: {
    loaded: (_s, a: PayloadAction<{ email: string | null; data: UserData }>) => a.payload,

    // ----- Cart and enrolment -----
    cartAdded: ({ data }, a: PayloadAction<string[]>) => {
      a.payload.forEach((id) => !data.cart.includes(id) && data.cart.push(id));
    },
    cartRemoved: ({ data }, a: PayloadAction<string>) => {
      data.cart = data.cart.filter((x) => x !== a.payload);
    },
    enrolled: ({ data }, a: PayloadAction<{ ids: string[]; at: string }>) => {
      const fresh = a.payload.ids.filter((id) => !data.owned.includes(id));
      fresh.forEach((id) => {
        data.owned.push(id);
        data.enrolledAt[id] = a.payload.at;
      });
      log(data, fresh.map((courseId) => ({ type: 'enroll', courseId, at: a.payload.at })));
    },
    purchased: ({ data }, a: PayloadAction<{ order: Order; usedReferral: boolean }>) => {
      const { order, usedReferral } = a.payload;
      data.cart = [];
      data.orders.unshift(order);
      data.refUsed = data.refUsed || usedReferral;
      log(data, [{ type: 'purchase', courseId: order.items[0]?.id ?? '', at: order.at, detail: order.id }]);
    },

    // ----- Learning -----
    lessonCompleted: ({ data }, a: PayloadAction<{ id: string; at: string; title: string; finished: boolean }>) => {
      const { id, at, title, finished } = a.payload;
      data.lessons[id] = (data.lessons[id] || 0) + 1;
      log(data, [...(finished ? [{ type: 'complete' as const, courseId: id, at }] : []), { type: 'lesson', courseId: id, at, detail: title }]);
    },
    viewed: ({ data }, a: PayloadAction<string>) => {
      data.recent = [a.payload, ...data.recent.filter((x) => x !== a.payload)].slice(0, 6);
    },
    visited: ({ data }, a: PayloadAction<string>) => {
      if (!data.visits.includes(a.payload)) data.visits = [...data.visits, a.payload].slice(-400);
    },
    favoriteToggled: ({ data }, a: PayloadAction<string>) => {
      const id = a.payload;
      data.favorites = data.favorites.includes(id) ? data.favorites.filter((x) => x !== id) : [...data.favorites, id];
    },

    // ----- Profile, settings, rewards -----
    resumeSaved: ({ data }, a: PayloadAction<Resume>) => {
      data.resume = a.payload;
    },
    withdrawn: ({ data }, a: PayloadAction<{ at: string; amount: number }>) => {
      data.withdrawals.push(a.payload);
    },
    profileSaved: ({ data }, a: PayloadAction<{ ans: Answers; at: string }>) => {
      data.profile = a.payload;
    },
    calcSaved: ({ data }, a: PayloadAction<Answers>) => {
      data.calc = a.payload;
    },
    prefsChanged: ({ data }, a: PayloadAction<Partial<Preferences>>) => {
      data.prefs = { ...data.prefs, ...a.payload };
    },
    announcementsSeen: ({ data }, a: PayloadAction<string>) => {
      data.annSeen = a.payload;
    },

    // ----- Notifications (the bell) -----
    notified: ({ data }, a: PayloadAction<AppNotification[]>) => {
      data.notifications = [...a.payload, ...data.notifications].slice(0, MAX_NOTIFICATIONS);
    },
    notificationRemoved: ({ data }, a: PayloadAction<string>) => {
      data.notifications = data.notifications.filter((n) => n.id !== a.payload);
    },
    announcementDismissed: ({ data }, a: PayloadAction<string>) => {
      if (!data.dismissedAnns.includes(a.payload)) data.dismissedAnns.push(a.payload);
    },
    notificationRead: ({ data }, a: PayloadAction<string>) => {
      const n = data.notifications.find((x) => x.id === a.payload);
      if (n) n.read = true;
    },
    notificationsAllRead: ({ data }, a: PayloadAction<string>) => {
      data.notifications.forEach((n) => (n.read = true));
      data.annSeen = a.payload;
    },
    notificationsCleared: ({ data }, a: PayloadAction<string[]>) => {
      data.notifications = [];
      data.dismissedAnns = Array.from(new Set([...data.dismissedAnns, ...a.payload]));
    },
  },
});

export const learnerActions = learnerSlice.actions;
export default learnerSlice.reducer;
