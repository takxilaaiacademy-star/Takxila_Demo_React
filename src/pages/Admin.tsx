import { lazy, Suspense, useMemo, useState } from 'react';
import { Autocomplete, Box, Button, Chip, CircularProgress, Container, Grid, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyIcon from '@mui/icons-material/VpnKeyOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import PlayIcon from '@mui/icons-material/SmartDisplayOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import BackupIcon from '@mui/icons-material/BackupOutlined';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import HistoryIcon from '@mui/icons-material/HistoryRounded';
import MailIcon from '@mui/icons-material/MailOutlineRounded';
import OrdersIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Navigate, useSearchParams } from 'react-router-dom';
import { panelSx } from '../components/admin/adminUi';

// Each tab is its own small file, downloaded the first time it is opened, so the admin panel opens fast.
const AdminOverview = lazy(() => import('../components/admin/AdminOverview'));
const AdminUsers = lazy(() => import('../components/admin/AdminUsers'));
const AdminOrders = lazy(() => import('../components/admin/AdminOrders'));
const AdminActivity = lazy(() => import('../components/admin/AdminActivity'));
const AdminEmails = lazy(() => import('../components/admin/AdminEmails'));
const AdminBackup = lazy(() => import('../components/admin/AdminBackup'));
const AdminCourses = lazy(() => import('../components/admin/AdminCourses'));
const AdminSite = lazy(() => import('../components/admin/AdminSite'));
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
// Read from the live list (the admin can add, hide and rename courses), so it is a function, not a constant.
const optionsNow = () => [...COURSES].sort((a, b) => a.title.localeCompare(b.title));
type Tab = 'overview' | 'users' | 'orders' | 'courses' | 'access' | 'players' | 'activity' | 'emails' | 'site' | 'backup';
const TABS: Tab[] = ['overview', 'users', 'orders', 'courses', 'access', 'players', 'activity', 'emails', 'site', 'backup'];
/** Admin tabs: [id, label, icon]. The navbar's admin menu links to the same ids. */
export const ADMIN_TABS: [Tab, string][] = [
  ['overview', 'Dashboard'], ['users', 'Users'], ['orders', 'Orders'], ['courses', 'Courses'], ['access', 'Give access'], ['players', 'Course players'],
  ['activity', 'Activity'], ['emails', 'Emails'], ['site', 'Navbar & banner'], ['backup', 'Backup & restore'],
];
const ICONS: Record<Tab, JSX.Element> = {
  overview: <DashboardIcon fontSize="small" />, users: <PeopleIcon fontSize="small" />, orders: <OrdersIcon fontSize="small" />, courses: <SchoolIcon fontSize="small" />, access: <KeyIcon fontSize="small" />,
  players: <PlayIcon fontSize="small" />, activity: <HistoryIcon fontSize="small" />, emails: <MailIcon fontSize="small" />, site: <MenuOpenIcon fontSize="small" />, backup: <BackupIcon fontSize="small" />,
};

/** Admin area: edit courses and the navbar, give access, set course players, see who has joined, back everything up. */
export default function Admin() {
  const { isAdmin, isAdminAccount } = useAuth();
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const q = (raw === 'learners' ? 'users' : raw) as Tab | null;
  const tab: Tab = q && TABS.includes(q) ? q : 'overview';
  const setTab = (t: string) => setParams({ tab: t }, { replace: true });

  if (!isAdminAccount) return <Navigate to="/home" replace />;

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <AdminIcon sx={{ fontSize: 56, color: 'secondary.main' }} />
        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>You are in User mode</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>The site looks the way a learner sees it. Switch back to manage courses and access.</Typography>
        <Button variant="contained" size="large" onClick={() => dispatch(adminActions.modeSet('admin'))}>Back to Admin mode</Button>
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
          <Typography color="text.secondary">Your learners, numbers, courses and content in one place. No developer needed.</Typography>
        </Box>
      </Stack>

      <Tabs value={tab} onChange={(_, v: Tab) => setTab(v)} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        {ADMIN_TABS.map(([id, label]) => <Tab key={id} value={id} icon={ICONS[id]} iconPosition="start" label={label} />)}
      </Tabs>

      <Suspense fallback={<Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress color="secondary" /></Box>}>
        {tab === 'overview' && <AdminOverview go={setTab} />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'courses' && <AdminCourses />}
        {tab === 'access' && <AccessTab />}
        {tab === 'players' && <PlayersTab />}
        {tab === 'activity' && <AdminActivity />}
        {tab === 'emails' && <AdminEmails />}
        {tab === 'site' && <AdminSite />}
        {tab === 'backup' && <AdminBackup />}
      </Suspense>
    </Container>
  );
}


function AccessTab() {
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const grants = useAppSelector((s) => s.admin.grants);
  const users = useAppSelector((s) => s.auth.users);
  const rev = useAppSelector((s) => s.site.rev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const OPTIONS = useMemo(optionsNow, [rev]);
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
  // Everybody who has an account in this browser (the admin account excluded).
  const giveEveryone = () => {
    if (!picked.length) return setErr('Choose at least one course.');
    const learners = users.filter((u) => u.role !== 'admin');
    if (!learners.length) return setErr('No learner has signed up in this browser yet. Use "Open access" in the Courses tab to let everybody watch, including people who sign up later.');
    learners.forEach((u) => dispatch(adminActions.accessGranted({ email: u.email, ids: picked.map((c) => c.id) })));
    setErr('');
    toast(`${picked.length} course${picked.length > 1 ? 's' : ''} given to ${learners.length} learner${learners.length > 1 ? 's' : ''}.`);
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
            <Button variant="outlined" onClick={giveEveryone}>Give these courses to ALL current learners</Button>
            <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>For people who sign up later too, turn on "Open access" for the course in the Courses tab.</Typography>
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
  const rev = useAppSelector((s) => s.site.rev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => optionsNow().filter((c) => c.title.toLowerCase().includes(q.toLowerCase())), [q, rev]);

  return (
    <Box sx={panelSx}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Course players</Typography>
      <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
        Learners watch the lesson inside the site. Paste the link for a course here: an academy link, or a YouTube, Vimeo or Google Drive share link (converted for you). Empty means the default link is used. Only https links are accepted.
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
        helperText={bad ? 'Use a link that starts with https://' : ' '}
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
