import { Box, Button, Card, CardContent, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { courseById, plan, priceText } from '../data/recommend';
import { hoverLift } from './CourseCard';
import { BlobImg } from './Media';
import type { Recommendation } from '../types';

export function PlanStats({ recs }: { recs: Recommendation[] }) {
  const { owned, addMany } = useStore();
  const p = plan(recs, owned);
  if (!p.n) return null;
  const stats = [
    [String(p.n), 'Courses in your plan'],
    ['₹' + p.total, 'Total price'],
    ['₹' + p.save, 'You save'],
    [p.hours + '+ hrs', 'Of learning'],
  ];
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 3, borderRadius: '18px', bgcolor: 'transparent' }}>
      <Grid container spacing={2} alignItems="center">
        {stats.map(([v, l]) => (
          <Grid item xs={6} md={2.25} key={l}>
            <Typography sx={{ fontWeight: 800, fontSize: 26, color: 'secondary.main' }}>{v}</Typography>
            <Typography variant="body2" color="text.secondary">
              {l}
            </Typography>
          </Grid>
        ))}
        <Grid item xs={12} md={3}>
          <Button fullWidth variant="contained" onClick={() => addMany(p.ids)}>
            {(p.n > 1 ? 'Add all ' + p.n + ' to cart' : 'Add to cart') + ' · ₹' + p.total}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function RecCard({ r, onNavigate }: { r: Recommendation; onNavigate?: () => void }) {
  const nav = useNavigate();
  const { owned, cart, addMany, toast } = useStore();
  const c = courseById(r.id);
  if (!c) return null;
  const isOwned = owned.includes(r.id);
  const inCart = cart.includes(r.id);
  const label = isOwned ? 'Enrolled' : inCart ? 'In cart' : c.price === 0 ? 'Enroll free' : 'Add to cart';
  return (
    <Card sx={(t) => ({ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', ...hoverLift(t) })}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <BlobImg src={c.img} alt="" ratio="375 / 110" />
        <Chip label={r.match + '% match'} color="primary" size="small" sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 800 }} />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontSize: 11 }}>
          {c.catLabel}
        </Typography>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>{c.title}</Typography>
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          {r.why.map((w) => (
            <Chip key={w} label={w} size="small" variant="outlined" sx={{ maxWidth: '100%' }} />
          ))}
        </Stack>
      </CardContent>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2, pt: 0 }}>
        <Typography sx={{ fontWeight: 800, mr: 'auto' }}>{priceText(c)}</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            onNavigate?.();
            nav('/courses/' + c.id);
          }}
        >
          Details
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={isOwned}
          onClick={() => (inCart ? toast('Already in your cart.') : addMany([c.id]))}
        >
          {label}
        </Button>
      </Stack>
    </Card>
  );
}

export function RecGrid({ recs, onNavigate }: { recs: Recommendation[]; onNavigate?: () => void }) {
  return (
    <Grid container spacing={2.5}>
      {recs.map((r) => (
        <Grid item xs={12} sm={6} md={4} key={r.id}>
          <RecCard r={r} onNavigate={onNavigate} />
        </Grid>
      ))}
    </Grid>
  );
}
