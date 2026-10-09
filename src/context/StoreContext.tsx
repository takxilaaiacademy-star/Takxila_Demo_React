import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from './AuthContext';
import { courseById } from '../data/recommend';
import { lessonsFor, pctOf } from '../data/curriculum';
import { load, save } from '../utils/storage';
import type { Activity, Answers, Preferences, QuizMode, QuizState, ReferralRec, Resume, UserData } from '../types';
import { dayKey, priceCart, REFERRAL_REWARD } from '../data/showcase';
import Confetti from '../components/Confetti';

interface StoreActions {
  toast: (message: string) => void;
  celebrate: () => void;
  addToCart: (id: string) => void;
  addMany: (ids: string[]) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
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
}

interface StoreValue extends UserData, StoreActions {
  sel: string[];
  quiz: QuizState | null;
  ready: boolean;
  /** Progress per course in %, derived from completed lessons */
  prog: Record<string, number>;
  /** This user signed up with a referral code and has not used the discount yet */
  referralOpen: boolean;
}

export const DEFAULT_PREFS: Preferences = { autoplay: true, reduceMotion: false, pageSize: 9, lang: 'en', notify: true };
const EMPTY: UserData = {
  cart: [], owned: [], lessons: {}, enrolledAt: {}, profile: null, calc: null, recent: [],
  orders: [], activity: [], prefs: DEFAULT_PREFS, annSeen: null,
  favorites: [], visits: [], resume: null, withdrawals: [], refUsed: false,
};

