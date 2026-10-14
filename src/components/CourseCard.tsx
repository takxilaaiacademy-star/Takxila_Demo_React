import { memo } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Chip, IconButton, LinearProgress, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import type { Theme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/EditOutlined';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useAppDispatch, useAppSelector } from '../store';
import { siteActions } from '../store/siteSlice';
import { offText, priceText } from '../data/recommend';
import type { Course } from '../types';
import { BlobImg, shimmer } from './Media';
import { usePreview } from './Preview';

export const hoverLift = (theme: Theme) => ({
  transition: 'transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s, border-color .45s',
  '&:hover': { transform: 'translateY(-8px)', borderColor: theme.tx.hl, boxShadow: `0 28px 60px ${theme.tx.glow}` },
  '&:hover img': { transform: 'scale(1.06)' },
});

export function Price({ c, size = 22 }: { c: Course; size?: number }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
      <Typography sx={{ fontWeight: 800, fontSize: size, color: c.price === 0 ? 'error.main' : 'text.primary' }}>{c.price === 0 ? 'FREE COURSE' : priceText(c)}</Typography>
      {c.was ? (
        <Typography color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: size * 0.65 }}>
          ₹{c.was}
        </Typography>
      ) : null}
      {c.was && c.price ? <Chip size="small" color="success" label={offText(c)} sx={{ height: 22, fontSize: 11 }} /> : null}
    </Stack>
  );
}

interface CardViewProps {
  c: Course;
  index: number;
  isOwned: boolean;
  inCart: boolean;
  selected: boolean;
  pct: number;
  addToCart: (id: string) => void;
  toggleSel: (id: string) => void;
}

