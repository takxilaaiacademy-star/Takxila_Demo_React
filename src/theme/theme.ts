import type { PaletteMode } from "@mui/material";
import { alpha, createTheme } from "@mui/material/styles";

export interface TxTokens {
  bg: string;
  paper: string;
  surface: string;
  fg: string;
  mute: string;
  line: string;
  ac: string;
  acfg: string;
  hl: string;
  glow: string;
  orb1: string;
  orb2: string;
  orb3: string;
}

// Lets components read the brand tokens as theme.tx.*
declare module "@mui/material/styles" {
  interface Theme {
    tx: TxTokens;
  }
  interface ThemeOptions {
    tx?: TxTokens;
  }
}

// Same palette as the original site: dark navy + gold, light lavender + indigo.
export const tokens: Record<PaletteMode, TxTokens> = {
  dark: {
    bg: "#0A1022",
    paper: "#111936",
    surface: "rgba(255,255,255,.07)",
    fg: "#FFFFFF",
    mute: "#C0C7DE",
    line: "rgba(255,255,255,.18)",
    ac: "#F5B93F",
    acfg: "#0A1022",
    hl: "#F5B93F",
    glow: "rgba(245,185,63,.26)",
    orb1: "rgba(245,185,63,.30)",
    orb2: "rgba(72,104,255,.38)",
    orb3: "rgba(160,90,255,.28)",
  },
  light: {
    bg: "#EEF1FB",
    paper: "#FFFFFF",
    surface: "rgba(255,255,255,.62)",
    fg: "#0B1030",
    mute: "#454D6E",
    line: "rgba(20,32,138,.16)",
    ac: "#14208A",
    acfg: "#FFFFFF",
    hl: "#2B2BD6",
    glow: "rgba(43,43,214,.20)",
    orb1: "rgba(90,120,255,.40)",
    orb2: "rgba(170,110,255,.34)",
    orb3: "rgba(60,200,230,.30)",
  },
};

export function createAppTheme(mode: PaletteMode) {
  const t = tokens[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: t.ac, contrastText: t.acfg },
      secondary: { main: t.hl },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.fg, secondary: t.mute },
      divider: t.line,
      success: { main: "#2EBD85" },
    },
    tx: t,
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      h1: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04 },
      h2: { fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08 },
      h3: { fontWeight: 800, letterSpacing: "-0.02em" },
      h4: { fontWeight: 800, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 700 },
      overline: { fontWeight: 700, letterSpacing: "0.12em", lineHeight: 1.6 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.bg,
            transition: "background-color .4s, color .4s",
          },
          // Scrollbars in the theme colours (Firefox and Chromium/Safari).
          html: {
            scrollbarColor: `${mode === "dark" ? "rgba(245,185,63,.55)" : "rgba(20,32,138,.45)"} transparent`,
            scrollbarWidth: "thin",
          },
          "*": {
            scrollbarColor: `${mode === "dark" ? "rgba(245,185,63,.45)" : "rgba(20,32,138,.35)"} transparent`,
            scrollbarWidth: "thin",
          },
          "::-webkit-scrollbar": { width: 10, height: 10 },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            borderRadius: 99,
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(180deg, #F5B93F, #B8862A)"
                : "linear-gradient(180deg, #2B2BD6, #14208A)",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(180deg, #FFD06B, #F5B93F)"
                : "linear-gradient(180deg, #4D4DFF, #2B2BD6)",
          },
          "::-webkit-scrollbar-corner": { background: "transparent" },
          "::selection": { background: t.glow },
          "@media (prefers-reduced-motion: reduce)": {
            "*": {
              animation: "none !important",
              transition: "none !important",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          // Every button: lift on hover, press-in on click, icons nudge, and a light sweep on filled buttons.
          root: {
            minHeight: 44,
            borderRadius: 12,
            paddingInline: 18,
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
            transition:
              "transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, background-color .25s, border-color .25s, color .25s",
            "&:active": {
              transform: "translateY(0) scale(.96)",
              transitionDuration: ".08s",
            },
            "&:focus-visible": {
              outline: `2px solid ${t.hl}`,
              outlineOffset: 2,
            },
            "& .MuiButton-endIcon, & .MuiButton-startIcon": {
              transition: "transform .3s cubic-bezier(.2,.8,.2,1)",
            },
            "&:hover .MuiButton-endIcon": { transform: "translateX(4px)" },
            "&:hover .MuiButton-startIcon": {
              transform: "scale(1.15) rotate(-8deg)",
            },
          },
          contained: {
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              background:
                "linear-gradient(110deg, transparent 25%, rgba(255,255,255,.55) 50%, transparent 75%)",
              transform: "translateX(-130%)",
              transition: "transform .75s cubic-bezier(.2,.8,.2,1)",
            },
            "&:hover::after": { transform: "translateX(130%)" },
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: t.ac,
              transform: "translateY(-2px)",
              boxShadow: `0 14px 36px ${t.glow}`,
            },
          },
          outlined: {
            borderColor: t.line,
            color: t.fg,
            "&:hover": {
              borderColor: t.hl,
              backgroundColor: t.surface,
              transform: "translateY(-2px)",
              boxShadow: `0 10px 26px ${t.glow}`,
            },
          },
          text: { "&:hover": { transform: "translateY(-1px)" } },
          sizeLarge: {
            minHeight: 54,
            borderRadius: 999,
            paddingInline: 28,
            fontSize: 16,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition:
              "transform .25s cubic-bezier(.2,.8,.2,1), background-color .25s, color .25s",
            "&:hover": {
              transform: "translateY(-2px) scale(1.08)",
              color: t.hl,
            },
            "&:active": { transform: "scale(.9)", transitionDuration: ".08s" },
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: "hover",
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            transition: "transform .2s, background-color .2s, border-color .2s",
            "&.MuiChip-clickable:hover": { transform: "translateY(-2px)" },
            "&.MuiChip-clickable:active": { transform: "scale(.95)" },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: t.surface,
            backdropFilter: "blur(22px) saturate(160%)",
            border: `1px solid ${t.line}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.18)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            "& fieldset": { borderColor: t.line },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            border: `1px solid ${t.line}`,
            background:
              mode === "dark" ? "rgba(16,23,48,.96)" : "rgba(255,255,255,.97)",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: alpha("#050814", 0.72),
            backdropFilter: "blur(8px)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            border: `1px solid ${t.line}`,
            backdropFilter: "blur(22px)",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { height: 8, borderRadius: 99, backgroundColor: t.line },
          bar: { borderRadius: 99 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 700, fontSize: 15 },
        },
      },
    },
  });
}
