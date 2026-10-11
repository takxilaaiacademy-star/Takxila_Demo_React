import { useMemo } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { courseById, priceText } from '../data/recommend';
import { ALL_ACCESS_PRICE, CUSTOM_MIN, PACKS, PAID, listPrice, priceCart } from '../data/showcase';
import type { Course } from '../types';
import { BlobImg } from './Media';

/** Courses that go well with c: same category first, then shared tags. Never owned or already in the cart. */
export function relatedTo(c: Course, skip: string[], n = 3): Course[] {
  const score = (x: Course) => (x.group === c.group ? 10 : 0) + (x.cat === c.cat ? 4 : 0) + x.tags.filter((t) => c.tags.includes(t)).length;
  return COURSES.filter((x) => x.id !== c.id && x.price > 0 && !skip.includes(x.id))
    .map((x) => [x, score(x)] as const)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([x]) => x);
}

/** Popup after a course is added to the cart: related courses, the best combo and All Access. */
export default function CartUpsell() {
  const { upsell, closeUpsell, owned, cart, addMany } = useStore();
  const theme = useTheme();
  const full = useMediaQuery(theme.breakpoints.down('sm'));
  const nav = useNavigate();
  const c = upsell ? courseById(upsell) : undefined;

  const offer = useMemo(() => {
    if (!c) return null;
    const skip = [...owned, ...cart];
    const related = relatedTo(c, skip);
    // Best combo: a ready-made pack that includes this course, else this course + related ones as a 25%-off custom pack.
    const pack = PACKS.filter((p) => p.courses.includes(c.id))
      .map((p) => ({ p, missing: p.courses.filter((id) => !skip.includes(id)) }))
      .filter((x) => x.missing.length > 0)
      .sort((a, b) => a.missing.length - b.missing.length)[0];
    const extra = pack ? pack.missing : relatedTo(c, skip, Math.max(0, CUSTOM_MIN - cart.length)).map((x) => x.id);
    const comboIds = Array.from(new Set([...cart, ...extra]));
    const add = comboIds.filter((id) => !cart.includes(id));
    const now = priceCart(cart, owned, false);
    const after = priceCart(comboIds, owned, false);
    const allIds = PAID.filter((x) => !owned.includes(x.id)).map((x) => x.id);
    return {
      related,
      combo: add.length
        ? { title: pack ? pack.p.title + ' combo' : `Custom combo of ${comboIds.length} courses`, add, list: listPrice(comboIds), total: after.total, extra: after.total - now.total }
        : null,
      all: { count: allIds.length, list: listPrice(allIds) },
    };
  }, [c, owned, cart]);

  if (!c || !offer) return null;
  const go = (to: string) => {
    closeUpsell();
    nav(to);
  };
  const cartTotal = priceCart(cart, owned, false).total;

  return (
    <Dialog open onClose={closeUpsell} fullScreen={full} maxWidth="sm" fullWidth aria-labelledby="upsell-title">
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography id="upsell-title" variant="h6" sx={{ flexGrow: 1 }}>
            Added to cart
          </Typography>
          <IconButton onClick={closeUpsell} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}`, mb: 2.5 })}>
          <BlobImg src={c.img} alt="" ratio="375 / 110" sx={{ width: { xs: 110, sm: 150 }, flex: 'none', borderRadius: '8px' }} />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: 15 }}>{c.title}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {c.meta[0]}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 800 }}>{priceText(c)}</Typography>
        </Stack>

        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Great pick! Make it a complete skill set.</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
          One course teaches a tool. Two or three together teach the whole workflow, and every course you add brings the price per course down.
        </Typography>

        {offer.combo && (
          <Box
            sx={(t) => ({
              p: 2, mb: 2.5, borderRadius: '14px', border: `2px solid ${t.palette.secondary.main}`,
              background: t.palette.mode === 'dark' ? 'rgba(245,185,63,.08)' : 'rgba(245,185,63,.12)',
            })}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <LocalOfferIcon color="secondary" fontSize="small" />
              <Typography sx={{ fontWeight: 800, flexGrow: 1 }}>{offer.combo.title}</Typography>
              <Chip size="small" color="success" label={'Save ₹' + (offer.combo.list - offer.combo.total)} />
            </Stack>
            <Typography color="text.secondary" sx={{ fontSize: 14, mb: 1.5 }}>
              Add {offer.combo.add.map((id) => courseById(id)?.title).join(', ')} and your cart becomes{' '}
              <Box component="span" sx={{ textDecoration: 'line-through' }}>
                ₹{offer.combo.list}
              </Box>{' '}
              <b>₹{offer.combo.total}</b> for {offer.combo.add.length + cart.length} courses (only ₹{offer.combo.extra} more than now).
            </Typography>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => addMany(offer.combo!.add)}>
              Add the combo
            </Button>
          </Box>
        )}

        {offer.related.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Goes well with {c.title.length > 40 ? 'this course' : c.title}</Typography>
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              {offer.related.map((r) => (
                <Stack key={r.id} direction="row" spacing={1.5} alignItems="center" sx={(t) => ({ p: 1, borderRadius: '12px', border: `1px solid ${t.tx.line}` })}>
                  <BlobImg src={r.img} alt="" ratio="375 / 110" onClick={() => go('/courses/' + r.id)} sx={{ width: 96, flex: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography onClick={() => go('/courses/' + r.id)} sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      {r.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                      {r.meta[0]} · <b>{priceText(r)}</b>
                      {r.was ? <s style={{ marginLeft: 6 }}>₹{r.was}</s> : null}
                    </Typography>
                  </Box>
                  {cart.includes(r.id) ? (
                    <Chip size="small" label="In cart" />
                  ) : (
                    <IconButton color="primary" aria-label={'Add ' + r.title} onClick={() => addMany([r.id])}>
                      <AddIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </Stack>
          </>
        )}

        <Stack direction="row" spacing={1.5} alignItems="center" sx={(t) => ({ p: 1.5, borderRadius: '12px', background: t.tx.surface, border: `1px dashed ${t.tx.line}`, mb: 2.5 })}>
          <WorkspacePremiumIcon color="secondary" />
          <Typography sx={{ fontSize: 14, flexGrow: 1 }}>
            Want everything? <b>All Access</b> gets you all {offer.all.count} paid courses for <b>₹{ALL_ACCESS_PRICE}</b> instead of ₹{offer.all.list}.
          </Typography>
          <Button
            size="small"
            onClick={() => {
              addMany(PAID.filter((x) => !owned.includes(x.id)).map((x) => x.id));
              go('/cart');
            }}
          >
            Get All Access
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5}>
          <Button fullWidth variant="outlined" onClick={closeUpsell}>
            Keep browsing
          </Button>
          <Button fullWidth variant="contained" onClick={() => go('/cart')}>
            Go to cart · ₹{cartTotal}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
