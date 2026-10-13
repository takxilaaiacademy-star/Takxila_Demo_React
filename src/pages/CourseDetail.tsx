import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  LinearProgress,
  Link,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  type Theme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/LockOutlined';
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideoOutlined';
import ViewListIcon from '@mui/icons-material/ViewListOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsOutlined';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import LanguageIcon from '@mui/icons-material/Language';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import UpdateIcon from '@mui/icons-material/Update';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Price } from '../components/CourseCard';
import { relatedTo } from '../components/CartUpsell';
import GradeReport from '../components/GradeReport';
import { BlobImg } from '../components/Media';
import { usePreview } from '../components/Preview';
import { ComparisonTable, CourseFaq } from '../components/Showcase';
import { useStore } from '../context/StoreContext';
import { CAT_PILLS } from '../data/courses';
import type { CourseContent } from '../data/courseContent';
import { lessonsFor } from '../data/curriculum';
import { courseById, priceText } from '../data/recommend';
import { ALL_ACCESS_PRICE, PAID } from '../data/showcase';
import type { Course } from '../types';
import CoursePromo from '../components/CoursePromo';

/**
 * Consolidated JSON configuration holding repeated styling, badge themes,
 * colors, and UI display constants for the Course Detail page.
 * New developers: Update badges, update dates, limits, and common styles here.
 */
const COURSE_CONFIG = {
  lastUpdated: '10/2026',
  initialSectionsCount: 10,
  badges: {
    featured: { bgcolor: '#C7F0E4', color: '#0b3b2e', fontWeight: 700, height: 22 },
    free: { bgcolor: '#FDE2E2', color: '#7f1d1d', fontWeight: 700 },
    kicker: { bgcolor: '#DDD6FE', color: '#3b0764', fontWeight: 700, maxWidth: '100%' },
  },
  colors: {
    heroGradient: 'linear-gradient(120deg, #0b1022 0%, #141a3a 60%, #1d1450 100%)',
    purpleAccent: '#C4B5FD',
    allAccessPurple: '#5624d0',
    borderLight: '#d1d7e6',
  },
  styles: {
    hero: {
      background: 'linear-gradient(120deg, #0b1022 0%, #141a3a 60%, #1d1450 100%)',
      color: '#fff',
      pt: { xs: 3, md: 5 },
      pb: { xs: 3, md: 6 },
      mt: { xs: 2, md: 3 },
      position: 'relative',
      zIndex: 1,
    },
    breadcrumbs: {
      mb: 1.5,
      fontSize: 14,
      '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,.6)' },
    },
    breadLink: { color: '#C4B5FD', fontWeight: 600 },
    cardBordered: (t: Theme) => ({
      border: `1px solid ${t.tx.line}`,
      borderRadius: '12px',
      p: { xs: 2, md: 3 },
    }),
    curriculumBox: (t: Theme) => ({
      border: `1px solid ${t.tx.line}`,
      borderRadius: '10px',
      overflow: 'hidden',
    }),
    accordion: (t: Theme) => ({
      background: 'transparent',
      '&:before': { display: 'none' },
      '& + &': { borderTop: `1px solid ${t.tx.line}` },
    }),
    accordionSummary: (t: Theme) => ({
      flexDirection: 'row-reverse',
      gap: 1.5,
      bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,.04)' : '#F7F9FA',
      '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
    }),
    planOption: (t: Theme, selected: boolean) => ({
      border: `1px solid ${selected ? t.palette.primary.main : t.tx.line}`,
      borderRadius: '10px',
      px: 1.5,
      py: 1,
      mb: 1.25,
      background: selected ? (t.palette.mode === 'dark' ? 'rgba(91,124,255,.1)' : 'rgba(43,43,214,.05)') : 'transparent',
    }),
    relatedCard: (t: Theme) => ({
      p: 1.5,
      borderRadius: '14px',
      border: `1px solid ${t.tx.line}`,
      transition: 'border-color .2s',
      '&:hover': { borderColor: t.tx.hl },
    }),
    lessonRow: (t: Theme, active: boolean) => ({
      p: 1,
      borderRadius: '12px',
      ...(active && { background: t.tx.surface, border: `1px solid ${t.tx.hl}` }),
    }),
  },
} as const;

