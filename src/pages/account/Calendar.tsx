import { useMemo, useState } from 'react';
import { Box, Button, Card, Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { Heading, Page } from '../../components/Section';
import { useAnnouncements } from '../../context/AnnouncementsContext';
import { useStore } from '../../context/StoreContext';
import { courseById } from '../../data/recommend';

type Kind = 'enroll' | 'lesson' | 'complete' | 'purchase' | 'challenge' | 'announcement';
interface CalEvent {
  day: string; // YYYY-MM-DD
  kind: Kind;
  title: string;
  to?: string;
}
const KIND: Record<Kind, { label: string; color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'default' }> = {
  enroll: { label: 'Enrolled', color: 'primary' },
  lesson: { label: 'Lesson', color: 'info' },
  complete: { label: 'Completed', color: 'success' },
  purchase: { label: 'Purchase', color: 'warning' },
  challenge: { label: 'Challenge day', color: 'secondary' },
  announcement: { label: 'Announcement', color: 'default' },
};
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const nav = useNavigate();
  const { activity, owned, enrolledAt } = useStore();
  const { items: anns } = useAnnouncements();
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [picked, setPicked] = useState(ymd(new Date()));

  const events = useMemo(() => {
    const list: CalEvent[] = [];
    activity.forEach((a) => {
      const c = courseById(a.courseId);
      const name = c?.title.split(':')[0] ?? '';
      if (a.type === 'purchase') list.push({ day: ymd(new Date(a.at)), kind: 'purchase', title: 'Order ' + (a.detail ?? ''), to: '/purchases' });
      else list.push({ day: ymd(new Date(a.at)), kind: a.type, title: a.type === 'lesson' ? `${a.detail} · ${name}` : name, to: '/courses/' + a.courseId });
    });
    // Daily challenges: one entry per day from the enrolment date.
    owned.forEach((id) => {
      const c = courseById(id);
      const m = c && /(\d+)\s*Days/i.exec(c.meta[0]);
      if (!c || !m || !enrolledAt[id]) return;
      const start = new Date(enrolledAt[id]);
      for (let i = 0; i < +m[1]; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        list.push({ day: ymd(d), kind: 'challenge', title: `Day ${i + 1} of ${m[1]} · ${c.title}`, to: '/courses/' + id });
      }
    });
    anns.forEach((a) => list.push({ day: ymd(new Date(a.at)), kind: 'announcement', title: a.title, to: '/announcements#' + a.id }));
    return list;
  }, [activity, owned, enrolledAt, anns]);

  const byDay = useMemo(() => {
    const m = new Map<string, CalEvent[]>();
    events.forEach((e) => m.set(e.day, [...(m.get(e.day) ?? []), e]));
    return m;
  }, [events]);

  const first = (month.getDay() + 6) % 7; // Monday first
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, i) => (i < first || i >= first + days ? null : new Date(month.getFullYear(), month.getMonth(), i - first + 1)));
  const today = ymd(new Date());
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const dayEvents = byDay.get(picked) ?? [];

  return (
    <Page>
      <Heading kick="CALENDAR" title="Your learning" hl="calendar" sub="Enrolments, lessons, challenge days, purchases and announcements." />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
              <IconButton onClick={() => shift(-1)} aria-label="Previous month">
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  const d = new Date();
                  setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                  setPicked(today);
                }}
              >
                Today
              </Button>
              <IconButton onClick={() => shift(1)} aria-label="Next month">
                <ChevronRightIcon />
              </IconButton>
            </Stack>
            <Box key={month.toISOString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.75, animation: 'txfade .35s both' }}>
              {WEEK.map((w) => (
                <Typography key={w} variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 700 }}>
                  {w}
                </Typography>
              ))}
              {cells.map((d, i) => {
                if (!d) return <Box key={i} />;
                const key = ymd(d);
                const ev = byDay.get(key) ?? [];
                const sel = key === picked;
                return (
                  <Box
                    key={i}
                    onClick={() => setPicked(key)}
                    sx={(t) => ({
                      minHeight: { xs: 48, md: 78 }, p: 0.75, borderRadius: '10px', cursor: 'pointer', border: `1px solid ${sel ? t.tx.hl : t.tx.line}`,
                      background: sel ? t.tx.surface : 'transparent', transition: 'transform .2s, border-color .2s', '&:hover': { transform: 'translateY(-2px)', borderColor: t.tx.hl },
                    })}
                  >
                    <Typography
                      sx={{
                        fontSize: 13, fontWeight: 700, width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        ...(key === today && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                      }}
                    >
                      {d.getDate()}
                    </Typography>
                    <Stack direction="row" gap={0.4} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      {ev.slice(0, 6).map((e, j) => (
                        <Box key={j} title={e.title} sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: KIND[e.kind].color === 'default' ? 'text.secondary' : KIND[e.kind].color + '.main' }} />
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              {new Date(picked + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
            {!dayEvents.length && <Typography color="text.secondary">Nothing on this day.</Typography>}
            <Stack spacing={1.25}>
              {dayEvents.map((e, i) => (
                <Box key={i} onClick={() => e.to && nav(e.to)} sx={(t) => ({ p: 1.25, borderRadius: '12px', border: `1px solid ${t.tx.line}`, cursor: e.to ? 'pointer' : 'default', animation: `txrise .35s ${i * 40}ms both`, '&:hover': { borderColor: t.tx.hl } })}>
                  <Chip size="small" label={KIND[e.kind].label} color={KIND[e.kind].color} sx={{ mb: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {e.title}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 2.5 }}>
              {(Object.keys(KIND) as Kind[]).map((k) => (
                <Chip key={k} size="small" variant="outlined" label={KIND[k].label} icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', ml: '8px !important', bgcolor: KIND[k].color === 'default' ? 'text.secondary' : KIND[k].color + '.main' }} />} />
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
}
