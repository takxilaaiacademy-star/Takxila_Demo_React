// Public showcase page: the first thing a visitor sees, before logging in.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Box, Button, Chip, Container, Drawer, Grid, IconButton, LinearProgress, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcardOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import GradingIcon from '@mui/icons-material/GradingOutlined';
import CalculateIcon from '@mui/icons-material/CalculateOutlined';
import QuizIcon from '@mui/icons-material/QuizOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { CAT_PILLS, COURSES } from '../data/courses';
import { lessonsFor } from '../data/curriculum';
import { courseById } from '../data/recommend';
import { hoursOf, LEADERS, PAID } from '../data/showcase';
import type { CatId } from '../types';
import Background from '../components/Background';
import { CourseIcon } from '../components/CourseIcon';
import { BlobImg, CourseVideo } from '../components/Media';
import { CountUp, Reveal } from '../components/Motion';
import Logo, { LogoFull } from '../components/Logo';
import { PreviewProvider, usePreview } from '../components/Preview';
import { ComboPacks, ComparisonTable, CourseFaq, HowItWorks, NumberedGrid, Perks, Plans } from '../components/Showcase';
import {
  FlipWords, GradientText, GridBackdrop, InfiniteRow, Lamp, Meteors, MovingBorderButton, ScrollTilt, ScrollTimeline, Sparkles, Spotlight, TextGenerate, TiltCard,
} from '../components/fx';
import { prefetch } from '../utils/media';

const LINKS: [label: string, id: string][] = [
  ['Courses', 'courses'], ['Inside', 'inside'], ['Challenges', 'challenges'], ['Packs', 'packs'], ['Compare', 'compare'],
];
const TOTAL_LESSONS = COURSES.reduce((a, c) => a + lessonsFor(c).length, 0);
const TOTAL_HOURS = Math.round(COURSES.reduce((a, c) => a + hoursOf(c), 0));
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

function Section({ id, kick, title, hl, sub, children }: { id?: string; kick: string; title: string; hl: string; sub?: string; children: ReactNode }) {
  return (
    <Box id={id} component="section" sx={{ scrollMarginTop: 90, py: { xs: 7, md: 11 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <Reveal>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip label={kick} size="small" variant="outlined" sx={(t) => ({ mb: 1.5, fontWeight: 800, letterSpacing: '.12em', borderColor: t.tx.hl, color: 'secondary.main' })} />
            <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 50 } }}>
              {title} <GradientText>{hl}</GradientText>
            </Typography>
            {sub && (
              <Typography color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', mt: 1.5, fontSize: 17 }}>
                {sub}
              </Typography>
            )}
          </Box>
        </Reveal>
        {children}
      </Container>
    </Box>
  );
}

function LandingNav() {
  const nav = useNavigate();
  const { isAuthed, user } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <Box
      component="header"
      sx={(t) => ({
        position: 'fixed', top: scrolled ? 10 : 0, left: 0, right: 0, zIndex: 1100, transition: 'top .4s cubic-bezier(.2,.8,.2,1)', px: { xs: 1, md: 2 },
        '& > div': {
          maxWidth: scrolled ? 1120 : 1280, mx: 'auto', px: { xs: 1.5, md: 2.5 }, height: 66, display: 'flex', alignItems: 'center', gap: 1,
          borderRadius: scrolled ? '18px' : 0, border: `1px solid ${scrolled ? t.tx.line : 'transparent'}`,
          background: scrolled ? (t.palette.mode === 'dark' ? 'rgba(10,16,34,.72)' : 'rgba(255,255,255,.75)') : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none', transition: 'all .4s cubic-bezier(.2,.8,.2,1)',
        },
      })}
    >
      <div>
        <Box onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} sx={{ cursor: 'pointer', '& .MuiTypography-root': { display: { xs: 'none', sm: 'block' } } }}>
          <Logo size={38} />
        </Box>
        <Stack direction="row" spacing={0.5} sx={{ mx: 'auto', display: { xs: 'none', md: 'flex' } }}>
          {LINKS.map(([l, id]) => (
            <Button key={id} color="inherit" onClick={() => go(id)} sx={{ fontWeight: 600, minHeight: 38 }}>
              {l}
            </Button>
          ))}
        </Stack>
        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
        <IconButton onClick={toggleMode} aria-label={mode === 'dark' ? 'Light theme' : 'Dark theme'}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {isAuthed ? (
          <Button variant="contained" onClick={() => nav('/dashboard')} endIcon={<ArrowForwardIcon />} sx={{ minHeight: 40, whiteSpace: 'nowrap' }}>
            {user ? 'Hi ' + user.name.split(' ')[0] : 'Dashboard'}
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => nav('/auth')} sx={{ display: { xs: 'none', sm: 'inline-flex' }, minHeight: 40 }}>
              Log in
            </Button>
            <Button variant="contained" onClick={() => nav('/auth#register')} sx={{ minHeight: 40 }}>
              Start free
            </Button>
          </>
        )}
        <IconButton onClick={() => setDrawer(true)} sx={{ display: { md: 'none' } }} aria-label="Open menu">
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)} PaperProps={{ sx: { width: 260, p: 2 } }}>
        <Logo size={36} />
        <List sx={{ mt: 2 }}>
          {LINKS.map(([l, id]) => (
            <ListItemButton
              key={id}
              onClick={() => {
                setDrawer(false);
                setTimeout(() => go(id), 250);
              }}
            >
              <ListItemText primary={l} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ))}
          {!isAuthed && (
            <ListItemButton onClick={() => nav('/auth')}>
              <ListItemText primary="Log in" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </Box>
  );
}