/** Category display title lookup */
const catName = (c: Course) => CAT_PILLS.find(([id]) => id === c.cat)?.[1] ?? '';

/** Format duration into human readable string (e.g., 45min, 2h 30m) */
const fmtLen = (min: number) => (min < 60 ? `${min}min` : `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`);

/** Lazy-load curriculum content in a separate bundle chunk on first request */
let contentPromise: Promise<Record<string, CourseContent>> | null = null;
const loadContent = () => (contentPromise ??= import('../data/courseContent').then((m) => m.CONTENT));

function useCourseContent(id: string | undefined) {
  const [all, setAll] = useState<Record<string, CourseContent> | null>(null);
  useEffect(() => {
    let live = true;
    void loadContent().then((m) => live && setAll(m));
    return () => {
      live = false;
    };
  }, []);
  return all && id ? (all[id] ?? null) : undefined;
}

/**
 * CourseDetail Page
 * -----------------
 * Displays full syllabus, previews, instructor details, enrollment options,
 * and personal lesson progress when enrolled.
 *
 * Route Modes:
 * - `tab="course"`: Syllabus, video preview, outcomes, requirements, and FAQs.
 * - `tab="grades"`: Enrolled student grade report and test scores.
 */
export default function CourseDetail({ tab = 'course' }: { tab?: 'course' | 'grades' }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { owned, cart, prog, lessons, enrolledAt, addToCart, addMany, completeLesson, markViewed } = useStore();

  const c = id ? courseById(id) : undefined;
  const content = useCourseContent(c?.id);
  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (c) markViewed(c.id);
  }, [c, markViewed]);

  // Single-pass computation of total minutes and lecture counts
  const { minutes, lectureCount } = useMemo(() => {
    if (!content) return { minutes: 0, lectureCount: 0 };
    let mins = 0;
    let count = 0;
    for (const section of content.sections) {
      count += section.lectures.length;
      for (const lecture of section.lectures) mins += lecture[1];
    }
    return { minutes: mins, lectureCount: count };
  }, [content]);

  // Memoized related courses
  const related = useMemo(() => (c ? relatedTo(c, owned, 5) : []), [c, owned]);

  if (!c) return <Navigate to="/courses" replace />;

  const isOwned = owned.includes(c.id);
  if (tab === 'grades' && !isOwned) return <Navigate to={'/courses/' + c.id} replace />;
  const done = lessons[c.id] || 0;

  const openLesson = (i: number) => {
    nav('/courses/' + c.id);
    setTimeout(() => lessonRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  };

  const courseFeatures = [
    [OndemandVideoIcon, (minutes ? fmtLen(minutes) : c.meta[0]) + ' of on-demand video'],
    [PhoneIphoneIcon, 'Access on mobile, laptop and TV'],
    [ViewListIcon, content ? `${content.sections.length} sections · ${lectureCount} lectures` : c.meta[1]],
    [EmojiEventsIcon, 'Certificate of completion'],
    [AssignmentIcon, 'Hands-on projects and practice tasks'],
    [AllInclusiveIcon, 'Learn at your own pace, anytime'],
  ] as const;
  // Course sheets with their own "This course includes" list show it instead of the standard one
  const features = content?.includes ? content.includes.map((text) => [CheckIcon, text] as const) : courseFeatures;

  return (
    <Box>
      {/* Top Hero Banner */}
      <Box sx={COURSE_CONFIG.styles.hero}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs sx={COURSE_CONFIG.styles.breadcrumbs}>
                <Link component={RouterLink} to="/courses" underline="hover" sx={COURSE_CONFIG.styles.breadLink}>
                  Courses
                </Link>
                <Link component={RouterLink} to={'/courses?cat=' + c.group} underline="hover" sx={COURSE_CONFIG.styles.breadLink}>
                  {c.catLabel.split(' - ')[0]}
                </Link>
                <Typography sx={COURSE_CONFIG.styles.breadLink}>{tab === 'grades' ? 'Grades' : catName(c)}</Typography>
              </Breadcrumbs>
              <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 26, md: 36 }, lineHeight: 1.2, mb: 1.5, color: '#fff', animation: 'txrise .4s both' }}>
                {c.title}
              </Typography>
              <Typography sx={{ fontSize: { xs: 16, md: 19 }, opacity: 0.92, mb: 2 }}>{content ? content.subtitle : c.short}</Typography>

              {/* Tag Chips */}
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {c.featured && <Chip size="small" label="Featured" sx={COURSE_CONFIG.badges.featured} />}
                {c.price === 0 && <Chip size="small" label="Free course" sx={COURSE_CONFIG.badges.free} />}
                <Chip size="small" label={c.kicker} sx={COURSE_CONFIG.badges.kicker} />
              </Stack>

              <Typography sx={{ mb: 1.5 }}>
                Created by{' '}
                <Link component={RouterLink} to="/about" sx={{ color: COURSE_CONFIG.colors.purpleAccent }}>
                  Takxila AI Academy
                </Link>
              </Typography>

              <Stack direction="row" gap={2.5} flexWrap="wrap" sx={{ fontSize: 14, opacity: 0.9, '& svg': { fontSize: 18, mr: 0.75, verticalAlign: '-4px' } }}>
                <span>
                  <UpdateIcon /> Last updated {COURSE_CONFIG.lastUpdated}
                </span>
                <span>
                  <LanguageIcon /> {content?.language ?? (c.id === 'junior' ? 'Regional language' : 'English')}
                </span>
                {content?.level && (
                  <span>
                    <SignalCellularAltIcon /> {content.level}
                  </span>
                )}
                <span>
                  <OndemandVideoIcon /> {c.meta[0]}
                </span>
              </Stack>
            </Grid>
          </Grid>

          {/* All Access Banner for Non-Enrolled Users */}
          {tab === 'course' && !isOwned && c.price > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ mt: 3, maxWidth: { md: 'calc(66.66% - 16px)' }, borderRadius: '10px', overflow: 'hidden', bgcolor: '#fff', color: '#1b1f33', border: `1px solid ${COURSE_CONFIG.colors.borderLight}` }}
            >
              <Stack alignItems="center" justifyContent="center" sx={{ px: 2.5, py: 1.5, bgcolor: COURSE_CONFIG.colors.allAccessPurple, color: '#fff', minWidth: 110 }}>
                <WorkspacePremiumIcon />
                <Typography sx={{ fontWeight: 800 }}>All Access</Typography>
              </Stack>
              <Typography sx={{ px: 2, py: 1.5, fontSize: 14, flex: 1, alignSelf: 'center' }}>
                Get this course and all {PAID.length - 1} other paid courses for ₹{ALL_ACCESS_PRICE}, with every future update.
              </Typography>
              <Stack direction="row" divider={<Box sx={{ width: '1px', bgcolor: COURSE_CONFIG.colors.borderLight }} />} sx={{ borderLeft: { sm: `1px solid ${COURSE_CONFIG.colors.borderLight}` } }}>
                <Stat value={content ? String(content.sections.length) : '…'} label="sections" />
                <Stat value={content ? String(lectureCount) : '…'} label="lectures" />
              </Stack>
            </Stack>
          )}
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          {/* Sticky Purchase / Progress Card */}
          <Grid item xs={12} md={4} sx={{ order: { md: 2 } }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 100 }, mt: { md: tab === 'course' && !isOwned && c.price > 0 ? -38 : -30 }, zIndex: 2 }}>
              <BuyCard
                c={c}
                isOwned={isOwned}
                inCart={cart.includes(c.id)}
                pct={prog[c.id] || 0}
                enrolled={enrolledAt[c.id]}
                onAdd={() => addToCart(c.id)}
                onBuyNow={() => {
                  if (!cart.includes(c.id)) addMany([c.id]);
                  nav('/cart');
                }}
                onAllAccess={() => {
                  addMany(PAID.filter((x) => !owned.includes(x.id)).map((x) => x.id));
                  nav('/cart');
                }}
                onNextLesson={() => completeLesson(c.id)}
              />
            </Box>
          </Grid>

          {/* Left Column Syllabus & Outcomes */}
          <Grid item xs={12} md={8} sx={{ order: { md: 1 } }}>
            {isOwned && (
              <Tabs value={tab} onChange={(_, v: string) => nav('/courses/' + c.id + (v === 'grades' ? '/grades' : ''))} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab value="course" label="Course" />
                <Tab value="grades" label="Grades" />
              </Tabs>
            )}

            {tab === 'grades' ? (
              <GradeReport c={c} done={done} onOpenLesson={openLesson} />
            ) : (
              <Stack spacing={4}>
                {isOwned && <MyLessons c={c} done={done} refs={lessonRefs} onComplete={() => completeLesson(c.id)} />}

                {/* The academy's promo card for this course */}
                {!isOwned && <CoursePromo c={c} onEnroll={() => addToCart(c.id)} />}

                {content === undefined ? (
                  <ContentSkeleton />
                ) : (
                  <>
                    {/* What you'll learn */}
                    <Box sx={COURSE_CONFIG.styles.cardBordered}>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        What you&apos;ll learn
                      </Typography>
                      <Grid container columnSpacing={3} rowSpacing={1.25}>
                        {(content?.learn ?? c.learn).map((l) => (
                          <Grid item xs={12} sm={6} key={l}>
                            <Stack direction="row" spacing={1.25}>
                              <CheckIcon fontSize="small" sx={{ mt: '2px', color: 'text.secondary' }} />
                              <Typography sx={{ fontSize: 14 }}>{l}</Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Related topics chips */}
                    <Box>
                      <Typography variant="h5" sx={{ mb: 1.5 }}>
                        Explore related topics
                      </Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {Array.from(new Set([c.catLabel.split(' - ')[0], catName(c), ...c.tags.slice(0, 3).map((t) => t[0].toUpperCase() + t.slice(1))])).map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            variant="outlined"
                            clickable
                            onClick={() => nav('/courses?view=cards&q=' + encodeURIComponent(t.toLowerCase()))}
                            sx={{ fontWeight: 700, borderRadius: '6px' }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Course Features */}
                    <Box>
                      <Typography variant="h5" sx={{ mb: 1.5 }}>
                        This course includes:
                      </Typography>
                      <Grid container rowSpacing={1.25} columnSpacing={3} sx={{ '& svg': { fontSize: 20, color: 'text.secondary' } }}>
                        {features.map(([Icon, text]) => (
                          <Grid item xs={12} sm={6} key={text}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Icon />
                              <Typography sx={{ fontSize: 15 }}>{text}</Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Expandable Curriculum */}
                    {content && <Curriculum content={content} minutes={minutes} lectures={lectureCount} unlocked={isOwned} />}

                    {/* Requirements and Description */}
                    {content && (
                      <>
                        <Box>
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            Requirements
                          </Typography>
                          <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 0.75, fontSize: 15 } }}>
                            {content.requirements.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </Box>
                        </Box>
                        <Description paragraphs={content.description} audience={content.audience} />
                      </>
                    )}
                  </>
                )}

                {related.length > 0 && <AlsoLike courses={related} />}

                {!isOwned && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Questions about this course
                    </Typography>
                    <CourseFaq />
                  </Box>
                )}
              </Stack>
            )}
          </Grid>
        </Grid>

        {/* Comparison table */}
        {tab === 'course' && !isOwned && (
          <Box sx={{ mt: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontSize: { xs: 26, md: 34 } }}>
              Why learners{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                trust Takxila
              </Box>
            </Typography>
            <ComparisonTable />
          </Box>
        )}
      </Container>
    </Box>
  );
}

/** Stat item in the All-Access banner */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ px: 2.5, py: 1.25, textAlign: 'center', flex: 1 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{value}</Typography>
      <Typography sx={{ fontSize: 13, color: '#5a6178' }}>{label}</Typography>
    </Box>
  );
}

