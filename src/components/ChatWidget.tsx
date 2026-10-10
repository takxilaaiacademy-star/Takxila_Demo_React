import { useState, type FormEvent } from 'react';
import { Avatar, Box, Button, ClickAwayListener, Fab, Grow, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { translate } from '../data/i18n';
import { MENTOR_TOPICS, WHATSAPP_DISPLAY, sendMentorMail, whatsappLink } from '../utils/contact';

const WA_GREEN = '#25D366';

/** Floating help button (bottom right) with two ways to talk to us: a mentor by email, or WhatsApp. */
export default function ChatWidget() {
  const { user } = useAuth();
  const { prefs } = useStore();
  const t = (k: Parameters<typeof translate>[1]) => translate(prefs.lang, k);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'mentor'>('menu');
  const [f, setF] = useState({ name: user?.name ?? '', email: user?.email ?? '', topic: MENTOR_TOPICS[0], message: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { toast } = useStore();

  const close = () => {
    setOpen(false);
    setTimeout(() => setView('menu'), 250);
  };
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = user ? { ...f, name: user.name, email: user.email } : f;
    if (!r.name.trim() || !/^\S+@\S+\.\S+$/.test(r.email)) return setErr('Please add your name and a valid email.');
    if (!f.message.trim()) return setErr('Tell the mentor what you need help with.');
    setErr('');
    setBusy(true);
    const how = await sendMentorMail(r);
    setBusy(false);
    setF({ ...f, message: '' });
    close();
    toast(how === 'sent' ? 'Sent! A mentor will reply to ' + r.email + '.' : 'Your email app is open with the message. Press Send to reach the mentor.');
  };
  const waText = `Hi Takxila team, I'm ${user?.name ?? 'interested in your AI courses'}${user ? ` (${user.email})` : ''}. I'd like to chat about the courses.`;

  return (
    // The Topic menu opens in a layer outside this box; a click there is not a click away.
    <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(e) => open && !(e.target as Element).closest?.('.MuiPopover-root') && close()}>
      <Box sx={{ position: 'fixed', right: { xs: 14, md: 24 }, bottom: { xs: 16, md: 24 }, zIndex: 1250 }}>
        <Grow in={open} style={{ transformOrigin: '100% 100%' }} unmountOnExit>
          <Paper
            role="dialog"
            aria-label={t('needHelp')}
            elevation={0}
            sx={(th) => ({
              position: 'absolute', right: 0, bottom: 70, width: { xs: 'calc(100vw - 28px)', sm: 360 }, maxWidth: 360, borderRadius: '20px', overflow: 'hidden',
              border: `1px solid ${th.tx.line}`, boxShadow: `0 24px 70px ${th.tx.glow}, 0 8px 24px rgba(0,0,0,.18)`,
              background: th.palette.mode === 'dark' ? 'rgba(14,20,44,.97)' : '#fff', backdropFilter: 'blur(20px)',
            })}
          >
            <Box
              sx={{ p: 2.25, color: '#fff', position: 'relative', background: 'linear-gradient(135deg, #2B2BD6, #6A3FE0 60%, #9B3FD0)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25}>
                {view === 'mentor' && (
                  <IconButton size="small" onClick={() => setView('menu')} aria-label="Back" sx={{ color: '#fff', ml: -0.75 }}>
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 17 }}>{view === 'menu' ? t('needHelp') : t('chatMentor')}</Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                    {view === 'menu' ? 'We usually reply within a few hours.' : 'We reply to your email within a day'}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={close} aria-label="Close chat" sx={{ color: '#fff' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {view === 'menu' ? (
              <Stack spacing={1.25} sx={{ p: 2 }}>
                <Option
                  icon={<SchoolIcon />}
                  color="primary.main"
                  title={t('chatMentor')}
                  sub="Course advice, career guidance or help with a lesson, by email."
                  onClick={() => setView('mentor')}
                />
                <Option
                  icon={<WhatsAppIcon />}
                  color={WA_GREEN}
                  title={t('chatWhatsapp')}
                  sub={'Message us now on ' + WHATSAPP_DISPLAY}
                  href={whatsappLink(waText)}
                />
              </Stack>
            ) : (
              <Box component="form" noValidate onSubmit={submit} sx={{ p: 2, display: 'grid', gap: 1.5 }}>
                {!user && (
                  <>
                    <TextField size="small" label="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                    <TextField size="small" label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                  </>
                )}
                <TextField
                  size="small"
                  select
                  label="Topic"
                  value={f.topic}
                  onChange={(e) => setF({ ...f, topic: e.target.value })}
                >
                  {MENTOR_TOPICS.map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField size="small" label="Message" multiline minRows={3} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} autoFocus />
                {err && (
                  <Typography color="error" sx={{ fontSize: 13 }}>
                    {err}
                  </Typography>
                )}
                <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={busy}>
                  {busy ? 'Sending…' : 'Send to mentor'}
                </Button>
                <Typography color="text.secondary" sx={{ fontSize: 12, textAlign: 'center' }}>
                  Goes straight to our mentor inbox. We reply by email.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grow>

        <Fab
          color="secondary"
          aria-label={open ? 'Close chat' : t('needHelp')}
          onClick={() => (open ? close() : setOpen(true))}
          sx={(th) => ({
            width: 58, height: 58, boxShadow: `0 12px 34px ${th.tx.glow}`,
            '&::before': open ? {} : {
              content: '""', position: 'absolute', inset: -6, borderRadius: '50%', border: `2px solid ${th.palette.secondary.main}`,
              animation: 'txring 2.4s ease-out infinite', pointerEvents: 'none',
            },
            '& svg': { transition: 'transform .3s' },
          })}
        >
          {open ? <CloseIcon sx={{ transform: 'rotate(90deg)' }} /> : <ChatIcon />}
        </Fab>
      </Box>
    </ClickAwayListener>
  );
}

function Option({ icon, color, title, sub, onClick, href }: { icon: React.ReactNode; color: string; title: string; sub: string; onClick?: () => void; href?: string }) {
  const link = href ? { component: 'a' as const, href, target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Box
      {...link}
      onClick={onClick}
      role={href ? undefined : 'button'}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onClick?.()}
      sx={(th) => ({
        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '14px', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
        border: `1px solid ${th.tx.line}`, transition: 'transform .2s, border-color .2s, background .2s',
        '&:hover, &:focus-visible': { transform: 'translateY(-2px)', borderColor: color, background: th.palette.action.hover, outline: 'none' },
        '&:hover .tx-chev': { transform: 'translateX(3px)' },
      })}
    >
      <Avatar sx={{ bgcolor: color, color: '#fff', width: 44, height: 44 }}>{icon}</Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.4 }}>
          {sub}
        </Typography>
      </Box>
      <ChevronRightIcon className="tx-chev" sx={{ color: 'text.secondary', transition: 'transform .2s' }} />
    </Box>
  );
}