// Older saves kept progress as a % in `prog`; turn that into completed lessons.
function migrate(raw: Partial<UserData> & { prog?: Record<string, number> }): UserData {
  const d: UserData = { ...EMPTY, ...raw, prefs: { ...DEFAULT_PREFS, ...raw.prefs } };
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

const StoreContext = createContext<StoreValue | null>(null);
const now = () => new Date().toISOString();

// Per-user learning data, saved to localStorage under tx_user_<email>.
export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email || null;
  const [data, setData] = useState<UserData>(EMPTY);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [toastMsg, setToastMsg] = useState<{ m: string; k: number } | null>(null);
  const [party, setParty] = useState(0);

  useEffect(() => {
    const d = email ? migrate(load<Partial<UserData>>('user_' + email, {})) : EMPTY;
    const today = dayKey(new Date());
    // Every day the app is opened counts towards the learning streak.
    setData(email && !d.visits.includes(today) ? { ...d, visits: [...d.visits, today].slice(-400) } : d);
    setSel([]);
    setQuiz(null);
    setLoadedFor(email);
  }, [email]);

  useEffect(() => {
    if (email && loadedFor === email) save('user_' + email, data);
  }, [data, email, loadedFor]);

  // Actions read the latest state through a ref, so they never change identity
  // and memoised components (course cards) do not re-render because of them.
  const live = useRef({ data, sel, user });
  live.current = { data, sel, user };

  const actions = useMemo<StoreActions>(() => {
    const toast = (m: string) => setToastMsg({ m, k: Date.now() });
    const patch = (p: (d: UserData) => Partial<UserData>) => setData((d) => ({ ...d, ...p(d) }));
    const log = (d: UserData, items: Activity[]) => [...items, ...d.activity].slice(0, 400);
    const enroll = (d: UserData, ids: string[]): Partial<UserData> => {
      const fresh = ids.filter((id) => !d.owned.includes(id));
      const at = now();
      return {
        owned: d.owned.concat(fresh),
        enrolledAt: { ...d.enrolledAt, ...Object.fromEntries(fresh.map((id) => [id, at])) },
        activity: log(d, fresh.map((courseId) => ({ type: 'enroll' as const, courseId, at }))),
      };
    };

    return {
      toast,
      celebrate: () => setParty((n) => n + 1),
      addToCart: (id) => {
        const c = courseById(id);
        const { owned, cart } = live.current.data;
        if (!c) return;
        if (owned.includes(id)) return toast('You are already enrolled in this course.');
        if (c.price === 0) {
          patch((d) => enroll(d, [id]));
          setParty((n) => n + 1);
          return toast('Enrolled. Find it in My courses.');
        }
        if (cart.includes(id)) return toast('Already in your cart.');
        patch((d) => ({ cart: d.cart.concat(id) }));
        toast('Added to cart.');
      },
      // Paid courses go to the cart, free ones enroll straight away.
      addMany: (ids) => {
        const { owned, cart } = live.current.data;
        const fresh = ids.filter((id) => !owned.includes(id) && !cart.includes(id));
        const free = fresh.filter((id) => courseById(id)?.price === 0);
        const paid = fresh.filter((id) => !free.includes(id));
        patch((d) => ({ ...enroll(d, free), cart: d.cart.concat(paid) }));
        setSel([]);
        toast(
          paid.length
            ? paid.length + (paid.length > 1 ? ' courses' : ' course') + ' added to cart' + (free.length ? ' + free course enrolled' : '')
            : free.length
              ? 'Free course enrolled. Find it in My courses.'
              : 'Already in your cart or courses.',
        );
      },
      removeFromCart: (id) => patch((d) => ({ cart: d.cart.filter((x) => x !== id) })),
      checkout: () => {
        const { data: d0, user: u } = live.current;
        const referral = !!u?.refBy && !d0.refUsed && !d0.orders.length;
        const priced = priceCart(d0.cart, d0.owned, referral);
        const usedRef = priced.lines.some((l) => l.label === 'Referral discount');
        const order = {
          id: 'TX' + Date.now().toString(36).toUpperCase(), at: now(),
          items: priced.ids.map((id) => ({ id, price: courseById(id)?.price ?? 0 })),
          subtotal: priced.subtotal, discounts: priced.lines, total: priced.total,
        };
        if (usedRef && u?.refBy) {
          // Credit the friend who shared the code.
          const all = load<Record<string, ReferralRec[]>>('referrals', {});
          const rec: ReferralRec = { name: u.name, email: u.email, courses: priced.ids, at: order.at, reward: REFERRAL_REWARD };
          save('referrals', { ...all, [u.refBy]: [...(all[u.refBy] || []), rec] });
        }
        patch((d) => {
          const e = enroll(d, priced.ids);
          return {
            ...e, cart: [], orders: [order, ...d.orders], refUsed: d.refUsed || usedRef,
            activity: [{ type: 'purchase', courseId: priced.ids[0] ?? '', at: order.at, detail: order.id }, ...(e.activity ?? d.activity)],
          };
        });
        setParty((n) => n + 1);
        toast('Enrolled! Your courses are ready.');
      },
      toggleFavorite: (id) => patch((d) => ({ favorites: d.favorites.includes(id) ? d.favorites.filter((x) => x !== id) : [...d.favorites, id] })),
      saveResume: (r) => {
        patch(() => ({ resume: r }));
        toast('Resume saved.');
      },
      withdraw: (amount) => {
        patch((d) => ({ withdrawals: [...d.withdrawals, { at: now(), amount }] }));
        toast('Withdrawal of ₹' + amount + ' requested.');
      },
      completeLesson: (id) => {
        const c = courseById(id);
        if (!c) return;
        const total = lessonsFor(c).length;
        const done = live.current.data.lessons[id] || 0;
        if (done >= total) return;
        const n = done + 1;
        const at = now();
        patch((d) => ({
          lessons: { ...d.lessons, [id]: n },
          activity: log(d, [
            ...(n >= total ? [{ type: 'complete' as const, courseId: id, at }] : []),
            { type: 'lesson', courseId: id, at, detail: lessonsFor(c)[done] },
          ]),
        }));
        if (n >= total) setParty((p) => p + 1);
        toast(n >= total ? 'Course completed! Your grade is 100%.' : `Lesson ${n} of ${total} done. Progress ${pctOf(c, n)}%`);
      },
      markViewed: (id) => patch((d) => ({ recent: [id].concat(d.recent.filter((x) => x !== id)).slice(0, 6) })),
      toggleSel: (id) => {
        if (live.current.data.owned.includes(id)) return toast('You are already enrolled in this course.');
        setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat(id)));
      },
      clearSel: () => setSel([]),
      saveProfile: (ans) => patch(() => ({ profile: { ans, at: now() } })),
      saveCalc: (ans) => patch(() => ({ calc: ans })),
      setPrefs: (p) => patch((d) => ({ prefs: { ...d.prefs, ...p } })),
      markAnnouncementsSeen: () => patch(() => ({ annSeen: now() })),
      openQuiz: (mode) => {
        const d = live.current.data;
        setQuiz({ mode, step: 0, ans: (mode === 'onboard' ? d.profile?.ans : d.calc) || {} });
      },
      setQuiz,
      closeQuiz: () => setQuiz(null),
    };
  }, []);

  const prog = useMemo(() => {
    const out: Record<string, number> = {};
    data.owned.forEach((id) => {
      const c = courseById(id);
      if (c) out[id] = pctOf(c, data.lessons[id] || 0);
    });
    return out;
  }, [data.owned, data.lessons]);

  const value = useMemo<StoreValue>(
    () => ({
      ...data, ...actions, prog, sel, quiz, ready: !!email && loadedFor === email,
      referralOpen: !!user?.refBy && !data.refUsed && !data.orders.length,
    }),
    [data, actions, prog, sel, quiz, email, loadedFor, user?.refBy],
  );

  // Reduced motion: honour the preference and the OS setting.
  useEffect(() => {
    document.documentElement.classList.toggle('tx-reduce', data.prefs.reduceMotion);
  }, [data.prefs.reduceMotion]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {party > 0 && !data.prefs.reduceMotion && <Confetti key={party} />}
      <Snackbar
        key={toastMsg?.k}
        open={!!toastMsg}
        autoHideDuration={2800}
        onClose={(_, r) => r !== 'clickaway' && setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: sel.length ? 96 : 24 } }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToastMsg(null)} sx={{ fontWeight: 600 }}>
          {toastMsg?.m}
        </Alert>
      </Snackbar>
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
