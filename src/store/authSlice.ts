import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session, StoredUser } from '../types';
import type { Provider } from '../utils/social';
import { load } from '../utils/storage';

/**
 * Accounts registered in this browser (tx_users) and the current session.
 * A session lives in localStorage when "Keep me logged in" is ticked, otherwise in sessionStorage.
 */
export const readSession = (): Session | null => load<Session | null>('session', null) || load<Session | null>('session', null, sessionStorage);

interface AuthState {
  users: StoredUser[];
  session: Session | null;
  /** Google / Facebook / Microsoft sign-in in progress, and its last error (not saved) */
  social: { busy: Provider | null; error: string };
}

const initialState: AuthState = { users: load<StoredUser[]>('users', []), session: readSession(), social: { busy: null, error: '' } };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userAdded: (s, a: PayloadAction<StoredUser>) => {
      s.users.push(a.payload);
    },
    userUpdated: (s, a: PayloadAction<{ email: string; patch: Partial<StoredUser> }>) => {
      const u = s.users.find((x) => x.email === a.payload.email);
      if (u) Object.assign(u, a.payload.patch);
    },
    /** Put the saved accounts back (leaving the admin's learner preview). */
    usersLoaded: (s, a: PayloadAction<StoredUser[]>) => {
      s.users = a.payload;
    },
    sessionStarted: (s, a: PayloadAction<Session>) => {
      s.session = a.payload;
    },
    sessionEnded: (s) => {
      s.session = null;
    },
    socialStarted: (s, a: PayloadAction<Provider>) => {
      s.social = { busy: a.payload, error: '' };
    },
    socialFinished: (s, a: PayloadAction<string | undefined>) => {
      s.social = { busy: null, error: a.payload ?? '' };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
