import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizState } from '../types';

/** Short-lived screen state: selection bar, quiz dialog, add-to-cart popup, toasts, confetti. Never saved. */
interface UiState {
  /** Courses ticked on course cards for "add several at once" */
  sel: string[];
  quiz: QuizState | null;
  /** Course just added to the cart: the popup with related courses and combos shows for it */
  upsell: string | null;
  toast: { message: string; key: number } | null;
  /** Bumped to fire the confetti */
  party: number;
}

const initialState: UiState = { sel: [], quiz: null, upsell: null, toast: null, party: 0 };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    reset: (s) => ({ ...initialState, toast: s.toast, party: s.party }),
    selToggled: (s, a: PayloadAction<string>) => {
      s.sel = s.sel.includes(a.payload) ? s.sel.filter((x) => x !== a.payload) : [...s.sel, a.payload];
    },
    selCleared: (s) => {
      s.sel = [];
    },
    quizSet: (s, a: PayloadAction<QuizState | null>) => {
      s.quiz = a.payload;
    },
    upsellSet: (s, a: PayloadAction<string | null>) => {
      s.upsell = a.payload;
    },
    toastShown: (s, a: PayloadAction<string>) => {
      s.toast = { message: a.payload, key: Date.now() };
    },
    toastHidden: (s) => {
      s.toast = null;
    },
    celebrated: (s) => {
      s.party += 1;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
