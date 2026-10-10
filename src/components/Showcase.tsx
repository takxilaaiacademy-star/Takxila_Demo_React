// Course showcase blocks shared by the landing page, the catalog, the dashboard and course pages:
// numbered course tiles, the comparison table, combo packs, plans, "how it works" and perks.
import { memo, useMemo, useRef, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  Stack, Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HourglassIcon from '@mui/icons-material/HourglassEmptyRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/HighlightOff';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBookOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import BuildIcon from '@mui/icons-material/BuildOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgentOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import {
  ALL_ACCESS_PRICE, COMPARE_COLS, COMPARE_PRICE, COMPARE_ROWS, COMPARE_SAVE, COURSE_FAQ, CUSTOM_MIN, PACK_GROUPS, PACKS, PAID, PERKS,
  durationText, howItWorks, listPrice, packList, type Pack, type PackGroup,
} from '../data/showcase';
import type { Course } from '../types';
import { CourseIcon } from './CourseIcon';
import { LogoFull } from './Logo';
import { usePreview } from './Preview';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

/** Numbered course tile: icon, title, duration and a Curriculum button. */
export const NumberedCourse = memo(function NumberedCourse({ c, n, index = 0, action }: { c: Course; n: number; index?: number; action?: (c: Course) => void }) {
  const preview = usePreview();
  return (
    <Box
      onClick={() => (action ? action(c) : preview(c.id))}
      sx={(t) => ({
        position: 'relative', p: 2, height: '100%', borderRadius: '18px', border: `1px solid ${t.tx.line}`, background: t.tx.surface, backdropFilter: 'blur(16px)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 1.5,
        animation: `txrise .5s cubic-bezier(.2,.8,.2,1) ${Math.min(index, 15) * 40}ms both`,
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s',
        '&:hover': { transform: 'translateY(-6px)', borderColor: t.tx.hl, boxShadow: `0 22px 48px ${t.tx.glow}` },
        '&:hover .tx-cicon': { transform: 'rotate(-8deg) scale(1.1)' },
        '&:hover .tx-num': { color: t.tx.hl, transform: 'scale(1.15)' },
      })}
    >
      <Typography className="tx-num" sx={(t) => ({ position: 'absolute', top: 8, right: 14, fontWeight: 800, fontSize: 22, color: t.tx.line, transition: 'all .35s' })}>
        {n}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pr: 3, minHeight: 48 }}>
        <CourseIcon c={c} size={44} />
        <Typography sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {c.title}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={(t) => ({ border: `1px solid ${t.tx.line}`, borderRadius: '8px', px: 1, py: 0.5, color: 'text.secondary', fontSize: 13, whiteSpace: 'nowrap' })}>
        <HourglassIcon sx={{ fontSize: 15 }} />
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{durationText(c)}</Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography component="span" sx={{ fontWeight: 800, fontSize: 13, color: c.price ? 'text.primary' : 'error.main' }}>
          {c.price ? fmt(c.price) : 'FREE'}
        </Typography>
      </Stack>
      <Button variant="outlined" color="secondary" endIcon={<ChevronRightIcon />} sx={{ mt: 'auto', minHeight: 40 }} tabIndex={-1}>
        Curriculum
      </Button>
    </Box>
  );
});

export function NumberedGrid({ courses, start = 1, action }: { courses: Course[]; start?: number; action?: (c: Course) => void }) {
  return (
    // Columns fit the space the grid actually has (it sits in narrow dashboard columns too), never below 236px a card.
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 236px), 1fr))', '& > *': { minWidth: 0 } }}>
      {courses.map((c, i) => (
        <NumberedCourse key={c.id} c={c} n={start + i} index={i} action={action} />
      ))}
    </Box>
  );
}

