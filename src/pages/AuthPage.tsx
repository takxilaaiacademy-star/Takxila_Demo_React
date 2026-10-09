import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert, Box, Button, Card, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, Link, Stack, Tab, Tabs, TextField, Tooltip, Typography, type TextFieldProps,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useTheme } from '@mui/material/styles';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';
import Background from '../components/Background';
import Logo from '../components/Logo';
import { useBlobUrl } from '../utils/media';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type AuthTab = 'login' | 'register';
interface AuthForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  remember: boolean;
  agree: boolean;
  refBy: string;
}
type FieldErrors = Partial<Record<keyof AuthForm, string>>;
interface LocationState {
  from?: string;
}

function PasswordField(props: TextFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default function AuthPage() {
  const { isAuthed, login, register, lastEmail } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const heroUrl = useBlobUrl(mode === 'dark' ? '/assets/3.jpg' : '/assets/1.jpg');
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as LocationState | null)?.from;
  const refParam = new URLSearchParams(loc.search).get('ref') || '';
  const [tab, setTab] = useState<AuthTab>(loc.hash === '#register' || refParam ? 'register' : 'login');
  const [f, setF] = useState<AuthForm>({ name: '', email: lastEmail || '', phone: '', password: '', confirm: '', remember: true, agree: false, refBy: refParam.toUpperCase() });
  const [err, setErr] = useState<FieldErrors>({});
  const [formErr, setFormErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthed) return <Navigate to={from || '/dashboard'} replace />;

  const set = (k: keyof AuthForm) => (e: ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const switchTab = (t: AuthTab) => {
    setTab(t);
    setErr({});
    setFormErr('');
  };

  const validate = () => {
    const e: FieldErrors = {};
    if (tab === 'register' && f.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.';
    if (tab === 'register' && f.phone && !/^\+?[\d\s-]{7,15}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
    if (tab === 'register') {
      if (f.password.length < 6) e.password = 'Use at least 6 characters.';
      if (f.confirm !== f.password) e.confirm = 'Passwords do not match.';
      if (!f.agree) e.agree = 'Please accept the terms to continue.';
    } else if (!f.password) e.password = 'Enter your password.';
    setErr(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setFormErr('');
    if (!validate()) return;
    setBusy(true);
    try {
      if (tab === 'register') await register(f);
      else await login(f);
      nav(from || '/dashboard', { replace: true });
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', py: { xs: 3, md: 6 }, px: 2 }}>
      <Background />
      <Tooltip title={mode === 'dark' ? 'Light theme' : 'Dark theme'}>
        <IconButton onClick={toggleMode} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      <Card sx={{ width: '100%', maxWidth: 1080, mx: 'auto', position: 'relative', zIndex: 1, overflow: 'hidden', animation: 'txrise .6s cubic-bezier(.2,.8,.2,1) both' }}>
        <Grid container>
          <Grid
            item
            md={6}
            sx={{
              display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', p: 5, minHeight: 620, position: 'relative',
              backgroundImage: `linear-gradient(180deg, ${theme.palette.mode === 'dark' ? 'rgba(10,16,34,.15), rgba(10,16,34,.92)' : 'rgba(238,241,251,.1), rgba(238,241,251,.94)'}), url(${heroUrl ?? ''})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          >
            <Logo size={52} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                THE AI SKILLS ACADEMY FOR REAL PEOPLE
              </Typography>
              <Typography variant="h2" sx={{ fontSize: 44, my: 1 }}>
                Learn AI Skills.{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  Build What&apos;s Next.
                </Box>
              </Typography>
              <Typography color="text.secondary">45 practical courses and challenges, a personal dashboard and course picks made for you.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ p: { xs: 3, sm: 5 } }}>
            <Box sx={{ display: { md: 'none' }, mb: 3 }}>
              <Logo size={46} />
            </Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {tab === 'login' ? 'Log in to pick up your courses where you left off.' : 'Join Takxila and start learning AI today.'}
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => switchTab(v)}
              variant="fullWidth"
              sx={(t) => ({ mb: 3, p: 0.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, minHeight: 0, '& .MuiTabs-indicator': { height: '100%', borderRadius: '12px', zIndex: 0, bgcolor: 'primary.main' }, '& .MuiTab-root': { zIndex: 1, minHeight: 44, borderRadius: '12px' }, '& .Mui-selected': { color: `${t.palette.primary.contrastText} !important` } })}
            >
              <Tab value="login" label="Log in" />
              <Tab value="register" label="Register" />
            </Tabs>

            {formErr && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErr}{' '}
                {/No account/.test(formErr) && (
                  <Link component="button" type="button" onClick={() => switchTab('register')} sx={{ fontWeight: 700, verticalAlign: 'baseline' }}>
                    Register now
                  </Link>
                )}
              </Alert>
            )}

            <Stack component="form" spacing={2} onSubmit={submit} noValidate>
              {tab === 'register' && (
                <TextField label="Full name" value={f.name} onChange={set('name')} error={!!err.name} helperText={err.name} autoComplete="name" autoFocus />
              )}
              <TextField label="Email" type="email" value={f.email} onChange={set('email')} error={!!err.email} helperText={err.email} autoComplete="email" autoFocus={tab === 'login'} />
              {tab === 'register' && (
                <TextField label="Phone / WhatsApp (optional)" value={f.phone} onChange={set('phone')} error={!!err.phone} helperText={err.phone} autoComplete="tel" />
              )}
              <PasswordField label="Password" value={f.password} onChange={set('password')} error={!!err.password} helperText={err.password || (tab === 'register' ? 'At least 6 characters.' : '')} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
              {tab === 'register' && (
                <PasswordField label="Confirm password" value={f.confirm} onChange={set('confirm')} error={!!err.confirm} helperText={err.confirm} autoComplete="new-password" />
              )}
              {tab === 'register' && (
                <TextField label="Referral code (optional)" value={f.refBy} onChange={set('refBy')} helperText={f.refBy ? 'Your friend gets ₹200 when you enroll, and you get ₹200 off your first order.' : 'Got a code from a friend? You get ₹200 off your first order.'} inputProps={{ style: { textTransform: 'uppercase', letterSpacing: '.12em' } }} />
              )}
              <FormControlLabel control={<Checkbox checked={f.remember} onChange={set('remember')} />} label="Keep me logged in" />
              {tab === 'register' && (
                <Box>
                  <FormControlLabel control={<Checkbox checked={f.agree} onChange={set('agree')} />} label="I agree to the Terms of use and Privacy policy" />
                  {err.agree && (
                    <Typography variant="caption" color="error" component="div">
                      {err.agree}
                    </Typography>
                  )}
                </Box>
              )}
              <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ borderRadius: '14px' }}>
                {tab === 'login' ? 'Log in' : 'Create account'}
              </Button>
              <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                {tab === 'login' ? 'New to Takxila? ' : 'Already have an account? '}
                <Link component="button" type="button" onClick={() => switchTab(tab === 'login' ? 'register' : 'login')} sx={{ fontWeight: 700, color: 'secondary.main', verticalAlign: 'baseline' }}>
                  {tab === 'login' ? 'Create an account' : 'Log in'}
                </Link>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                Demo login: accounts are saved only in this browser.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
