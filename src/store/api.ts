import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Every call to an outside service goes through this RTK Query API, so loading and error states,
 * caching and retries live in one place. Add new endpoints here when the academy gets its own backend.
 */

// Contact, mentor and password-reset forms are emailed through FormSubmit (https://formsubmit.co).
// The very first message triggers a one-time "Activate form" email to the inbox; click it once.
export const INBOX = 'takxila.ai.academy@gmail.com';
const FORMSUBMIT = `https://formsubmit.co/ajax/${INBOX}`;

// Visitor counter: a free public counter (counterapi.dev). Falls back to a count kept in this browser.
const COUNTER = 'https://api.counterapi.dev/v1/takxila-ai-academy/visits';

// Branded learner emails go out through EmailJS (https://www.emailjs.com), which can send your own HTML to any address.
const EMAILJS = 'https://api.emailjs.com/api/v1.0/email/send';
export const emailjsConfig = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};
export const emailjsReady = () => !!(emailjsConfig.service && emailjsConfig.template && emailjsConfig.publicKey);

export interface LearnerEmailRequest {
  to: string;
  name: string;
  subject: string;
  html: string;
  text: string;
}

export interface MailRequest {
  subject: string;
  fields: Record<string, string>;
}

function localVisits(increment: boolean): number {
  try {
    const n = Number(localStorage.getItem('tx_visits') || 0) + (increment ? 1 : 0);
    localStorage.setItem('tx_visits', String(n));
    return n;
  } catch {
    return 1;
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<{ message: string }>(),
  endpoints: (build) => ({
    /** Visitor count. `count: true` adds this visit (once per browser session). */
    visits: build.query<{ count: number; source: 'online' | 'local' }, { count: boolean }>({
      queryFn: async ({ count }) => {
        try {
          const res = await fetch(count ? COUNTER + '/up' : COUNTER, { signal: AbortSignal.timeout(5000) });
          const d = (await res.json()) as { count?: number };
          if (!res.ok || typeof d.count !== 'number') throw new Error('counter');
          return { data: { count: d.count, source: 'online' } };
        } catch {
          return { data: { count: localVisits(count), source: 'local' } };
        }
      },
      keepUnusedDataFor: 600,
    }),

    /** Email a form to the academy inbox. */
    sendMail: build.mutation<true, MailRequest>({
      queryFn: async ({ subject, fields }) => {
        try {
          const res = await fetch(FORMSUBMIT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ _subject: subject, _template: 'table', _captcha: 'false', ...fields }),
          });
          const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
          if (!res.ok || String(data.success) === 'false') return { error: { message: data.message || 'The message could not be sent.' } };
          return { data: true };
        } catch (e) {
          return { error: { message: e instanceof Error ? e.message : 'Network error' } };
        }
      },
    }),

    /**
     * Email a learner (purchase, enrolment, course completed). With EmailJS set up, the branded HTML goes to the learner.
     * Without it, FormSubmit sends a plain copy to the academy inbox and CCs the learner.
     */
    learnerEmail: build.mutation<'emailjs' | 'formsubmit', LearnerEmailRequest>({
      queryFn: async ({ to, name, subject, html, text }) => {
        try {
          if (emailjsReady()) {
            const res = await fetch(EMAILJS, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: emailjsConfig.service, template_id: emailjsConfig.template, user_id: emailjsConfig.publicKey,
                template_params: { to_email: to, to_name: name, subject, html_body: html, text_body: text, reply_to: INBOX },
              }),
            });
            if (!res.ok) return { error: { message: (await res.text().catch(() => '')) || 'EmailJS refused the email.' } };
            return { data: 'emailjs' };
          }
          const res = await fetch(FORMSUBMIT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ _subject: subject, _template: 'box', _captcha: 'false', _cc: to, name, email: to, message: text }),
          });
          const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
          if (!res.ok || String(data.success) === 'false') return { error: { message: data.message || 'The email could not be sent.' } };
          return { data: 'formsubmit' };
        } catch (e) {
          return { error: { message: e instanceof Error ? e.message : 'Network error' } };
        }
      },
    }),
  }),
});

export const { useVisitsQuery, useSendMailMutation, useLearnerEmailMutation } = api;
