import { useMemo, useState } from 'react';
import { Avatar, Box, Button, Chip, Grid, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import CartIcon from '@mui/icons-material/ShoppingBagOutlined';
import RupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppSelector } from '../../store';
import { ago, collectStats, monthly, topCourses } from '../../utils/adminStats';
import BarChart from './BarChart';
import { KIND_META, panelSx } from './adminUi';


// Reference data-viz palette, slots 1-3 (validated for colour-blind separation), [light, dark].
const BLUE: [string, string] = ['#2a78d6', '#3987e5'];
const ORANGE: [string, string] = ['#eb6834', '#d95926'];
const AQUA: [string, string] = ['#1baf7a', '#199e70'];
const VIOLET: [string, string] = ['#4a3aa7', '#9085e9'];

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
const short = (n: number) => (n >= 100000 ? (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

/** Admin > Dashboard: the headline numbers, enrolments and revenue by month, top courses, deadlines and recent activity. */
export default function AdminOverview({ go }: { go: (tab: string) => void }) {
  const users = useAppSelector((s) => s.auth.users);
  const grants = useAppSelector((s) => s.admin.grants);
  const log = useAppSelector((s) => s.log.items);
  const [months, setMonths] = useState(6);
  const [tick, setTick] = useState(0);

  // Re-read every account when people sign up, buy or the admin presses Refresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = useMemo(() => collectStats(users, grants), [users, grants, log.length, tick]);
  const series = useMemo(() => monthly(rows, months), [rows, months]);
  const top = useMemo(() => topCourses(rows), [rows]);

  const all = rows.flatMap((r) => r.enrolments);
  const now = Date.now();
  const thisMonth = new Date().toISOString().slice(0, 7);
  const kpi = {
    learners: rows.length,
    newThisMonth: rows.filter((r) => r.user.createdAt.startsWith(thisMonth)).length,
    active: rows.filter((r) => r.lastSeen && now - new Date(r.lastSeen).getTime() < 7 * 86_400_000).length,
    enrolments: all.length,
    bought: all.filter((e) => e.how === 'bought').length,
    revenue: rows.reduce((n, r) => n + r.spent, 0),
    completion: all.length ? Math.round((100 * all.filter((e) => e.status === 'completed').length) / all.length) : 0,
  };
  const attention = rows
    .flatMap((r) => r.enrolments.filter((e) => e.status === 'overdue' || e.status === 'due-soon').map((e) => ({ r, e })))
    .sort((a, b) => a.e.left - b.e.left)
    .slice(0, 6);

  const tiles: [string, string, string, JSX.Element, string][] = [
    ['Learners', String(kpi.learners), `+${kpi.newThisMonth} this month`, <PeopleIcon key="i" />, '#4F6BFF'],
    ['Active in 7 days', String(kpi.active), kpi.learners ? `${Math.round((100 * kpi.active) / kpi.learners)}% of learners` : '—', <BoltIcon key="i" />, '#F97316'],
    ['Enrolments', String(kpi.enrolments), `${kpi.enrolments - kpi.bought} free or given`, <SchoolIcon key="i" />, '#0EA5E9'],
    ['Courses bought', String(kpi.bought), `${rows.reduce((n, r) => n + r.orders, 0)} orders`, <CartIcon key="i" />, '#9333EA'],
    ['Revenue', inr(kpi.revenue), 'all time, this browser', <RupeeIcon key="i" />, '#16A34A'],
    ['Completion rate', kpi.completion + '%', `${all.filter((e) => e.status === 'completed').length} finished`, <TrophyIcon key="i" />, '#F5B93F'],
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap spacing={1}>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>Live numbers from every account saved in this browser.</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup size="small" exclusive value={months} onChange={(_, v: number | null) => v && setMonths(v)} aria-label="Months shown">
            <ToggleButton value={3}>3 mo</ToggleButton>
            <ToggleButton value={6}>6 mo</ToggleButton>
            <ToggleButton value={12}>12 mo</ToggleButton>
          </ToggleButtonGroup>
          <Button size="small" startIcon={<RefreshIcon />} onClick={() => setTick((x) => x + 1)}>Refresh</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {tiles.map(([label, value, sub, icon, color]) => (
          <Grid item xs={6} md={4} lg={2} key={label}>
            <Box sx={(t) => ({ ...panelSx(t), p: { xs: 1.75, md: 2 }, height: '100%' })}>
              <Box sx={{ width: 36, height: 36, borderRadius: '12px', display: 'grid', placeItems: 'center', color: '#fff', background: color, mb: 1.25, '& svg': { fontSize: 20 } }}>{icon}</Box>
              <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, lineHeight: 1.1 }}>{value}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.25 }}>{label}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>{sub}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Box sx={panelSx}>
            <Typography variant="h6">Enrolments per month</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13.5, mb: 1.5 }}>How many courses learners joined each month, and how they got them.</Typography>
            <BarChart
              labels={series.map((p) => p.label)}
              series={[
                { key: 'bought', label: 'Bought', color: BLUE, values: series.map((p) => p.bought) },
                { key: 'given', label: 'Given by admin', color: ORANGE, values: series.map((p) => p.given) },
                { key: 'free', label: 'Free', color: AQUA, values: series.map((p) => p.free) },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Box sx={panelSx}>
            <Typography variant="h6">Revenue per month</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13.5, mb: 1.5 }}>Total paid on orders, in rupees.</Typography>
            <BarChart labels={series.map((p) => p.label)} series={[{ key: 'revenue', label: 'Revenue', color: VIOLET, values: series.map((p) => p.revenue) }]} format={short} />
          </Box>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Box sx={panelSx}>
            <Typography variant="h6">New learners per month</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13.5, mb: 1.5 }}>Accounts created each month.</Typography>
            <BarChart labels={series.map((p) => p.label)} series={[{ key: 'signups', label: 'Signed up', color: BLUE, values: series.map((p) => p.signups) }]} height={180} />
          </Box>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Box sx={panelSx}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Top courses</Typography>
            {top.length === 0 ? (
              <Typography color="text.secondary">No enrolments yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {top.map((c) => (
                  <Box key={c.id}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={{ xs: 0, sm: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>{c.title}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 13, flexShrink: 0 }}>{c.enrolled} enrolled · {c.bought} bought · {c.completed} done</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(100 * c.enrolled) / top[0].enrolled} sx={{ height: 8, borderRadius: 99, mt: 0.5 }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={panelSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6">Deadlines to watch</Typography>
              <Button size="small" onClick={() => go('users')}>All users</Button>
            </Stack>
            {attention.length === 0 ? (
              <Typography color="text.secondary">Nobody is close to their deadline.</Typography>
            ) : (
              <Stack spacing={1.25}>
                {attention.map(({ r, e }) => (
                  <Stack key={r.user.email + e.id} direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={r.user.avatar} sx={{ width: 34, height: 34, fontSize: 14 }}>{r.user.name[0]}</Avatar>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>{r.user.name}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 12.5 }} noWrap>{e.title} · {e.pct}% done</Typography>
                    </Box>
                    <Chip size="small" color={e.left < 0 ? 'error' : 'warning'} label={e.left < 0 ? `${-e.left} d overdue` : `${e.left} d left`} />
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={panelSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6">Recent activity</Typography>
              <Button size="small" onClick={() => go('activity')}>See all</Button>
            </Stack>
            {log.length === 0 ? (
              <Typography color="text.secondary">Nothing yet. Changes and sign-ups show up here.</Typography>
            ) : (
              <Stack spacing={1.25}>
                {log.slice(0, 6).map((e) => {
                  const m = KIND_META[e.kind];
                  return (
                    <Stack key={e.id} direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 30, height: 30, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: m.color, color: '#fff', flexShrink: 0, '& svg': { fontSize: 17 } }}>{m.icon}</Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600 }} noWrap>{e.text}</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 12 }} noWrap>{e.who ? e.who + ' · ' : ''}{ago(e.at)}</Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}
