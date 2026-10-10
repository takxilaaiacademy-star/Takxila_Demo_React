import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, StoredUser, User } from '../types';
import { hashPassword, load, remove, save } from '../utils/storage';
import { referralCode } from '../data/showcase';
import type { SocialProfile } from '../utils/social';

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
interface AuthValue {
  user: User | null;
  isAuthed: boolean;
  register: (input: RegisterInput) => Promise<StoredUser>;
  login: (input: LoginInput) => Promise<StoredUser>;
  /** Log in (or sign up on first use) with a Google, Facebook or Microsoft profile. */
  socialLogin: (profile: SocialProfile, remember: boolean) => StoredUser;
  logout: () => void;
  updateUser: (patch: Partial<Omit<StoredUser, 'email' | 'id' | 'passHash'>>) => void;
  changePassword: (current: string, next: string) => Promise<void>;
  /** The first account registered in this browser manages announcements. */
  isAdmin: boolean;
  lastEmail: string;
  /** Everyone registered in this browser (name and email only), for the leaderboard */
  members: { name: string; email: string }[];
}

const AuthContext = createContext<AuthValue | null>(null);
const norm = (email: string) => String(email || '').trim().toLowerCase();

// A session lives in localStorage when "Keep me logged in" is ticked,
// otherwise in sessionStorage so it ends when the browser tab closes.
function readSession(): Session | null {
  return load<Session | null>('session', null) || load<Session | null>('session', null, sessionStorage);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(() => load<StoredUser[]>('users', []));
  const [session, setSession] = useState<Session | null>(readSession);

  useEffect(() => save('users', users), [users]);

  const user = useMemo<User | null>(() => {
    if (!session) return null;
    const u = users.find((x) => x.email === session.email);
    if (!u) return null;
    const { passHash: _hash, ...safe } = u; // never hand the hash to the UI
    return safe;
  }, [users, session]);

  const startSession = (email: string, remember: boolean) => {
    const s: Session = { email, loginAt: new Date().toISOString(), remember: !!remember };
    remove('session');
    remove('session', sessionStorage);
    save('session', s, remember ? localStorage : sessionStorage);
    save('last_email', email);
    setSession(s);
  };

  const register = async ({ name, email, phone, password, remember = true, refBy }: RegisterInput): Promise<StoredUser> => {
    const e = norm(email);
    if (users.some((u) => u.email === e)) throw new Error('An account with this email already exists. Log in instead.');
    const code = (refBy || '').trim().toUpperCase();
    if (code && !users.some((u) => referralCode(u.name, u.email) === code)) throw new Error('That referral code is not valid. Check it or leave it empty.');
    const u: StoredUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: e,
      phone: (phone || '').trim(),
      passHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      ...(code ? { refBy: code } : {}),
    };
    setUsers((list) => list.concat(u));
    startSession(e, remember);
    return u;
  };

  const login = async ({ email, password, remember }: LoginInput): Promise<StoredUser> => {
    const e = norm(email);
    const u = users.find((x) => x.email === e);
    if (!u) throw new Error('No account found for this email. Register first.');
    if (!u.passHash && u.provider) throw new Error(`This account uses ${u.provider[0].toUpperCase() + u.provider.slice(1)} sign-in. Use that button below.`);
    if (u.passHash !== (await hashPassword(password))) throw new Error('Wrong password. Please try again.');
    startSession(e, remember);
    return u;
  };

  const socialLogin = (p: SocialProfile, remember: boolean): StoredUser => {
    const e = norm(p.email);
    let u = users.find((x) => x.email === e);
    if (!u) {
      u = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: p.name.trim() || e,
        email: e,
        phone: '',
        passHash: '', // no password: this account signs in with its provider
        createdAt: new Date().toISOString(),
        provider: p.provider,
        ...(p.avatar ? { avatar: p.avatar } : {}),
      };
      const created = u;
      setUsers((list) => list.concat(created));
    }
    startSession(e, remember);
    return u;
  };

  const logout = () => {
    remove('session');
    remove('session', sessionStorage);
    setSession(null);
  };

  const updateUser: AuthValue['updateUser'] = (patch) => setUsers((list) => list.map((u) => (u.email === session?.email ? { ...u, ...patch } : u)));

  const changePassword = async (current: string, next: string) => {
    const u = users.find((x) => x.email === session?.email);
    if (!u) throw new Error('Please log in again.');
    if (u.passHash !== (await hashPassword(current))) throw new Error('Your current password is not right.');
    const passHash = await hashPassword(next);
    setUsers((list) => list.map((x) => (x.email === u.email ? { ...x, passHash } : x)));
  };

  const isAdmin = !!user && users[0]?.email === user.email;
  const members = useMemo(() => users.map((u) => ({ name: u.name, email: u.email })), [users]);
  const value: AuthValue = { user, isAuthed: !!user, register, login, socialLogin, logout, updateUser, changePassword, isAdmin, lastEmail: load<string>('last_email', ''), members };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** For pages behind ProtectedRoute, where a user is always logged in. */
export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('useUser called without a logged-in user');
  return user;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
