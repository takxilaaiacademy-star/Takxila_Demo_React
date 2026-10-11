import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { Box, Button, Grid, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate } from 'react-router-dom';
import { DashShell, EnrolledCard, LeaderboardList, Panel, StreakCalendar, StreakTiles } from '../components/Learning';
import { NumberedGrid } from '../components/Showcase';
import { CourseIcon } from '../components/CourseIcon';
import { Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { courseById, profileLine, recommend } from '../data/recommend';
import { ALL_ACCESS_PRICE, CUSTOM_MIN, listPrice, PAID } from '../data/showcase';
import type { Course } from '../types';
import FastField from '../components/FastField';

function Promo({ title, hl, price, was, note, cta, onClick, dark, icons }: { title: string; hl: string; price: string; was?: string; note: string; cta: string; onClick: () => void; dark?: boolean; icons: string[] }) {
  return (
    <Box
      onClick={onClick}
      sx={(t) => ({
        position: 'relative', overflow: 'hidden', borderRadius: '20px', p: { xs: 2.5, md: 3 }, cursor: 'pointer', minHeight: 170, height: '100%',
        color: dark ? '#fff' : 'text.primary', border: `1px solid ${t.tx.line}`,
        background: dark ? 'linear-gradient(120deg, #2B2BD6, #6A2BD6 55%, #A13BD6)' : t.palette.mode === 'dark' ? 'linear-gradient(120deg, rgba(245,185,63,.22), rgba(245,185,63,.05))' : 'linear-gradient(120deg, #FFF3D6, #FFFFFF)',
        backgroundSize: '200% 100%', animation: 'txgradient 10s ease infinite, txrise .5s both',
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 22px 48px ${t.tx.glow}` },
        '&:hover .tx-orbit': { transform: 'rotate(25deg) scale(1.06)' },
      })}
    >
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '60%', md: '62%' } }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 17, md: 19 }, lineHeight: 1.2 }}>
          {title}{' '}
          <Box component="span" sx={{ color: dark ? '#F5B93F' : 'secondary.main' }}>
            {hl}
          </Box>
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.9 }}>
          Price: <b>{price}</b> {was && <s>{was}</s>}
        </Typography>
        <Typography sx={{ fontSize: 12.5, opacity: 0.85, mb: 1.5 }}>{note}</Typography>
        <Button variant={dark ? 'outlined' : 'contained'} size="small" endIcon={<ArrowForwardIcon />} sx={dark ? { color: '#fff', borderColor: 'rgba(255,255,255,.6)', minHeight: 36 } : { minHeight: 36 }}>
          {cta}
        </Button>
      </Box>
      {/* The icon ring sits fully inside the card, with breathing room from its edge. */}
      <Box className="tx-orbit" sx={{ position: 'absolute', right: { xs: 12, md: 24 }, top: '50%', mt: '-70px', width: 140, height: 140, transition: 'transform .6s cubic-bezier(.2,.8,.2,1)' }}>
        {icons.map((id, i) => {
          const c = courseById(id);
          const a = (i / icons.length) * Math.PI * 2;
          return c ? (
            <Box key={id} sx={{ position: 'absolute', left: 70 + Math.cos(a) * 46 - 18, top: 70 + Math.sin(a) * 46 - 18, animation: `txfloat ${4 + i}s ease-in-out ${i * 0.4}s infinite` }}>
              <CourseIcon c={c} size={36} />
            </Box>
          ) : null;
        })}
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const user = useUser();
  const { owned, prog, enrolledAt, favorites, toggleFavorite, profile, openQuiz } = useStore();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q.trim().toLowerCase());
  const row = useRef<HTMLDivElement>(null);

  const enrolled = useMemo(() => {
    const list = owned.map(courseById).filter((c): c is Course => !!c);
    // Starred first, then most recently enrolled.
    return list
      .filter((c) => !dq || c.search.includes(dq))
      .sort((a, b) => +favorites.includes(b.id) - +favorites.includes(a.id) || (enrolledAt[b.id] || '').localeCompare(enrolledAt[a.id] || ''));
  }, [owned, favorites, enrolledAt, dq]);

  const recs = useMemo(() => {
    const fromQuiz = profile ? recommend(profile.ans, owned).map((r) => courseById(r.id)) : [];
    const list = fromQuiz.filter((c): c is Course => !!c);
    const fill = COURSES.filter((c) => c.featured && !owned.includes(c.id) && !list.includes(c));
    return list.concat(fill).slice(0, 8);
  }, [profile, owned]);

  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  const done = owned.filter((id) => (prog[id] || 0) >= 100).length;

  return (
    <Page maxWidth="xl">
      <DashShell>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1} sx={{ mb: 2.5 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              DASHBOARD
            </Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 32 } }}>
              Welcome back,{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                {user.name.split(' ')[0]}
              </Box>
            </Typography>
          </Box>
          {done > 0 && (
            <Button variant="outlined" startIcon={<WorkspacePremiumIcon />} onClick={() => nav('/certificates')}>
              {done} {done === 1 ? 'certificate' : 'certificates'} ready
            </Button>
          )}
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} xl={8.5} sx={{ minWidth: 0 }}>
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <Promo
                  title="Accelerate your career with the"
                  hl="All Access pack"
                  price={'₹' + ALL_ACCESS_PRICE.toLocaleString('en-IN')}
                  was={'₹' + listPrice(PAID.map((c) => c.id)).toLocaleString('en-IN')}
                  note={`All ${PAID.length} paid courses in one go`}
                  cta="Explore now"
                  onClick={() => nav('/#packs')}
                  icons={['claude-code', 'agentic', 'mj-advanced', 'meta-ads', 'film-3']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Promo
                  dark
                  title="Maximize your skills on"
                  hl={`any ${CUSTOM_MIN}+ courses`}
                  price="25% off"
                  note="Pick your own pack. The discount applies in the cart."
                  cta="Pick courses"
                  onClick={() => nav('/courses')}
                  icons={['gemini', 'perplexity', 'canva-ai', 'lovable']}
                />
              </Grid>
            </Grid>

            <Panel sx={{ mb: 2.5 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  Enrolled courses
                </Typography>
                <FastField
                  size="small"
                  placeholder="Search courses…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  sx={{ width: { sm: 240 } }}
                />
                <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <IconButton onClick={() => scroll(-1)} aria-label="Scroll left" sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton onClick={() => scroll(1)} aria-label="Scroll right" sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
                    <ChevronRightIcon />
                  </IconButton>
                </Stack>
              </Stack>
              {owned.length ? (
                enrolled.length ? (
                  <Box ref={row} sx={{ display: 'flex', gap: 2, overflowX: 'auto', scrollSnapType: 'x mandatory', pb: 1, scrollbarWidth: 'thin' }}>
                    {enrolled.map((c, i) => (
                      <EnrolledCard key={c.id} c={c} index={i} pct={prog[c.id] || 0} at={enrolledAt[c.id]} fav={favorites.includes(c.id)} onFav={toggleFavorite} />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">No enrolled course matches “{q}”.</Typography>
                )
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                  <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                    You have not enrolled yet. Start with the free 30-minute AI agent course.
                  </Typography>
                  <Button variant="contained" onClick={() => nav('/courses/wa-agent')}>
                    Start free course
                  </Button>
                </Stack>
              )}
            </Panel>

            <Stack direction="row" alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                Recommended for you
              </Typography>
              <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={() => openQuiz('onboard')}>
                {profile ? 'Update my answers' : 'Get personal picks'}
              </Button>
            </Stack>
            {profile && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {profileLine(profile.ans)}
              </Typography>
            )}
            <NumberedGrid courses={recs} />
          </Grid>

          {/* Side column on wide screens; below the courses, in two columns, on laptops and tablets. */}
          <Grid item xs={12} xl={3.5} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: '1fr' } }}>
              <Stack spacing={2.5} sx={{ minWidth: 0 }}>
                <StreakTiles />
                <StreakCalendar />
              </Stack>
              <Panel>
                <LeaderboardList limit={8} />
                <Button fullWidth size="small" endIcon={<ArrowForwardIcon />} sx={{ mt: 1 }} onClick={() => nav('/leaderboard')}>
                  Full leaderboard
                </Button>
              </Panel>
            </Box>
          </Grid>
        </Grid>
      </DashShell>
    </Page>
  );
}
