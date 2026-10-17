import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { dayKey } from "../data/showcase";
import { applySite } from "../data/liveCourses";
import { COURSES, HIDDEN_COURSES } from "../data/courses";
import { isAdminAccount, inPreview } from "./roles";
import { authActions } from "./authSlice";
import type { UserData } from "../types";
import { load, save } from "../utils/storage";
import { api } from "./api";
import admin from "./adminSlice";
import announcements from "./announcementsSlice";
import auth from "./authSlice";
import learner, {
  EMPTY_LEARNER,
  learnerActions,
  migrateLearner,
} from "./learnerSlice";
import site, { siteDataOf } from "./siteSlice";
import log, { logListener } from "./logSlice";
import theme from "./themeSlice";
import ui, { uiActions } from "./uiSlice";

/**
 * The Takxila Redux store.
 *
 *   auth           accounts and the current session         -> tx_users, tx_session
 *   learner        the logged-in learner's data              -> tx_user_<email>
 *   announcements  site announcements                        -> tx_announcements
 *   admin          grants, player links, admin/user mode -> tx_grants, tx_player_urls, tx_admin_mode
 *   site           everything the admin edits on the website -> tx_site
 *   log            the admin's activity log                  -> tx_activity_log
 *   theme          dark / light                              -> tx_theme
 *   ui             selection, dialogs, toasts (not saved)
 *   api            RTK Query: visitor counter, form emails
 *
 * Components use the hooks in src/context/* (useAuth, useStore, useAnnouncements, useThemeMode),
 * which read from this store, or useAppSelector / useAppDispatch directly.
 */
export const store = configureStore({
  reducer: {
    auth,
    learner,
    announcements,
    theme,
    ui,
    admin,
    site,
    log,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().prepend(logListener.middleware).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => R;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// ---------- Learner data follows the session: load tx_user_<email> whenever who is logged in changes ----------
// The admin account gets its own data: in Admin mode it owns every course (free, no cart); in "Preview as learner"
// it starts as a brand-new learner in a sandbox that is never saved (see src/store/roles.ts).
let loadedKey: string | null = null;
function adminData(email: string, preview: boolean): UserData {
  const stored = migrateLearner(load<Partial<UserData>>("user_" + email, {}));
  if (preview) return { ...EMPTY_LEARNER, prefs: stored.prefs };
  const all = [...COURSES, ...HIDDEN_COURSES].map((c) => c.id);
  const at = new Date().toISOString();
  return { ...stored, cart: [], owned: all, enrolledAt: Object.fromEntries(all.map((id) => [id, stored.enrolledAt[id] ?? at])) };
}
function syncLearner() {
  const state = store.getState();
  const { auth } = state;
  const email =
    auth.session && auth.users.some((u) => u.email === auth.session!.email)
      ? auth.session.email
      : null;
  const admin = !!email && isAdminAccount(state);
  const preview = admin && inPreview(state);
  const key = email ? email + (admin ? (preview ? "#preview" : "#admin") : "") : null;
  if (key === loadedKey) return;
  const sameUser = !!loadedKey && !!email && loadedKey.split("#")[0] === email;
  loadedKey = key;
  const data = !email
    ? EMPTY_LEARNER
    : admin
      ? adminData(email, preview)
      : migrateLearner(load<Partial<UserData>>("user_" + email, {}));
  store.dispatch(learnerActions.loaded({ email, data }));
  if (!sameUser) store.dispatch(uiActions.reset());
  if (admin) return;
  // Every day the app is opened counts towards the learning streak.
  if (email) store.dispatch(learnerActions.visited(dayKey(new Date())));
  syncGrants();
}

// Courses the admin gave to this learner's email are enrolled as soon as the learner is logged in.
function syncGrants() {
  const { learner: l, admin: a } = store.getState();
  if (!l.email || isAdminAccount(store.getState())) return;
  const ids = (a.grants[l.email] ?? []).filter(
    (id) => !l.data.owned.includes(id),
  );
  if (ids.length)
    store.dispatch(
      learnerActions.enrolled({ ids, at: new Date().toISOString() }),
    );
}
// The admin's course edits must be in place before anything reads the course list.
applySite(siteDataOf(store.getState().site));
syncLearner();

// ---------- Persistence: write a slice to localStorage only when it actually changed ----------
let prev = store.getState();
store.subscribe(() => {
  const next = store.getState();
  const sandbox = inPreview(next);
  // Leaving the learner preview: everything changed in it (accounts included) is thrown away below.
  const leftPreview = inPreview(prev) && !sandbox;
  if (next.auth.users !== prev.auth.users && !sandbox && !leftPreview) save("users", next.auth.users);
  if (next.theme.mode !== prev.theme.mode) save("theme", next.theme.mode);
  if (next.announcements.items !== prev.announcements.items)
    save("announcements", next.announcements.items);
  if (
    next.learner.data !== prev.learner.data &&
    next.learner.email &&
    next.learner.email === prev.learner.email &&
    !sandbox &&
    !leftPreview
  ) {
    // The admin's own record keeps only its settings (language, theme ...), never the "owns everything" list.
    if (isAdminAccount(next))
      save("user_" + next.learner.email, { ...load<Partial<UserData>>("user_" + next.learner.email, {}), prefs: next.learner.data.prefs });
    else save("user_" + next.learner.email, next.learner.data);
  }
  if (next.admin.grants !== prev.admin.grants)
    save("grants", next.admin.grants);
  if (next.admin.playerUrls !== prev.admin.playerUrls)
    save("player_urls", next.admin.playerUrls);
  if (next.log.items !== prev.log.items) save("activity_log", next.log.items);
  if (next.admin.mode !== prev.admin.mode) save("admin_mode", next.admin.mode);
  // BACKEND HOOK: when you add a server, send siteDataOf(next.site) to it here (and load it at start-up
  // in siteSlice.ts) so every visitor sees the admin's changes, not just this browser.
  if (next.site.rev !== prev.site.rev) {
    const data = siteDataOf(next.site);
    applySite(data);
    save("site", data);
  }
  const grantsChanged = next.admin.grants !== prev.admin.grants;
  const who =
    next.auth.session !== prev.auth.session ||
    next.auth.users !== prev.auth.users ||
    next.admin.mode !== prev.admin.mode ||
    // A course the admin just created is theirs straight away.
    (next.site.rev !== prev.site.rev && isAdminAccount(next) && !sandbox);
  if (next.site.rev !== prev.site.rev && isAdminAccount(next) && !sandbox) loadedKey = null;
  prev = next;
  if (leftPreview && next.auth.session) {
    store.dispatch(authActions.usersLoaded(load("users", next.auth.users)));
    return;
  }
  if (who) syncLearner();
  else if (grantsChanged) syncGrants();
});
