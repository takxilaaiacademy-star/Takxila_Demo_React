import { courseById } from '../data/recommend';
import { lessonsFor, pctOf } from '../data/curriculum';
import { priceCart, REFERRAL_REWARD } from '../data/showcase';
import type { AppNotification, NotificationKind, Order, QuizMode, ReferralRec } from '../types';
import { load, save } from '../utils/storage';
import type { AppThunk, RootState } from './index';
import { learnerActions as L } from './learnerSlice';
import { uiActions as U } from './uiSlice';
import { openAcademyCheckout, syncAcademyAdd } from '../utils/academy';
import { emailData, emailLearner, toEmailCourse } from '../emails/send';

/**
 * Learner actions with side effects (toasts, confetti, notifications, referral credit).
 * Plain state changes are the reducers in learnerSlice.
 */

const now = () => new Date().toISOString();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
/** Name and email of the logged-in learner, for emails. */
const who = (getState: () => RootState) => {
  const { auth, learner } = getState();
  const u = auth.users.find((x) => x.email === learner.email);
  return { name: u?.name ?? '', email: u?.email ?? '', owned: learner.data.owned };
};

const note = (kind: NotificationKind, title: string, body: string, to?: string): AppNotification => ({ id: uid(), kind, title, body, to, at: now(), read: false });

export const toast = (message: string): AppThunk => (dispatch) => dispatch(U.toastShown(message));

/** Free courses enroll straight away; paid ones go to the cart and open the combo popup. */
export const addToCart = (id: string): AppThunk => (dispatch, getState) => {
  const c = courseById(id);
  const { owned, cart } = getState().learner.data;
  if (!c) return;
  if (owned.includes(id)) return dispatch(U.toastShown('You are already enrolled in this course.'));
  if (c.price === 0) {
    dispatch(L.enrolled({ ids: [id], at: now() }));
    dispatch(L.notified([note('enroll', 'Enrolled: ' + c.title, 'Your free course is ready in My courses.', '/courses/' + id)]));
    const w = who(getState);
    dispatch(emailLearner('enroll', emailData('enroll', w.name, w.email, { ids: [id] })));
    dispatch(U.celebrated());
    return dispatch(U.toastShown('Enrolled. Find it in My courses.'));
  }
  if (cart.includes(id)) return dispatch(U.toastShown('Already in your cart.'));
  dispatch(L.cartAdded([id]));
  syncAcademyAdd(id);
  dispatch(U.upsellSet(id));
};

/** Add several courses at once (selection bar, combos). */
export const addMany = (ids: string[]): AppThunk => (dispatch, getState) => {
  const { owned, cart } = getState().learner.data;
  const fresh = ids.filter((id) => !owned.includes(id) && !cart.includes(id));
  const free = fresh.filter((id) => courseById(id)?.price === 0);
  const paid = fresh.filter((id) => !free.includes(id));
  if (free.length) {
    dispatch(L.enrolled({ ids: free, at: now() }));
    dispatch(L.notified(free.map((id) => note('enroll', 'Enrolled: ' + (courseById(id)?.title ?? id), 'Your free course is ready in My courses.', '/courses/' + id))));
    const w = who(getState);
    dispatch(emailLearner('enroll', emailData('enroll', w.name, w.email, { ids: free })));
  }
  if (paid.length) {
    dispatch(L.cartAdded(paid));
    paid.forEach(syncAcademyAdd);
  }
  dispatch(U.selCleared());
  dispatch(
    U.toastShown(
      paid.length
        ? paid.length + (paid.length > 1 ? ' courses' : ' course') + ' added to cart' + (free.length ? ' + free course enrolled' : '')
        : free.length
          ? 'Free course enrolled. Find it in My courses.'
          : 'Already in your cart or courses.',
    ),
  );
};

