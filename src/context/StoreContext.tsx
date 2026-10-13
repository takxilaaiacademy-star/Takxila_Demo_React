import { useEffect, useMemo, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { shallowEqual } from 'react-redux';
import { courseById } from '../data/recommend';
import { pctOf } from '../data/curriculum';
import { useAppDispatch, useAppSelector } from '../store';
import { learnerActions as L } from '../store/learnerSlice';
import { uiActions as U } from '../store/uiSlice';
import * as T from '../store/learnerThunks';
import type { Answers, Preferences, QuizMode, QuizState, Resume, UserData } from '../types';
import Confetti from '../components/Confetti';
import { applySiteLanguage, savedLanguage } from '../utils/siteTranslate';

export { DEFAULT_PREFS } from '../store/learnerSlice';

/**
 * useStore() is the learner's data plus every learner action, read from the Redux store
 * (src/store/learnerSlice.ts, uiSlice.ts, learnerThunks.ts). It keeps the same shape the
 * pages used before Redux, so nothing else had to change.
 */
interface StoreActions {
  toast: (message: string) => void;
  celebrate: () => void;
  addToCart: (id: string) => void;
  addMany: (ids: string[]) => void;
  removeFromCart: (id: string) => void;
  checkout: (paymentId?: string) => void;
  /** Close the "added to cart" popup */
  closeUpsell: () => void;
  toggleFavorite: (id: string) => void;
  saveResume: (r: Resume) => void;
  withdraw: (amount: number) => void;
  completeLesson: (id: string) => void;
  markViewed: (id: string) => void;
  toggleSel: (id: string) => void;
  clearSel: () => void;
  saveProfile: (ans: Answers) => void;
  saveCalc: (ans: Answers) => void;
  setPrefs: (patch: Partial<Preferences>) => void;
  markAnnouncementsSeen: () => void;
  openQuiz: (mode: QuizMode) => void;
  setQuiz: (quiz: QuizState | null) => void;
  closeQuiz: () => void;
  /** Bell notifications */
  removeNotification: (id: string) => void;
  dismissAnnouncement: (id: string) => void;
  readNotification: (id: string) => void;
  readAllNotifications: () => void;
  clearNotifications: (announcementIds: string[]) => void;
}

interface StoreValue extends UserData, StoreActions {
  sel: string[];
  quiz: QuizState | null;
  /** Course just added to the cart: the popup with related courses and combos shows for it */
  upsell: string | null;
  ready: boolean;
  /** Progress per course in %, derived from completed lessons */
  prog: Record<string, number>;
  /** This user signed up with a referral code and has not used the discount yet */
  referralOpen: boolean;
}

const now = () => new Date().toISOString();

/** All learner actions. They only depend on dispatch, so they never change identity. */
export function useStoreActions(): StoreActions {
  const dispatch = useAppDispatch();
  return useMemo<StoreActions>(
    () => ({
      toast: (m) => dispatch(U.toastShown(m)),
      celebrate: () => dispatch(U.celebrated()),
      closeUpsell: () => dispatch(U.upsellSet(null)),
      addToCart: (id) => dispatch(T.addToCart(id)),
      addMany: (ids) => dispatch(T.addMany(ids)),
      removeFromCart: (id) => dispatch(L.cartRemoved(id)),
      checkout: (paymentId) => dispatch(T.checkout(paymentId)),
      toggleFavorite: (id) => dispatch(L.favoriteToggled(id)),
      saveResume: (r) => {
        dispatch(L.resumeSaved(r));
        dispatch(U.toastShown('Resume saved.'));
      },
      withdraw: (amount) => {
        dispatch(L.withdrawn({ at: now(), amount }));
        dispatch(U.toastShown('Withdrawal of ₹' + amount + ' requested.'));
      },
      completeLesson: (id) => dispatch(T.completeLesson(id)),
      markViewed: (id) => dispatch(L.viewed(id)),
      toggleSel: (id) => dispatch(T.toggleSel(id)),
      clearSel: () => dispatch(U.selCleared()),
      saveProfile: (ans) => dispatch(L.profileSaved({ ans, at: now() })),
      saveCalc: (ans) => dispatch(L.calcSaved(ans)),
      setPrefs: (p) => dispatch(L.prefsChanged(p)),
      markAnnouncementsSeen: () => dispatch(L.announcementsSeen(now())),
      openQuiz: (mode) => dispatch(T.openQuiz(mode)),
      setQuiz: (q) => dispatch(U.quizSet(q)),
      closeQuiz: () => dispatch(U.quizSet(null)),
      removeNotification: (id) => dispatch(L.notificationRemoved(id)),
      dismissAnnouncement: (id) => dispatch(L.announcementDismissed(id)),
      readNotification: (id) => dispatch(L.notificationRead(id)),
      readAllNotifications: () => dispatch(L.notificationsAllRead(now())),
      clearNotifications: (ids) => dispatch(L.notificationsCleared(ids)),
    }),
    [dispatch],
  );
}

/** Progress % per owned course. */
export function useProgress(): Record<string, number> {
  const { owned, lessons } = useAppSelector((s) => ({ owned: s.learner.data.owned, lessons: s.learner.data.lessons }), shallowEqual);
  return useMemo(() => {
    const out: Record<string, number> = {};
    owned.forEach((id) => {
      const c = courseById(id);
      if (c) out[id] = pctOf(c, lessons[id] || 0);
    });
    return out;
  }, [owned, lessons]);
}

export function useStore(): StoreValue {
  const data = useAppSelector((s) => s.learner.data);
  const { sel, quiz, upsell } = useAppSelector((s) => ({ sel: s.ui.sel, quiz: s.ui.quiz, upsell: s.ui.upsell }), shallowEqual);
  const ready = useAppSelector((s) => !!s.learner.email && s.learner.email === s.auth.session?.email);
  const refBy = useAppSelector((s) => s.auth.users.find((u) => u.email === s.learner.email)?.refBy);
  const actions = useStoreActions();
  const prog = useProgress();
  return useMemo<StoreValue>(
    () => ({ ...data, ...actions, prog, sel, quiz, upsell, ready, referralOpen: !!refBy && !data.refUsed && !data.orders.length }),
    [data, actions, prog, sel, quiz, upsell, ready, refBy],
  );
}

/** Screen-wide extras driven by the store: toasts, confetti and the reduce-motion class. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.ui.toast);
  const party = useAppSelector((s) => s.ui.party);
  const hasSel = useAppSelector((s) => s.ui.sel.length > 0);
  const reduce = useAppSelector((s) => s.learner.data.prefs.reduceMotion);
  // Logged in: the learner's language. Before login: the last language picked in this browser.
  const lang = useAppSelector((s) => (s.learner.email ? s.learner.data.prefs.lang : null)) ?? savedLanguage();

  // Translate the whole site into the chosen language.
  useEffect(() => {
    applySiteLanguage(lang);
  }, [lang]);

  // Reduced motion: honour the preference and the OS setting.
  useEffect(() => {
    document.documentElement.classList.toggle('tx-reduce', reduce);
  }, [reduce]);

  return (
    <>
      {children}
      {party > 0 && !reduce && <Confetti key={party} />}
      <Snackbar
        key={toast?.key}
        open={!!toast}
        autoHideDuration={2800}
        onClose={(_, r) => r !== 'clickaway' && dispatch(U.toastHidden())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: hasSel ? 96 : 24 } }}
      >
        <Alert severity="success" variant="filled" onClose={() => dispatch(U.toastHidden())} sx={{ fontWeight: 600 }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
