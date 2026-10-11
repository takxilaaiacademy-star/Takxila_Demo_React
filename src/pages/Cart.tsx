import { useState } from 'react';
import { Alert, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { Heading, Page } from '../components/Section';
import { BlobImg } from '../components/Media';
import { useStore } from '../context/StoreContext';
import { courseById, priceText } from '../data/recommend';
import type { Course } from '../types';
import { CUSTOM_MIN, PACKS, priceCart } from '../data/showcase';
import { useUser } from '../context/AuthContext';
import { isTestKey, payWithRazorpay, razorpayReady } from '../utils/razorpay';

export default function Cart() {
  const nav = useNavigate();
  const user = useUser();
  const { cart, owned, removeFromCart, checkout, referralOpen, addMany, toast } = useStore();
  const [paying, setPaying] = useState(false);
  const [setup, setSetup] = useState(false);
  const items = cart.map(courseById).filter((c): c is Course => !!c);
  const was = items.reduce((a, c) => a + (c.was || c.price), 0);
  const priced = priceCart(cart, owned, referralOpen);
  const total = priced.total;
  // Nudge: the pack this cart is closest to completing.
  const near = PACKS.map((p) => ({ p, missing: p.courses.filter((id) => !cart.includes(id) && !owned.includes(id)) }))
    .filter((x) => x.missing.length > 0 && x.missing.length < x.p.courses.length - 1 && x.missing.length <= 2)
    .sort((a, b) => a.missing.length - b.missing.length)[0];
  const packed = priced.lines.some((l) => /pack/i.test(l.label));

  const done = (paymentId?: string) => {
    checkout(paymentId);
    nav('/my-courses');
  };
  const pay = async () => {
    if (total <= 0) return done();
    if (!razorpayReady) return setSetup(true);
    setPaying(true);
    try {
      const id = await payWithRazorpay({
        amount: total,
        description: items.length === 1 ? items[0].title : items.length + ' courses',
        name: user.name,
        email: user.email,
        notes: { courses: priced.ids.join(',') },
      });
      done(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg !== 'dismissed') toast('Payment did not go through: ' + msg);
    } finally {
      setPaying(false);
    }
  };

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
                disabled={paying}
                startIcon={paying ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                onClick={pay}
              >
                {paying ? 'Opening Razorpay…' : total > 0 ? 'Pay ₹' + total + ' securely' : 'Enroll now'}
              </Button>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1.5, textAlign: 'center' }}>
                Payments by Razorpay: UPI, cards, net banking and wallets.{isTestKey ? ' Test mode: no real money is charged.' : ''}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}
      <Dialog open={setup} onClose={() => setSetup(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Razorpay is not connected yet</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5 }}>
            Add your Razorpay key to the <code>.env</code> file and rebuild the site to take real payments:
          </Typography>
          <Typography component="pre" sx={(t) => ({ p: 1.5, borderRadius: '8px', fontSize: 13, background: t.tx.surface, border: `1px solid ${t.tx.line}`, overflowX: 'auto' })}>
            VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14, mt: 1.5 }}>
            Until then you can enroll in demo mode, without paying.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetup(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setSetup(false);
              done();
            }}
          >
            Enroll in demo mode
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
