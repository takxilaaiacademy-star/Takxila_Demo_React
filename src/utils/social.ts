// "Log in with Google / Facebook / Microsoft" without a backend.
// Each provider opens in a popup (OAuth implicit flow) and returns to public/oauth-callback.html,
// which hands the result back to this window. Add the app IDs to a .env file (see README):
//   VITE_GOOGLE_CLIENT_ID, VITE_FACEBOOK_APP_ID, VITE_MICROSOFT_CLIENT_ID
// Note: without a server the ID token's signature is not verified, so treat this as a demo login.

export type Provider = 'google' | 'facebook' | 'microsoft';
export interface SocialProfile {
  provider: Provider;
  name: string;
  email: string;
  avatar?: string;
}

const env = import.meta.env;
const CFG: Record<Provider, { id?: string; label: string; envKey: string; url: string; params: Record<string, string> }> = {
  google: {
    id: env.VITE_GOOGLE_CLIENT_ID, label: 'Google', envKey: 'VITE_GOOGLE_CLIENT_ID',
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    params: { response_type: 'id_token', scope: 'openid email profile', prompt: 'select_account' },
  },
  microsoft: {
    id: env.VITE_MICROSOFT_CLIENT_ID, label: 'Microsoft', envKey: 'VITE_MICROSOFT_CLIENT_ID',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    params: { response_type: 'id_token', response_mode: 'fragment', scope: 'openid email profile', prompt: 'select_account' },
  },
  facebook: {
    id: env.VITE_FACEBOOK_APP_ID, label: 'Facebook', envKey: 'VITE_FACEBOOK_APP_ID',
    url: 'https://www.facebook.com/v19.0/dialog/oauth',
    params: { response_type: 'token', scope: 'email,public_profile' },
  },
};

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

export function socialSignIn(provider: Provider): Promise<SocialProfile> {
  const cfg = CFG[provider];
  if (!cfg.id) return Promise.reject(new Error(`${cfg.label} sign-in is not set up yet.`));
  const state = rand();
  const nonce = rand();
  const redirect = location.origin + '/oauth-callback.html';
  const q = new URLSearchParams({ client_id: cfg.id, redirect_uri: redirect, state, nonce, ...cfg.params });
  const w = 500, h = 640;
  const popup = window.open(`${cfg.url}?${q}`, 'tx-oauth', `width=${w},height=${h},left=${(screen.width - w) / 2},top=${(screen.height - h) / 2}`);
  if (!popup) return Promise.reject(new Error('The sign-in window was blocked. Allow pop-ups for this site and try again.'));

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('Sign-in was cancelled.'));
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
