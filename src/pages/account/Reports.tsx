import { useMemo, useState } from 'react';
import { Box, Card, Grid, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CountUp, Reveal } from '../../components/Motion';
import { Heading, Page } from '../../components/Section';
import { useStore } from '../../context/StoreContext';
import { gradeReport, lessonsFor } from '../../data/curriculum';
import { courseById } from '../../data/recommend';
import type { Course } from '../../types';

const DAYS = 14;

/** Lessons completed per day, last 14 days: one series, so no legend; hover shows the value. */
function ActivityChart({ counts }: { counts: { label: string; n: number }[] }) {
  const max = Math.max(1, ...counts.map((c) => c.n));
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 180, borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
        {[0.5, 1].map((g) => (
          <Box key={g} sx={{ position: 'absolute', left: 0, right: 0, bottom: `${g * 100}%`, borderTop: '1px dashed', borderColor: 'divider', opacity: 0.6 }}>
            <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: -18, left: 0 }}>
              {Math.round(max * g)}
            </Typography>
          </Box>
        ))}
        {counts.map((c, i) => (
          <Tooltip key={i} title={`${c.label}: ${c.n} ${c.n === 1 ? 'lesson' : 'lessons'}`} placement="top" arrow>
            <Box
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              sx={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', cursor: 'default' }}
            >
              <Box
                sx={{
                  width: '100%', maxWidth: 28, mx: 'auto', height: `${(c.n / max) * 100}%`, minHeight: c.n ? 4 : 0,
                  bgcolor: 'primary.main', borderRadius: '4px 4px 0 0', opacity: hover == null || hover === i ? 1 : 0.55,
                  transformOrigin: 'bottom', animation: `txgrowy .7s cubic-bezier(.2,.8,.2,1) ${i * 35}ms both`, transition: 'opacity .2s',
                  '@keyframes txgrowy': { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '2px', mt: 0.75 }}>
        {counts.map((c, i) => (
          <Typography key={i} variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center', fontSize: 10, visibility: i % 2 ? 'hidden' : 'visible' }}>
            {c.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function Reports() {
  const { owned, lessons, activity, orders, prog } = useStore();
  const courses = owned.map(courseById).filter((c): c is Course => !!c);
  const totalLessons = courses.reduce((a, c) => a + (lessons[c.id] || 0), 0);
  const completed = courses.filter((c) => (prog[c.id] || 0) >= 100).length;
  const avg = courses.length ? courses.reduce((a, c) => a + gradeReport(c, lessons[c.id] || 0).total, 0) / courses.length : 0;
  const spent = orders.reduce((a, o) => a + o.total, 0);

  const counts = useMemo(() => {
    const out: { label: string; n: number; key: string }[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ key: d.toDateString(), label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), n: 0 });
    }
    activity.forEach((a) => {
      if (a.type !== 'lesson') return;
      const hit = out.find((o) => o.key === new Date(a.at).toDateString());
      if (hit) hit.n++;
    });
    return out;
  }, [activity]);

  const tiles: [number, string, string?, string?][] = [
    [courses.length, 'Courses enrolled'],
    [completed, 'Courses completed'],
    [totalLessons, 'Lessons completed'],
    [Math.round(avg), 'Average grade', '', '%'],
    [spent, 'Total spent', '₹'],
  ];

  return (
    <Page>
      <Heading kick="REPORTS" title="Your learning" hl="report" />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, mb: 4 }}>
        {tiles.map(([v, l, pre, suf], i) => (
          <Card key={l} sx={{ p: 2.5, animation: `txpop .45s ${i * 60}ms both` }}>
            <Typography sx={{ fontWeight: 800, fontSize: 30, color: 'secondary.main' }}>
              <CountUp value={v} prefix={pre} suffix={suf} />
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {l}
            </Typography>
          </Card>
        ))}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Reveal>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Lessons completed per day</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Last {DAYS} days
              </Typography>
              <ActivityChart counts={counts} />
            </Card>
          </Reveal>
        </Grid>
        <Grid item xs={12} md={5}>
          <Reveal delay={100}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Progress by course
              </Typography>
              {!courses.length && <Typography color="text.secondary">No courses yet.</Typography>}
              <Stack spacing={2}>
                {courses.map((c) => (
                  <Box key={c.id}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography component={RouterLink} to={'/courses/' + c.id} variant="body2" sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }} noWrap>
                        {c.title.split(':')[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 'none' }}>
                        {lessons[c.id] || 0}/{lessonsFor(c).length}
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={prog[c.id] || 0} sx={{ mt: 0.5 }} color={(prog[c.id] || 0) >= 100 ? 'success' : 'primary'} />
                  </Box>
                ))}
              </Stack>
            </Card>
          </Reveal>
        </Grid>
      </Grid>
    </Page>
  );
}
