import { Alert, Button, Card, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { Heading, Page } from '../components/Section';
import { BlobImg } from '../components/Media';
import { useStore } from '../context/StoreContext';
import { courseById, priceText } from '../data/recommend';
import type { Course } from '../types';
import { CUSTOM_MIN, PACKS, priceCart } from '../data/showcase';

export default function Cart() {
  const nav = useNavigate();
  const { cart, owned, removeFromCart, checkout, referralOpen, addMany } = useStore();
  const items = cart.map(courseById).filter((c): c is Course => !!c);
  const was = items.reduce((a, c) => a + (c.was || c.price), 0);
  const priced = priceCart(cart, owned, referralOpen);
  const total = priced.total;
  // Nudge: the pack this cart is closest to completing.
  const near = PACKS.map((p) => ({ p, missing: p.courses.filter((id) => !cart.includes(id) && !owned.includes(id)) }))
    .filter((x) => x.missing.length > 0 && x.missing.length < x.p.courses.length - 1 && x.missing.length <= 2)
    .sort((a, b) => a.missing.length - b.missing.length)[0];
  const packed = priced.lines.some((l) => /pack/i.test(l.label));

  return (
    <Page maxWidth="md">
      <Heading kick="YOUR CART" title="Ready to" hl="enroll?" />
      {!items.length ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Your cart is empty. Pick a course to get started.
          </Typography>
          <Button variant="contained" onClick={() => nav('/courses')}>
            Browse courses
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={1.5}>
              {items.map((c) => (
                <Card key={c.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BlobImg src={c.img} alt="" ratio="375 / 110" onClick={() => nav('/courses/' + c.id)} sx={{ width: { xs: 110, sm: 170 }, flex: 'none', borderRadius: '10px', cursor: 'pointer' }} />
                  <Typography sx={{ fontWeight: 700, flexGrow: 1, lineHeight: 1.3, fontSize: { xs: 14, sm: 16 } }}>{c.title}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{priceText(c)}</Typography>
                  <IconButton aria-label="Remove" onClick={() => removeFromCart(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Card>
              ))}
            </Stack>
            {near && !packed && (
              <Alert
                icon={<LocalOfferIcon />}
                severity="info"
                sx={{ mt: 2, animation: 'txrise .5s both' }}
                action={
                  <Button color="inherit" size="small" onClick={() => addMany(near.missing)}>
                    Add {near.missing.length === 1 ? 'it' : 'them'}
                  </Button>
                }
              >
                Add {near.missing.map((id) => courseById(id)?.title).join(' and ')} to complete the <b>{near.p.title}</b> combo pack for ₹{near.p.price}.
              </Alert>
            )}
            {!near && !packed && items.length > 0 && items.length < CUSTOM_MIN && (
              <Alert icon={<LocalOfferIcon />} severity="info" sx={{ mt: 2 }}>
                Add {CUSTOM_MIN - items.length} more {CUSTOM_MIN - items.length === 1 ? 'course' : 'courses'} to get 25% off with a customized pack.
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography color="text.secondary">{items.length} courses</Typography>
                <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ₹{was}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography color="text.secondary">Course prices</Typography>
                <Typography color="text.secondary">₹{priced.subtotal}</Typography>
              </Stack>
              {priced.lines.map((l) => (
                <Stack key={l.label} direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 1, animation: 'txrise .4s both' }}>
                  <Typography color="success.main" sx={{ fontSize: 14 }}>
                    {l.label}
                  </Typography>
                  <Typography color="success.main" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    −₹{l.amount}
                  </Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography color="success.main" sx={{ fontWeight: 700 }}>
                  You save
                </Typography>
                <Typography color="success.main" sx={{ fontWeight: 700 }}>
                  ₹{was - total}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>₹{total}</Typography>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  checkout();
                  nav('/my-courses');
                }}
              >
                Checkout and enroll
              </Button>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1.5 }}>
                Demo checkout: no payment is taken. Courses move straight to My courses.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}
    </Page>
  );
}
