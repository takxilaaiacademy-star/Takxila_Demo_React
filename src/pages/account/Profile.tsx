import { useRef, useState, type FormEvent } from 'react';
import { Alert, Avatar, Badge, Box, Button, Card, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Link as RouterLink } from 'react-router-dom';
import { Page } from '../../components/Section';
import { useAuth, useUser } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { courseById } from '../../data/recommend';
import { resizeImage } from '../../utils/image';
import { profileLine } from '../../data/recommend';
import FastField from '../../components/FastField';

export default function Profile() {
  const user = useUser();
  const { updateUser, changePassword } = useAuth();
  const { owned, prog, profile, orders, toast } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({ name: user.name, phone: user.phone, city: user.city ?? '', bio: user.bio ?? '' });
  const [pw, setPw] = useState({ current: '', next: '' });
  const [pwErr, setPwErr] = useState('');

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast('Please enter your name.');
    updateUser({ name: f.name.trim(), phone: f.phone.trim(), city: f.city.trim(), bio: f.bio.trim() });
    toast('Profile saved.');
  };
  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      updateUser({ avatar: await resizeImage(file) });
      toast('Profile picture updated.');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not read that image.');
    }
  };
  const savePw = async (e: FormEvent) => {
    e.preventDefault();
    setPwErr('');
    if (pw.next.length < 6) return setPwErr('Use at least 6 characters.');
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: '', next: '' });
      toast('Password changed.');
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : 'Could not change the password.');
    }
  };
  const completed = owned.filter((id) => (prog[id] || 0) >= 100).length;

  return (
    <Page>
      <Card sx={(t) => ({ p: { xs: 3, md: 4 }, mb: 3, background: `linear-gradient(120deg, ${t.tx.glow}, transparent 60%), ${t.tx.surface}` })}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Tooltip title="Change photo">
                <IconButton size="small" onClick={() => fileRef.current?.click()} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main' } }}>
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            <Avatar src={user.avatar} sx={{ width: 112, height: 112, fontSize: 40, fontWeight: 800, bgcolor: 'primary.main', color: 'primary.contrastText', border: 3, borderColor: 'secondary.main', animation: 'txpop .6s both' }}>
              {user.name[0]}
            </Avatar>
          </Badge>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">{user.name}</Typography>
            <Typography color="text.secondary">
              {user.email}
              {user.city ? ' · ' + user.city : ''}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Member since {new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
            {profile && <Chip size="small" label={profileLine(profile.ans)} sx={{ mt: 1, maxWidth: '100%' }} />}
          </Box>
          <Stack direction="row" spacing={3}>
            {[[owned.length, 'Enrolled'], [completed, 'Completed'], [orders.length, 'Orders']].map(([v, l]) => (
              <Box key={l} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: 28, color: 'secondary.main' }}>{v}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {l}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card component="form" onSubmit={save} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Edit profile
            </Typography>
            <Stack spacing={2}>
              <FastField label="Full name" value={f.name} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, name: v })); }} />
              <FastField label="Email" value={user.email} disabled helperText="Your email is your login and cannot be changed." />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FastField fullWidth label="Phone / WhatsApp" value={f.phone} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, phone: v })); }} />
                <FastField fullWidth label="City" value={f.city} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, city: v })); }} />
              </Stack>
              <FastField label="About me" multiline minRows={3} value={f.bio} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, bio: v })); }} />
              <Box>
                <Button type="submit" variant="contained">
                  Save profile
                </Button>
              </Box>
            </Stack>
          </Card>
          <Card component="form" onSubmit={savePw} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change password
            </Typography>
            {pwErr && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {pwErr}
              </Alert>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FastField fullWidth type="password" label="Current password" value={pw.current} onChange={(e) => { const v = e.target.value; setPw((s) => ({ ...s, current: v })); }} autoComplete="current-password" />
              <FastField fullWidth type="password" label="New password" value={pw.next} onChange={(e) => { const v = e.target.value; setPw((s) => ({ ...s, next: v })); }} autoComplete="new-password" />
            </Stack>
            <Button type="submit" variant="outlined" sx={{ mt: 2 }} disabled={!pw.current || !pw.next}>
              Change password
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Course details
            </Typography>
            {!owned.length && <Typography color="text.secondary">You are not enrolled in any course yet.</Typography>}
            <Stack spacing={2}>
              {owned.map((id) => {
                const c = courseById(id);
                if (!c) return null;
                return (
                  <Box key={id}>
                    <Typography component={RouterLink} to={'/courses/' + id} sx={{ fontWeight: 600, color: 'secondary.main', textDecoration: 'none', fontSize: 14 }}>
                      {c.title}
                    </Typography>
                    <LinearProgress variant="determinate" value={prog[id] || 0} sx={{ mt: 0.75 }} color={(prog[id] || 0) >= 100 ? 'success' : 'primary'} />
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
}
