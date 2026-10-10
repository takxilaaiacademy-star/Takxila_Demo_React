// Sends form messages to the academy inbox without a backend, through FormSubmit (https://formsubmit.co).
// The very first message triggers a one-time "Activate form" email to the inbox; click it once and every
// later message arrives as a normal email. If FormSubmit can't be reached, the caller falls back to mailto.
export const INBOX = 'takxila.ai.academy@gmail.com';

export async function sendMail(subject: string, fields: Record<string, string>): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, _template: 'table', _captcha: 'false', ...fields }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'The message could not be sent.');
}

export function mailtoHref(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
