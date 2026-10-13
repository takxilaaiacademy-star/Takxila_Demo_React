import { useMemo, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { CssBaseline, GlobalStyles, ThemeProvider, type PaletteMode } from '@mui/material';
import { createAppTheme } from '../theme/theme';
import { store, useAppSelector } from '../store';
import { themeActions } from '../store/themeSlice';

interface ThemeModeValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

// Shared keyframes for the whole app. `.tx-reduce` (Preferences > Reduce motion) switches them off.
const motion = {
  '@keyframes txdrift': {
    '0%,100%': { transform: 'translate(0,0) scale(1)' },
    '33%': { transform: 'translate(80px,-50px) scale(1.15)' },
    '66%': { transform: 'translate(-60px,60px) scale(.9)' },
  },
  '@keyframes txrise': { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'none' } },
  '@keyframes txfade': { from: { opacity: 0 }, to: { opacity: 1 } },
  '@keyframes txpop': { from: { opacity: 0, transform: 'scale(.92)' }, to: { opacity: 1, transform: 'none' } },
  '@keyframes txmarq': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
  '@keyframes txfloat': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
  '@keyframes txshimmer': { from: { backgroundPosition: '-400px 0' }, to: { backgroundPosition: '400px 0' } },
  '@keyframes txpulse': { '0%': { boxShadow: '0 0 0 0 rgba(245,185,63,.55)' }, '100%': { boxShadow: '0 0 0 16px rgba(245,185,63,0)' } },
  '@keyframes txshine': { '0%,60%': { left: '-60%' }, '100%': { left: '130%' } },
  '@keyframes txconfetti': {
    '0%': { opacity: 1, transform: 'translate(0,0) rotate(0)' },
    '100%': { opacity: 0, transform: 'translate(var(--dx), 105vh) rotate(var(--rot))' },
  },
  '@keyframes txspin': { to: { transform: 'rotate(360deg)' } },
  '@keyframes txspotlight': { '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(.5)' }, '100%': { opacity: 1, transform: 'translate(-50%, -40%) scale(1)' } },
  '@keyframes txmeteor': { '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 }, '70%': { opacity: 1 }, '100%': { transform: 'rotate(215deg) translateX(-900px)', opacity: 0 } },
  '@keyframes txgradient': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
  '@keyframes txblurin': { from: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(8px)' }, to: { opacity: 1, filter: 'blur(0)', transform: 'none' } },
  '@keyframes txflip': { from: { opacity: 0, transform: 'translateY(60%) rotateX(-70deg)', filter: 'blur(6px)' }, to: { opacity: 1, transform: 'none', filter: 'blur(0)' } },
  '@keyframes txbeam': { '0%': { strokeDashoffset: 1000 }, '100%': { strokeDashoffset: 0 } },
  '@keyframes txtwinkle': { '0%,100%': { opacity: 0.15, transform: 'scale(.6)' }, '50%': { opacity: 1, transform: 'scale(1)' } },
  '@keyframes txlamp': { from: { opacity: 0.4, width: '30%' }, to: { opacity: 1, width: '70%' } },
  '@keyframes txring': { from: { opacity: 0.7, transform: 'scale(.9)' }, to: { opacity: 0, transform: 'scale(1.35)' } },
  // While the theme switches, skip every colour transition so the new theme paints in one go.
  '.tx-theming *, .tx-theming *::before, .tx-theming *::after': { transition: 'none !important' },
  '.tx-reduce *, .tx-reduce *::before, .tx-reduce *::after': { animation: 'none !important', transition: 'none !important' },
  // Live translation (src/utils/siteTranslate.ts): hide Google's toolbar and hover popups, keep the page where it is.
  'iframe.goog-te-banner-frame, iframe.skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-yAWNEb-L7lbkb':
    { display: 'none !important' },
  'body': { top: '0 !important' },
  'font[style]': { background: 'none !important', boxShadow: 'none !important' },
  '.goog-text-highlight': { background: 'none !important', boxShadow: 'none !important' },
};

// Both themes are built once, so switching only swaps which one is used.
const themes = { dark: createAppTheme('dark'), light: createAppTheme('light') };

/** Dark / light switch. The mode lives in the Redux store (src/store/themeSlice.ts). */
function toggleMode() {
  const root = document.documentElement;
  const next: PaletteMode = store.getState().theme.mode === 'dark' ? 'light' : 'dark';
  root.classList.add('tx-theming');
  flushSync(() => store.dispatch(themeActions.modeSet(next)));
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('tx-theming')));
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const mode = useAppSelector((s) => s.theme.mode);
  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />
      <GlobalStyles styles={motion} />
      {children}
    </ThemeProvider>
  );
}

export function useThemeMode(): ThemeModeValue {
  const mode = useAppSelector((s) => s.theme.mode);
  return useMemo(() => ({ mode, toggleMode }), [mode]);
}