const ORBIT = ['claude-code', 'agentic', 'mj-advanced', 'film-3', 'meta-ads', 'wa-agent'];

function Hero() {
  const nav = useNavigate();
  const { isAuthed } = useAuth();
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 18 }, pb: { xs: 8, md: 12 } }}>
      <GridBackdrop />
      <Spotlight sx={(t) => ({ '& ellipse': { fill: t.palette.mode === 'dark' ? '#fff' : '#5B7CFF' } })} />
      <Meteors n={12} />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip
              icon={<SchoolIcon />}
              label={`${COURSES.length} courses · ${CAT_PILLS.length} tracks · ${TOTAL_LESSONS}+ lessons`}
              variant="outlined"
              sx={(t) => ({ mb: 3, fontWeight: 700, borderColor: t.tx.line, background: t.tx.surface, backdropFilter: 'blur(10px)', animation: 'txblurin .6s both' })}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 54, md: 72 }, mb: 2.5 }}>
              <TextGenerate text="Master the AI frameworks." hl={['AI']} />
              <br />
              <TextGenerate text="Own the AI future." delay={320} sx={{ '& span': { color: 'secondary.main' } }} />
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: { xs: 17, md: 20 }, maxWidth: 560, mb: 4, animation: 'txblurin .7s .7s both' }}>
              Learn{' '}
              <FlipWords
                words={['ChatGPT', 'Claude AI', 'AI Agents', 'Midjourney', 'Kling AI', 'n8n automation', 'AI filmmaking']}
                sx={{ fontWeight: 800, color: 'text.primary' }}
              />{' '}
              step by step, with summary videos, hands-on projects, grades and a certificate.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ animation: 'txblurin .7s .9s both' }}>
              <MovingBorderButton filled onClick={() => nav(isAuthed ? '/dashboard' : '/auth#register')}>
                {isAuthed ? 'Go to my dashboard' : 'Start learning free'} <ArrowForwardIcon fontSize="small" />
              </MovingBorderButton>
              <MovingBorderButton onClick={() => go('courses')}>
                <PlayCircleIcon fontSize="small" /> Explore {COURSES.length} courses
              </MovingBorderButton>
            </Stack>
            <Stack direction="row" spacing={{ xs: 3, md: 5 }} sx={{ mt: 5, animation: 'txblurin .7s 1.1s both' }}>
              {(
                [
                  [COURSES.length, '', 'Courses'],
                  [TOTAL_HOURS, '+', 'Hours of learning'],
                  [99, '₹', 'Courses from'],
                ] as const
              ).map(([v, s, l]) => (
                <Box key={l}>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, lineHeight: 1.1 }}>
                    {s === '₹' ? <CountUp value={v} prefix="₹" /> : <CountUp value={v} suffix={s} />}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {l}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative', width: { xs: 300, sm: 380 }, height: { xs: 300, sm: 380 }, mx: 'auto', display: 'grid', placeItems: 'center' }}>
              <Box sx={(t) => ({ position: 'absolute', inset: '12%', borderRadius: '50%', background: `radial-gradient(circle, ${t.tx.orb2}, transparent 70%)`, filter: 'blur(20px)' })} />
              <Box sx={(t) => ({ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px dashed ${t.tx.line}`, animation: 'txspin 40s linear infinite' })} />
              <Box sx={(t) => ({ position: 'absolute', inset: '16%', borderRadius: '50%', border: `1px solid ${t.tx.line}`, animation: 'txspin 26s linear infinite reverse' })} />
              <Sparkles n={18} />
              <Box sx={{ animation: 'txfloat 6s ease-in-out infinite', position: 'relative', zIndex: 1 }}>
                <LogoFull width={190} />
              </Box>
              {/* Course icons orbiting the logo */}
              <Box sx={{ position: 'absolute', inset: 0, animation: 'txspin 40s linear infinite' }}>
                {ORBIT.map((id, i) => {
                  const c = courseById(id);
                  const a = (i / ORBIT.length) * Math.PI * 2;
                  return c ? (
                    <Box key={id} sx={{ position: 'absolute', left: `calc(50% + ${Math.cos(a) * 50}% - 22px)`, top: `calc(50% + ${Math.sin(a) * 50}% - 22px)`, animation: 'txspin 40s linear infinite reverse' }}>
                      <CourseIcon c={c} size={44} />
                    </Box>
                  ) : null;
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function BannerRows() {
  const preview = usePreview();
  const half = Math.ceil(COURSES.length / 2);
  const row = (list: typeof COURSES) =>
    list.map((c) => (
      <Box key={c.id} onClick={() => preview(c.id)} sx={(t) => ({ width: { xs: 240, md: 300 }, flex: 'none', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${t.tx.line}`, cursor: 'pointer', transition: 'transform .3s', '&:hover': { transform: 'scale(1.04)' } })}>
        <BlobImg src={c.img} alt={c.title} ratio="375 / 110" />
      </Box>
    ));
  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <InfiniteRow seconds={70}>{row(COURSES.slice(0, half))}</InfiniteRow>
      <InfiniteRow seconds={80} reverse>
        {row(COURSES.slice(half))}
      </InfiniteRow>
    </Box>
  );
}

