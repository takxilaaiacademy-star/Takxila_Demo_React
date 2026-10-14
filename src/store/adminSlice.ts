import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { load } from '../utils/storage';

/**
 * Admin-only data.
 *   grants      course access the admin gave by email   -> tx_grants       { "student@mail.com": ["claude-7", ...] }
 *   playerUrls  course player link per course (optional) -> tx_player_urls  { "claude-7": "https://academy..." }
 *   mode        which side the admin is looking at       -> tx_admin_mode
 *
 * Frontend-only: this lives in the browser that the admin uses. See README ("Admin") for what that means.
 */
export type AdminMode = 'admin' | 'user';
export type Grants = Record<string, string[]>;

interface AdminState {
  grants: Grants;
  playerUrls: Record<string, string>;
  mode: AdminMode;
}

const initialState: AdminState = {
  grants: load<Grants>('grants', {}),
  playerUrls: load<Record<string, string>>('player_urls', {}),
  mode: load<AdminMode>('admin_mode', 'admin'),
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    accessGranted: (s, a: PayloadAction<{ email: string; ids: string[] }>) => {
      const cur = s.grants[a.payload.email] ?? [];
      s.grants[a.payload.email] = Array.from(new Set([...cur, ...a.payload.ids]));
    },
    accessRevoked: (s, a: PayloadAction<{ email: string; id: string }>) => {
      const left = (s.grants[a.payload.email] ?? []).filter((x) => x !== a.payload.id);
      if (left.length) s.grants[a.payload.email] = left;
      else delete s.grants[a.payload.email];
    },
    playerUrlSet: (s, a: PayloadAction<{ id: string; url: string }>) => {
      const url = a.payload.url.trim();
      if (url) s.playerUrls[a.payload.id] = url;
      else delete s.playerUrls[a.payload.id];
    },
    modeSet: (s, a: PayloadAction<AdminMode>) => {
      s.mode = a.payload;
    },
  },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