/** Pay for (or enroll in) everything in the cart. paymentId comes from Razorpay. */
export const checkout = (paymentId?: string): AppThunk => (dispatch, getState) => {
  const { learner, auth } = getState();
  const d = learner.data;
  const user = auth.users.find((u) => u.email === auth.session?.email);
  const referral = !!user?.refBy && !d.refUsed && !d.orders.length;
  const priced = priceCart(d.cart, d.owned, referral);
  const usedReferral = priced.lines.some((l) => l.label === 'Referral discount');
  const order: Order = {
    id: 'TX' + Date.now().toString(36).toUpperCase(), at: now(),
    items: priced.ids.map((id) => ({ id, price: courseById(id)?.price ?? 0 })),
    subtotal: priced.subtotal, discounts: priced.lines, total: priced.total,
    ...(paymentId && { paymentId }),
  };
  if (usedReferral && user?.refBy) {
    // Credit the friend who shared the code.
    const all = load<Record<string, ReferralRec[]>>('referrals', {});
    const rec: ReferralRec = { name: user.name, email: user.email, courses: priced.ids, at: order.at, reward: REFERRAL_REWARD };
    save('referrals', { ...all, [user.refBy]: [...(all[user.refBy] || []), rec] });
  }
  dispatch(L.enrolled({ ids: priced.ids, at: order.at }));
  dispatch(L.purchased({ order, usedReferral }));
  const n = priced.ids.length;
  dispatch(
    L.notified([
      note(
        'purchase',
        paymentId ? 'Payment successful · ₹' + order.total : 'Enrolment confirmed',
        `You are enrolled in ${n === 1 ? courseById(priced.ids[0])?.title ?? '1 course' : n + ' courses'}. Order ${order.id}.`,
        '/purchases',
      ),
    ]),
  );
  if (priced.ids.length) {
    const w = who(getState);
    const kind = order.total > 0 ? 'purchase' : 'enroll';
    const data = emailData(kind, w.name, w.email, { ids: [], orderId: order.id, paymentId, total: order.total });
    data.courses = order.items.map((i) => toEmailCourse(i.id, i.price));
    dispatch(emailLearner(kind, data));
  }
  dispatch(U.celebrated());
  dispatch(U.toastShown(paymentId ? 'Payment received. Your courses are ready.' : 'Enrolled! Your courses are ready.'));
};

/** Tick the next lesson of a course. Finishing the last one completes the course and readies the certificate. */
export const completeLesson = (id: string): AppThunk => (dispatch, getState) => {
  const c = courseById(id);
  if (!c) return;
  const list = lessonsFor(c);
  const done = getState().learner.data.lessons[id] || 0;
  if (done >= list.length) return;
  const n = done + 1;
  const finished = n >= list.length;
  dispatch(L.lessonCompleted({ id, at: now(), title: list[done], finished }));
  if (finished) {
    dispatch(
      L.notified([
        note('certificate', 'Your certificate is ready', 'Download it as PNG or PDF: ' + c.title + '.', '/certificates'),
        note('complete', 'Course completed: ' + c.title, 'Well done! Your grade is 100%.', '/courses/' + id + '/grades'),
      ]),
    );
    // One email for both: a congratulations greeting with the certificate.
    const w = who(getState);
    dispatch(emailLearner('completed', emailData('completed', w.name, w.email, { ids: [id] }, w.owned)));
    dispatch(U.celebrated());
  }
  dispatch(U.toastShown(finished ? 'Course completed! Your certificate is ready.' : `Lesson ${n} of ${list.length} done. Progress ${pctOf(c, n)}%`));
};

export const toggleSel = (id: string): AppThunk => (dispatch, getState) => {
  if (getState().learner.data.owned.includes(id)) return dispatch(U.toastShown('You are already enrolled in this course.'));
  dispatch(U.selToggled(id));
};

export const openQuiz = (mode: QuizMode): AppThunk => (dispatch, getState) => {
  const d = getState().learner.data;
  dispatch(U.quizSet({ mode, step: 0, ans: (mode === 'onboard' ? d.profile?.ans : d.calc) || {} }));
};

/** Send the cart to the Moodle academy: adds each course to its cart and opens its checkout (Pay with Razorpay there). */
export const checkoutOnAcademy = (): AppThunk<Promise<{ added: string[]; missing: string[] } | null>> => async (dispatch, getState) => {
  try {
    const res = await openAcademyCheckout(getState().learner.data.cart);
    if (res.missing.length)
      dispatch(U.toastShown(`${res.missing.length} course${res.missing.length > 1 ? 's are' : ' is'} not linked to the academy yet. Add ${res.missing.length > 1 ? 'them' : 'it'} there by hand.`));
    return res;
  } catch (e) {
    dispatch(U.toastShown(e instanceof Error ? e.message : 'Could not open the academy.'));
    return null;
  }
};
