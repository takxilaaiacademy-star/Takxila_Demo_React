// "Log in with Google / Facebook / Microsoft" without a backend.
// Each provider opens in a popup (OAuth implicit flow) and returns to public/oauth-callback.html,
// which hands the result back to this window. The public client IDs live in src/data/oauth.json
// (or .env: VITE_GOOGLE_CLIENT_ID, VITE_FACEBOOK_APP_ID, VITE_MICROSOFT_CLIENT_ID).
// Client secrets are never used here: anything in website code can be read by every visitor.
// Note: without a server the ID token's signature is not verified, so treat this as a demo login.

export type Provider = 'google' | 'facebook' | 'microsoft';
export interface SocialProfile {
  provider: Provider;
  name: string;
  email: string;
  avatar?: string;
}

import oauth from '../data/oauth.json';

const env = import.meta.env;
type Cfg = { id?: string; label: string; envKey: string; url: string; logo: string; params: Record<string, string> };
const P = oauth.providers;
// Client IDs come from .env when set, otherwise from src/data/oauth.json. Both are public values.
const CFG: Record<Provider, Cfg> = {
  google: {
    id: env.VITE_GOOGLE_CLIENT_ID || P.google.clientId, label: P.google.label, envKey: 'VITE_GOOGLE_CLIENT_ID', url: P.google.authUrl, logo: P.google.logoUrl,
    params: { response_type: 'id_token', scope: 'openid email profile', prompt: 'select_account' },
  },
  microsoft: {
    id: env.VITE_MICROSOFT_CLIENT_ID || P.microsoft.clientId, label: P.microsoft.label, envKey: 'VITE_MICROSOFT_CLIENT_ID', url: P.microsoft.authUrl, logo: P.microsoft.logoUrl,
    params: { response_type: 'id_token', response_mode: 'fragment', scope: 'openid email profile', prompt: 'select_account' },
  },
  facebook: {
    id: env.VITE_FACEBOOK_APP_ID || P.facebook.clientId, label: P.facebook.label, envKey: 'VITE_FACEBOOK_APP_ID', url: P.facebook.authUrl, logo: P.facebook.logoUrl,
    params: { response_type: 'token', scope: 'email,public_profile' },
  },
};

export const providerLogo = (p: Provider) => CFG[p].logo;
export const providerLabel = (p: Provider) => CFG[p].label;
export const providerEnvKey = (p: Provider) => CFG[p].envKey;
export const isConfigured = (p: Provider) => !!CFG[p].id;

const rand = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

function decodeJwt(token: string): Record<string, string> {
  const part = token.split('.')[1] ?? '';
  const json = decodeURIComponent(
    atob(part.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  );
  return JSON.parse(json) as Record<string, string>;
}

/** Where each provider keeps its list of allowed return addresses. */
const SETTINGS: Record<Provider, string> = {
  google: 'Google Cloud Console > APIs & Services > Credentials > your OAuth client: add it under "Authorized redirect URIs", and add ' +
    'the site address under "Authorized JavaScript origins"',
  facebook: 'Facebook Developers > your app > Facebook Login > Settings: add it under "Valid OAuth Redirect URIs" and turn on ' +
    '"Client OAuth login" and "Web OAuth login"',
  microsoft: 'Azure Portal > App registrations > your app > Authentication: add it as a "Single-page application" redirect URI and tick ' +
    '"ID tokens"',
};

/** The popup was closed before it came back. The usual cause is a return address the provider does not know yet. */
function closedMessage(provider: Provider, redirect: string) {
  return `The ${CFG[provider].label} window closed before sign-in finished. If it showed an error such as "redirect_uri_mismatch" ` +
    `or "invalid request", the provider does not know this website yet. Add ${redirect} in ${SETTINGS[provider]}.`;
}

export function socialSignIn(provider: Provider): Promise<SocialProfile> {
  const cfg = CFG[provider];
  if (!cfg.id) return Promise.reject(new Error(`${cfg.label} sign-in is not set up yet.`));
  const state = rand();
  const nonce = rand();
  const redirect = location.origin + oauth.redirectPath;
  const q = new URLSearchParams({ client_id: cfg.id, redirect_uri: redirect, state, nonce, ...cfg.params });
  const w = 500, h = 640;
  const popup = window.open(`${cfg.url}?${q}`, 'tx-oauth', `width=${w},height=${h},left=${(screen.width - w) / 2},top=${(screen.height - h) / 2}`);
  if (!popup) return Promise.reject(new Error('The sign-in window was blocked. Allow pop-ups for this site and try again.'));

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error(closedMessage(provider, redirect)));
      }
    }, 600);
    const cleanup = () => {
      clearInterval(timer);
      window.removeEventListener('message', onMsg);
    };
    const onMsg = async (e: MessageEvent) => {
      if (e.origin !== location.origin || e.data?.type !== 'tx-oauth') return;
      cleanup();
      const p = new URLSearchParams(String(e.data.hash || '').replace(/^#/, '') || String(e.data.search || '').replace(/^\?/, ''));
      try {
        if (p.get('error')) throw new Error(p.get('error_description') || 'Sign-in failed.');
        if (p.get('state') !== state) throw new Error('Sign-in failed a security check. Please try again.');
        if (provider === 'facebook') {
          const token = p.get('access_token');
          if (!token) throw new Error('Facebook did not return a token.');
          const r = await fetch(`https://graph.facebook.com/me?fields=name,email,picture.width(160)&access_token=${encodeURIComponent(token)}`);
          const me = (await r.json()) as { name?: string; email?: string; picture?: { data?: { url?: string } } };
          if (!me.email) throw new Error('Your Facebook account did not share an email address.');
          resolve({ provider, name: me.name || me.email, email: me.email, avatar: me.picture?.data?.url });
        } else {
          const idToken = p.get('id_token');
          if (!idToken) throw new Error('No sign-in token was returned.');
          const c = decodeJwt(idToken);
          if (c.nonce !== nonce) throw new Error('Sign-in failed a security check. Please try again.');
          const email = c.email || c.preferred_username;
          if (!email) throw new Error('Your account did not share an email address.');
          resolve({ provider, name: c.name || email, email, avatar: c.picture });
        }
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Sign-in failed.'));
      }
    };
    window.addEventListener('message', onMsg);
  });
}
