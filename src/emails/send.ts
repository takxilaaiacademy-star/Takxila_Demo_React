import { COURSES } from '../data/courses';
import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import { certificateId } from '../data/showcase';
import { api } from '../store/api';
import type { AppThunk } from '../store';
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

/** Send one branded email to the logged-in learner (quietly; a failed email never blocks the app). */
export const emailLearner =
  (kind: EmailKind, data: EmailData): AppThunk =>
  (dispatch, getState) => {
    const { learner, auth } = getState();
    if (!learner.data.prefs.emails || !learner.email) return;
    const user = auth.users.find((u) => u.email === learner.email);
    if (!user) return;
    const mail = renderEmail(kind, data);
    void dispatch(api.endpoints.learnerEmail.initiate({ to: user.email, name: user.name, ...mail }))
      .unwrap()
      .catch((e: unknown) => console.warn('Email not sent:', e));
  };
