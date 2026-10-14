import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { dayKey } from "../data/showcase";
import { applySite } from "../data/liveCourses";
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
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
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
function syncLearner() {
  const { auth, learner: l } = store.getState();
  const email =
    auth.session && auth.users.some((u) => u.email === auth.session!.email)
      ? auth.session.email
      : null;
  if (email === l.email) return;
  const data = email
    ? migrateLearner(load<Partial<UserData>>("user_" + email, {}))
    : EMPTY_LEARNER;
  store.dispatch(learnerActions.loaded({ email, data }));
  store.dispatch(uiActions.reset());
  // Every day the app is opened counts towards the learning streak.
  if (email) store.dispatch(learnerActions.visited(dayKey(new Date())));
  syncGrants();
}

// Courses the admin gave to this learner's email are enrolled as soon as the learner is logged in.
function syncGrants() {
  const { learner: l, admin: a } = store.getState();
  if (!l.email) return;
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
  if (next.auth.users !== prev.auth.users) save("users", next.auth.users);
  if (next.theme.mode !== prev.theme.mode) save("theme", next.theme.mode);
  if (next.announcements.items !== prev.announcements.items)
    save("announcements", next.announcements.items);
  if (
    next.learner.data !== prev.learner.data &&
    next.learner.email &&
    next.learner.email === prev.learner.email
  )
    save("user_" + next.learner.email, next.learner.data);
  if (next.admin.grants !== prev.admin.grants)
    save("grants", next.admin.grants);
  if (next.admin.playerUrls !== prev.admin.playerUrls)
    save("player_urls", next.admin.playerUrls);
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
    next.auth.users !== prev.auth.users;
  prev = next;
  if (who) syncLearner();
  else if (grantsChanged) syncGrants();
});