/** A mock of the learner dashboard that straightens up as you scroll. */
function DashboardMock() {
  const enrolled = ['genai-complete', 'claude-code', 'mastery-28'].map((id) => courseById(id)!);
  return (
    <ScrollTilt>
      <Box sx={(t) => ({ maxWidth: 1000, mx: 'auto', borderRadius: '26px', p: { xs: 1, md: 1.5 }, border: `1px solid ${t.tx.line}`, background: t.tx.surface, boxShadow: `0 40px 120px ${t.tx.glow}` })}>
        <Box sx={(t) => ({ borderRadius: '18px', overflow: 'hidden', bgcolor: t.palette.background.default, border: `1px solid ${t.tx.line}` })}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={(t) => ({ px: 2, py: 1.25, borderBottom: `1px solid ${t.tx.line}` })}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
              takxila · dashboard
            </Typography>
          </Stack>
          <Grid container spacing={2} sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Enrolled courses</Typography>
              <Grid container spacing={1.5}>
                {enrolled.map((c, i) => (
                  <Grid item xs={12} sm={4} key={c.id}>
                    <Box sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, background: t.tx.surface })}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
                        <CourseIcon c={c} size={32} />
                        <Typography sx={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>{c.title}</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={[68, 35, 90][i]} color="secondary" />
                      <Typography variant="caption" color="text.secondary">
                        {[68, 35, 90][i]}% complete
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                {(
                  [
                    [LocalFireDepartmentIcon, '12 days', 'Learning streak', '#FF8A3D'],
                    [WorkspacePremiumIcon, '3', 'Certificates', '#F5B93F'],
                    [GradingIcon, '86%', 'Average grade', '#2EBD85'],
                  ] as const
                ).map(([Icon, v, l, col]) => (
                  <Box key={l} sx={(t) => ({ flex: 1, p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, background: t.tx.surface })}>
                    <Icon sx={{ color: col }} />
                    <Typography sx={{ fontWeight: 800 }}>{v}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {l}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, background: t.tx.surface, height: '100%' })}>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>Leaderboard</Typography>
                {LEADERS.slice(0, 5).map(([n, , h], i) => (
                  <Stack key={n} direction="row" alignItems="center" spacing={1} sx={(t) => ({ py: 0.75, borderBottom: i < 4 ? `1px solid ${t.tx.line}` : 0 })}>
                    <EmojiEventsIcon sx={{ fontSize: 18, color: ['#F5B93F', '#C0C7DE', '#CD7F32', 'transparent', 'transparent'][i] }} />
                    <Typography sx={{ fontSize: 13, flexGrow: 1 }}>{n}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'secondary.main' }}>{h} hr</Typography>
                  </Stack>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ScrollTilt>
  );
}

const BENTO: { icon: typeof SchoolIcon; title: string; text: string; span: number; color: string }[] = [
  { icon: PlayCircleIcon, title: 'Summary video on every course', text: 'Watch a 10-second preview before you buy, right from the course card.', span: 2, color: '#5B7CFF' },
  { icon: GradingIcon, title: 'Grades for every lesson', text: 'A grade report like a real LMS, updated as you learn.', span: 1, color: '#2EBD85' },
  { icon: WorkspacePremiumIcon, title: 'Certificates', text: 'Finish a course and download a certificate with a unique ID.', span: 1, color: '#F5B93F' },
  { icon: LeaderboardIcon, title: 'Leaderboard', text: 'See where your learning hours rank this week and overall.', span: 1, color: '#C25BFF' },
  { icon: LocalFireDepartmentIcon, title: 'Learning streaks', text: 'Keep the flame alive with a streak calendar.', span: 1, color: '#FF8A3D' },
  { icon: CardGiftcardIcon, title: 'Refer and earn', text: 'Share your code. Your friend saves ₹200 and you earn ₹200.', span: 1, color: '#FF6B8B' },
  { icon: DescriptionIcon, title: 'Resume builder', text: 'Build a clean resume with a live preview, then download it as a PDF.', span: 2, color: '#21B8D6' },
  { icon: CalculateIcon, title: 'AI course calculator', text: 'Answer a few questions and get your plan and total.', span: 1, color: '#7C8CFF' },
];

function Bento() {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
      {BENTO.map((b, i) => (
        <Box key={b.title} sx={{ gridColumn: { md: `span ${b.span}` } }}>
          <Reveal delay={i * 60} sx={{ height: '100%' }}>
            <TiltCard sx={{ p: 3, minHeight: 190 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '14px', display: 'grid', placeItems: 'center', mb: 2, color: '#fff', background: `linear-gradient(135deg, ${b.color}, ${b.color}99)`, boxShadow: `0 10px 30px ${b.color}66`, transform: 'translateZ(40px)' }}>
                <b.icon />
              </Box>
              <Typography variant="h6" sx={{ mb: 0.75, transform: 'translateZ(30px)' }}>
                {b.title}
              </Typography>
              <Typography color="text.secondary" sx={{ transform: 'translateZ(20px)' }}>
                {b.text}
              </Typography>
            </TiltCard>
          </Reveal>
        </Box>
      ))}
    </Box>
  );
}

function CourseShowcase() {
  const [cat, setCat] = useState<CatId | 'all'>('all');
  const [all, setAll] = useState(false);
  const list = useMemo(() => COURSES.filter((c) => cat === 'all' || c.cat === cat), [cat]);
  const shown = all ? list : list.slice(0, 12);
  useEffect(() => prefetch(list.slice(0, 12).map((c) => c.img)), [list]);
  return (
    <>
      <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" sx={{ mb: 3 }}>
        <Chip label={'All (' + COURSES.length + ')'} clickable color={cat === 'all' ? 'primary' : 'default'} variant={cat === 'all' ? 'filled' : 'outlined'} onClick={() => setCat('all')} />
        {CAT_PILLS.map(([id, label]) => (
          <Chip key={id} label={label} clickable color={cat === id ? 'primary' : 'default'} variant={cat === id ? 'filled' : 'outlined'} onClick={() => setCat(id)} />
        ))}
      </Stack>
      <Box key={cat}>
        <NumberedGrid courses={shown} />
      </Box>
      {list.length > 12 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" size="large" onClick={() => setAll((v) => !v)}>
            {all ? 'Show fewer' : `Show all ${list.length} courses`}
          </Button>
        </Box>
      )}
    </>
  );
}

