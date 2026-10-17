/**
 * One place for contact details and the admin account.
 * Change the phone number here and it changes everywhere (footer, chat, WhatsApp, emails, contact page).
 */
export const SITE = {
  name: "Takxila AI Academy",
  supportEmail: "support@takxila.in",
  /** Country code + number, no "+" or spaces: what wa.me and tel: links need */
  phoneE164: "917276607776",
  phoneDisplay: "+91 72766 07776",
} as const;

/**
 * Google Apps Script email sender (tools/email/Code.gs). Paste the Web app link that ends in /exec here,
 * or put it in .env as VITE_MAIL_WEBHOOK (the .env value wins). Empty: emails go out through FormSubmit (plain).
 */
export const MAIL_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzXcyK920wIkbC1M8oXnwELIgfjzES6-rn6_OoDEoeVKBq3ZsYOFE9SdGFpC6apW-dU/exec";

export const TEL_HREF = "tel:+" + SITE.phoneE164;

/**
 * The admin account. The email is public by nature; the password is NOT written in the code.
 *   - First login in a browser: the password typed becomes the admin password (8+ characters). Only its
 *     SHA-256 hash is saved. Change it later in Profile > Password.
 *   - Optional: set VITE_ADMIN_PASSWORD in .env to require that exact password for the very first login.
 * Anything in a frontend bundle can be read by a visitor, so for real security move this check to a server.
 */
export const ADMIN_EMAIL = SITE.supportEmail;
export const ADMIN_FIRST_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "";

/**
 * WHAT HAPPENS TO THE BROWSER'S SAVED DATA WHEN SOMEONE LOGS OUT
 *
 *   'session'     (recommended) Clears the login, "last email", theme, admin mode and everything in
 *                 sessionStorage. Keeps the "database" keys listed in KEEP_ON_LOGOUT, because this demo
 *                 has no server: accounts, course progress, grants and the admin's site edits live in
 *                 localStorage, so wiping them would delete every account and all of the admin's work.
 *   'everything'  Clears ALL localStorage and sessionStorage. Use this only on a shared / public computer,
 *                 or after you have connected a real server that stores the data.
 *   'off'         Only ends the session (the old behaviour).
 */
export const CLEAR_ON_LOGOUT: "session" | "everything" | "off" = "session";

/** Keys (without the "tx_" prefix; a trailing "_" means "starts with") that survive a 'session' logout. */
export const KEEP_ON_LOGOUT: string[] = [
  "users", // registered accounts
  "user_", // every learner's courses, progress, cart, quiz answers (tx_user_<email>)
  "grants", // courses the admin gave to an email
  "player_urls", // lesson player links
  "announcements",
  "site", // the admin's course / navbar / banner edits
  "referrals",
  "messages", // contact-form messages
  "visits", // visitor counter
  "mail_webhook", // the email-sender link pasted in Admin > Emails
  "activity_log", // the admin's activity log (content changes, sign-ups, purchases)
];
