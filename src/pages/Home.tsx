import { useState } from 'react';
import { Box, Button, Card, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { CourseGrid, Price } from '../components/CourseCard';
import { BlobImg } from '../components/Media';
import { CountUp, Reveal } from '../components/Motion';
import { usePreview } from '../components/Preview';
import Faq from '../components/Faq';
import CoursePromo from '../components/CoursePromo';
import { Heading } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { PERSONAS, STEPS, TOOLS } from '../data/content';
import { courseById } from '../data/recommend';

// Courses shown as promo cards on Home (the first three the learner does not own yet).
const SPOTLIGHT = ['lovable', 'ready', 'agentic', 'n8n-agents', 'claude-code', 'wa-mastery', 'mastery-14'];

export default function Home() {
  const theme = useTheme();
  const nav = useNavigate();
  const preview = usePreview();
  const user = useUser();
  const { owned, cart, addToCart } = useStore();
  const [persona, setPersona] = useState<string | null>(null);
  const featured = COURSES.filter((c) => c.featured);
  const personaRow = PERSONAS.find((p) => p[0] === persona);
  const rec = personaRow ? courseById(personaRow[2]) : undefined;
  const dark = theme.palette.mode === 'dark';

  return (
    <Box>
      {/* Hero */}
      <Container maxWidth="xl" sx={{ position: 'relative', pt: { xs: 4, md: 6 } }}>
        <Box sx={{ position: 'relative', borderRadius: { md: '28px' }, overflow: 'hidden', minHeight: { md: 540 }, display: 'flex', alignItems: 'center' }}>
          <BlobImg
            key={dark ? 'd' : 'l'}
            eager
            src={dark ? '/assets/3.jpg' : '/assets/1.jpg'}
            alt="A learner at her laptop beside a friendly robot"
            sx={{
              position: 'absolute !important', right: 0, top: 0, width: '76%', height: '100%', display: { xs: 'none', md: 'block' },
              maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 22%, #000 46%)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 22%, #000 46%)',
              background: 'none !important', animation: 'txfade 1s ease both',
              '& img': { animation: 'txzoom 18s ease-in-out infinite alternate', '@keyframes txzoom': { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } } },
            }}
          />
          <Box sx={{ position: 'relative', maxWidth: 620, px: { xs: 1, md: 5 }, py: { xs: 2, md: 6 }, animation: 'txrise .8s cubic-bezier(.2,.8,.2,1) both' }}>
            <Typography variant="overline" color="text.secondary">
              WELCOME, {user.name.split(' ')[0].toUpperCase()} · THE AI SKILLS ACADEMY FOR REAL PEOPLE
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 58, md: 76 }, my: 1.5 }}>
              Learn AI Skills.{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                Build What&apos;s Next.
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 18, mb: 3.5 }}>
              Practical, hands-on AI courses to help you work smarter, create faster, and stay ahead in your career, business, and everyday life.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => nav('/courses')}>
                Explore Courses
              </Button>
              <Button variant="outlined" size="large" onClick={() => nav('/courses/wa-agent')}>
                Start the free course
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {([[COURSES.length, '', '', 'Courses and challenges'], [33, '', '+ hrs', 'Of agent training'], [28, '', ' days', 'To become AI ready'], [0, '₹', '', 'To start today']] as [number, string, string, string][]).map(([v, pre, suf, l], i) => (
                <Grid item xs={6} sm={3} key={l} sx={{ animation: `txrise .6s ${0.3 + i * 0.1}s both` }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 28 }}>
                    <CountUp value={v} prefix={pre} suffix={suf} ms={1200} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {l}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>

      {/* Tools marquee */}
      <Box sx={{ overflow: 'hidden', borderBlock: 1, borderColor: 'divider', py: 2, my: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', width: 'max-content', animation: 'txmarq 30s linear infinite' }}>
          {TOOLS.concat(TOOLS).map((t, i) => (
            <Typography key={i} sx={{ fontWeight: 700, fontSize: 20, px: 3, whiteSpace: 'nowrap', color: 'text.secondary' }}>
              {t} <Box component="span" sx={{ color: 'secondary.main', pl: 3 }}>✦</Box>
            </Typography>
          ))}
        </Box>
      </Box>

      <Container maxWidth="lg">
        {/* Featured */}
        <Heading kick="FEATURED COURSES" title="Most Popular" hl="AI Courses" sub="Practical, project-based courses to help you master AI, step by step." />
        <CourseGrid courses={featured} />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" onClick={() => nav('/courses')}>
            See all {COURSES.length} courses
          </Button>
        </Box>

        {/* Course offers, in the academy's promo-card style */}
        <Box sx={{ mt: { xs: 7, md: 10 } }}>
          <Heading kick="SPECIAL OFFERS" title="Pick a skill." hl="Start building." sub="Limited-time prices on our most loved courses." />
          <Grid container spacing={2.5}>
            {SPOTLIGHT.map(courseById)
              .filter((c): c is NonNullable<typeof c> => !!c && !owned.includes(c.id))
              .slice(0, 3)
              .map((c) => (
                <Grid item xs={12} md={4} key={c.id}>
                  <CoursePromo c={c} compact onEnroll={() => addToCart(c.id)} />
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Course finder */}
        <Reveal>
        <Card sx={{ p: { xs: 3, md: 5 }, mt: { xs: 7, md: 10 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Heading kick="COURSE FINDER" title="Not sure where to start?" hl="Tell us who you are." mb={2} />
              <Button color="secondary" endIcon={<ArrowForwardIcon />} onClick={() => nav('/calculator')} sx={{ mb: 2, px: 0 }}>
                Try the AI Course Calculator
              </Button>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {PERSONAS.map(([id, label]) => (
                  <Chip key={id} label={label} clickable color={persona === id ? 'primary' : 'default'} variant={persona === id ? 'filled' : 'outlined'} onClick={() => setPersona(id)} sx={{ height: 40, fontSize: 14, px: 0.5 }} />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              {rec ? (
                <Box sx={{ animation: 'txrise .5s both' }} key={rec.id}>
                  <BlobImg src={rec.img} alt="" ratio="375 / 110" onClick={() => preview(rec.id)} sx={{ borderRadius: '14px', mb: 2, cursor: 'pointer' }} />
                  <Typography variant="overline" color="text.secondary">
                    YOUR BEST FIRST COURSE
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {rec.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {rec.desc}
                  </Typography>
                  <Price c={rec} />
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={() => nav('/courses/' + rec.id)}>
                      Go to course
                    </Button>
                    <Button variant="contained" onClick={() => (owned.includes(rec.id) ? nav('/courses/' + rec.id) : cart.includes(rec.id) ? nav('/cart') : addToCart(rec.id))}>
                      {owned.includes(rec.id) ? 'Continue learning' : rec.price === 0 ? 'Enroll for free' : cart.includes(rec.id) ? 'Go to cart' : 'Add to cart'}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box sx={(t) => ({ height: '100%', minHeight: 200, borderRadius: '18px', border: `1px dashed ${t.tx.line}`, display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' })}>
                  <Typography color="text.secondary">Pick one and your best first course appears here.</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>
        </Reveal>

        {/* How it works */}
        <Reveal>
        <Box sx={{ mt: { xs: 7, md: 10 } }}>
          <Heading kick="HOW IT WORKS" title="From first lesson to" hl="real results" />
          <Grid container spacing={2.5}>
            {STEPS.map(([n, t, d]) => (
              <Grid item xs={12} sm={6} md={3} key={n}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 36, color: 'secondary.main' }}>{n}</Typography>
                  <Typography variant="h6">{t}</Typography>
                  <Typography color="text.secondary">{d}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        </Reveal>

        {/* Free course */}
        <Reveal>
        <Card sx={(t) => ({ mt: { xs: 7, md: 10 }, p: { xs: 3, md: 5 }, borderColor: t.tx.hl, boxShadow: `0 28px 60px ${t.tx.glow}` })}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="FREE COURSE" color="primary" size="small" sx={{ mb: 1.5, fontWeight: 800 }} />
              <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 }, mb: 1 }}>
                Your first AI agent in{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  30 minutes.
                </Box>
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Create your own AI agent for bulk WhatsApp messaging in 4 easy steps. No payment needed.
              </Typography>
              <Button variant="contained" size="large" onClick={() => nav('/courses/wa-agent')}>
                Start the course for free
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <BlobImg src="/assets/7.jpg" alt="" ratio="375 / 110" onClick={() => preview('wa-agent')} sx={{ borderRadius: '14px', cursor: 'pointer', animation: 'txfloat 7s ease-in-out infinite' }} />
            </Grid>
          </Grid>
        </Card>
        </Reveal>

        {/* FAQ */}
        <Grid container spacing={4} sx={{ mt: { xs: 5, md: 8 } }}>
          <Grid item xs={12} md={4}>
            <Heading kick="QUESTIONS" title="Before you" hl="enroll" />
          </Grid>
          <Grid item xs={12} md={8}>
            <Faq />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 7, md: 10 } }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 56 }, mb: 3 }}>
            Start learning AI{' '}
            <Box component="span" sx={{ color: 'secondary.main' }}>
              today.
            </Box>
          </Typography>
          <Button variant="contained" size="large" onClick={() => nav('/courses')}>
            Explore all courses
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
