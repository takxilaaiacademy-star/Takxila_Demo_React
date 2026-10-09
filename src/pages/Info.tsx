import { useEffect, useState, type FormEvent } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import { Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/WhatsApp';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import Faq from '../components/Faq';
import { Heading, Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { load, save } from '../utils/storage';
import type { ContactMessage } from '../types';

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
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography color="text.secondary">[YOUR STORY: WHO FOUNDED TAKXILA, WHEN, AND WHY]</Typography>
      </Card>
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
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!f.message.trim()) return toast('Please write a message first.');
    // Demo: messages are kept in the browser (tx_messages) until a backend exists.
    save('messages', load<ContactMessage[]>('messages', []).concat({ ...f, at: new Date().toISOString() }));
    setF({ ...f, message: '' });
    toast('Message sent. We will get back to you.');
  };
  const info: [SvgIconComponent, string][] = [
    [EmailIcon, '[SUPPORT EMAIL]'],
    [PhoneIcon, '[PHONE / WHATSAPP NUMBER]'],
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
              <TextField label="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              <TextField label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
              <TextField label="Message" multiline minRows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} required />
              <Button type="submit" variant="contained" size="large">
                Send message
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
