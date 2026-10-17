/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  readonly VITE_MICROSOFT_CLIENT_ID?: string;
  readonly VITE_RAZORPAY_KEY_ID?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  /** Your live site address (https://...), used for the logo and buttons in emails */
  readonly VITE_SITE_URL?: string;
  readonly VITE_MAIL_WEBHOOK?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
