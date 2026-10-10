import { useMemo, useState, type FormEvent } from 'react';
import { Avatar, Box, Button, Chip, Grid, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import RouteIcon from '@mui/icons-material/RouteOutlined';
import WorkIcon from '@mui/icons-material/WorkOutline';
import SmartToyIcon from '@mui/icons-material/SmartToyOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';
import EventIcon from '@mui/icons-material/EventAvailableOutlined';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import MailIcon from '@mui/icons-material/MailOutline';
import { DashShell, Panel } from '../components/Learning';
import { Page } from '../components/Section';
import { GradientText } from '../components/fx';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import type { ContactMessage } from '../types';
import { MENTOR_EMAIL, MENTOR_TOPICS, WHATSAPP_DISPLAY, sendMentorMail, whatsappLink } from '../utils/contact';
import { load } from '../utils/storage';

const AREAS: [title: string, body: string, Icon: typeof RouteIcon][] = [
  ['Learning path', 'Not sure which course comes next? Get a plan built around your goal and weekly time.', RouteIcon],
  ['Career switch', 'Move into an AI role: which skills matter, what to build, how to talk about it.', WorkIcon],
  ['Agents and projects', 'Stuck on a build? Walk through your agent, workflow or no-code app with a mentor.', SmartToyIcon],
  ['Portfolio and resume', 'Feedback on your resume, portfolio and LinkedIn before you apply.', DescriptionIcon],
  ['AI for your business', 'Find the tasks in your business that AI can take over first.', StorefrontIcon],
  ['Lesson help', 'A concept didn’t click? Ask about any lesson in your courses.', HelpIcon],
];

const STEPS: [title: string, body: string, Icon: typeof RouteIcon][] = [
  ['Tell us what you need', 'Pick a topic and a time that suits you.', ForumIcon],
  ['We match a mentor', 'A mentor who knows the topic replies by email or WhatsApp.', MailIcon],
  ['Meet and move forward', 'A focused session with clear next steps.', EventIcon],
];

const MODES = ['Google Meet', 'WhatsApp call', 'Email'] as const;

export default function Mentorship() {
  const user = useUser();
  const { toast } = useStore();
  const [f, setF] = useState({ topic: MENTOR_TOPICS[0], slot: '', mode: MODES[0] as string, message: '' });
  const [sent, setSent] = useState(0);
  const past = useMemo(
    () => load<ContactMessage[]>('messages', []).filter((m) => m.email === user.email && m.message.startsWith('[Mentor')).reverse(),
    [user.email, sent],
  );

  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!f.message.trim()) return toast('Tell the mentor what you would like help with.');
    setBusy(true);
    const when = f.slot ? new Date(f.slot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + ' · ' + f.mode : f.mode;
    const how = await sendMentorMail({ name: user.name, email: user.email, topic: f.topic, message: f.message, slot: when });
    setBusy(false);
    setF({ ...f, message: '' });
    setSent((n) => n + 1);
    toast(how === 'sent' ? 'Request sent. A mentor will reply to ' + user.email + '.' : 'Your email app is open with the request. Press Send to reach the mentor.');
  };

  return (
    <Page maxWidth="xl">
      <DashShell>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            1:1 MENTORSHIP
          </Typography>
          <Typography variant="h4">
            Learn faster with a <GradientText>mentor</GradientText>
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
            Book a session for course advice, project help or career guidance. Requests go to {MENTOR_EMAIL}.
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {STEPS.map(([title, body, Icon], i) => (
            <Grid item xs={12} sm={4} key={title}>
              <Panel sx={{ height: '100%' }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', width: 40, height: 40 }}>
                    <Icon fontSize="small" />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {i + 1}. {title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                      {body}
                    </Typography>
                  </Box>
                </Stack>
              </Panel>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              What mentors help with
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 2 }}>
              {AREAS.map(([title, body, Icon], i) => (
                <Box
                  key={title}
                  role="button"
                  tabIndex={0}
                  onClick={() => setF({ ...f, topic: MENTOR_TOPICS[i] })}
                  aria-pressed={f.topic === MENTOR_TOPICS[i]}
                  sx={(t) => ({
                    p: 2, borderRadius: '16px', border: `1px solid ${t.tx.line}`, background: t.tx.surface, cursor: 'pointer', transition: 'transform .25s, border-color .25s',
                    '&:hover, &[aria-pressed=true]': { transform: 'translateY(-4px)', borderColor: t.tx.hl },
                    '&:hover svg': { transform: 'rotate(-8deg) scale(1.1)' },
                  })}
                >
                  <Icon color="secondary" sx={{ mb: 1, transition: 'transform .3s' }} />
                  <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                    {body}
                  </Typography>
                </Box>
              ))}
            </Box>

            {past.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Your requests
                </Typography>
                <Stack spacing={1}>
                  {past.slice(0, 6).map((m) => (
                    <Panel key={m.at} sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Chip size="small" label={/\[Mentor · (.+?)\]/.exec(m.message)?.[1] ?? 'Mentor'} color="secondary" variant="outlined" />
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          {new Date(m.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 14, overflowWrap: 'anywhere' }}>{m.message.replace(/^\[Mentor · .+?\]\s*/, '')}</Typography>
                    </Panel>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} lg={5}>
            <Panel>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Book a session
              </Typography>
              <Box component="form" noValidate onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
                <TextField select label="Topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>
                  {MENTOR_TOPICS.map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Preferred date and time" type="datetime-local" value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })} InputLabelProps={{ shrink: true }} />
                <ToggleButtonGroup exclusive fullWidth size="small" color="secondary" value={f.mode} onChange={(_, v) => v && setF({ ...f, mode: v })}>
                  {MODES.map((m) => (
                    <ToggleButton key={m} value={m} sx={{ textTransform: 'none', fontWeight: 600 }}>
                      {m}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <TextField label="What would you like help with?" multiline minRows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
                <Button type="submit" variant="contained" size="large" endIcon={<SendIcon />} disabled={busy}>
                  {busy ? 'Sending…' : 'Request a mentor'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  href={whatsappLink(`Hi Takxila team, I'm ${user.name} (${user.email}). I'd like a mentorship session about: ${f.topic}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderColor: '#25D366', color: '#25D366', '&:hover': { borderColor: '#25D366', background: 'rgba(37,211,102,.08)' } }}
                >
                  Chat on WhatsApp · {WHATSAPP_DISPLAY}
                </Button>
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </DashShell>
    </Page>
  );
}
