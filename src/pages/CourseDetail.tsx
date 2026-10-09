import { useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Button, Card, Checkbox, Chip, Grid, LinearProgress, Link, Stack, Tab, Tabs, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CourseGrid, Price } from '../components/CourseCard';
import GradeReport from '../components/GradeReport';
import { CourseVideo } from '../components/Media';
import { Reveal } from '../components/Motion';
import { Page } from '../components/Section';
import { CourseIcon } from '../components/CourseIcon';
import { ComparisonTable, CourseFaq, HowItWorks, Perks } from '../components/Showcase';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { lessonsFor } from '../data/curriculum';
import { courseById } from '../data/recommend';

export default function CourseDetail({ tab = 'course' }: { tab?: 'course' | 'grades' }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { owned, cart, prog, lessons, enrolledAt, prefs, addToCart, completeLesson, markViewed } = useStore();
  const c = id ? courseById(id) : undefined;
  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (c) markViewed(c.id);
  }, [c, markViewed]);
  if (!c) return <Navigate to="/courses" replace />;

  const isOwned = owned.includes(c.id);
  if (tab === 'grades' && !isOwned) return <Navigate to={'/courses/' + c.id} replace />;
  const inCart = cart.includes(c.id);
  const pct = prog[c.id] || 0;
  const done = lessons[c.id] || 0;
  const list = lessonsFor(c);
  const related = COURSES.filter((x) => x.cat === c.cat && x.id !== c.id).slice(0, 3);
  const openLesson = (i: number) => {
    nav('/courses/' + c.id);
    setTimeout(() => lessonRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  };

  return (
    <Page>
      <Breadcrumbs sx={{ mb: 1, fontSize: 14 }}>
        <Link component={RouterLink} to={'/courses?cat=' + c.cat} color="secondary.main" underline="hover">
          {c.catLabel.toLowerCase().replace(/(^|\s)\S/g, (x) => x.toUpperCase())}
        </Link>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          {tab === 'grades' ? 'Grade administration' : 'Course'}
        </Typography>
        {tab === 'grades' && <Typography sx={{ fontSize: 14, color: 'secondary.main' }}>User report</Typography>}
      </Breadcrumbs>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5, animation: 'txrise .5s both' }}>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, animation: 'txpop .6s .1s both' }}>
          <CourseIcon c={c} size={56} />
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 } }}>
          {c.title}
        </Typography>
      </Stack>
      {isOwned && (
        <Tabs value={tab} onChange={(_, v: string) => nav('/courses/' + c.id + (v === 'grades' ? '/grades' : ''))} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab value="course" label="Course" />
          <Tab value="grades" label="Grades" />
        </Tabs>
      )}

      {tab === 'grades' ? (
        <GradeReport c={c} done={done} onOpenLesson={openLesson} />
      ) : (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <CourseVideo key={c.id} src={c.video} poster={c.img} autoPlay={prefs.autoplay} title={c.title} />
              <Typography variant="overline" color="text.secondary" component="div" sx={{ mt: 3 }}>
                {c.catLabel}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 18, mb: 2 }}>
                {c.desc}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 4 }}>
                {c.meta.map((m) => (
                  <Chip key={m} label={m} variant="outlined" />
                ))}
              </Stack>
              <Reveal>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    What you will work with
                  </Typography>
                  <Grid container>
                    {c.learn.map((l) => (
                      <Grid item xs={12} sm={6} key={l}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.75 }}>
                          <CheckCircleIcon color="secondary" fontSize="small" />
                          <Typography>{l}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </Reveal>
              <Reveal>
                <Card sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6">Curriculum</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isOwned ? `${done} of ${list.length} lessons done` : `${list.length} lessons`}
                    </Typography>
                  </Stack>
                  {list.map((m, i) => {
                    const complete = isOwned && i < done;
                    const next = isOwned && i === done;
                    return (
                      <Stack
                        key={i}
                        ref={(el: HTMLDivElement | null) => {
                          lessonRefs.current[i] = el;
                        }}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={(t) => ({
                          p: 1.25, borderRadius: '12px', transition: 'background .3s',
                          ...(next && { background: t.tx.surface, border: `1px solid ${t.tx.hl}` }),
                        })}
                      >
                        {isOwned ? (
                          <Checkbox checked={complete} disabled={!next} onChange={() => completeLesson(c.id)} color="success" inputProps={{ 'aria-label': 'Mark lesson ' + (i + 1) + ' complete' }} />
                        ) : (
                          <LockIcon color="disabled" sx={{ mx: 1.25 }} />
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                            LESSON {i + 1}
                          </Typography>
                          <Typography sx={{ fontWeight: 600, textDecoration: complete ? 'line-through' : 'none', opacity: complete ? 0.7 : 1 }}>{m}</Typography>
                        </Box>
                        {next && (
                          <Button size="small" variant="contained" onClick={() => completeLesson(c.id)}>
                            Mark complete
                          </Button>
                        )}
                      </Stack>
                    );
                  })}
                </Card>
              </Reveal>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 110 }, animation: 'txpop .5s .15s both' }}>
                {isOwned ? (
                  <>
                    <Typography variant="overline" color="text.secondary">
                      YOUR PROGRESS
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 40 }}>{pct}%</Typography>
                    <LinearProgress variant="determinate" value={pct} color={pct >= 100 ? 'success' : 'primary'} sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      Enrolled {enrolledAt[c.id] ? new Date(enrolledAt[c.id]).toLocaleDateString() : ''}
                    </Typography>
                    <Stack spacing={1.25}>
                      {pct >= 100 ? (
                        <Button variant="contained" onClick={() => nav('/certificates')}>
                          Get my certificate
                        </Button>
                      ) : (
                        <Button variant="contained" onClick={() => completeLesson(c.id)}>
                          Complete next lesson
                        </Button>
                      )}
                      <Button variant="outlined" onClick={() => nav('/courses/' + c.id + '/grades')}>
                        View my grades
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Price c={c} size={32} />
                    <Stack spacing={1.25} sx={{ mt: 3 }}>
                      <Button variant="contained" size="large" onClick={() => (inCart ? nav('/cart') : addToCart(c.id))}>
                        {c.price === 0 ? 'Enroll for free' : inCart ? 'In cart · go to cart' : 'Add to cart'}
                      </Button>
                      <Button variant="outlined" onClick={() => nav('/cart')}>
                        View cart
                      </Button>
                    </Stack>
                  </>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Learn at your own pace, anytime, anywhere.
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Reveal sx={{ mt: { xs: 6, md: 8 } }}>
            <HowItWorks c={c} />
          </Reveal>
          <Grid container spacing={4} sx={{ mt: { xs: 2, md: 4 } }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Everything you get{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  inside
                </Box>
              </Typography>
              <Perks />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Questions about this course
              </Typography>
              <CourseFaq />
            </Grid>
          </Grid>
          {!isOwned && (
            <Reveal sx={{ mt: { xs: 6, md: 8 } }}>
              <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontSize: { xs: 26, md: 34 } }}>
                Why learners{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  trust Takxila
                </Box>
              </Typography>
              <ComparisonTable />
            </Reveal>
          )}
          {related.length > 0 && (
            <Reveal sx={{ mt: 7 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                More like this
              </Typography>
              <CourseGrid courses={related} />
            </Reveal>
          )}
        </>
      )}
    </Page>
  );
}
