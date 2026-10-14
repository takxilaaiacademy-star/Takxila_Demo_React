import { useMemo, useState } from 'react';
import { Autocomplete, Box, Button, Chip, Container, Grid, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyIcon from '@mui/icons-material/VpnKeyOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayIcon from '@mui/icons-material/SmartDisplayOutlined';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStoreActions } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { courseById } from '../data/recommend';
import { DEFAULT_PLAYER_URL, PLAYER_URLS, isAllowedPlayerUrl } from '../data/player';
import { useAppDispatch, useAppSelector } from '../store';
import { adminActions } from '../store/adminSlice';
import { normEmail } from '../store/authThunks';
import type { UserData } from '../types';
import { load, save } from '../utils/storage';

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const OPTIONS = [...COURSES].sort((a, b) => a.title.localeCompare(b.title));

/** Admin area: give a learner access to courses by email, set the player link per course, see who has joined. */
export default function Admin() {
  const { isAdmin, isAdminAccount } = useAuth();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'access' | 'players' | 'learners'>('access');

  if (!isAdminAccount) return <Navigate to="/home" replace />;

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <AdminIcon sx={{ fontSize: 56, color: 'secondary.main' }} />
        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>You are in User mode</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>The site looks the way a learner sees it. Switch back to manage courses and access.</Typography>
        <Button variant="contained" size="large" onClick={() => dispatch(adminActions.modeSet('admin'))}>Switch to Admin mode</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: '16px', display: 'grid', placeItems: 'center', color: '#0A1022', background: 'linear-gradient(135deg,#F5B93F,#FFD98A)' }}>
          <AdminIcon />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: 26, md: 34 } }}>Admin</Typography>
          <Typography color="text.secondary">Give access, set course players, see your learners.</Typography>
        </Box>
      </Stack>

      <Tabs value={tab} onChange={(_, v: typeof tab) => setTab(v)} variant="scrollable" sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab value="access" icon={<KeyIcon fontSize="small" />} iconPosition="start" label="Give access" />
        <Tab value="players" icon={<PlayIcon fontSize="small" />} iconPosition="start" label="Course players" />
        <Tab value="learners" icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="Learners" />
      </Tabs>

      {tab === 'access' && <AccessTab />}
      {tab === 'players' && <PlayersTab />}
      {tab === 'learners' && <LearnersTab />}
    </Container>
  );
}

const panelSx = (t: import('@mui/material').Theme) => ({ p: { xs: 2, md: 3 }, borderRadius: '22px', background: t.tx.surface, border: `1px solid ${t.tx.line}`, backdropFilter: 'blur(22px)' });

