import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session, StoredUser } from '../types';
import { load } from '../utils/storage';

/**
 * Accounts registered in this browser (tx_users) and the current session.
 * A session lives in localStorage when "Keep me logged in" is ticked, otherwise in sessionStorage.
 */
export const readSession = (): Session | null => load<Session | null>('session', null) || load<Session | null>('session', null, sessionStorage);

interface AuthState {
  users: StoredUser[];
  session: Session | null;
}

const initialState: AuthState = { users: load<StoredUser[]>('users', []), session: readSession() };

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
    sessionStarted: (s, a: PayloadAction<Session>) => {
      s.session = a.payload;
    },
    sessionEnded: (s) => {
      s.session = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
