import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import type { StoredUser, User } from "../types";
import { ADMIN_EMAIL } from "../config/site";
import { load } from "../utils/storage";
import type { Provider, SocialProfile } from "../utils/social";
import { useAppDispatch, useAppSelector } from "../store";
import { authActions } from "../store/authSlice";
import * as A from "../store/authThunks";

export type { LoginInput, RegisterInput } from "../store/authThunks";

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
  /** Popup sign-in with a provider, through Redux. Resolves true when signed in. */
  signInWith: (provider: Provider, remember: boolean) => Promise<boolean>;
  /** Provider whose popup is open, and the last sign-in error */
  social: { busy: Provider | null; error: string };
  logout: () => void;
  updateUser: (
    patch: Partial<Omit<StoredUser, "email" | "id" | "passHash">>,
  ) => void;
  changePassword: (current: string, next: string) => Promise<void>;
  /** The logged-in account is the academy admin (support@takxila.in) */
  isAdminAccount: boolean;
  /** Admin account AND currently in Admin mode (Admin can switch to User mode to see the site as a learner) */
  isAdmin: boolean;
  lastEmail: string;
  /** Everyone registered in this browser (name and email only), for the leaderboard */
  members: { name: string; email: string }[];
}

export function useAuth(): AuthValue {
  const dispatch = useAppDispatch();
  const { users, session, social } = useAppSelector(
    (s) => ({
      users: s.auth.users,
      session: s.auth.session,
      social: s.auth.social,
    }),
    shallowEqual,
  );

  const stored = session
    ? users.find((x) => x.email === session.email)
    : undefined;
  const user = useMemo<User | null>(() => {
    if (!stored) return null;
    const { passHash: _hash, ...safe } = stored; // never hand the hash to the UI
    return safe;
  }, [stored]);
  const members = useMemo(
    () => users.map((u) => ({ name: u.name, email: u.email })),
    [users],
  );

  const actions = useMemo(
    () => ({
      register: (i: A.RegisterInput) => dispatch(A.register(i)),
      login: (i: A.LoginInput) => dispatch(A.login(i)),
      socialLogin: (p: SocialProfile, remember: boolean) =>
        dispatch(A.socialLogin(p, remember)),
      signInWith: (p: Provider, remember: boolean) =>
        dispatch(A.signInWithProvider(p, remember)),
      logout: () => dispatch(A.logout()),
      changePassword: (current: string, next: string) =>
        dispatch(A.changePassword(current, next)),
    }),
    [dispatch],
  );
  const adminMode = useAppSelector((s) => s.admin.mode);
  const isAdminAccount =
    !!user &&
    (user.role === "admin" || user.email === ADMIN_EMAIL.toLowerCase());
  const email = session?.email;
  const updateUser = useMemo<AuthValue["updateUser"]>(
    () => (patch) =>
      email && dispatch(authActions.userUpdated({ email, patch })),
    [dispatch, email],
  );

  return {
    user,
    isAuthed: !!user,
    ...actions,
    updateUser,
    social,
    isAdminAccount,
    isAdmin: isAdminAccount && adminMode === "admin",
    lastEmail: load<string>("last_email", ""),
    members,
  };
}

/** For pages behind ProtectedRoute, where a user is always logged in. */
export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error("useUser called without a logged-in user");
  return user;
}
