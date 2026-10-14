import { load, save } from './storage';
import type { ContactMessage } from '../types';
import { mailtoHref, sendMail } from './mail';

// Where mentor requests and WhatsApp chats go.
export const MENTOR_EMAIL = 'takxila.ai.academy@gmail.com';
export const WHATSAPP_NUMBER = '917276607776';
export const WHATSAPP_DISPLAY = '+91 72766 07776';

export interface MentorRequest {
  name: string;
  email: string;
  topic: string;
  message: string;
  slot?: string;
}

/**
 * Emails the request to the mentor inbox through FormSubmit (see utils/mail.ts).
 * If that fails (offline, blocked), it opens the visitor's mail app with the message filled in instead.
 * A copy is kept in the browser (tx_messages) either way. Returns how it was sent.
 */
export async function sendMentorMail(r: MentorRequest): Promise<'sent' | 'mailto'> {
  const subject = `Mentorship request: ${r.topic} (${r.name})`;
  const fields: Record<string, string> = { Name: r.name, Email: r.email, Topic: r.topic, ...(r.slot ? { 'Preferred time': r.slot } : {}), Message: r.message, _replyto: r.email };
  save('messages', load<ContactMessage[]>('messages', []).concat({ name: r.name, email: r.email, message: `[Mentor · ${r.topic}] ${r.message}`, at: new Date().toISOString() }));
  try {
    await sendMail(subject, fields);
    return 'sent';
  } catch {
    const { _replyto: _r, ...visible } = fields;
    window.location.href = mailtoHref(subject, visible);
    return 'mailto';
  }
}

export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const MENTOR_TOPICS = [
  'Choosing the right course',
  'Career switch into AI',
  'Building an AI agent or project',
  'Portfolio and resume review',
  'AI for my business',
  'Help with a lesson',
];
