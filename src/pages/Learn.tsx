import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FullscreenIcon from "@mui/icons-material/FullscreenRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/CallOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpenRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useThemeMode } from "../context/ThemeModeContext";
import { TEL_HREF } from "../config/site";
import { lessonsFor } from "../data/curriculum";
import { isAllowedPlayerUrl, playerUrlFor } from "../data/player";
import { courseById } from "../data/recommend";
import { useAppSelector } from "../store";
import { whatsappLink } from "../utils/contact";

/**
 * Courses whose player tracks its own progress (its own modules, XP, resume point).
 * For these the page shows only the player, with no lesson list or progress panel beside it.
 */
const SELF_TRACKED = new Set(["claude-7"]);

/** Adds ?theme=dark|light so an embedded page can start in the same theme as this site. */
const withTheme = (url: string, mode: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("takxila.in")) return url; // the Moodle academy does not need it
    u.searchParams.set("theme", mode);
    return u.toString();
  } catch {
    return url;
  }
};

const originOf = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return "*";
  }
};

/**
 * Learn page: a focused study screen.
 * Just a slim top bar and a big player. The theme (dark / light) is pushed into the player
 * so both always match.
 */
export default function Learn() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { user, isAdmin } = useAuth();
  const { owned, lessons, completeLesson } = useStore();
  const { mode } = useThemeMode();
  const overrides = useAppSelector((s) => s.admin.playerUrls);
  // Courses the admin opened for everybody (Admin > Courses > Open access) play without enrolling.
  const isOpen = useAppSelector((s) => s.site.openCourses.includes(id));
  const c = courseById(id);

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  const baseSrc = useMemo(() => playerUrlFor(id, overrides), [id, overrides]);
  const safe = isAllowedPlayerUrl(baseSrc);
  const isAcademy = baseSrc.includes("takxila.in");

  // The frame starts with the theme active at load time. Later switches are sent with postMessage,
  // so the lesson never reloads and nobody loses their place.
  const startMode = useRef(mode);
  const src = useMemo(() => withTheme(baseSrc, startMode.current), [baseSrc]);
  const openHref = useMemo(() => withTheme(baseSrc, mode), [baseSrc, mode]);

  // Show a "taking a while" hint if the lesson has not loaded after 8 seconds.
  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, [src]);

  // Tell the embedded page which theme is active: on load, and every time the theme changes.
  useEffect(() => {
    if (!safe || isAcademy) return;
    const target = originOf(src);
    const send = () =>
      frameRef.current?.contentWindow?.postMessage(
        { type: "tx-theme", theme: mode, mode },
        target,
      );
    send();
    const timers = [300, 1200, 3000].map((ms) => setTimeout(send, ms));
    return () => timers.forEach(clearTimeout);
  }, [mode, loaded, src, safe, isAcademy]);

  if (!c) return <Navigate to="/my-courses" replace />;
  if (!owned.includes(c.id) && !isAdmin && !isOpen)
    return <Navigate to={"/courses/" + c.id} replace />;

  const selfTracked = SELF_TRACKED.has(c.id);
  const list = lessonsFor(c);
  const done = lessons[c.id] || 0;
  const finished = done >= list.length;
  const adminPreview = isAdmin && !owned.includes(c.id);
  const openAccess = isOpen && !owned.includes(c.id) && !isAdmin;
  const help = `Hi Takxila team, I'm ${user?.name ?? "a learner"}. I need help with "${c.title}".`;

  const fullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  // Extra attributes some browsers still want on the frame, passed through as plain attributes.
  const legacyFullscreen = {
    webkitallowfullscreen: "true",
    mozallowfullscreen: "true",
  } as Record<string, string>;

  const pill = {
    px: 1.8,
    py: 0.6,
    borderRadius: "999px",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "none",
  } as const;

  return (
    <Container
      maxWidth="xl"
      sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 4 } }}
    >
      {/* Slim top bar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ mb: { xs: 1.5, md: 2 }, flexWrap: "wrap", rowGap: 1 }}
      >
        <Button
          onClick={() => nav(-1)}
          startIcon={<ArrowBackRoundedIcon />}
          sx={(t) => ({
            ...pill,
            color: "text.primary",
            background: t.tx.surface,
            border: `1px solid ${t.tx.line}`,
            backdropFilter: "blur(16px)",
            transition: "transform .2s",
            "&:hover": { transform: "translateX(-3px)", background: t.tx.glow },
          })}
        >
          Back
        </Button>

        <Typography
          noWrap
          component="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: 16, md: 22 },
            letterSpacing: "-.01em",
            flexGrow: 1,
            minWidth: 0,
            background: "linear-gradient(90deg, #F5B93F, #C86BFF 50%, #6C8BFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {c.title}
        </Typography>

        {adminPreview && (
          <Stack
            direction="row"
            spacing={0.6}
            alignItems="center"
            sx={{
              ...pill,
              bgcolor: "rgba(245,185,63,.18)",
              color: "#F5B93F",
              border: "1px solid rgba(245,185,63,.5)",
              fontSize: 12,
            }}
          >
            <LockOpenIcon sx={{ fontSize: 14 }} />
            <span>Admin preview</span>
          </Stack>
        )}
        {openAccess && (
          <Box
            sx={{
              ...pill,
              bgcolor: "rgba(46,204,113,.16)",
              color: "#2ECC71",
              border: "1px solid rgba(46,204,113,.5)",
              fontSize: 12,
            }}
          >
            Open access
          </Box>
        )}

        {/* Progress controls only for courses that do not track progress inside their own player */}
        {!selfTracked &&
          (finished ? (
            <Button
              variant="contained"
              startIcon={<WorkspacePremiumIcon />}
              onClick={() => nav("/certificates")}
              sx={pill}
            >
              Get my certificate
            </Button>
          ) : (
            <Tooltip
              title={adminPreview ? "Progress is not saved in preview" : ""}
            >
              <span>
                <Button
                  variant="contained"
                  startIcon={<CheckRoundedIcon />}
                  onClick={() => completeLesson(c.id)}
                  disabled={adminPreview}
                  sx={pill}
                >
                  Done · {done}/{list.length}
                </Button>
              </span>
            </Tooltip>
          ))}

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Ask for help on WhatsApp">
            <IconButton
              size="small"
              component="a"
              href={whatsappLink(help)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              sx={(t) => ({
                color: "text.primary",
                border: `1px solid ${t.tx.line}`,
                background: t.tx.surface,
              })}
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Call us">
            <IconButton
              size="small"
              component="a"
              href={TEL_HREF}
              aria-label="Call"
              sx={(t) => ({
                color: "text.primary",
                border: `1px solid ${t.tx.line}`,
                background: t.tx.surface,
              })}
            >
              <CallIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Full screen">
            <IconButton
              size="small"
              onClick={fullscreen}
              aria-label="Full screen"
              sx={(t) => ({
                color: "text.primary",
                border: `1px solid ${t.tx.line}`,
                background: t.tx.surface,
              })}
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in a new tab">
            <IconButton
              size="small"
              component="a"
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open lesson in a new tab"
              sx={(t) => ({
                color: "text.primary",
                border: `1px solid ${t.tx.line}`,
                background: t.tx.surface,
              })}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* The player: one big glowing card */}
      <Box
        ref={stageRef}
        sx={{
          p: "2px",
          borderRadius: { xs: "20px", md: "28px" },
          backgroundSize: "200% 200%",
          background:
            "linear-gradient(135deg, #F5B93F, #C86BFF 45%, #4868FF, #F5B93F)",
          animation: "txgradient 8s ease infinite",
          boxShadow:
            "0 30px 80px rgba(72,104,255,.25), 0 8px 24px rgba(0,0,0,.25)",
          height: { xs: "calc(100svh - 150px)", md: "calc(100vh - 150px)" },
          minHeight: 480,
          display: "flex",
          "&:fullscreen": { borderRadius: 0, p: 0, height: "100vh" },
        }}
      >
        <Box
          sx={(t) => ({
            position: "relative",
            flex: 1,
            overflow: "hidden",
            borderRadius: { xs: "18px", md: "26px" },
            bgcolor: t.palette.background.default,
            "&:fullscreen, :fullscreen &": { borderRadius: 0 },
          })}
        >
          {!loaded && safe && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{
                position: "absolute",
                inset: 0,
                textAlign: "center",
                px: 3,
                background:
                  "radial-gradient(500px 260px at 50% 40%, rgba(106,63,224,.22), transparent 70%)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 84,
                  height: 84,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CircularProgress
                  size={84}
                  thickness={2.2}
                  sx={{ position: "absolute", inset: 0, color: "#F5B93F" }}
                />
                <Logo size={40} withText={false} />
              </Box>
              <Typography sx={{ fontWeight: 800 }}>
                Getting your lesson ready…
              </Typography>
              {slow && (
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13.5, maxWidth: 380 }}
                >
                  {isAcademy && "Sign in to academy.takxila.in in this browser, or "}
                  {!isAcademy && "Taking longer than usual. "}
                  <Box
                    component="a"
                    href={openHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: "#F5B93F", fontWeight: 700 }}
                  >
                    {isAcademy ? "open the lesson in a new tab" : "Open the lesson in a new tab"}
                  </Box>
                  .
                </Typography>
              )}
            </Stack>
          )}

          {safe ? (
            <iframe
              ref={frameRef}
              key={src}
              id="scorm_object"
              title={c.title}
              src={src}
              allowFullScreen
              allow="fullscreen; autoplay; clipboard-write; encrypted-media"
              onLoad={() => setLoaded(true)}
              {...legacyFullscreen}
              style={{
                width: "100%",
                height: "100%",
                border: 0,
                display: "block",
                opacity: loaded ? 1 : 0,
                transition: "opacity .4s",
              }}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%", px: 3, textAlign: "center" }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                This lesson link is not allowed.
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Player links must be https links. Ask the admin to fix it.
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>

      {isAcademy && (
        <Typography color="text.secondary" sx={{ mt: 1.25, fontSize: 13 }}>
          Black screen or a login page? Sign in to{" "}
          <strong>academy.takxila.in</strong> in this browser once, then reload.
        </Typography>
      )}
    </Container>
  );
}
