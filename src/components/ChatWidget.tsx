import { useState, type FormEvent } from "react";
import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Fab,
  Grow,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  type Theme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { translate } from "../data/i18n";
import CallIcon from '@mui/icons-material/CallRounded';
import {
  MENTOR_TOPICS,
  WHATSAPP_DISPLAY,
  sendMentorMail,
  whatsappLink
} from "../utils/contact";
import FastField from "./FastField";
import { TEL_HREF } from "../config/site";

/**
 * Central JSON configuration holding repeated styles, tokens, timings, and header copy.
 * New developers: Update styling, colors, animation timings, or default copy directly here.
 */
const CHAT_CONFIG = {
  colors: {
    whatsapp: "#25D366",
    headerGradient: "linear-gradient(135deg, #2B2BD6, #6A3FE0 60%, #9B3FD0)",
  },
  timing: {
    viewResetMs: 250,
  },
  headers: {
    menu: {
      titleKey: "needHelp" as const,
      sub: "We usually reply within a few hours.",
    },
    mentor: {
      titleKey: "chatMentor" as const,
      sub: "We reply to your email within a day",
    },
  },
  styles: {
    container: {
      position: "fixed",
      right: { xs: 14, md: 24 },
      bottom: { xs: 16, md: 24 },
      zIndex: 1250,
    },
    popup: (th: Theme) => ({
      position: "absolute",
      right: 0,
      bottom: 70,
      width: { xs: "calc(100vw - 28px)", sm: 360 },
      maxWidth: 360,
      borderRadius: "20px",
      overflow: "hidden",
      border: `1px solid ${th.tx.line}`,
      boxShadow: `0 24px 70px ${th.tx.glow}, 0 8px 24px rgba(0,0,0,.18)`,
      background: th.palette.mode === "dark" ? "rgba(14,20,44,.97)" : "#fff",
      backdropFilter: "blur(20px)",
    }),
    headerBox: {
      p: 2.25,
      color: "#fff",
      position: "relative",
      background: "linear-gradient(135deg, #2B2BD6, #6A3FE0 60%, #9B3FD0)",
    },
    formBox: {
      p: 2,
      display: "grid",
      gap: 1.5,
    },
    fab: (th: Theme, open: boolean) => ({
      width: 58,
      height: 58,
      boxShadow: `0 12px 34px ${th.tx.glow}`,
      "&::before": open
        ? {}
        : {
            content: '""',
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            border: `2px solid ${th.palette.secondary.main}`,
            animation: "txring 2.4s ease-out infinite",
            pointerEvents: "none",
          },
      "& svg": { transition: "transform .3s" },
    }),
    optionCard: (th: Theme, color: string) => ({
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      p: 1.5,
      borderRadius: "14px",
      cursor: "pointer",
      textDecoration: "none",
      color: "inherit",
      border: `1px solid ${th.tx.line}`,
      transition: "transform .2s, border-color .2s, background .2s",
      "&:hover, &:focus-visible": {
        transform: "translateY(-2px)",
        borderColor: color,
        background: th.palette.action.hover,
        outline: "none",
      },
      "&:hover .tx-chev": { transform: "translateX(3px)" },
    }),
  },
} as const;

/**
 * ChatWidget Component
 * --------------------
 * Floating support widget anchored to the bottom-right of the viewport.
 * Features:
 * - Two views: `menu` (select contact method) and `mentor` (email contact form).
 * - WhatsApp direct chat link pre-populated with user context.
 * - Mentor email submission with graceful fallback to user mail client.
 */