function AccessTab() {
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const grants = useAppSelector((s) => s.admin.grants);
  const [email, setEmail] = useState('');
  const [picked, setPicked] = useState<typeof OPTIONS>([]);
  const [err, setErr] = useState('');

  const give = () => {
    const e = normEmail(email);
    if (!EMAIL_RE.test(e)) return setErr('Enter a valid email address.');
    if (!picked.length) return setErr('Choose at least one course.');
    dispatch(adminActions.accessGranted({ email: e, ids: picked.map((c) => c.id) }));
    setErr('');
    toast(`Access given to ${e}: ${picked.length} course${picked.length > 1 ? 's' : ''}.`);
    setEmail('');
    setPicked([]);
  };
  const entries = Object.entries(grants) as [string, string[]][];
  // Taking access away also removes that course from the learner's saved account (unless they paid for it).
  const revoke = (em: string, id: string) => {
    dispatch(adminActions.accessRevoked({ email: em, id }));
    const d = load<Partial<UserData>>('user_' + em, {});
    if (d.owned?.includes(id) && !d.orders?.some((o) => o.items.some((i) => i.id === id))) {
      save('user_' + em, { ...d, owned: d.owned.filter((x) => x !== id) });
    }
    toast(`Access removed for ${em}.`);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Box sx={panelSx}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Give a learner access</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
            The courses unlock in their account the next time they log in with this email.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Learner's email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={OPTIONS}
              value={picked}
              onChange={(_, v) => setPicked(v)}
              getOptionLabel={(c) => c.title}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderTags={(v, getTagProps) => v.map((c, i) => <Chip {...getTagProps({ index: i })} key={c.id} size="small" label={c.title.length > 28 ? c.title.slice(0, 27) + '…' : c.title} />)}
              renderInput={(p) => <TextField {...p} label="Courses" placeholder={picked.length ? '' : 'Search a course'} />}
            />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => setPicked(OPTIONS)}>Select all courses</Button>
              <Button size="small" onClick={() => setPicked([])} disabled={!picked.length}>Clear</Button>
            </Stack>
            {err && <Typography color="error" sx={{ fontSize: 13 }}>{err}</Typography>}
            <Button variant="contained" size="large" onClick={give}>Give access</Button>
          </Stack>
        </Box>
      </Grid>

      <Grid item xs={12} md={7}>
        <Box sx={panelSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>Access you have given ({entries.length})</Typography>
          {entries.length === 0 ? (
            <Typography color="text.secondary">No one yet. Add an email on the left to get started.</Typography>
          ) : (
            <Stack spacing={2}>
              {entries.map(([em, ids]) => (
                <Box key={em} sx={(t) => ({ p: 1.75, borderRadius: '16px', border: `1px solid ${t.tx.line}` })}>
                  <Typography sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-all' }}>{em}</Typography>
                  <Stack direction="row" gap={0.75} flexWrap="wrap">
                    {ids.map((id) => (
                      <Chip
                        key={id}
                        size="small"
                        label={courseById(id)?.title ?? id}
                        onDelete={() => revoke(em, id)}
                        sx={{ maxWidth: '100%' }}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

function PlayersTab() {
  const dispatch = useAppDispatch();
  const urls = useAppSelector((s) => s.admin.playerUrls);
  const [q, setQ] = useState('');
  const list = useMemo(() => OPTIONS.filter((c) => c.title.toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <Box sx={panelSx}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Course players</Typography>
      <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
        Learners watch the lesson inside the site. Paste the academy link for a course here. Empty means the default link is used. Only https links on takxila.in are accepted.
      </Typography>
      <TextField size="small" placeholder="Search a course" value={q} onChange={(e) => setQ(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <Stack spacing={1.5}>
        {list.map((c) => (
          <PlayerRow key={c.id + (urls[c.id] ?? '')} id={c.id} title={c.title} value={urls[c.id] ?? ''} builtIn={PLAYER_URLS[c.id] ?? DEFAULT_PLAYER_URL} onSave={(url) => dispatch(adminActions.playerUrlSet({ id: c.id, url }))} />
        ))}
      </Stack>
    </Box>
  );
}

function PlayerRow({ id, title, value, builtIn, onSave }: { id: string; title: string; value: string; builtIn: string; onSave: (url: string) => void }) {
  const [v, setV] = useState(value);
  const bad = v.trim() !== '' && !isAllowedPlayerUrl(v.trim());
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} data-course={id}>
      <Typography sx={{ fontWeight: 700, fontSize: 14, width: { md: 280 }, flexShrink: 0 }}>{title}</Typography>
      <TextField
        size="small"
        fullWidth
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder={builtIn}
        error={bad}
        helperText={bad ? 'Use an https link on takxila.in' : ' '}
        FormHelperTextProps={{ sx: { mt: 0.25 } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <Tooltip title="Use the default link">
                  <IconButton size="small" onClick={() => onSave('')} aria-label="Reset to default"><RestartAltIcon fontSize="small" /></IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Button variant="outlined" size="small" disabled={bad || v.trim() === value} onClick={() => onSave(v)}>Save</Button>
    </Stack>
  );
}

function LearnersTab() {
  const users = useAppSelector((s) => s.auth.users);
  const grants = useAppSelector((s) => s.admin.grants);
  const rows = users
    .filter((u) => u.role !== 'admin')
    .map((u) => {
      const d = load<Partial<UserData>>('user_' + u.email, {});
      return { ...u, owned: d.owned?.length ?? 0, granted: grants[u.email]?.length ?? 0 };
    });
  return (
    <Box sx={panelSx}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Learners in this browser ({rows.length})</Typography>
      <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>Accounts are saved in the browser they sign up in. See the README for how to connect a server.</Typography>
      {rows.length === 0 ? (
        <Typography color="text.secondary">No learners have signed up in this browser yet.</Typography>
      ) : (
        <Stack spacing={1}>
          {rows.map((u) => (
            <Stack key={u.id} direction="row" spacing={2} alignItems="center" sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}` })}>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }} noWrap>{u.name}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }} noWrap>{u.email}</Typography>
              </Box>
              <Chip size="small" label={`${u.owned} course${u.owned === 1 ? '' : 's'}`} />
              {u.granted > 0 && <Chip size="small" color="secondary" label={`${u.granted} from you`} />}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