// Pure view: re-renders only when this card's own state changes.
export const CourseCardView = memo(function CourseCardView({ c, index, isOwned, inCart, selected, pct, addToCart, toggleSel }: CardViewProps) {
  const nav = useNavigate();
  const preview = usePreview();
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((st) => st.site.openCourses.includes(c.id));
  const open = () => nav('/courses/' + c.id);
  const label = isOwned ? 'Go to course' : c.price === 0 ? 'Enroll for free' : inCart ? 'In cart · go to cart' : 'View and add to cart';
  const act = () => (isOwned ? open() : inCart ? nav('/cart') : addToCart(c.id));

  return (
    <Card
      sx={(t) => ({
        height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', ...hoverLift(t),
        animation: `txrise .4s cubic-bezier(.2,.8,.2,1) ${Math.min(index, 6) * 35}ms both`,
        ...(selected && { borderColor: t.tx.hl, boxShadow: `0 0 0 2px ${t.tx.hl}` }),
        '&:hover .tx-play': { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
      })}
    >
      <Box sx={{ position: 'relative' }}>
        <BlobImg src={c.img} alt={c.title} ratio="375 / 110" onClick={() => preview(c.id)} sx={{ cursor: 'pointer' }} />
        <Box
          className="tx-play"
          onClick={() => preview(c.id)}
          sx={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) scale(.7)', opacity: { xs: 1, md: 0 },
            transition: 'opacity .3s, transform .35s cubic-bezier(.2,.8,.2,1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 99,
            bgcolor: 'rgba(10,16,34,.78)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(6px)',
          }}
        >
          <PlayArrowRoundedIcon fontSize="small" /> Preview
        </Box>
        {isAdmin && (
          <Tooltip title="Admin: edit this course">
            <IconButton size="small" onClick={() => dispatch(siteActions.editorOpened(c.id))} aria-label={'Edit ' + c.title} sx={{ position: 'absolute', top: 4, left: 4, bgcolor: '#F5B93F', color: '#0A1022', '&:hover': { bgcolor: '#FFD98A' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {isOpen && <Chip size="small" color="success" label="Open access" sx={{ position: 'absolute', bottom: 6, left: 6, height: 22, fontSize: 11, fontWeight: 700 }} />}
        {!isOwned && (
          <Tooltip title={selected ? 'Remove from selection' : 'Select to add several at once'}>
            <Checkbox
              checked={selected}
              onChange={() => toggleSel(c.id)}
              inputProps={{ 'aria-label': 'Select ' + c.title }}
              sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(10,16,34,.55)', color: '#fff', borderRadius: '10px', p: 0.5, '&.Mui-checked': { color: '#F5B93F' }, '&:hover': { bgcolor: 'rgba(10,16,34,.75)' } }}
            />
          </Tooltip>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {c.kicker}
        </Typography>
        <Typography variant="h6" onClick={open} sx={{ cursor: 'pointer', lineHeight: 1.25, my: 0.5, color: 'secondary.main', fontSize: 18, '&:hover': { textDecoration: 'underline' } }}>
          {c.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {c.catLabel.toLowerCase().replace(/(^|\s|·\s)\S/g, (x) => x.toUpperCase())}
        </Typography>
        {isOwned && (
          <Box sx={{ mb: 1.5 }}>
            <LinearProgress variant="determinate" value={pct} color={pct >= 100 ? 'success' : 'primary'} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {pct}% complete
            </Typography>
          </Box>
        )}
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Duration:
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {c.meta.join(' | ')}
        </Typography>
        {!isOwned && <Price c={c} size={20} />}
      </CardContent>
      <Stack direction="row" spacing={1} sx={{ p: 2, pt: 1 }}>
        <Button variant="contained" onClick={act} startIcon={!isOwned && c.price > 0 && !inCart ? <ShoppingCartIcon /> : null} sx={{ flex: 1, px: 1.5 }}>
          {label}
        </Button>
        <Button variant="outlined" onClick={open}>
          Details
        </Button>
      </Stack>
    </Card>
  );
});

/** Card that reads its state from the store (for single use outside grids). */
export default function CourseCard({ c, index = 0 }: { c: Course; index?: number }) {
  const { owned, cart, sel, prog, addToCart, toggleSel } = useStore();
  return (
    <CourseCardView
      c={c}
      index={index}
      isOwned={owned.includes(c.id)}
      inCart={cart.includes(c.id)}
      selected={sel.includes(c.id)}
      pct={prog[c.id] || 0}
      addToCart={addToCart}
      toggleSel={toggleSel}
    />
  );
}

/** Grid of cards that reads the store once and passes plain props down. */
export function CourseGrid({ courses }: { courses: Course[] }) {
  const { owned, cart, sel, prog, addToCart, toggleSel } = useStore();
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
      {courses.map((c, i) => (
        <CourseCardView
          key={c.id}
          c={c}
          index={i}
          isOwned={owned.includes(c.id)}
          inCart={cart.includes(c.id)}
          selected={sel.includes(c.id)}
          pct={prog[c.id] || 0}
          addToCart={addToCart}
          toggleSel={toggleSel}
        />
      ))}
    </Box>
  );
}

/** Placeholder card shown while a page of courses loads, same size as a real card. */
export function CourseCardSkeleton() {
  return (
    <Card aria-hidden sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={(t) => ({ aspectRatio: '375 / 110', ...shimmer(t) })} />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Skeleton width="45%" />
        <Skeleton variant="text" sx={{ fontSize: 22 }} />
        <Skeleton variant="text" width="70%" sx={{ fontSize: 22, mb: 1 }} />
        <Skeleton width="55%" sx={{ mb: 1.5 }} />
        <Skeleton width="30%" />
        <Skeleton width="80%" sx={{ mb: 1 }} />
        <Skeleton width="40%" sx={{ fontSize: 24 }} />
      </CardContent>
      <Stack direction="row" spacing={1} sx={{ p: 2, pt: 1 }}>
        <Skeleton variant="rounded" height={38} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={38} width={80} />
      </Stack>
    </Card>
  );
}

/** Grid of skeleton cards, laid out like CourseGrid. */
export function CourseGridSkeleton({ count }: { count: number }) {
  return (
    <Box role="status" aria-label="Loading courses" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
      {Array.from({ length: count }, (_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </Box>
  );
}