function Challenge() {
  const nav = useNavigate();
  const { isAuthed } = useAuth();
  const c = courseById('mastery-28')!;
  return (
    <Stack spacing={{ xs: 5, md: 7 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Chip label="Most joined challenge" size="small" color="secondary" variant="outlined" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 44 }, mb: 1.5 }}>
            28 days challenge to become <GradientText>AI-ready</GradientText>
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ mb: 1 }}>
            <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ₹{c.was}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 34 }}>₹{c.price}</Typography>
            <Chip size="small" color="success" label={Math.round((1 - c.price / (c.was ?? c.price)) * 100) + '% OFF'} />
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {c.desc}
          </Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => nav(isAuthed ? '/courses/' + c.id : '/auth#register')}>
            Join the 28 days challenge
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <CourseVideo src={c.video} poster={c.img} autoPlay={false} title={c.title} />
        </Grid>
      </Grid>
      <Reveal>
        <HowItWorks c={c} />
      </Reveal>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2.5, fontSize: { xs: 24, md: 32 } }}>
            Everything you get <GradientText>inside</GradientText>
          </Typography>
          <Perks />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2.5, fontSize: { xs: 24, md: 32 } }}>
            Questions, <GradientText>answered</GradientText>
          </Typography>
          <CourseFaq />
        </Grid>
      </Grid>
    </Stack>
  );
}

