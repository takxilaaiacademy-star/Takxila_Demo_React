import { useMemo, useState, type ReactNode } from 'react';
import { Box, Button, Chip, Grid, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/SendRounded';
import MailIcon from '@mui/icons-material/MarkEmailReadOutlined';
import AtIcon from '@mui/icons-material/AlternateEmailRounded';
import CartIcon from '@mui/icons-material/ShoppingBagOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import CheckIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useUser } from '../../context/AuthContext';
import { useStoreActions } from '../../context/StoreContext';
import { emailData, sendEmailTo } from '../../emails/send';
import { renderEmail, type EmailKind } from '../../emails/templates';
import { useAppDispatch } from '../../store';
import { emailRoute } from '../../store/api';
import { panelSx } from './adminUi';

const KINDS: { kind: EmailKind; name: string; when: string; color: string; icon: ReactNode }[] = [
  { kind: 'purchase', name: 'Order confirmed', when: 'Right after a learner pays for a course', color: '#9333EA', icon: <CartIcon /> },
  { kind: 'enroll', name: 'Free enrolment', when: 'When a learner joins a free or given course', color: '#2a78d6', icon: <SchoolIcon /> },
  { kind: 'completed', name: 'Course completed', when: 'When the last lesson is done, with the certificate', color: '#D97706', icon: <TrophyIcon /> },
];

type Result = { ok: boolean; text: string; at: string } | null;

/** Admin > Emails: the three learner emails, a live preview and a test send. */
export default function AdminEmails() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const [kind, setKind] = useState<EmailKind>('purchase');
  const [view, setView] = useState<'html' | 'text'>('html');
  const [to, setTo] = useState(user.email);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const designed = emailRoute() !== 'formsubmit';

  const sample = useMemo(() => {
    const ids = kind === 'purchase' ? ['claude-deep'] : kind === 'enroll' ? ['wa-agent'] : ['claude-code'];
    const d = emailData(kind, user.name, user.email, { ids, orderId: 'TXSAMPLE01', paymentId: 'pay_SAMPLE123' });
    if (kind === 'purchase') d.total = d.courses.reduce((n, c) => n + (c.price ?? 0), 0);
    return d;
  }, [kind, user.name, user.email]);
  const mail = useMemo(() => renderEmail(kind, sample), [kind, sample]);
  const valid = /^\S+@\S+\.\S+$/.test(to.trim());
  const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const send = async () => {
    if (!valid) return toast('Enter a valid email address.');
    setBusy(true);
    try {
      await dispatch(sendEmailTo(kind, sample, to.trim(), user.name));
      setResult({ ok: true, text: `Sent to ${to.trim()}. Check the inbox (and spam) in a minute.`, at: time() });
    } catch (e) {
      setResult({ ok: false, text: 'Not sent: ' + ((e as { message?: string })?.message ?? 'unknown error'), at: time() });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={5}>
        <Stack spacing={2}>
          {/* Hero */}
          <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '22px', p: { xs: 2.25, md: 3 }, color: '#fff', background: 'linear-gradient(135deg,#13215E 0%,#3b2a8f 55%,#6A3FE0 100%)' }}>
            <Box sx={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,185,63,.45),transparent 70%)' }} />
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative' }}>
              <Box sx={{ width: 46, height: 46, borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)' }}>
                <MailIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, md: 20 }, lineHeight: 1.2 }}>Learner emails</Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.8 }}>Sent automatically, branded with your logo</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Chip size="small" label={designed ? 'Live' : 'Basic'} sx={{ fontWeight: 800, color: designed ? '#062e1c' : '#3a2600', background: designed ? '#4ade80' : '#F5B93F' }} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 2.25, position: 'relative' }}>
              {[['3', 'email types'], ['24/7', 'automatic'], [designed ? 'HTML' : 'Text', 'design']].map(([v, l]) => (
                <Box key={l} sx={{ flex: 1, minWidth: 0, p: 1.25, borderRadius: '14px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 17, md: 19 }, lineHeight: 1.1 }}>{v}</Typography>
                  <Typography sx={{ fontSize: 11.5, opacity: 0.75 }} noWrap>{l}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* The three emails */}
          <Box sx={panelSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>What learners receive</Typography>
            <Stack spacing={1}>
              {KINDS.map((k) => {
                const on = k.kind === kind;
                return (
                  <Box
                    key={k.kind}
                    component="button"
                    type="button"
                    onClick={() => setKind(k.kind)}
                    sx={(t) => ({
                      all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: '16px',
                      border: `1.5px solid ${on ? k.color : t.tx.line}`, background: on ? `${k.color}1f` : 'transparent', transition: 'background .15s, border-color .15s',
                      '&:hover': { background: `${k.color}14` }, '&:focus-visible': { outline: `2px solid ${k.color}`, outlineOffset: 2 },
                    })}
                  >
                    <Box sx={{ width: 38, height: 38, flexShrink: 0, borderRadius: '12px', display: 'grid', placeItems: 'center', color: '#fff', background: k.color, '& svg': { fontSize: 20 } }}>{k.icon}</Box>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{k.name}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>{k.when}</Typography>
                    </Box>
                    {on && <CheckIcon sx={{ color: k.color, flexShrink: 0 }} />}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Test send */}
          <Box sx={panelSx}>
            <Typography variant="h6">Send a test</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13, mb: 1.5 }}>Sends the <b>{KINDS.find((k) => k.kind === kind)?.name}</b> email to any address you type.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                size="small" fullWidth label="Send to" value={to} onChange={(e) => setTo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !busy) void send(); }}
                error={!!to.trim() && !valid}
                InputProps={{ startAdornment: <InputAdornment position="start"><AtIcon fontSize="small" /></InputAdornment> }}
              />
              <Button variant="contained" startIcon={<SendIcon />} disabled={busy || !valid} onClick={() => void send()} sx={{ flexShrink: 0 }}>{busy ? 'Sending…' : 'Send test'}</Button>
            </Stack>
            {to.trim().toLowerCase() !== user.email.toLowerCase() && (
              <Chip size="small" variant="outlined" label={`Use my address (${user.email})`} onClick={() => setTo(user.email)} sx={{ mt: 1.25, maxWidth: '100%' }} />
            )}
            {result && (
              <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1.5, p: 1.25, borderRadius: '12px', background: result.ok ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)' }}>
                {result.ok ? <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} /> : <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                <Typography sx={{ fontSize: 13, flexGrow: 1 }}>{result.text}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12, flexShrink: 0 }}>{result.at}</Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Grid>

      {/* Preview, framed like a mail app */}
      <Grid item xs={12} lg={7}>
        <Box sx={(t) => ({ ...panelSx(t), p: 0, overflow: 'hidden' })}>
          <Stack direction="row" alignItems="center" spacing={1} sx={(t) => ({ px: 2, py: 1.25, borderBottom: `1px solid ${t.tx.line}` })}>
            {['#ef4444', '#f59e0b', '#22c55e'].map((c) => <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, pl: 1, flexGrow: 1 }} noWrap>Preview</Typography>
            <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, v: 'html' | 'text' | null) => v && setView(v)}>
              <ToggleButton value="html">Designed</ToggleButton>
              <ToggleButton value="text">Plain text</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Box sx={{ px: 2, py: 1.5, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5, rowGap: 0.4, fontSize: 13.5 }}>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>From</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>TAKXILA AI Academy</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>To</Typography>
            <Typography sx={{ fontSize: 13 }} noWrap>{to.trim() || '—'}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>Subject</Typography>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{mail.subject}</Typography>
          </Box>
          <Box sx={{ px: { xs: 1, md: 2 }, pb: { xs: 1, md: 2 } }}>
            {view === 'html' ? (
              <Box component="iframe" title="Email preview" srcDoc={mail.html} sx={{ display: 'block', width: '100%', height: { xs: 560, md: 680 }, border: 0, borderRadius: '14px', background: '#EEF0F7' }} />
            ) : (
              <Box component="pre" sx={(t) => ({ m: 0, p: 2, borderRadius: '14px', background: t.tx.surface, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, lineHeight: 1.6, maxHeight: 680, overflow: 'auto' })}>{mail.text}</Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
