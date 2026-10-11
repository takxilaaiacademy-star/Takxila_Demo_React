import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';
import { load } from '../utils/storage';

/** Dark or light theme (saved as tx_theme). */
const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: (load<string>('theme', 'dark') === 'light' ? 'light' : 'dark') as PaletteMode },
  reducers: {
    modeSet: (s, a: PayloadAction<PaletteMode>) => {
      s.mode = a.payload;
    },
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
