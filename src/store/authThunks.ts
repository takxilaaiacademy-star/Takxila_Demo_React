import { referralCode } from '../data/showcase';
import type { Session, StoredUser } from '../types';
import { hashPassword, remove, save } from '../utils/storage';
import type { SocialProfile } from '../utils/social';
import type { AppThunk } from './index';
import { authActions as A } from './authSlice';

/** Sign-up, log-in and account changes. Frontend-only demo auth: passwords are SHA-256 hashed in this browser. */

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  remember?: boolean;
  refBy?: string;
}
export interface LoginInput {
  email: string;
  password: string;
  remember: boolean;
}

export const normEmail = (email: string) => String(email || '').trim().toLowerCase();
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

const startSession = (email: string, remember: boolean): AppThunk => (dispatch) => {
  const s: Session = { email, loginAt: new Date().toISOString(), remember: !!remember };
  remove('session');
  remove('session', sessionStorage);
  save('session', s, remember ? localStorage : sessionStorage);
  save('last_email', email);
  dispatch(A.sessionStarted(s));
};

export const register =
  ({ name, email, phone, password, remember = true, refBy }: RegisterInput): AppThunk<Promise<StoredUser>> =>
  async (dispatch, getState) => {
    const e = normEmail(email);
    const { users } = getState().auth;
    if (users.some((u) => u.email === e)) throw new Error('An account with this email already exists. Log in instead.');
    const code = (refBy || '').trim().toUpperCase();
    if (code && !users.some((u) => referralCode(u.name, u.email) === code)) throw new Error('That referral code is not valid. Check it or leave it empty.');
    const u: StoredUser = {
      id: newId(), name: name.trim(), email: e, phone: (phone || '').trim(),
      passHash: await hashPassword(password), createdAt: new Date().toISOString(),
      ...(code ? { refBy: code } : {}),
    };
    dispatch(A.userAdded(u));
    dispatch(startSession(e, remember));
    return u;
  };

export const login =
  ({ email, password, remember }: LoginInput): AppThunk<Promise<StoredUser>> =>
  async (dispatch, getState) => {
    const e = normEmail(email);
    const u = getState().auth.users.find((x) => x.email === e);
    if (!u) throw new Error('No account found for this email. Register first.');
    if (!u.passHash && u.provider) throw new Error(`This account uses ${u.provider[0].toUpperCase() + u.provider.slice(1)} sign-in. Use that button below.`);
    if (u.passHash !== (await hashPassword(password))) throw new Error('Wrong password. Please try again.');
    dispatch(startSession(e, remember));
    return u;
  };

/** Log in (or sign up on first use) with a Google, Facebook or Microsoft profile. */
export const socialLogin =
  (p: SocialProfile, remember: boolean): AppThunk<StoredUser> =>
  (dispatch, getState) => {
    const e = normEmail(p.email);
    let u = getState().auth.users.find((x) => x.email === e);
    if (!u) {
      u = {
        id: newId(), name: p.name.trim() || e, email: e, phone: '',
        passHash: '', // no password: this account signs in with its provider
        createdAt: new Date().toISOString(), provider: p.provider,
        ...(p.avatar ? { avatar: p.avatar } : {}),
      };
      dispatch(A.userAdded(u));
    }
    dispatch(startSession(e, remember));
    return u;
  };

export const logout = (): AppThunk => (dispatch) => {
  remove('session');
  remove('session', sessionStorage);
  dispatch(A.sessionEnded());
};

export const changePassword =
  (current: string, next: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { users, session } = getState().auth;
    const u = users.find((x) => x.email === session?.email);
    if (!u) throw new Error('Please log in again.');
    if (u.passHash !== (await hashPassword(current))) throw new Error('Your current password is not right.');
    dispatch(A.userUpdated({ email: u.email, patch: { passHash: await hashPassword(next) } }));
  };
