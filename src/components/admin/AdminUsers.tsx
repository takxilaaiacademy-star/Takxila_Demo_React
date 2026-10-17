import { memo, useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Button, Chip, Collapse, Grid, InputAdornment, LinearProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import ExpandIcon from '@mui/icons-material/ExpandMoreRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppSelector } from '../../store';
import { ago, collectStats, csv, download, type Enrolment, type LearnerRow } from '../../utils/adminStats';
import { panelSx } from './adminUi';

type Filter = 'all' | 'active' | 'due-soon' | 'overdue' | 'completed' | 'none';
type Sort = 'login' | 'newest' | 'courses' | 'spent' | 'deadline';

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const HOW: Record<Enrolment['how'], string> = { bought: 'Bought', given: 'Given by admin', free: 'Free' };
const nextDue = (r: LearnerRow) => r.enrolments.filter((e) => e.status !== 'completed').reduce<Enrolment | null>((m, e) => (!m || e.left < m.left ? e : m), null);

function DaysChip({ e }: { e: Enrolment }) {
  if (e.status === 'completed') return <Chip size="small" color="success" label="Completed" />;
  if (e.left < 0) return <Chip size="small" color="error" label={`${-e.left} day${e.left === -1 ? '' : 's'} overdue`} />;
  return <Chip size="small" color={e.left <= 3 ? 'error' : e.left <= 7 ? 'warning' : 'default'} variant={e.left <= 7 ? 'filled' : 'outlined'} label={`${e.left} day${e.left === 1 ? '' : 's'} left`} />;
}

/** Admin > Users: who has signed up, when they last logged in, what they are enrolled in and how many days they have left. */
export default function AdminUsers() {
  const users = useAppSelector((s) => s.auth.users);
  const grants = useAppSelector((s) => s.admin.grants);
  const logLen = useAppSelector((s) => s.log.items.length);
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('login');
  const [open, setOpen] = useState<string | null>(null);
  const [limit, setLimit] = useState(40);
  const toggle = useCallback((email: string) => setOpen((x) => (x === email ? null : email)), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useMemo(() => collectStats(users, grants), [users, grants, logLen, tick]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const week = Date.now() - 7 * 86_400_000;
    const out = rows.filter((r) => {
      if (t && !`${r.user.name} ${r.user.email} ${r.user.phone} ${r.enrolments.map((e) => e.title).join(' ')}`.toLowerCase().includes(t)) return false;
      if (filter === 'active') return !!r.lastSeen && new Date(r.lastSeen).getTime() > week;
      if (filter === 'none') return r.enrolments.length === 0;
      if (filter !== 'all') return r.enrolments.some((e) => e.status === filter);
      return true;
    });
    const key: Record<Sort, (r: LearnerRow) => number | string> = {
      login: (r) => r.lastSeen ?? '',
      newest: (r) => r.user.createdAt,
      courses: (r) => r.enrolments.length,
      spent: (r) => r.spent,
      deadline: (r) => -(nextDue(r)?.left ?? 99999),
    };
    return out.sort((a, b) => {
      const x = key[sort](a);
      const y = key[sort](b);
      return x < y ? 1 : x > y ? -1 : 0;
    });
  }, [rows, q, filter, sort]);

  const exportCsv = () =>
    download(
      'takxila-users.csv',
      csv([
        ['Name', 'Email', 'Phone', 'Joined', 'Last login', 'Logins', 'Course', 'How', 'Enrolled', 'Progress %', 'Days to complete', 'Days left', 'Status', 'Spent'],
        ...rows.flatMap((r) =>
          (r.enrolments.length ? r.enrolments : [null]).map((e) => [
            r.user.name, r.user.email, r.user.phone, r.user.createdAt.slice(0, 10), r.user.lastLoginAt?.slice(0, 16).replace('T', ' ') ?? '', r.user.logins ?? 0,
            e?.title ?? '', e ? HOW[e.how] : '', e?.at.slice(0, 10) ?? '', e?.pct ?? '', e?.days ?? '', e ? (e.status === 'completed' ? '' : e.left) : '', e?.status ?? '', r.spent,
          ]),
        ),
      ]),
    );

  return (
    <Box sx={panelSx}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Users ({rows.length})</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13.5 }}>Everyone who signed up in this browser: last login, courses, progress and days left to finish.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<RefreshIcon />} onClick={() => setTick((x) => x + 1)}>Refresh</Button>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />} disabled={!rows.length} onClick={exportCsv}>CSV</Button>
        </Stack>
      </Stack>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth placeholder="Search name, email, phone or course" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField select size="small" fullWidth label="Show" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <MenuItem value="all">Everyone</MenuItem>
            <MenuItem value="active">Active in the last 7 days</MenuItem>
            <MenuItem value="due-soon">Deadline within 7 days</MenuItem>
            <MenuItem value="overdue">Past the deadline</MenuItem>
            <MenuItem value="completed">Finished a course</MenuItem>
            <MenuItem value="none">Not enrolled yet</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField select size="small" fullWidth label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <MenuItem value="login">Last login</MenuItem>
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="courses">Most courses</MenuItem>
            <MenuItem value="spent">Most spent</MenuItem>
            <MenuItem value="deadline">Closest deadline</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {list.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>{rows.length ? 'Nobody matches.' : 'No learners have signed up in this browser yet.'}</Typography>
      ) : (
        <Stack spacing={1.25}>
          {list.slice(0, limit).map((r) => (
            <UserRow key={r.user.email} r={r} open={open === r.user.email} onToggle={toggle} />
          ))}
          {list.length > limit && <Button onClick={() => setLimit((x) => x + 40)}>Show more ({list.length - limit} left)</Button>}
        </Stack>
      )}
    </Box>
  );
}

