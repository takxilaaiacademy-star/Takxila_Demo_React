import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  type TextFieldProps,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeModeContext";
import Background from "../components/Background";
import Logo from "../components/Logo";
import { GradientText, GridBackdrop } from "../components/fx";
import {
  HumanCheck,
  LatestAnnouncements,
  LostPasswordDialog,
  MiniCalendar,
  SocialButtons,
  VisitorCounter,
} from "../components/AuthExtras";
import type { Provider } from "../utils/social";
import { useBlobUrl } from "../utils/media";
import FastField from "../components/FastField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type AuthTab = "login" | "register";
interface AuthForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  remember: boolean;
  agree: boolean;
  refBy: string;
  human: boolean;
}
type FieldErrors = Partial<Record<keyof AuthForm, string>>;
interface LocationState {
  from?: string;
}

function PasswordField(props: TextFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <FastField
      {...props}
      type={show ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default function AuthPage() {
  const { isAuthed, login, register, signInWith, social, lastEmail } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const heroUrl = useBlobUrl(
    mode === "dark" ? "/assets/3.jpg" : "/assets/1.jpg",
  );
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as LocationState | null)?.from;
  const refParam = new URLSearchParams(loc.search).get("ref") || "";
  const [tab, setTab] = useState<AuthTab>(
    loc.hash === "#register" || refParam ? "register" : "login",
  );
  const [f, setF] = useState<AuthForm>({
    name: "",
    email: lastEmail || "",
    phone: "",
    password: "",
    confirm: "",
    remember: true,
    agree: false,
    refBy: refParam.toUpperCase(),
    human: false,
  });
  const [lost, setLost] = useState(false);
  const [err, setErr] = useState<FieldErrors>({});
  const [formErr, setFormErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthed) return <Navigate to={from || "/home"} replace />;

  const set = (k: keyof AuthForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({
      ...s,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const switchTab = (t: AuthTab) => {
    setTab(t);
    setErr({});
    setFormErr("");
  };

  const validate = () => {
    const e: FieldErrors = {};
    if (tab === "register" && f.name.trim().length < 2)
      e.name = "Enter your full name.";
    if (!EMAIL_RE.test(f.email.trim()))
      e.email = "Enter a valid email address.";
    if (tab === "register" && f.phone && !/^\+?[\d\s-]{7,15}$/.test(f.phone))
      e.phone = "Enter a valid phone number.";
    if (tab === "register") {
      if (f.password.length < 6) e.password = "Use at least 6 characters.";
      if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
      if (!f.agree) e.agree = "Please accept the terms to continue.";
    } else if (!f.password) e.password = "Enter your password.";
    if (!f.human) e.human = "Please tick the box to show you are not a robot.";
    setErr(e);
    return !Object.keys(e).length;
  };

  // Google / Facebook / Microsoft sign-in runs as a Redux thunk (src/store/authThunks.ts).
  const withProvider = async (p: Provider) => {
    setFormErr("");
    if (await signInWith(p, f.remember)) nav(from || "/home", { replace: true, state: { calc: true } });
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setFormErr("");
    if (!validate()) return;
    setBusy(true);
    try {
      if (tab === "register") await register(f);
      else await login(f);
      nav(from || "/home", { replace: true, state: { calc: true } });
    } catch (e) {
      setFormErr(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        py: { xs: 3, md: 6 },
        px: 2,
      }}
    >
      <Background />
      <Tooltip title={mode === "dark" ? "Light theme" : "Dark theme"}>
        <IconButton
          onClick={toggleMode}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
        >
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      <Card
        sx={{
          width: "100%",
          maxWidth: 1080,
          mx: "auto",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          animation: "txrise .6s cubic-bezier(.2,.8,.2,1) both",
        }}
      >
        <Grid container>
          <Grid
            item
            md={6}
            sx={(t) => ({
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              gap: 3.5,
              p: 5,
              position: "relative",
              overflow: "hidden",
              background:
                t.palette.mode === "dark"
                  ? "radial-gradient(120% 80% at 0% 0%, rgba(91,63,216,.45), transparent 60%), linear-gradient(160deg, #0E1530, #0A1022)"
                  : "radial-gradient(120% 80% at 0% 0%, rgba(123,92,255,.22), transparent 60%), linear-gradient(160deg, #EEF1FF, #F8F9FF)",
              borderRight: `1px solid ${t.tx.line}`,
            })}
          >
            <GridBackdrop size={44} sx={{ opacity: 0.6 }} />
            <Box sx={{ position: "relative" }}>
              <Logo size={52} />
            </Box>
            <AuthHero src={heroUrl} />
            <Box sx={{ position: "relative", mt: "auto" }}>
              <Typography variant="overline" color="text.secondary">
                THE AI SKILLS ACADEMY FOR REAL PEOPLE
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { md: 34, lg: 40 }, my: 1, lineHeight: 1.15 }}
              >
                Learn AI Skills.{" "}
                <GradientText>Build What&apos;s Next.</GradientText>
              </Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {[
                  "45 practical courses and daily challenges",
                  "Certificates with a verifiable ID",
                  "1:1 mentor help on email and WhatsApp",
                ].map((x, i) => (
                  <Stack
                    key={x}
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{ animation: `txrise .6s ${0.25 + i * 0.12}s both` }}
                  >
                    <CheckCircleIcon color="secondary" fontSize="small" />
                    <Typography color="text.secondary">{x}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ display: { md: "none" }, mb: 3 }}>
              <Logo size={46} />
              <Box sx={{ mt: 2.5 }}>
                <AuthHero src={heroUrl} compact />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {tab === "login" ? "Welcome back" : "Create your account"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {tab === "login"
                ? "Log in to pick up your courses where you left off."
                : "Join Takxila and start learning AI today."}
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => switchTab(v)}
              variant="fullWidth"
              sx={(t) => ({
                mb: 3,
                p: 0.5,
                borderRadius: "14px",
                border: `1px solid ${t.tx.line}`,
                minHeight: 0,
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "12px",
                  zIndex: 0,
                  bgcolor: "primary.main",
                },
                "& .MuiTab-root": {
                  zIndex: 1,
                  minHeight: 44,
                  borderRadius: "12px",
                },
                "& .Mui-selected": {
                  color: `${t.palette.primary.contrastText} !important`,
                },
              })}
            >
              <Tab value="login" label="Log in" />
              <Tab value="register" label="Register" />
            </Tabs>

            {(formErr || social.error) && (
              <Alert severity="error" sx={{ mb: 2, wordBreak: "break-word" }}>
                {formErr || social.error}{" "}
                {/No account/.test(formErr) && (
                  <Link
                    component="button"
                    type="button"
                    onClick={() => switchTab("register")}
                    sx={{ fontWeight: 700, verticalAlign: "baseline" }}
                  >
                    Register now
                  </Link>
                )}
              </Alert>
            )}

            <Stack component="form" spacing={2} onSubmit={submit} noValidate>
              {tab === "register" && (
                <FastField
                  label="Full name"
                  value={f.name}
                  onChange={set("name")}
                  error={!!err.name}
                  helperText={err.name}
                  autoComplete="name"
                  autoFocus
                />
              )}
              <FastField
                label={tab === "login" ? "Username / email" : "Email"}
                type="email"
                value={f.email}
                onChange={set("email")}
                error={!!err.email}
                helperText={err.email}
                autoComplete="email"
                autoFocus={tab === "login"}
              />
              {tab === "register" && (
                <FastField
                  label="Phone / WhatsApp (optional)"
                  value={f.phone}
                  onChange={set("phone")}
                  error={!!err.phone}
                  helperText={err.phone}
                  autoComplete="tel"
                />
              )}
              <PasswordField
                label="Password"
                value={f.password}
                onChange={set("password")}
                error={!!err.password}
                helperText={
                  err.password ||
                  (tab === "register" ? "At least 6 characters." : "")
                }
                autoComplete={
                  tab === "login" ? "current-password" : "new-password"
                }
              />
              {tab === "register" && (
                <PasswordField
                  label="Confirm password"
                  value={f.confirm}
                  onChange={set("confirm")}
                  error={!!err.confirm}
                  helperText={err.confirm}
                  autoComplete="new-password"
                />
              )}
              {tab === "register" && (
                <FastField
                  label="Referral code (optional)"
                  value={f.refBy}
                  onChange={set("refBy")}
                  helperText={
                    f.refBy
                      ? "Your friend gets ₹200 when you enroll, and you get ₹200 off your first order."
                      : "Got a code from a friend? You get ₹200 off your first order."
                  }
                  inputProps={{
                    style: {
                      textTransform: "uppercase",
                      letterSpacing: ".12em",
                    },
                  }}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox checked={f.remember} onChange={set("remember")} />
                }
                label="Keep me logged in"
              />
              {tab === "register" && (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox checked={f.agree} onChange={set("agree")} />
                    }
                    label="I agree to the Terms of use and Privacy policy"
                  />
                  {err.agree && (
                    <Typography variant="caption" color="error" component="div">
                      {err.agree}
                    </Typography>
                  )}
                </Box>
              )}
              <HumanCheck
                checked={f.human}
                onChange={(v) => setF((s) => ({ ...s, human: v }))}
                error={err.human}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={busy}
                sx={{ borderRadius: "14px" }}
              >
                {tab === "login" ? "Log in" : "Create account"}
              </Button>
              {tab === "login" && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ flexWrap: "wrap", gap: 1 }}
                >
                  <Link
                    component="button"
                    type="button"
                    onClick={() => switchTab("register")}
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    Create new account
                  </Link>
                  <Link
                    component="button"
                    type="button"
                    onClick={() => setLost(true)}
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    Lost password?
                  </Link>
                </Stack>
              )}
              <SocialButtons onPick={withProvider} busy={social.busy} />
              <Typography
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  display: tab === "login" ? "none" : undefined,
                }}
              >
                {tab === "login"
                  ? "New to Takxila? "
                  : "Already have an account? "}
                <Link
                  component="button"
                  type="button"
                  onClick={() =>
                    switchTab(tab === "login" ? "register" : "login")
                  }
                  sx={{
                    fontWeight: 700,
                    color: "secondary.main",
                    verticalAlign: "baseline",
                  }}
                >
                  {tab === "login" ? "Create an account" : "Log in"}
                </Link>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Demo login: accounts are saved only in this browser.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      {/* Moodle-style sidebar blocks */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1080,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 0.8fr" },
          position: "relative",
          zIndex: 1,
        }}
      >
        <LatestAnnouncements />
        <MiniCalendar />
        <VisitorCounter />
      </Box>
      <LostPasswordDialog
        open={lost}
        onClose={() => setLost(false)}
        email={f.email}
      />
    </Box>
  );
}

