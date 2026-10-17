import { api, INBOX } from '../store/api';
import { store } from '../store';
import { inPreview } from '../store/roles';

export { INBOX };

/**
 * Email a form to the academy inbox. Runs through the RTK Query `sendMail` mutation (src/store/api.ts),
 * which posts to FormSubmit. If it fails, the caller falls back to a mailto: link.
 */
export async function sendMail(subject: string, fields: Record<string, string>): Promise<void> {
  // Admin's "Preview as learner" is for testing: forms look sent, but nothing leaves the browser.
  if (inPreview(store.getState())) return;
  try {
    await store.dispatch(api.endpoints.sendMail.initiate({ subject, fields })).unwrap();
  } catch (e) {
    throw new Error((e as { message?: string })?.message || 'The message could not be sent.');
  }
}

export function mailtoHref(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