interface BuyCardProps {
  c: Course;
  isOwned: boolean;
  inCart: boolean;
  pct: number;
  enrolled?: string;
  onAdd: () => void;
  onBuyNow: () => void;
  onAllAccess: () => void;
  onNextLesson: () => void;
}

/** Floating Card displaying purchase pricing, progress, and video preview trigger */
function BuyCard({ c, isOwned, inCart, pct, enrolled, onAdd, onBuyNow, onAllAccess, onNextLesson }: BuyCardProps) {
  const nav = useNavigate();
  const preview = usePreview();
  const [plan, setPlan] = useState<'single' | 'all'>('single');

  return (
    <Card sx={{ overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.25)' }}>
      {/* Video Preview thumbnail with play icon */}
      <Box sx={{ position: 'relative', cursor: 'pointer', '&:hover .tx-pv': { transform: 'scale(1.08)' } }} onClick={() => preview(c.id)}>
        <BlobImg src={c.img} alt={c.title} ratio="375 / 110" eager />
        <Stack alignItems="center" justifyContent="flex-end" sx={{ position: 'absolute', inset: 0, pb: 1.5, background: 'linear-gradient(transparent 30%, rgba(0,0,0,.65))' }}>
          <PlayCircleIcon className="tx-pv" sx={{ fontSize: 58, color: '#fff', transition: 'transform .25s', mb: 0.5 }} />
          <Typography sx={{ color: '#fff', fontWeight: 700 }}>Preview this course</Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {isOwned ? (
          <>
            <Typography variant="overline" color="text.secondary">
              YOUR PROGRESS
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 36 }}>{pct}%</Typography>
            <LinearProgress variant="determinate" value={pct} color={pct >= 100 ? 'success' : 'primary'} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enrolled {enrolled ? new Date(enrolled).toLocaleDateString() : ''}
            </Typography>
            <Stack spacing={1.25}>
              {pct >= 100 ? (
                <Button variant="contained" onClick={() => nav('/certificates')}>
                  Get my certificate
                </Button>
              ) : (
                <Button variant="contained" onClick={onNextLesson}>
                  Complete next lesson
                </Button>
              )}
              <Button variant="outlined" onClick={() => nav('/courses/' + c.id + '/grades')}>
                View my grades
              </Button>
            </Stack>
          </>
        ) : c.price === 0 ? (
          <>
            <Typography sx={{ fontWeight: 800, fontSize: 30, color: 'error.main' }}>FREE COURSE</Typography>
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={onAdd}>
              Enroll for free
            </Button>
          </>
        ) : (
          <>
            <RadioGroup value={plan} onChange={(e) => setPlan(e.target.value as 'single' | 'all')}>
              <PlanOption value="single" selected={plan === 'single'} title="Buy this course">
                <Price c={c} size={26} />
              </PlanOption>
              <PlanOption value="all" selected={plan === 'all'} title="All Access · every course">
                <Typography sx={{ fontWeight: 800, fontSize: 22 }}>₹{ALL_ACCESS_PRICE}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  All {PAID.length} paid courses, including this one, plus every future update.
                </Typography>
              </PlanOption>
            </RadioGroup>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {plan === 'all' ? (
                <Button variant="contained" size="large" onClick={onAllAccess}>
                  Get All Access
                </Button>
              ) : (
                <>
                  <Button variant="contained" size="large" startIcon={inCart ? null : <AddShoppingCartIcon />} onClick={() => (inCart ? nav('/cart') : onAdd())}>
                    {inCart ? 'In cart · go to cart' : 'Add to cart'}
                  </Button>
                  <Button variant="outlined" size="large" onClick={onBuyNow}>
                    Buy now
                  </Button>
                </>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
              Secure payment with Razorpay · UPI, cards, net banking
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
}

/** Plan selection radio button with custom border and highlight */
function PlanOption({ value, selected, title, children }: { value: string; selected: boolean; title: string; children: React.ReactNode }) {
  return (
    <Box sx={(t) => COURSE_CONFIG.styles.planOption(t, selected)}>
      <FormControlLabel
        value={value}
        control={<Radio size="small" />}
        sx={{ alignItems: 'flex-start', m: 0, width: '100%', '& .MuiRadio-root': { mt: -0.25 } }}
        label={
          <Box sx={{ pl: 0.5 }}>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{title}</Typography>
            {children}
          </Box>
        }
      />
    </Box>
  );
}

/** Accordion list of all sections and lectures with preview chips and durations */
function Curriculum({ content, minutes, lectures, unlocked }: { content: CourseContent; minutes: number; lectures: number; unlocked: boolean }) {
  const [open, setOpen] = useState<number[]>([0]);
  const [showAll, setShowAll] = useState(false);
  const totalSections = content.sections.length;
  const allOpen = open.length === totalSections;
  const shown = showAll ? content.sections : content.sections.slice(0, COURSE_CONFIG.initialSectionsCount);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Course content
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          {totalSections} sections · {lectures} lectures · {fmtLen(minutes)} total length
        </Typography>
        <Button
          size="small"
          onClick={() => {
            setShowAll(true);
            setOpen(allOpen ? [] : content.sections.map((_, i) => i));
          }}
        >
          {allOpen ? 'Collapse all sections' : 'Expand all sections'}
        </Button>
      </Stack>

      <Box sx={COURSE_CONFIG.styles.curriculumBox}>
        {shown.map((section, i) => {
          const sectionMins = section.lectures.reduce((acc, l) => acc + l[1], 0);
          return (
            <Accordion
              key={i}
              disableGutters
              square
              elevation={0}
              expanded={open.includes(i)}
              onChange={() => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}
              TransitionProps={{ unmountOnExit: true }}
              sx={COURSE_CONFIG.styles.accordion}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={COURSE_CONFIG.styles.accordionSummary}>
                <Typography sx={{ fontWeight: 700, flexGrow: 1, fontSize: 15 }}>{section.title}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13, whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}>
                  {section.lectures.length} lectures · {fmtLen(sectionMins)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ py: 1 }}>
                {section.lectures.map(([title, min], j) => (
                  <Stack key={j} direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.75 }}>
                    {unlocked || (i === 0 && j === 0) ? <PlayCircleIcon fontSize="small" color="action" /> : <LockIcon fontSize="small" color="disabled" />}
                    <Typography sx={{ flexGrow: 1, fontSize: 14 }}>{title}</Typography>
                    {i === 0 && j === 0 && !unlocked && <Chip size="small" label="Preview" variant="outlined" color="primary" sx={{ height: 22 }} />}
                    <Typography color="text.secondary" sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                      {String(Math.floor(min / 60)).padStart(2, '0')}:{String(min % 60).padStart(2, '0')}
                    </Typography>
                  </Stack>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {!showAll && totalSections > COURSE_CONFIG.initialSectionsCount && (
        <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1.25 }} onClick={() => setShowAll(true)}>
          {totalSections - COURSE_CONFIG.initialSectionsCount} more sections
        </Button>
      )}
    </Box>
  );
}

/** Expandable course description and target audience list */
function Description({ paragraphs, audience }: { paragraphs: string[]; audience: string[] }) {
  const [more, setMore] = useState(false);
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Description
      </Typography>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          maxHeight: more ? 'none' : 220,
          ...(!more && { maskImage: 'linear-gradient(#000 55%, transparent)', WebkitMaskImage: 'linear-gradient(#000 55%, transparent)' }),
        }}
      >
        {paragraphs.map((p, i) => (
          <Typography key={i} sx={{ mb: p.startsWith('• ') ? 0.5 : 1.5, fontSize: 15, lineHeight: 1.7 }}>
            {p}
          </Typography>
        ))}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Who this course is for:
        </Typography>
        <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 0.75, fontSize: 15 } }}>
          {audience.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </Box>
      </Box>
      <Button size="small" endIcon={<ExpandMoreIcon sx={{ transform: more ? 'rotate(180deg)' : 'none' }} />} onClick={() => setMore((m) => !m)} sx={{ mt: 0.5, fontWeight: 700 }}>
        {more ? 'Show less' : 'Show more'}
      </Button>
    </Box>
  );
}