const UserRow = memo(function UserRow({ r, open, onToggle }: { r: LearnerRow; open: boolean; onToggle: (email: string) => void }) {
  const due = nextDue(r);
  const avg = r.enrolments.length ? Math.round(r.enrolments.reduce((n, e) => n + e.pct, 0) / r.enrolments.length) : 0;
  return (
    <Box sx={(t) => ({ borderRadius: '18px', border: `1px solid ${open ? t.tx.hl : t.tx.line}`, overflow: 'hidden', transition: 'border-color .2s' })}>
      <Box
        component="button"
        type="button"
        onClick={() => onToggle(r.user.email)}
        aria-expanded={open}
        sx={(t) => ({ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', p: 1.5, display: 'block', '&:hover': { background: t.tx.surface }, '&:focus-visible': { outline: `2px solid ${t.tx.hl}` } })}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={r.user.avatar} sx={{ width: 42, height: 42, fontWeight: 800, background: 'linear-gradient(135deg,#6A3FE0,#4F6BFF)', color: '#fff' }}>{r.user.name[0]?.toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 800 }} noWrap>{r.user.name}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }} noWrap>{r.user.email}{r.user.phone ? ' · ' + r.user.phone : ''}</Typography>
          </Box>
          <Stack direction="row" gap={0.75} flexWrap="wrap" justifyContent="flex-end" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Chip size="small" variant="outlined" label={`Last login ${ago(r.lastSeen)}`} />
            <Chip size="small" label={`${r.enrolments.length} course${r.enrolments.length === 1 ? '' : 's'}`} />
            {due && <DaysChip e={due} />}
          </Stack>
          <ExpandIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'text.secondary' }} />
        </Stack>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1, display: { xs: 'flex', md: 'none' } }}>
          <Chip size="small" variant="outlined" label={`Login ${ago(r.lastSeen)}`} />
          <Chip size="small" label={`${r.enrolments.length} course${r.enrolments.length === 1 ? '' : 's'}`} />
          {due && <DaysChip e={due} />}
        </Stack>
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={(t) => ({ px: 1.5, pb: 1.5, borderTop: `1px solid ${t.tx.line}` })}>
          <Grid container spacing={1} sx={{ py: 1.5 }}>
            {[
              ['Joined', date(r.user.createdAt)],
              ['Last login', r.user.lastLoginAt ? new Date(r.user.lastLoginAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'],
              ['Logins', String(r.user.logins ?? '—')],
              ['Days active', String(r.activeDays)],
              ['Orders', `${r.orders} · ₹${r.spent.toLocaleString('en-IN')}`],
              ['Average progress', avg + '%'],
              ['Signed up with', r.user.provider ? r.user.provider[0].toUpperCase() + r.user.provider.slice(1) : 'Email'],
              ['Referral code used', r.user.refBy ?? '—'],
            ].map(([k, v]) => (
              <Grid item xs={6} md={3} key={k}>
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>{k}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{v}</Typography>
              </Grid>
            ))}
          </Grid>
          {r.enrolments.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>Not enrolled in any course yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {r.enrolments.map((e) => (
                <Box key={e.id} sx={(t) => ({ p: 1.25, borderRadius: '14px', background: t.tx.surface })}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{e.title}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>
                        {HOW[e.how]} · enrolled {date(e.at)} · {e.days} days to finish · due {date(e.due)}
                      </Typography>
                    </Box>
                    <DaysChip e={e} />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={e.pct} color={e.status === 'completed' ? 'success' : 'secondary'} sx={{ flexGrow: 1, height: 8, borderRadius: 99 }} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, width: 92, textAlign: 'right' }}>{e.done}/{e.total} · {e.pct}%</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
});