const JOURNEY = [
  { title: 'Create your free account', body: 'Register in seconds. Got a referral code? You save ₹200 on your first order.', icon: <PersonAddIcon fontSize="small" /> },
  { title: 'Answer 11 quick questions', body: 'Get courses picked for your goals, budget and time, with a full plan and total.', icon: <QuizIcon fontSize="small" /> },
  { title: 'Preview, then enroll', body: 'Watch the summary video of any course. Combo packs and 4+ course packs are discounted automatically.', icon: <PlayCircleIcon fontSize="small" /> },
  { title: 'Learn, get graded, keep the streak', body: 'Complete lessons, watch your grade grow, and climb the leaderboard.', icon: <LocalFireDepartmentIcon fontSize="small" /> },
  { title: 'Earn your certificate', body: 'Finish every lesson and download a certificate with a unique, verifiable ID.', icon: <WorkspacePremiumIcon fontSize="small" /> },
  { title: 'Build your resume and grow', body: 'Your certificates flow into the resume builder. Share your code and earn while friends learn.', icon: <DescriptionIcon fontSize="small" /> },
];

function Footer() {
  const nav = useNavigate();
  return (
    <Box component="footer" sx={(t) => ({ borderTop: `1px solid ${t.tx.line}`, py: 5, position: 'relative', zIndex: 1 })}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Logo size={40} />
          <Stack direction="row" gap={1} flexWrap="wrap">
            {LINKS.map(([l, id]) => (
              <Button key={id} color="inherit" size="small" onClick={() => go(id)}>
                {l}
              </Button>
            ))}
            <Button color="inherit" size="small" onClick={() => nav('/auth')}>
              Log in
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Takxila AI Academy
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default function Landing() {
  const nav = useNavigate();
  const { hash } = useLocation();
  const { isAuthed } = useAuth();
  useEffect(() => {
    if (hash) setTimeout(() => go(hash.slice(1)), 350);
  }, [hash]);
  useEffect(() => {
    document.title = 'Takxila AI Academy · Master the AI frameworks';
    prefetch(PAID.slice(0, 8).map((c) => c.img));
    return () => {
      document.title = 'Takxila AI Academy';
    };
  }, []);
  return (
    <PreviewProvider>
      <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <Background />
        <LandingNav />
        <Hero />
        <BannerRows />

        <Section id="inside" kick="INSIDE TAKXILA" title="Your learning," hl="all in one place" sub="A personal dashboard with your courses, streak, grades, certificates and leaderboard rank.">
          <DashboardMock />
          <Box sx={{ mt: { xs: 6, md: 9 } }}>
            <Bento />
          </Box>
        </Section>

        <Section id="courses" kick="ALL COURSES" title="Pick your next" hl="AI skill" sub="Tap Curriculum on any course to watch its summary video and see what you will learn.">
          <CourseShowcase />
        </Section>

        <Section id="challenges" kick="CHALLENGES" title="Learn daily." hl="Finish strong.">
          <Challenge />
        </Section>

        <Section id="packs" kick="COMBO PACKS" title="Career-focused" hl="combo packs" sub="Bundles built around a role. The discount is applied in your cart automatically.">
          <ComboPacks />
          <Typography variant="h4" sx={{ textAlign: 'center', mt: { xs: 6, md: 8 }, mb: 3, fontSize: { xs: 26, md: 34 } }}>
            Choose your perfect <GradientText>plan</GradientText>
          </Typography>
          <Plans />
        </Section>

        <Section id="compare" kick="WHY TAKXILA" title="Why learners" hl="trust Takxila">
          <Reveal>
            <ComparisonTable />
          </Reveal>
        </Section>

        <Section id="journey" kick="YOUR JOURNEY" title="From sign-up to" hl="certified">
          <ScrollTimeline items={JOURNEY} />
        </Section>

        <Lamp>
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Sparkles n={30} />
            <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 60 }, mb: 2, position: 'relative' }}>
              Start learning AI <GradientText>today.</GradientText>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: 18, position: 'relative' }}>
              Your first AI agent course is free. It takes 30 minutes.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ position: 'relative' }}>
              <MovingBorderButton filled onClick={() => nav(isAuthed ? '/courses/wa-agent' : '/auth#register')}>
                Start the free course <ArrowForwardIcon fontSize="small" />
              </MovingBorderButton>
              <MovingBorderButton onClick={() => go('packs')}>See combo packs</MovingBorderButton>
            </Stack>
          </Container>
        </Lamp>
        <Footer />
      </Box>
    </PreviewProvider>
  );
}