/** Recommended similar courses list */
function AlsoLike({ courses }: { courses: Course[] }) {
  const nav = useNavigate();
  const { cart, addToCart } = useStore();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Learners also explore
      </Typography>
      <Stack spacing={1.5}>
        {courses.map((r) => (
          <Stack key={r.id} direction="row" spacing={2} alignItems="center" sx={COURSE_CONFIG.styles.relatedCard}>
            <BlobImg src={r.img} alt="" ratio="375 / 110" onClick={() => nav('/courses/' + r.id)} sx={{ width: { xs: 90, sm: 140 }, flex: 'none', borderRadius: '8px', cursor: 'pointer' }} />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography onClick={() => nav('/courses/' + r.id)} sx={{ fontWeight: 700, lineHeight: 1.3, cursor: 'pointer', fontSize: { xs: 14, sm: 16 }, '&:hover': { textDecoration: 'underline' } }}>
                {r.title}
              </Typography>
              <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 0.75 }}>
                {r.featured && <Chip size="small" label="Featured" sx={COURSE_CONFIG.badges.featured} />}
                <Chip size="small" variant="outlined" label={r.meta[0]} sx={{ height: 22 }} />
                <Chip size="small" variant="outlined" label={'Updated ' + COURSE_CONFIG.lastUpdated} sx={{ height: 22, display: { xs: 'none', sm: 'inline-flex' } }} />
              </Stack>
            </Box>
            <Stack alignItems="flex-end" spacing={0.5} sx={{ flex: 'none' }}>
              <Typography sx={{ fontWeight: 800 }}>{priceText(r)}</Typography>
              {cart.includes(r.id) ? (
                <Chip size="small" label="In cart" onClick={() => nav('/cart')} />
              ) : (
                <Button size="small" variant="outlined" onClick={() => addToCart(r.id)} aria-label={'Add ' + r.title + ' to cart'} sx={{ minWidth: 0, px: 1 }}>
                  <AddShoppingCartIcon fontSize="small" />
                </Button>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

/** Interactive checklist for enrolled students to track module progress */
function MyLessons({ c, done, refs, onComplete }: { c: Course; done: number; refs: React.MutableRefObject<(HTMLDivElement | null)[]>; onComplete: () => void }) {
  const list = lessonsFor(c);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">Your lessons</Typography>
        <Typography variant="body2" color="text.secondary">
          {done} of {list.length} done
        </Typography>
      </Stack>
      {list.map((m, i) => {
        const complete = i < done;
        const next = i === done;
        return (
          <Stack
            key={i}
            ref={(el: HTMLDivElement | null) => {
              refs.current[i] = el;
            }}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={(t) => COURSE_CONFIG.styles.lessonRow(t, next)}
          >
            <Checkbox checked={complete} disabled={!next} onChange={onComplete} color="success" inputProps={{ 'aria-label': 'Mark lesson ' + (i + 1) + ' complete' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                LESSON {i + 1}
              </Typography>
              <Typography sx={{ fontWeight: 600, textDecoration: complete ? 'line-through' : 'none', opacity: complete ? 0.7 : 1 }}>{m}</Typography>
            </Box>
            {next && (
              <Button size="small" variant="contained" onClick={onComplete}>
                Mark complete
              </Button>
            )}
          </Stack>
        );
      })}
    </Card>
  );
}

/** Skeleton loading animation while curriculum chunk loads */
function ContentSkeleton() {
  return (
    <Stack spacing={2} role="status" aria-label="Loading course content">
      <Skeleton variant="rounded" height={220} />
      <Skeleton width="40%" height={36} />
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={52} />
      ))}
    </Stack>
  );
}
