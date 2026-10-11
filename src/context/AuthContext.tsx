import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import type { StoredUser, User } from '../types';
import { load } from '../utils/storage';
import type { SocialProfile } from '../utils/social';
import { useAppDispatch, useAppSelector } from '../store';
import { authActions } from '../store/authSlice';
import * as A from '../store/authThunks';

export type { LoginInput, RegisterInput } from '../store/authThunks';

/**
 * useAuth() reads accounts and the session from the Redux store (src/store/authSlice.ts)
 * and runs sign-up / log-in through src/store/authThunks.ts.
 */
interface AuthValue {
  user: User | null;
  isAuthed: boolean;
  register: (input: A.RegisterInput) => Promise<StoredUser>;
  login: (input: A.LoginInput) => Promise<StoredUser>;
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

export function useAuth(): AuthValue {
  const dispatch = useAppDispatch();
  const { users, session } = useAppSelector((s) => ({ users: s.auth.users, session: s.auth.session }), shallowEqual);

  const stored = session ? users.find((x) => x.email === session.email) : undefined;
  const user = useMemo<User | null>(() => {
    if (!stored) return null;
    const { passHash: _hash, ...safe } = stored; // never hand the hash to the UI
    return safe;
  }, [stored]);
  const members = useMemo(() => users.map((u) => ({ name: u.name, email: u.email })), [users]);

  const actions = useMemo(
    () => ({
      register: (i: A.RegisterInput) => dispatch(A.register(i)),
      login: (i: A.LoginInput) => dispatch(A.login(i)),
      socialLogin: (p: SocialProfile, remember: boolean) => dispatch(A.socialLogin(p, remember)),
      logout: () => dispatch(A.logout()),
      changePassword: (current: string, next: string) => dispatch(A.changePassword(current, next)),
    }),
    [dispatch],
  );
  const email = session?.email;
  const updateUser = useMemo<AuthValue['updateUser']>(() => (patch) => email && dispatch(authActions.userUpdated({ email, patch })), [dispatch, email]);

  return {
    user, isAuthed: !!user, ...actions, updateUser,
    isAdmin: !!user && users[0]?.email === user.email,
    lastEmail: load<string>('last_email', ''), members,
  };
}

/** For pages behind ProtectedRoute, where a user is always logged in. */
export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('useUser called without a logged-in user');
  return user;
}
