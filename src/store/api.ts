import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MAIL_WEBHOOK_URL } from '../config/site';
import { load } from '../utils/storage';

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
// Or: a free Google Apps Script web app that sends the HTML from the academy's own Gmail (tools/email/Code.gs).
// Order: .env, then src/config/site.ts, then a link the admin pasted in Admin > Emails to test (that browser only).
export const mailWebhook = () => (import.meta.env.VITE_MAIL_WEBHOOK as string | undefined) || MAIL_WEBHOOK_URL || load<string>('mail_webhook', '');
export const mailWebhookIsLocal = () => !import.meta.env.VITE_MAIL_WEBHOOK && !MAIL_WEBHOOK_URL && !!load<string>('mail_webhook', '');
export const emailjsReady = () => !!(emailjsConfig.service && emailjsConfig.template && emailjsConfig.publicKey);

export interface LearnerEmailRequest {
  to: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  /** Short labelled summary (order, courses, total) used by the plain FormSubmit fallback */
  fields?: Record<string, string>;
}

/** Which way learner emails go out right now (shown in Admin > Emails). */
export const emailRoute = (): 'emailjs' | 'webhook' | 'formsubmit' => (emailjsReady() ? 'emailjs' : mailWebhook() ? 'webhook' : 'formsubmit');

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
    learnerEmail: build.mutation<'emailjs' | 'webhook' | 'formsubmit', LearnerEmailRequest>({
      queryFn: async ({ to, name, subject, html, text, fields }) => {
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
          const hook = mailWebhook();
          if (hook) {
            // text/plain + no-cors: Google Apps Script accepts it without a CORS preflight. The reply cannot be read, so a sent request counts as sent.
            await fetch(hook, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ to, name, subject, html, text, replyTo: INBOX }) });
            return { data: 'webhook' };
          }
          // Last resort, FormSubmit: it cannot send your HTML. The inbox gets a tidy table (order, courses, total) and the
          // learner gets the friendly plain-text version as an auto-reply, instead of a copy of a form submission.
          const res = await fetch(FORMSUBMIT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              _subject: subject, _template: 'table', _captcha: 'false', _autoresponse: text,
              Learner: name, email: to, ...(fields ?? { Message: text }),
            }),
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
