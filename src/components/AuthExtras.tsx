import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import { useAnnouncements } from '../context/AnnouncementsContext';
import { useStore } from '../context/StoreContext';
import { dayKey } from '../data/showcase';
import { mailtoHref, sendMail } from '../utils/mail';
import { isConfigured, providerEnvKey, providerLabel, type Provider } from '../utils/social';
import { useVisitsQuery } from '../store/api';
import FastField from './FastField';
import authConfig from '../data/authExtras.json';

const ICONS: Record<string, () => JSX.Element> = {
  google: () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  ),
  facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path fill="#fff" d="M13.4 19.5v-6h2l.3-2.4h-2.3V9.6c0-.7.2-1.2 1.2-1.2h1.2V6.3c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8h-2v2.4h2v6z" />
    </svg>
  ),
  microsoft: () => (
    <svg width="17" height="17" viewBox="0 0 22 22" aria-hidden>
      <rect width="10" height="10" fill="#F25022" />
      <rect x="12" width="10" height="10" fill="#7FBA00" />
      <rect y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  ),
};

/**
 * Component: SocialButtons
 * Purpose: Renders third-party OAuth login buttons (Google, Facebook, Microsoft) with configuration guidance modal.
 */
export function SocialButtons({
  onPick,
  busy,
}: {
  onPick: (p: Provider) => void;
  busy: Provider | null;
}) {
  const [setup, setSetup] = useState<Provider | null>(null);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>
        Log in using your account on:
      </Typography>
      <Stack spacing={1}>
        {authConfig.socialProviders.map(({ id, label }) => {
          const p = id as Provider;
          const Logo = ICONS[p];
          return (
            <Button
              key={p}
              fullWidth
              variant="outlined"
              color="inherit"
              disabled={!!busy}
              onClick={() => (isConfigured(p) ? onPick(p) : setSetup(p))}
              startIcon={busy === p ? <CircularProgress size={16} /> : Logo ? <Logo /> : null}
              sx={(t) => ({
                justifyContent: 'center',
                minHeight: 44,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: t.tx.line,
                bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,.04)' : '#F4F6FB',
                '&:hover': { borderColor: t.tx.hl },
              })}
            >
              {label}
            </Button>
          );
        })}
      </Stack>

      <Dialog open={!!setup} onClose={() => setSetup(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{setup && providerLabel(setup)} sign-in is almost ready</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
            To turn this button on, the site owner adds a {setup && providerLabel(setup)} app ID to the project&apos;s <b>.env</b> file and rebuilds:
          </Typography>
          <Box
            component="code"
            sx={(t) => ({
              display: 'block',
              p: 1.5,
              borderRadius: '10px',
              bgcolor: t.tx.surface,
              border: `1px solid ${t.tx.line}`,
              fontSize: 13,
            })}
          >
            {setup && providerEnvKey(setup)}=your-id-here
          </Box>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 14 }}>
            The README explains where to get it. Until then, log in with your email and password.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetup(null)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/**
 * Component: HumanCheck
 * Purpose: Interactive bot verification checkbox ("I'm not a robot") for authentication forms.
 */
export function HumanCheck({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  const [busy, setBusy] = useState(false);

  const toggle = () => {
    if (checked || busy) return onChange(false);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onChange(true);
    }, 650);
  };

  return (
    <Box>
      <Box
        role="checkbox"
        aria-checked={checked}
        aria-label="I am not a robot"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          py: 1.25,
          borderRadius: '10px',
          cursor: 'pointer',
          userSelect: 'none',
          maxWidth: 300,
          border: `1px solid ${error ? t.palette.error.main : t.tx.line}`,
          bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,.04)' : '#F9FAFC',
        })}
      >
        <Box
          sx={(t) => ({
            width: 26,
            height: 26,
            borderRadius: '6px',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            border: checked || busy ? 'none' : `2px solid ${t.palette.text.secondary}`,
            bgcolor: checked ? 'success.main' : 'transparent',
            color: '#fff',
          })}
        >
          {busy ? <CircularProgress size={22} /> : checked ? <CheckIcon fontSize="small" /> : null}
        </Box>
        <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>I&apos;m not a robot</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 10, lineHeight: 1.2, textAlign: 'center' }}>
          Human
          <br />
          check
        </Typography>
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Component: LostPasswordDialog
 * Purpose: Dialog modal for submitting password reset requests via email.
 */