/** "Why learners trust Takxila": Takxila vs YouTube vs other platforms. */
export function ComparisonTable() {
  const nav = useNavigate();
  const { isAuthed } = useAuth();
  const cell = { px: { xs: 1, sm: 2 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } as const;
  return (
    <Box sx={(t) => ({ maxWidth: 820, mx: 'auto', borderRadius: '22px', overflow: 'hidden', border: `1px solid ${t.tx.line}`, background: t.tx.surface, backdropFilter: 'blur(18px)' })}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1.5fr 1fr 1fr 1fr', sm: '2fr 1.1fr 1fr 1fr' } }}>
        <Box sx={{ ...cell, justifyContent: 'flex-start', fontWeight: 800 }}>Features</Box>
        <Box sx={(t) => ({ ...cell, bgcolor: t.palette.mode === 'dark' ? 'rgba(91,124,255,.22)' : 'rgba(11,31,107,.08)', py: 1 })}>
          <LogoFull width={86} />
        </Box>
        {COMPARE_COLS.slice(1).map((c) => (
          <Box key={c} sx={{ ...cell, fontWeight: 600, fontSize: { xs: 12, sm: 14 }, color: 'text.secondary' }}>
            {c}
          </Box>
        ))}
        {[['Price', ...COMPARE_PRICE] as const].map(([label, ...vals]) => (
          <Box key={label} sx={{ display: 'contents' }}>
            <Box sx={(t) => ({ ...cell, justifyContent: 'flex-start', borderTop: `1px solid ${t.tx.line}`, fontSize: { xs: 13, sm: 15 } })}>{label}</Box>
            {vals.map((v, i) => (
              <Box key={i} sx={(t) => ({ ...cell, borderTop: `1px solid ${t.tx.line}`, fontWeight: 800, fontSize: { xs: 12, sm: 15 }, color: i === 0 ? 'secondary.main' : i === 1 ? 'success.main' : 'text.primary', bgcolor: i === 0 ? (t.palette.mode === 'dark' ? 'rgba(91,124,255,.10)' : 'rgba(11,31,107,.04)') : undefined })}>
                {v}
              </Box>
            ))}
          </Box>
        ))}
        {COMPARE_ROWS.map(([label, ...vals], r) => (
          <Box key={label} sx={{ display: 'contents' }}>
            <Box sx={(t) => ({ ...cell, justifyContent: 'flex-start', textAlign: 'left', borderTop: `1px solid ${t.tx.line}`, fontSize: { xs: 13, sm: 15 }, animation: `txrise .5s ${r * 60}ms both` })}>{label}</Box>
            {vals.map((ok, i) => (
              <Box key={i} sx={(t) => ({ ...cell, borderTop: `1px solid ${t.tx.line}`, bgcolor: i === 0 ? (t.palette.mode === 'dark' ? 'rgba(91,124,255,.10)' : 'rgba(11,31,107,.04)') : undefined })}>
                {ok ? (
                  <CheckCircleIcon sx={{ color: 'success.main', animation: `txpop .4s ${300 + r * 60}ms both` }} aria-label="Yes" />
                ) : (
                  <CancelIcon sx={{ color: 'error.main', opacity: 0.85 }} aria-label="No" />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ px: 3, py: 2.5, color: '#fff', background: 'linear-gradient(110deg, #2EBD85, #0E5F49 60%, #0B3B2E)', backgroundSize: '200% 100%', animation: 'txgradient 8s ease infinite' }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 12, letterSpacing: '.12em', opacity: 0.85 }}>YOU SAVE UP TO</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 30 }}>{fmt(COMPARE_SAVE)}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={() => nav(isAuthed ? '/courses' : '/auth#register')} sx={{ bgcolor: '#fff', color: '#0B3B2E', '&:hover': { bgcolor: '#fff' } }}>
            {isAuthed ? 'Explore courses' : 'Enroll from ₹99'}
          </Button>
          <Typography sx={{ fontSize: 11, mt: 0.75, opacity: 0.9 }}>
            <BoltIcon sx={{ fontSize: 12, verticalAlign: 'middle', color: '#F5B93F' }} /> No hidden charges after enrollment
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

/** Adds a set of courses to the cart, or sends visitors to register first. */
function useBuy() {
  const nav = useNavigate();
  const { isAuthed } = useAuth();
  const { addMany } = useStore();
  return (ids: string[]) => {
    if (!isAuthed) return nav('/auth#register');
    addMany(ids);
    nav('/cart');
  };
}

function PackCard({ p, onOpen, index }: { p: Pack; onOpen: (p: Pack) => void; index: number }) {
  const list = packList(p);
  const off = Math.round((1 - p.price / list) * 100);
  return (
    <Box
      sx={(t) => ({
        width: 268, flex: 'none', scrollSnapAlign: 'start', borderRadius: '18px', p: 1.75, display: 'flex', flexDirection: 'column', gap: 1.25,
        bgcolor: t.palette.mode === 'dark' ? 'rgba(17,25,54,.92)' : '#fff', border: `1px solid ${t.tx.line}`,
        animation: `txrise .5s ${index * 60}ms both`, transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s',
        '&:hover': { transform: 'translateY(-6px) rotate(-.4deg)', boxShadow: `0 24px 48px ${t.tx.glow}` },
      })}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 11, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PeopleIcon sx={{ fontSize: 14 }} /> {p.courses.length} courses
        </Typography>
        <Chip label={off + '% OFF'} size="small" color="success" sx={{ height: 20, fontSize: 10, fontWeight: 800 }} />
      </Stack>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>{p.title}</Typography>
        <Typography sx={{ fontSize: 10, letterSpacing: '.24em', color: 'text.secondary' }}>COMBO PACK</Typography>
      </Box>
      <Stack direction="row" spacing={1} sx={(t) => ({ bgcolor: t.palette.mode === 'dark' ? 'rgba(245,185,63,.12)' : 'rgba(245,185,63,.18)', borderRadius: '8px', px: 1, py: 0.5, fontSize: 12 })}>
        <StarIcon sx={{ fontSize: 14, color: '#F5B93F' }} />
        <span>{p.rating} rating</span>
        <Box sx={{ flexGrow: 1 }} />
        <span>
          <b>{fmt(p.price)}</b>{' '}
          <Box component="s" sx={{ color: 'text.secondary' }}>
            {fmt(list)}
          </Box>
        </span>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, flexGrow: 1 }}>
        {p.courses.slice(0, 6).map((id) => {
          const c = courseById(id);
          return c ? (
            <Stack key={id} direction="row" spacing={0.75} alignItems="center" sx={(t) => ({ border: `1px solid ${t.tx.line}`, borderRadius: '8px', p: 0.5 })}>
              <CourseIcon c={c} size={22} />
              <Typography sx={{ fontSize: 10.5, lineHeight: 1.15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.title}</Typography>
            </Stack>
          ) : null;
        })}
        {p.courses.length > 6 && <Typography sx={{ fontSize: 11, color: 'text.secondary', alignSelf: 'center', pl: 0.5 }}>+{p.courses.length - 6} more</Typography>}
      </Box>
      <Button variant="contained" size="small" endIcon={<ChevronRightIcon />} onClick={() => onOpen(p)} sx={{ minHeight: 38 }}>
        Explore this pack
      </Button>
    </Box>
  );
}

/** Career-focused combo packs with a filter and a swipeable row. */
export function ComboPacks() {
  const [group, setGroup] = useState<PackGroup | 'all'>('all');
  const [open, setOpen] = useState<Pack | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const packs = useMemo(() => PACKS.filter((p) => group === 'all' || p.group === group), [group]);
  const scroll = (dir: number) => row.current?.scrollBy({ left: dir * 560, behavior: 'smooth' });
  return (
    <Box>
      <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" sx={{ mb: 2.5 }}>
        {PACK_GROUPS.map(([id, label]) => (
          <Chip key={id} label={label} clickable color={group === id ? 'primary' : 'default'} variant={group === id ? 'filled' : 'outlined'} onClick={() => setGroup(id)} />
        ))}
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <Box ref={row} sx={{ display: 'flex', gap: 2, overflowX: 'auto', scrollSnapType: 'x mandatory', pb: 1.5, px: 0.5, scrollbarWidth: 'thin' }} key={group}>
          {packs.map((p, i) => (
            <PackCard key={p.id} p={p} index={i} onOpen={setOpen} />
          ))}
        </Box>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
          <IconButton aria-label="Previous packs" onClick={() => scroll(-1)} sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton aria-label="Next packs" onClick={() => scroll(1)} sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Box>
      {open && <PackDialog p={open} onClose={() => setOpen(null)} />}
    </Box>
  );
}

function PackDialog({ p, onClose }: { p: Pack; onClose: () => void }) {
  const buy = useBuy();
  const preview = usePreview();
  const { owned } = useStore();
  const list = packList(p);
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {p.title} combo pack
        <Typography color="text.secondary">
          {p.courses.length} courses · <b>{fmt(p.price)}</b> instead of <s>{fmt(list)}</s>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          {p.courses.map((id, i) => {
            const c = courseById(id);
            if (!c) return null;
            return (
              <Stack key={id} direction="row" spacing={1.5} alignItems="center" sx={{ animation: `txrise .4s ${i * 50}ms both` }}>
                <CourseIcon c={c} size={36} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                    {c.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {durationText(c)} · {fmt(c.price)}
                    {owned.includes(id) ? ' · already yours' : ''}
                  </Typography>
                </Box>
                <Button size="small" onClick={() => preview(id)}>
                  Preview
                </Button>
              </Stack>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => buy(p.courses)}>
          Add pack to cart · {fmt(p.price)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** All Access and Customized pack plans. */
export function Plans() {
  const buy = useBuy();
  const nav = useNavigate();
  const list = listPrice(PAID.map((c) => c.id));
  const plans = [
    { tag: 'Popular', title: 'All Access course pack', sub: `All ${PAID.length} paid courses`, note: 'Every course, every update in the catalog', price: ALL_ACCESS_PRICE, was: list, cta: 'Get All Access', act: () => buy(PAID.map((c) => c.id)) },
    { tag: 'New', title: 'Customized course pack', sub: `Choose any ${CUSTOM_MIN} or more courses`, note: '25% off applied in the cart automatically', price: null, was: null, cta: 'Pick my courses', act: () => nav('/courses') },
  ];
  return (
    <Grid container spacing={2.5} justifyContent="center">
      {plans.map((p, i) => (
        <Grid item xs={12} sm={6} md={4} key={p.title}>
          <Box
            sx={(t) => ({
              position: 'relative', p: 3, height: '100%', borderRadius: '22px', border: `1px solid ${i === 0 ? t.tx.hl : t.tx.line}`, background: t.tx.surface, backdropFilter: 'blur(18px)',
              display: 'flex', flexDirection: 'column', gap: 1.25, transition: 'transform .35s, box-shadow .35s', '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 26px 56px ${t.tx.glow}` },
              ...(i === 0 && { boxShadow: `0 0 0 1px ${t.tx.hl}, 0 20px 50px ${t.tx.glow}` }),
            })}
          >
            <Chip label={p.tag} size="small" color={i === 0 ? 'primary' : 'secondary'} sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 800 }} />
            <Typography variant="h6" sx={{ pr: 8 }}>
              {p.title}
            </Typography>
            <Typography color="text.secondary">{p.sub}</Typography>
            <Typography variant="body2" sx={(t) => ({ bgcolor: t.tx.surface, border: `1px dashed ${t.tx.line}`, borderRadius: '10px', p: 1, textAlign: 'center' })}>
              {p.note}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {p.price ? (
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography sx={{ fontWeight: 800, fontSize: 30 }}>{fmt(p.price)}</Typography>
                <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  {fmt(p.was ?? 0)}
                </Typography>
                <Chip size="small" color="success" label={Math.round((1 - p.price / (p.was ?? 1)) * 100) + '% off'} />
              </Stack>
            ) : (
              <Typography sx={{ fontWeight: 800, fontSize: 30 }}>25% off</Typography>
            )}
            <Button variant={i === 0 ? 'contained' : 'outlined'} size="large" onClick={p.act}>
              {p.cta}
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

const STEP_ICONS = [PaymentsIcon, TaskAltIcon, WorkspacePremiumIcon];
const PERK_ICONS = [MenuBookIcon, DescriptionIcon, FolderIcon, WorkspacePremiumIcon, BuildIcon, LeaderboardIcon, SupportAgentIcon];

/** "How it works" steps on a gradient band (from the challenge pages on tutedude.com). */
export function HowItWorks({ c }: { c: Course }) {
  const steps = howItWorks(c);
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: '24px', p: { xs: 3, md: 5 }, color: '#fff',
        background: 'radial-gradient(120% 140% at 0% 0%, #3B2BD6 0%, #1A1250 45%, #0A1022 100%)',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 3.5, fontSize: { xs: 24, md: 32 } }}>
        How {c.title.length > 34 ? 'this course' : c.title} works
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            {steps.map(([a, hl, b], i) => {
              const Icon = STEP_ICONS[i];
              return (
                <Stack
                  key={i}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    bgcolor: '#fff', color: '#0B1030', borderRadius: '999px 18px 18px 999px', p: 1, pr: 2.5, position: 'relative',
                    animation: `txrise .6s ${i * 150}ms both`, transition: 'transform .3s', '&:hover': { transform: 'translateX(8px)' },
                  }}
                >
                  <Box sx={{ width: 52, height: 52, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#EEF1FB', color: '#2B2BD6', flex: 'none' }}>
                    <Icon />
                  </Box>
                  <Typography sx={{ fontWeight: 700, flexGrow: 1 }}>
                    {a}
                    <Box component="span" sx={{ color: '#2B2BD6' }}>
                      {hl}
                    </Box>
                    {b}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 30, color: '#D9DEF5' }}>{i + 1}</Typography>
                </Stack>
              );
            })}
          </Stack>
        </Grid>
        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: 220, height: 220, display: 'grid', placeItems: 'center' }}>
            <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed rgba(245,185,63,.6)', animation: 'txspin 18s linear infinite' }} />
            <Box sx={{ position: 'absolute', inset: 22, borderRadius: '50%', background: 'radial-gradient(circle, #F5B93F, #B8862A)', boxShadow: '0 0 60px rgba(245,185,63,.5)', animation: 'txfloat 5s ease-in-out infinite' }} />
            <Box sx={{ position: 'relative', textAlign: 'center', color: '#0A1022' }}>
              <WorkspacePremiumIcon sx={{ fontSize: 44 }} />
              <Typography sx={{ fontWeight: 800, fontSize: 13, letterSpacing: '.1em' }}>CERTIFIED</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 11 }}>TAKXILA AI ACADEMY</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

/** "Everything you get inside" grid of perks. */
export function Perks() {
  return (
    <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
      {PERKS.map((p, i) => {
        const Icon = PERK_ICONS[i % PERK_ICONS.length];
        return (
          <Stack
            key={p}
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={(t) => ({
              p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, background: t.tx.surface, animation: `txrise .45s ${i * 50}ms both`,
              gridColumn: i === PERKS.length - 1 && PERKS.length % 2 ? { sm: '1 / -1' } : undefined, transition: 'transform .3s, border-color .3s',
              '&:hover': { transform: 'translateY(-3px)', borderColor: t.tx.hl },
            })}
          >
            <Box sx={(t) => ({ width: 38, height: 38, borderRadius: '10px', display: 'grid', placeItems: 'center', flex: 'none', border: `1px solid ${t.tx.hl}`, color: 'secondary.main' })}>
              <Icon fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{p}</Typography>
          </Stack>
        );
      })}
    </Box>
  );
}

export function CourseFaq() {
  return COURSE_FAQ.map(([q, a], i) => (
    <Accordion key={q} defaultExpanded={i === 0} disableGutters sx={(t) => ({ mb: 1.25, borderRadius: '16px !important', border: `1px solid ${t.tx.line}`, background: t.tx.surface, '&:before': { display: 'none' } })}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
        <Typography sx={{ fontWeight: 700 }}>{q}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
        <Typography color="text.secondary">{a}</Typography>
      </AccordionDetails>
    </Accordion>
  ));
}
