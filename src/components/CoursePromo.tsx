import { memo } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import promos from '../data/promos.json';
import { academyCourseUrl } from '../utils/academy';
import type { Course } from '../types';

type Promo = { label?: string; title?: string; sub?: string; hook?: string[]; flow?: string[] };
const BY_CAT = promos.byCategory as Record<string, Promo>;
const BY_COURSE = promos.byCourse as Record<string, Promo>;
const GOLD = '#D9A441';

/** The words for one course: its own override, else its category's, else built from the course itself. */
export function promoFor(c: Course) {
  const p = { ...BY_CAT[c.cat], ...BY_COURSE[c.id] };
  // "LOVABLE DEEP DIVE: PROMPTING • EDITING • …" → title before the colon, the rest as steps.
  const [head, tail] = c.title.split(/:\s*/, 2);
  const steps = (tail ?? '').split(/\s*[•→|]\s*/).filter(Boolean);
  const arrow = c.meta.find((m) => m.includes('→'));
  return {
    label: 'TAKXILA · ' + (p.label ?? 'AI MASTERY'),
    title: (p.title ?? (head.length <= 40 ? head : c.kicker)).toUpperCase(),
    sub: p.sub ?? c.short,
    hook: p.hook ?? [],
    flow: p.flow ?? (steps.length >= 3 ? steps.slice(0, 6) : arrow ? arrow.split(/\s*→\s*/) : c.learn.slice(0, 4)).map((s) => s.toUpperCase()),
    hours: (c.meta.find((m) => /hour|min|day/i.test(m)) ?? c.meta[0] ?? '').toUpperCase(),
  };
}

/**
 * The black "ENROLL NOW" promo card from the academy's ads (see the owner's screenshot): category line, big title,
 * hook, steps, duration, special price and the academy link. Words come from src/data/promos.json.
 */
function CoursePromo({ c, onEnroll, compact = false }: { c: Course; onEnroll: () => void; compact?: boolean }) {
  const p = promoFor(c);
  const save = c.was && c.was > c.price ? Math.round((1 - c.price / c.was) * 100) : 0;
  const link = academyCourseUrl(c.id).replace(/^https?:\/\//, '');
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', borderRadius: '14px', p: { xs: 2.25, sm: compact ? 2.5 : 3 }, color: '#F4F1EA',
        background: 'radial-gradient(120% 90% at 100% 0%, #1b1b1b 0%, #0b0b0b 55%, #050505 100%)', border: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 18px 44px rgba(0,0,0,.35)', height: '100%', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Faint brand mark on the right, as on the ad */}
      <Box
        component="img" src="/assets/logo-mark-dark.webp" alt="" aria-hidden
        sx={{ position: 'absolute', right: { xs: -30, sm: 10 }, top: '50%', transform: 'translateY(-50%)', width: { xs: 160, sm: 210 }, opacity: 0.07, pointerEvents: 'none', filter: 'grayscale(1)' }}
      />
      <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: 12, letterSpacing: 0.6 }}>{p.label}</Typography>
      <Typography component="h3" className="notranslate" sx={{ fontWeight: 800, fontSize: { xs: 22, sm: compact ? 22 : 26 }, lineHeight: 1.15, mt: 0.75 }}>
        {p.title}
      </Typography>
      <Typography sx={{ fontSize: 14, opacity: 0.85, mt: 0.5 }}>{p.sub}</Typography>
      <Box sx={{ height: '1px', my: { xs: 2, sm: 2.5 }, background: `linear-gradient(90deg, ${GOLD}, rgba(217,164,65,.25))` }} />
      {p.hook.length > 0 && (
        <Stack spacing={1.25} sx={{ mb: 1.5 }}>
          {p.hook.map((h) => (
            <Typography key={h} sx={{ fontWeight: 800, fontSize: { xs: 17, sm: compact ? 17 : 19 }, letterSpacing: 0.2 }}>
              {h}
            </Typography>
          ))}
        </Stack>
      )}
      {p.flow.length > 0 && <Typography sx={{ fontSize: 13.5, letterSpacing: 0.4, opacity: 0.92, mb: 2.5 }}>{p.flow.join(' → ')}</Typography>}
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" sx={{ mb: 2, px: { xs: 0, sm: 1 } }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 19, mt: 2 }}>{p.hours}</Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>Practical Learning</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 11.5, letterSpacing: 0.6, opacity: 0.8 }}>{c.price ? 'SPECIAL PRICE' : 'PRICE'}</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 21 }}>{c.price ? '₹' + c.price : 'FREE'}</Typography>
          {save > 0 && (
            <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
              Regular ₹{c.was} · Save {save}%
            </Typography>
          )}
        </Box>
      </Stack>
      <Button
        fullWidth
        onClick={onEnroll}
        sx={{
          py: 1.4, borderRadius: '8px', fontWeight: 800, letterSpacing: 0.6, color: '#1a1406', background: GOLD,
          '&:hover': { background: '#E8B65A' },
        }}
      >
        ENROLL NOW
      </Button>
      <Typography component="a" href={academyCourseUrl(c.id)} target="_blank" rel="noopener" className="notranslate" sx={{ mt: 1.25, fontSize: 12, color: 'inherit', opacity: 0.75, textDecoration: 'none', '&:hover': { opacity: 1 }, wordBreak: 'break-all' }}>
        {link.length > 48 ? 'academy.takxila.in' : link}
      </Typography>
    </Box>
  );
}

export default memo(CoursePromo);