export function LostPasswordDialog({
  open,
  onClose,
  email: initial,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) {
  const { toast } = useStore();
  const [email, setEmail] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => setEmail(initial), [initial, open]);

  const send = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Enter the email you registered with.');
    setBusy(true);
    const fields = { Email: email, Request: 'Please help me reset my Takxila password.' };
    try {
      await sendMail('Password reset request', { ...fields, _replyto: email });
      toast('Request sent. The academy will email you to reset your password.');
    } catch {
      window.location.href = mailtoHref('Password reset request', fields);
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Lost password?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Enter your email and we&apos;ll send you help to reset your password.
        </Typography>
        <FastField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={send} disabled={busy}>
          {busy ? 'Sending…' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Component: Block
 * Purpose: Base container layout with glassmorphic styling for auth sidebar widgets.
 */
export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        p: 2.25,
        borderRadius: '18px',
        border: `1px solid ${t.tx.line}`,
        background: t.tx.surface,
        backdropFilter: 'blur(16px)',
        height: '100%',
      })}
    >
      <Typography sx={{ fontWeight: 800, mb: 1.5 }}>{title}</Typography>
      {children}
    </Box>
  );
}

/**
 * Component: LatestAnnouncements
 * Purpose: Sidebar widget rendering the 3 most recent site announcements.
 */
export function LatestAnnouncements() {
  const { items } = useAnnouncements();
  const latest = items.slice(0, 3);

  return (
    <Block title="Latest announcements">
      <Stack spacing={1.5}>
        {latest.map((a) => (
          <Box key={a.id}>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {new Date(a.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · {a.author}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 15 }}>
              {a.title}
            </Typography>
          </Box>
        ))}
        {!latest.length && <Typography color="text.secondary">No announcements yet.</Typography>}
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          Log in to read all topics.
        </Typography>
      </Stack>
    </Block>
  );
}

/**
 * Component: MiniCalendar
 * Purpose: Interactive calendar widget displaying active month dates and highlighting announcement activity.
 */
export function MiniCalendar() {
  const { items } = useAnnouncements();
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = dayKey(new Date());
  const marked = useMemo(() => new Set(items.map((a) => dayKey(new Date(a.at)))), [items]);

  const first = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];
  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  return (
    <Block title="Calendar">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <IconButton size="small" onClick={() => shift(-1)} aria-label="Previous month">
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 700 }}>
          {month.toLocaleString([], { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton size="small" onClick={() => shift(1)} aria-label="Next month">
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
        {authConfig.calendar.weekdays.map((d) => (
          <Typography key={d} sx={{ fontWeight: 700, fontSize: 12 }}>
            {d}
          </Typography>
        ))}
        {cells.map((d, i) => {
          const key = d ? dayKey(new Date(month.getFullYear(), month.getMonth(), d)) : '';
          const isToday = key === today;
          return (
            <Box key={i} sx={{ height: 32, display: 'grid', placeItems: 'center', position: 'relative' }}>
              {d > 0 && (
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: isToday ? 800 : 500,
                    bgcolor: isToday ? 'secondary.main' : 'transparent',
                    color: isToday ? 'secondary.contrastText' : 'text.primary',
                  }}
                >
                  {d}
                </Box>
              )}
              {marked.has(key) && !isToday && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Block>
  );
}

const countThisVisit = (() => {
  try {
    const first = sessionStorage.getItem('tx_visit_counted') !== '1';
    sessionStorage.setItem('tx_visit_counted', '1');
    return first;
  } catch {
    return false;
  }
})();

/**
 * Component: VisitorCounter
 * Purpose: Digital odometer widget showing total website visit counts.
 */
export function VisitorCounter() {
  const count = useVisitsQuery({ count: countThisVisit }).data?.count ?? null;

  return (
    <Block title="Visitor counter">
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        {String(count ?? 0)
          .padStart(authConfig.visitorCounter.minDigits, '0')
          .split('')
          .map((d, i) => (
            <Box
              key={i}
              sx={{
                width: 30,
                height: 40,
                borderRadius: '6px',
                bgcolor: '#0B1A0B',
                color: '#4ADE80',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              {count === null ? '·' : d}
            </Box>
          ))}
      </Stack>
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        Started at {authConfig.visitorCounter.startDate}
      </Typography>
      <Link href="/#courses" underline="hover" sx={{ fontSize: 13, color: 'secondary.main' }}>
        See our courses
      </Link>
    </Block>
  );
}
