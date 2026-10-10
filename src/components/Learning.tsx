// Learner widgets: dashboard side menu, streaks, calendar, leaderboard and enrolled course cards.
import { memo, useMemo, useState, type ReactNode } from 'react';
import { Avatar, Box, Button, IconButton, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcardOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgentOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EventIcon from '@mui/icons-material/EventOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlayCircleIcon from '@mui/icons-material/PlayCircleFilledRounded';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { activeDays, dayKey, durationText, hoursFrom, LEADERS, streaks } from '../data/showcase';
import { translate, type StrKey } from '../data/i18n';
import { load } from '../utils/storage';
import type { Course, UserData } from '../types';
import { CourseIcon } from './CourseIcon';

const SIDE: [StrKey, string, typeof DashboardIcon][] = [
  ['dashboard', '/dashboard', DashboardIcon],
  ['certificates', '/certificates', WorkspacePremiumIcon],
  ['refer', '/refer', CardGiftcardIcon],
  ['resume', '/resume', DescriptionIcon],
  ['leaderboard', '/leaderboard', LeaderboardIcon],
  ['mentorship', '/mentorship', SchoolIcon],
  ['purchases', '/purchases', ReceiptIcon],
];

export const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** Dashboard pages share a side menu on desktop and a scrolling tab row on phones. */
export function DashShell({ children }: { children: ReactNode }) {
  const user = useUser();
  const { prefs } = useStore();
  const t = (k: StrKey) => translate(prefs.lang, k);
  const link = (to: string, label: string, Icon: typeof DashboardIcon, compact = false) => (
    <Box
      key={to}
      component={NavLink}
      to={to}
      end
      sx={(th) => ({
        display: 'flex', alignItems: 'center', gap: 1.25, px: compact ? 1.5 : 2, py: compact ? 0.9 : 1.25, borderRadius: '12px', textDecoration: 'none', color: 'text.secondary',
        fontWeight: 600, whiteSpace: 'nowrap', flex: 'none', border: compact ? `1px solid ${th.tx.line}` : '1px solid transparent', transition: 'all .25s',
        '&:hover': { color: 'text.primary', background: th.tx.surface, transform: compact ? 'none' : 'translateX(4px)' },
        '&.active': { color: 'secondary.main', background: th.palette.mode === 'dark' ? 'rgba(245,185,63,.12)' : 'rgba(43,43,214,.08)', borderColor: compact ? th.tx.hl : 'transparent' },
        '&.active svg': { transform: 'scale(1.12)' },
        '& svg': { transition: 'transform .3s' },
      })}
    >
      <Icon fontSize="small" />
      {label}
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <Box
        component="nav"
        aria-label="Dashboard"
        sx={(th) => ({
          display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 0.5, width: 220, flex: 'none', position: 'sticky', top: 96, p: 1.5,
          borderRadius: '20px', border: `1px solid ${th.tx.line}`, background: th.tx.surface, backdropFilter: 'blur(18px)', animation: 'txrise .5s both',
        })}
      >
        {SIDE.map(([k, to, Icon]) => link(to, t(k), Icon))}
        <Box sx={{ flexGrow: 1, minHeight: 24 }} />
        {link('/helpdesk', t('support'), SupportAgentIcon)}
        <Stack direction="row" spacing={1} alignItems="center" sx={(th) => ({ mt: 1, p: 1, borderRadius: '12px', border: `1px solid ${th.tx.line}` })}>
          <Avatar src={user.avatar} sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}>
            {initials(user.name)}
          </Avatar>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>
            {user.name.split(' ')[0]}
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box component="nav" aria-label="Dashboard" sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, overflowX: 'auto', pb: 1.5, mb: 1, mx: -0.5, px: 0.5 }}>
          {SIDE.map(([k, to, Icon]) => link(to, t(k), Icon, true))}
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export function Panel({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box sx={(t) => ({ p: { xs: 2, md: 2.5 }, borderRadius: '20px', border: `1px solid ${t.tx.line}`, background: t.tx.surface, backdropFilter: 'blur(18px)', ...sx })}>{children}</Box>
  );
}

