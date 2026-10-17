import { COURSES } from '../data/courses';
import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import { certificateId } from '../data/showcase';
import { api } from '../store/api';
import type { AppThunk } from '../store';
import { isAdminAccount } from '../store/roles';
import { renderEmail, type EmailCourse, type EmailData, type EmailKind } from './templates';

/** The address used for the logo and links inside emails. */
export const siteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export const toEmailCourse = (id: string, price?: number): EmailCourse => {
  const c = courseById(id);
  return { id, title: c?.title ?? id, meta: c?.meta?.[0], price: price ?? c?.price };
};

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** Fill in the details an email needs. `owned` keeps already-owned courses out of the suggestions. */
export function emailData(kind: EmailKind, name: string, email: string, extra: Partial<EmailData> & { ids: string[] }, owned: string[] = []): EmailData {
  const { ids, ...rest } = extra;
  const d: EmailData = { name, site: siteUrl(), courses: ids.map((id) => toEmailCourse(id)), date: today(), ...rest };
  if (kind === 'completed') {
    const c = courseById(ids[0]);
    d.certificateId = certificateId(email, ids[0]);
    d.lessons = c ? lessonsFor(c).length : undefined;
    // Suggest two paid courses from the same category that this learner does not have yet.
    d.next = c
      ? COURSES.filter((x) => x.id !== c.id && x.price > 0 && !owned.includes(x.id))
          .sort((a, b) => Number(b.group === c.group) - Number(a.group === c.group))
          .slice(0, 2)
          .map((x) => toEmailCourse(x.id))
      : [];
  }
  return d;
}

const rupee = (n: number) => (n === 0 ? 'Free' : '₹' + n.toLocaleString('en-IN'));

/** The short labelled summary FormSubmit shows as a table when no HTML sender is set up. */
export function emailFields(kind: EmailKind, d: EmailData): Record<string, string> {
  const f: Record<string, string> = {
    Type: kind === 'purchase' ? 'Course purchase' : kind === 'enroll' ? 'Free enrolment' : 'Course completed',
    Courses: d.courses.map((c) => c.title + (kind === 'purchase' && c.price != null ? ` (${rupee(c.price)})` : '')).join(' • '),
  };
  if (d.orderId) f.Order = d.orderId;
  if (d.paymentId) f['Payment ID'] = d.paymentId;
  if (d.total != null && kind === 'purchase') f['Total paid'] = rupee(d.total);
  if (d.certificateId) f.Certificate = d.certificateId;
  if (d.date) f.Date = d.date;
  return f;
}

/** Send any of the learner emails to an address (Admin > Emails > Send a test). */
export const sendEmailTo = (kind: EmailKind, data: EmailData, to: string, name: string): AppThunk<Promise<'emailjs' | 'webhook' | 'formsubmit'>> => (dispatch) => {
  const mail = renderEmail(kind, data);
  return dispatch(api.endpoints.learnerEmail.initiate({ to, name, ...mail, fields: emailFields(kind, data) })).unwrap();
};

/** Send one branded email to the logged-in learner (quietly; a failed email never blocks the app). */
export const emailLearner =
  (kind: EmailKind, data: EmailData): AppThunk =>
  (dispatch, getState) => {
    const { learner, auth } = getState();
    // No emails for the admin's own account (Admin mode or "Preview as learner"): it is for testing only.
    if (!learner.data.prefs.emails || !learner.email || isAdminAccount(getState())) return;
    const user = auth.users.find((u) => u.email === learner.email);
    if (!user) return;
    const mail = renderEmail(kind, data);
    void dispatch(api.endpoints.learnerEmail.initiate({ to: user.email, name: user.name, ...mail, fields: emailFields(kind, data) }))
      .unwrap()
      .catch((e: unknown) => console.warn('Email not sent:', e));
  };