export default function ChatWidget() {
  const { user } = useAuth();
  const { prefs, toast } = useStore();
  const t = (k: Parameters<typeof translate>[1]) => translate(prefs.lang, k);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "mentor">("menu");
  const [f, setF] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    topic: MENTOR_TOPICS[0],
    message: "",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Close widget and smoothly reset view to initial menu after transition
  const close = () => {
    setOpen(false);
    setTimeout(() => setView("menu"), CHAT_CONFIG.timing.viewResetMs);
  };

  // Generic form field updater to eliminate repetitive inline setters
  const update =
    (key: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setF((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // Submit mentor message with validation and user feedback
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = user ? { ...f, name: user.name, email: user.email } : f;
    if (!payload.name.trim() || !/^\S+@\S+\.\S+$/.test(payload.email)) {
      return setErr("Please add your name and a valid email.");
    }
    if (!f.message.trim()) {
      return setErr("Tell the mentor what you need help with.");
    }

    setErr("");
    setBusy(true);
    const result = await sendMentorMail(payload);
    setBusy(false);
    setF((prev) => ({ ...prev, message: "" }));
    close();

    toast(
      result === "sent"
        ? `Sent! A mentor will reply to ${payload.email}.`
        : "Your email app is open with the message. Press Send to reach the mentor.",
    );
  };

  const waText = `Hi Takxila team, I'm ${user?.name ?? "interested in your AI courses"}${user ? ` (${user.email})` : ""}. I'd like to chat about the courses.`;
  const header = CHAT_CONFIG.headers[view];

  return (
    // ClickAwayListener: Ignore clicks targeting MUI Select popovers which render in portals outside this container
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={(e) =>
        open && !(e.target as Element).closest?.(".MuiPopover-root") && close()
      }
    >
      <Box sx={CHAT_CONFIG.styles.container}>
        <Grow in={open} style={{ transformOrigin: "100% 100%" }} unmountOnExit>
          <Paper
            role="dialog"
            aria-label={t("needHelp")}
            elevation={0}
            sx={CHAT_CONFIG.styles.popup}
          >
            {/* Header with back button, view title, and close action */}
            <Box sx={CHAT_CONFIG.styles.headerBox}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                {view === "mentor" && (
                  <IconButton
                    size="small"
                    onClick={() => setView("menu")}
                    aria-label="Back"
                    sx={{ color: "#fff", ml: -0.75 }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                    {t(header.titleKey)}
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                    {header.sub}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={close}
                  aria-label="Close chat"
                  sx={{ color: "#fff" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {/* Menu View: Choose contact method */}
            {view === "menu" ? (
              <Stack spacing={1.25} sx={{ p: 2 }}>
                <Option
                  icon={<SchoolIcon />}
                  color="primary.main"
                  title={t("chatMentor")}
                  sub="Course advice, career guidance or help with a lesson, by email."
                  onClick={() => setView("mentor")}
                />
                <Option
                  icon={<WhatsAppIcon />}
                  color={CHAT_CONFIG.colors.whatsapp}
                  title={t("chatWhatsapp")}
                  sub={`Message us now on ${WHATSAPP_DISPLAY}`}
                  href={whatsappLink(waText)}
                />
                <Option
                  icon={<CallIcon />}
                  color="#4F46E5"
                  title="Call Us"
                  sub={`Talk to a real person on ${WHATSAPP_DISPLAY}`}
                  href={TEL_HREF}
                />
              </Stack>
            ) : (
              /* Mentor View: Email form */
              <Box
                component="form"
                noValidate
                onSubmit={submit}
                sx={CHAT_CONFIG.styles.formBox}
              >
                {!user && (
                  <>
                    <FastField
                      size="small"
                      label="Your name"
                      value={f.name}
                      onChange={update("name")}
                    />
                    <FastField
                      size="small"
                      label="Email"
                      type="email"
                      value={f.email}
                      onChange={update("email")}
                    />
                  </>
                )}
                <TextField
                  size="small"
                  select
                  label="Topic"
                  value={f.topic}
                  onChange={update("topic")}
                >
                  {MENTOR_TOPICS.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </TextField>
                <FastField
                  size="small"
                  label="Message"
                  multiline
                  minRows={3}
                  value={f.message}
                  onChange={update("message")}
                  autoFocus
                />
                {err && (
                  <Typography color="error" sx={{ fontSize: 13 }}>
                    {err}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={busy}
                >
                  {busy ? "Sending…" : "Send to mentor"}
                </Button>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 12, textAlign: "center" }}
                >
                  Goes straight to our mentor inbox. We reply by email.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grow>

        {/* Floating Action Button toggling the chat dialog */}
        <Fab
          color="secondary"
          aria-label={open ? "Close chat" : t("needHelp")}
          onClick={() => (open ? close() : setOpen(true))}
          sx={(th) => CHAT_CONFIG.styles.fab(th, open)}
        >
          {open ? (
            <CloseIcon sx={{ transform: "rotate(90deg)" }} />
          ) : (
            <ChatIcon />
          )}
        </Fab>
      </Box>
    </ClickAwayListener>
  );
}

/**
 * Reusable action row in the chat menu view.
 * Supports button click actions (e.g. switching views) and direct anchor links (e.g. WhatsApp).
 */
function Option({
  icon,
  color,
  title,
  sub,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  sub: string;
  onClick?: () => void;
  href?: string;
}) {
  const linkProps = href
    ? {
        component: "a" as const,
        href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};
  return (
    <Box
      {...linkProps}
      onClick={onClick}
      role={href ? undefined : "button"}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      sx={(th) => CHAT_CONFIG.styles.optionCard(th, color)}
    >
      <Avatar sx={{ bgcolor: color, color: "#fff", width: 44, height: 44 }}>
        {icon}
      </Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 13, lineHeight: 1.4 }}
        >
          {sub}
        </Typography>
      </Box>
      <ChevronRightIcon
        className="tx-chev"
        sx={{ color: "text.secondary", transition: "transform .2s" }}
      />
    </Box>
  );
}