/**
 * The banner photo shown whole (not stretched over the panel), in a floating rounded frame.
 * The left edge of the source image has cut-off text, so the frame starts a little in from it.
 */
function AuthHero({
  src,
  compact = false,
}: {
  src?: string;
  compact?: boolean;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        animation: compact ? undefined : "txfloat 7s ease-in-out infinite",
      }}
    >
      <Box
        sx={(t) => ({
          position: "relative",
          aspectRatio: "2.1",
          borderRadius: compact ? "16px" : "22px",
          overflow: "hidden",
          border: `1px solid ${t.tx.line}`,
          boxShadow: compact ? "none" : `0 30px 70px ${t.tx.glow}`,
          bgcolor: t.tx.surface,
        })}
      >
        {src && (
          <Box
            component="img"
            src={src}
            alt="A learner studying AI with Takxila"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "72% 45%",
              display: "block",
              animation: "txblurin .8s both",
            }}
          />
        )}
      </Box>
      {!compact && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={(t) => ({
            position: "absolute",
            left: -14,
            bottom: -18,
            px: 1.5,
            py: 1,
            borderRadius: "14px",
            border: `1px solid ${t.tx.line}`,
            background:
              t.palette.mode === "dark"
                ? "rgba(16,23,48,.92)"
                : "rgba(255,255,255,.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 12px 30px rgba(0,0,0,.18)",
            animation: "txrise .7s .4s both",
          })}
        >
          <WorkspacePremiumIcon sx={{ color: "#F5B93F" }} />
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
              Certified learning
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Finish a course, get your certificate
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
