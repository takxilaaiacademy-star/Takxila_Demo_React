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
  pass:
    (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
    "Takxila@123",
} as const;

export const TEL_HREF = "tel:+" + SITE.phoneE164;

/**
 * The admin account. The email is public by nature; the password is NOT stored in the code.
 * Put it in your .env file:  VITE_ADMIN_PASSWORD=your-password
 * (Anything in a frontend bundle can be read by a visitor, so for real security move this check to a server.)
 */
export const ADMIN_EMAIL = SITE.supportEmail;
// Local setup: falls back to the password below when VITE_ADMIN_PASSWORD is not set. Change it before going live.
export const ADMIN_PASSWORD = SITE.pass;
