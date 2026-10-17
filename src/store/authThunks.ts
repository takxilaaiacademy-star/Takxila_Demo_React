import { referralCode } from "../data/showcase";
import type { Session, StoredUser } from "../types";
import {
  ADMIN_EMAIL,
  ADMIN_FIRST_PASSWORD,
  CLEAR_ON_LOGOUT,
  KEEP_ON_LOGOUT,
} from "../config/site";
import { clearBrowserData, hashPassword, remove, save } from "../utils/storage";
import { adminActions } from "./adminSlice";
import {
  socialSignIn,
  type Provider,
  type SocialProfile,
} from "../utils/social";
import type { AppThunk } from "./index";
import { authActions as A } from "./authSlice";

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

export const normEmail = (email: string) =>
  String(email || "")
    .trim()
    .toLowerCase();
const newId = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

const startSession =
  (email: string, remember: boolean): AppThunk =>
  (dispatch, getState) => {
    const s: Session = {
      email,
      loginAt: new Date().toISOString(),
      remember: !!remember,
    };
    remove("session");
    remove("session", sessionStorage);
    save("session", s, remember ? localStorage : sessionStorage);
    save("last_email", email);
    // Admin > Users shows when each person last logged in and how often.
    const u = getState().auth.users.find((x) => x.email === email);
    if (u) dispatch(A.userUpdated({ email, patch: { lastLoginAt: s.loginAt, logins: (u.logins ?? 0) + 1 } }));
    dispatch(A.sessionStarted(s));
  };

export const register =
  ({
    name,
    email,
    phone,
    password,
    remember = true,
    refBy,
  }: RegisterInput): AppThunk<Promise<StoredUser>> =>
  async (dispatch, getState) => {
    const e = normEmail(email);
    const { users } = getState().auth;
    if (e === normEmail(ADMIN_EMAIL))
      throw new Error(
        "This email is reserved for the academy admin. Use a different email.",
      );
    if (users.some((u) => u.email === e))
      throw new Error(
        "An account with this email already exists. Log in instead.",
      );
    const code = (refBy || "").trim().toUpperCase();
    if (code && !users.some((u) => referralCode(u.name, u.email) === code))
      throw new Error(
        "That referral code is not valid. Check it or leave it empty.",
      );
    const u: StoredUser = {
      id: newId(),
      name: name.trim(),
      email: e,
      phone: (phone || "").trim(),
      passHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
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
    // The admin account. First login in this browser: the password typed becomes the admin password
    // (or must equal VITE_ADMIN_PASSWORD when that is set). After that only its hash is checked.
    if (e === normEmail(ADMIN_EMAIL)) {
      let admin = getState().auth.users.find((x) => x.email === e);
      if (!admin || !admin.passHash) {
        if (ADMIN_FIRST_PASSWORD && password !== ADMIN_FIRST_PASSWORD)
          throw new Error("Wrong password. Please try again.");
        if (password.length < 8)
          throw new Error("First admin login: choose a password of at least 8 characters. It becomes the admin password.");
        const passHash = await hashPassword(password);
        if (!admin) {
          admin = { id: newId(), name: "Takxila Admin", email: e, phone: "", passHash, createdAt: new Date().toISOString(), role: "admin" };
          dispatch(A.userAdded(admin));
        } else dispatch(A.userUpdated({ email: e, patch: { passHash, role: "admin" } }));
      } else {
        if (admin.passHash !== (await hashPassword(password)))
          throw new Error("Wrong password. Please try again.");
        if (admin.role !== "admin") dispatch(A.userUpdated({ email: e, patch: { role: "admin" } }));
      }
      dispatch(startSession(e, remember));
      return { ...admin, role: "admin" as const };
    }
    const u = getState().auth.users.find((x) => x.email === e);
    if (!u) throw new Error("No account found for this email. Register first.");
    if (!u.passHash && u.provider)
      throw new Error(
        `This account uses ${u.provider[0].toUpperCase() + u.provider.slice(1)} sign-in. Use that button below.`,
      );
    if (u.passHash !== (await hashPassword(password)))
      throw new Error("Wrong password. Please try again.");
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
        id: newId(),
        name: p.name.trim() || e,
        email: e,
        phone: "",
        passHash: "", // no password: this account signs in with its provider
        createdAt: new Date().toISOString(),
        provider: p.provider,
        ...(p.avatar ? { avatar: p.avatar } : {}),
      };
      dispatch(A.userAdded(u));
    }
    dispatch(startSession(e, remember));
    return u;
  };

/**
 * Log out: end the session, then clear what the browser saved (see CLEAR_ON_LOGOUT in src/config/site.ts).
 * The in-memory learner data is dropped by the store when the session ends, so the next person starts clean.
 */
export const logout = (): AppThunk => (dispatch) => {
  // Next login starts in Admin mode again (done first, so the value it saves is wiped below).
  dispatch(adminActions.modeSet("admin"));
  remove("session");
  remove("session", sessionStorage);
  if (CLEAR_ON_LOGOUT === "everything") clearBrowserData(null);
  else if (CLEAR_ON_LOGOUT === "session") clearBrowserData(KEEP_ON_LOGOUT);
  dispatch(A.sessionEnded());
};

export const changePassword =
  (current: string, next: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { users, session } = getState().auth;
    const u = users.find((x) => x.email === session?.email);
    if (!u) throw new Error("Please log in again.");
    if (u.passHash !== (await hashPassword(current)))
      throw new Error("Your current password is not right.");
    dispatch(
      A.userUpdated({
        email: u.email,
        patch: { passHash: await hashPassword(next) },
      }),
    );
  };

/** The whole "Log in with Google / Facebook / Microsoft" flow: popup, profile, account, session. Resolves true when signed in. */
export const signInWithProvider =
  (provider: Provider, remember: boolean): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    dispatch(A.socialStarted(provider));
    try {
      const profile = await socialSignIn(provider);
      dispatch(socialLogin(profile, remember));
      dispatch(A.socialFinished());
      return true;
    } catch (e) {
      dispatch(
        A.socialFinished(
          e instanceof Error ? e.message : "Sign-in failed. Please try again.",
        ),
      );
      return false;
    }
  };