/** Current and longest streak tiles. */
export function StreakTiles() {
  const { activity, visits } = useStore();
  const { current, longest } = useMemo(() => streaks(activeDays(activity, visits)), [activity, visits]);
  return (
    <Stack direction="row" spacing={1.5}>
      {(
        [
          ['Learning streak', current, true],
          ['Longest streak', longest, false],
        ] as const
      ).map(([label, n, fire]) => (
        <Panel key={label} sx={{ flex: 1, p: 1.75 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {fire && <LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#FF8A3D', animation: n ? 'txfloat 1.6s ease-in-out infinite' : 'none' }} />}
            {label}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
            {n}{' '}
            <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
              {n === 1 ? 'Day' : 'Days'}
            </Box>
          </Typography>
        </Panel>
      ))}
    </Stack>
  );
}

/** Month calendar with the days you learned marked. */
export function StreakCalendar() {
  const { activity, visits } = useStore();
  const days = useMemo(() => activeDays(activity, visits), [activity, visits]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = dayKey(new Date());
  const lead = (month.getDay() + 6) % 7; // Monday first
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  return (
    <Panel>
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <IconButton size="small" onClick={() => shift(-1)} aria-label="Previous month">
          <ChevronLeftIcon />
        </IconButton>
        <Typography key={month.toISOString()} sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 700, animation: 'txfade .3s both' }}>
          {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton size="small" onClick={() => shift(1)} aria-label="Next month">
          <ChevronRightIcon />
        </IconButton>
      </Stack>
      <Box key={month.toISOString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center', animation: 'txfade .35s both' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <Typography key={i} variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {d}
          </Typography>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={'b' + i} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const k = dayKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
          const on = days.has(k);
          const isToday = k === today;
          return (
            <Tooltip key={k} title={on ? 'You learned on this day' : ''} disableInteractive>
              <Box
                sx={(t) => ({
                  aspectRatio: '1', display: 'grid', placeItems: 'center', borderRadius: '50%', fontSize: 13, position: 'relative',
                  fontWeight: on || isToday ? 800 : 500, color: on ? 'primary.contrastText' : 'text.primary',
                  bgcolor: on ? 'primary.main' : 'transparent', border: isToday ? `2px solid ${t.tx.hl}` : '2px solid transparent',
                  boxShadow: on ? `0 4px 14px ${t.tx.glow}` : 'none',
                })}
              >
                {i + 1}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Panel>
  );
}

export interface LeaderRow {
  name: string;
  hours: number;
  you: boolean;
}

/** Demo learners, everyone registered in this browser, and you, ranked by learning hours. */
export function useLeaderboard(mode: 'weekly' | 'overall'): LeaderRow[] {
  const { members, user } = useAuth();
  const { activity } = useStore();
  return useMemo(() => {
    const since = mode === 'weekly' ? Date.now() - 7 * 864e5 : undefined;
    const rows: LeaderRow[] = LEADERS.map(([name, week, all]) => ({ name, hours: mode === 'weekly' ? week : all, you: false }));
    members.forEach((m) => {
      const mine = m.email === user?.email;
      const acts = mine ? activity : load<Partial<UserData>>('user_' + m.email, {}).activity || [];
      rows.push({ name: m.name, hours: Math.round(hoursFrom(acts, since) * 10) / 10, you: mine });
    });
    return rows.sort((a, b) => b.hours - a.hours || +b.you - +a.you);
  }, [mode, members, user?.email, activity]);
}

const MEDALS = ['#F5B93F', '#C0C7DE', '#CD7F32'];

export function LeaderboardList({ limit, mode: fixed }: { limit?: number; mode?: 'weekly' | 'overall' }) {
  const [mode, setMode] = useState<'weekly' | 'overall'>(fixed ?? 'overall');
  const rows = useLeaderboard(fixed ?? mode);
  const youAt = rows.findIndex((r) => r.you);
  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <Box>
      {!fixed && (
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Leaderboard
          </Typography>
          <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)} color="secondary">
            <ToggleButton value="weekly" sx={{ px: 1.5, py: 0.25, fontWeight: 700, textTransform: 'none' }}>
              Weekly
            </ToggleButton>
            <ToggleButton value="overall" sx={{ px: 1.5, py: 0.25, fontWeight: 700, textTransform: 'none' }}>
              Overall
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}
      <Stack spacing={0.75} key={mode} sx={{ maxHeight: limit ? 300 : undefined, overflowY: limit ? 'auto' : undefined, pr: limit ? 0.5 : 0 }}>
        {shown.map((r, i) => (
          <Stack
            key={r.name + i}
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={(t) => ({
              px: 1.5, py: 1, borderRadius: '12px', animation: `txrise .4s ${Math.min(i, 12) * 40}ms both`,
              border: `1px solid ${r.you ? t.tx.hl : t.tx.line}`, background: r.you ? (t.palette.mode === 'dark' ? 'rgba(245,185,63,.12)' : 'rgba(43,43,214,.07)') : t.tx.surface,
            })}
          >
            {i < 3 ? <EmojiEventsIcon sx={{ color: MEDALS[i], fontSize: 22 }} /> : <Typography sx={{ width: 22, textAlign: 'center', fontWeight: 800, color: 'text.secondary', fontSize: 13 }}>#{i + 1}</Typography>}
            <Typography noWrap sx={{ flexGrow: 1, fontWeight: r.you ? 800 : 600, fontSize: 14, color: i < 3 ? 'secondary.main' : 'text.primary' }}>
              {r.name}
              {r.you ? ' (you)' : ''}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#FF8A3D' }}>
              <ScheduleIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{r.hours} hr</Typography>
            </Stack>
          </Stack>
        ))}
        {limit && youAt >= limit && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 0.5 }}>
            You are #{youAt + 1}. Complete lessons to climb.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

const ordinal = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
export const enrolledOn = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return ordinal(d.getDate()) + ' ' + d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

/** Enrolled course card: icon, star, enrolled date, progress and a Start learning button. */
export const EnrolledCard = memo(function EnrolledCard({ c, pct, at, fav, onFav, index }: { c: Course; pct: number; at?: string; fav: boolean; onFav: (id: string) => void; index: number }) {
  const nav = useNavigate();
  return (
    <Box
      sx={(t) => ({
        width: { xs: 260, sm: 280 }, flex: 'none', scrollSnapAlign: 'start', p: 2, borderRadius: '18px', border: `1px solid ${t.tx.line}`, background: t.tx.surface,
        display: 'flex', flexDirection: 'column', gap: 1.25, animation: `txrise .45s ${index * 60}ms both`, transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s',
        '&:hover': { transform: 'translateY(-5px)', borderColor: t.tx.hl, boxShadow: `0 20px 44px ${t.tx.glow}` },
        '&:hover .tx-cicon': { transform: 'rotate(-8deg) scale(1.08)' },
      })}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <CourseIcon c={c} size={44} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.title}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: 13 }} /> {durationText(c)}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => onFav(c.id)} aria-label={fav ? 'Remove star' : 'Star this course'} sx={{ color: fav ? '#F5B93F' : 'text.secondary' }}>
          {fav ? <StarIcon sx={{ animation: 'txpop .35s both' }} /> : <StarBorderIcon />}
        </IconButton>
      </Stack>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
        <EventIcon sx={{ fontSize: 16, color: 'secondary.main' }} /> Enrolled on {enrolledOn(at)}
      </Typography>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LinearProgress variant="determinate" value={pct} color="secondary" sx={{ flexGrow: 1 }} />
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: 'success.main', minWidth: 34, textAlign: 'right' }}>{pct}%</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Course progress
        </Typography>
      </Box>
      <Button variant="contained" endIcon={<PlayCircleIcon />} onClick={() => nav('/courses/' + c.id)}>
        {pct >= 100 ? 'Review course' : pct ? 'Continue learning' : 'Start learning'}
      </Button>
    </Box>
  );
});
