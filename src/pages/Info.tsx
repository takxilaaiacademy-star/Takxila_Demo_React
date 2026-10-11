import { useEffect, useState, type FormEvent } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/PhoneOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import Faq from '../components/Faq';
import { Heading, Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../components/Footer';
import { WHATSAPP_DISPLAY } from '../utils/contact';
import { mailtoHref, sendMail } from '../utils/mail';
import { load, save } from '../utils/storage';
import type { ContactMessage } from '../types';
import FastField from '../components/FastField';
import { ABOUT_SIGNOFF, ABOUT_STORY, ABOUT_TAGLINE } from '../data/about';

/** The "About TAKXILA" story. Words live in src/data/about.tsx. */
function AboutStory() {
  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'relative', px: { xs: 2.5, md: 5 }, py: { xs: 3.5, md: 5 }, color: '#fff', overflow: 'hidden',
          background: 'linear-gradient(120deg, #0B1636 0%, #13215e 55%, #2a2f8f 100%)',
          '&::after': { content: '""', position: 'absolute', right: -80, top: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,185,63,.35), transparent 70%)' },
        }}
      >
        <Typography variant="overline" sx={{ color: '#F5B93F', letterSpacing: 3, fontWeight: 800 }}>
          OUR STORY
        </Typography>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 30, md: 42 }, lineHeight: 1.1, mt: 0.5 }}>
          About TAKXILA
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: { xs: 16, md: 19 }, opacity: 0.9, maxWidth: 720 }}>{ABOUT_TAGLINE}</Typography>
      </Box>
      <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 3, md: 4 }, '& b': { color: 'text.primary', fontWeight: 700 } }}>
        {ABOUT_STORY.map((blk, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            {blk.heading && (
              <Typography component="h3" sx={{ fontWeight: 800, fontSize: { xs: 21, md: 25 }, mb: 1.5, mt: i ? 1.5 : 0 }}>
                {blk.heading}
              </Typography>
            )}
            {blk.paras.map((para, j) => (
              <Typography key={j} color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.75, fontSize: 15.5 }}>
                {para}
              </Typography>
            ))}
            {blk.quote && (
              <Box
                sx={(t) => ({
                  my: 2.5, px: 2.5, py: 2, borderRadius: '12px', borderLeft: `4px solid ${t.palette.secondary.main}`,
                  background: t.palette.mode === 'dark' ? 'rgba(245,185,63,.08)' : 'rgba(245,185,63,.12)',
                })}
              >
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 16, md: 18 } }}>{blk.quote}</Typography>
              </Box>
            )}
          </Box>
        ))}
        <Box sx={(t) => ({ pt: 2.5, borderTop: `1px solid ${t.tx.line}` })}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 28 } }}>{ABOUT_SIGNOFF.brand}</Typography>
          <Typography sx={{ fontWeight: 700, color: 'secondary.main' }}>{ABOUT_SIGNOFF.line}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

export function About() {
  const nav = useNavigate();
  const pillars: [SvgIconComponent, string, string][] = [
    [BuildIcon, 'Hands-on Projects', 'Learn by doing, not just watching.'],
    [PublicIcon, 'Real-world Use Cases', 'Apply AI in work, business and life.'],
    [ScheduleIcon, 'Learn at Your Own Pace', 'Anytime, anywhere.'],
  ];
  return (
    <Page>
      <Heading
        kick="ABOUT US"
        title="The AI skills academy for"
        hl="real people."
        sub="Takxila AI Academy teaches practical AI: agents, automation and everyday AI skills, for working professionals, business owners and kids aged 8 to 12."
      />
      <AboutStory />
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {pillars.map(([Icon, t, d]) => (
          <Grid item xs={12} md={4} key={t}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Icon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
              <Typography variant="h6">{t}</Typography>
              <Typography color="text.secondary">{d}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" size="large" onClick={() => nav('/courses')}>
        See the courses
      </Button>
    </Page>
  );
}

export function Helpdesk() {
  const nav = useNavigate();
  return (
    <Page maxWidth="md">
      <Heading kick="HELPDESK" title="How can we" hl="help?" />
      <Faq />
      <Card sx={{ p: 3, mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 700, flexGrow: 1 }}>Still stuck? Send us a message.</Typography>
        <Button variant="contained" onClick={() => nav('/contact')}>
          Contact us
        </Button>
      </Card>
    </Page>
  );
}

export function Contact() {
  const user = useUser();
  const { toast } = useStore();
  const [f, setF] = useState({ name: user.name, email: user.email, message: '' });
  const [busy, setBusy] = useState(false);
  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!f.message.trim()) return toast('Please write a message first.');
    // A copy stays in the browser (tx_messages); the message itself is emailed to the academy inbox.
    save('messages', load<ContactMessage[]>('messages', []).concat({ ...f, at: new Date().toISOString() }));
    const subject = `Website contact: ${f.name}`;
    const fields = { Name: f.name, Email: f.email, Message: f.message };
    setBusy(true);
    try {
      await sendMail(subject, { ...fields, _replyto: f.email });
      toast('Message sent. We will reply to ' + f.email + '.');
    } catch {
      window.location.href = mailtoHref(subject, fields);
      toast('Your email app is open with the message. Press Send to reach us.');
    } finally {
      setBusy(false);
    }
    setF({ ...f, message: '' });
  };
  const info: [SvgIconComponent, string][] = [
    [EmailIcon, SUPPORT_EMAIL],
    [CallIcon, SUPPORT_PHONE],
    [PhoneIcon, 'WhatsApp ' + WHATSAPP_DISPLAY],
    [PlaceIcon, '[OFFICE ADDRESS]'],
  ];
  return (
    <Page>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Heading kick="CONTACT US" title="Let's" hl="talk." sub="Questions about a course, a payment or your account? Write to us." />
          <Stack spacing={2}>
            {info.map(([Icon, t]) => (
              <Stack direction="row" spacing={1.5} alignItems="center" key={t}>
                <Icon color="secondary" />
                <Typography>{t}</Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card component="form" onSubmit={send} sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2}>
              <FastField label="Your name" value={f.name} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, name: v })); }} required />
              <FastField label="Email" type="email" value={f.email} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, email: v })); }} required />
              <FastField label="Message" multiline minRows={5} value={f.message} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, message: v })); }} required />
              <Button type="submit" variant="contained" size="large" disabled={busy}>
                {busy ? 'Sending…' : 'Send message'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
}

export function Policies() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    return () => clearTimeout(t);
  }, [hash]);
  const P: [id: string, title: string, text: string][] = [
    ['privacy', 'Privacy policy', '[PRIVACY POLICY TEXT]'],
    ['refund', 'Refund policy', '[REFUND POLICY TEXT]'],
    ['terms', 'Terms of use', '[TERMS OF USE TEXT]'],
  ];
  return (
    <Page maxWidth="md">
      <Heading kick="POLICIES" title="The" hl="fine print" />
      <Stack spacing={2.5}>
        {P.map(([id, t, d]) => (
          <Card key={id} id={id} sx={{ p: 3, scrollMarginTop: 120 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t}
            </Typography>
            <Typography color="text.secondary">{d}</Typography>
          </Card>
        ))}
      </Stack>
    </Page>
  );
}

export function NotFound() {
  const nav = useNavigate();
  return (
    <Page maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" sx={{ fontSize: 96, color: 'secondary.main' }}>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This page does not exist.
        </Typography>
        <Button variant="contained" onClick={() => nav('/')}>
          Go home
        </Button>
      </Box>
    </Page>
  );
}
