import { useMemo, useState } from 'react';
import { Avatar, Box, Button, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { courseById } from '../../data/recommend';
import { useAppSelector } from '../../store';
import { ago, collectStats, csv, download } from '../../utils/adminStats';
import { panelSx } from './adminUi';

const inr = (n: number) => (n === 0 ? 'Free' : '₹' + n.toLocaleString('en-IN'));

/** Admin > Orders: every course any learner bought (or enrolled in through the cart), newest first. */
export default function AdminOrders() {
  const users = useAppSelector((s) => s.auth.users);
  const grants = useAppSelector((s) => s.admin.grants);
  const logLen = useAppSelector((s) => s.log.items.length);
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(50);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const orders = useMemo(() => collectStats(users, grants).flatMap((r) => r.orderList.map((o) => ({ o, u: r.user }))).sort((a, b) => b.o.at.localeCompare(a.o.at)), [users, grants, logLen, tick]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return orders;
    return orders.filter(({ o, u }) => `${o.id} ${o.paymentId ?? ''} ${u.name} ${u.email} ${o.items.map((i) => courseById(i.id)?.title ?? i.id).join(' ')}`.toLowerCase().includes(t));
  }, [orders, q]);
  const revenue = orders.reduce((n, x) => n + x.o.total, 0);
  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = orders.filter((x) => x.o.at.startsWith(month));

  return (
    <Box sx={panelSx}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Orders ({orders.length})</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13.5 }}>
            Every purchase by every learner in this browser. Total {inr(revenue)} · this month {thisMonth.length} order{thisMonth.length === 1 ? '' : 's'}, {inr(thisMonth.reduce((n, x) => n + x.o.total, 0))}.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<RefreshIcon />} onClick={() => setTick((x) => x + 1)}>Refresh</Button>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />} disabled={!orders.length}
            onClick={() => download('takxila-orders.csv', csv([['Date', 'Order', 'Payment ID', 'Learner', 'Email', 'Courses', 'Subtotal', 'Total'], ...orders.map(({ o, u }) => [o.at.slice(0, 16).replace('T', ' '), o.id, o.paymentId ?? '', u.name, u.email, o.items.map((i) => courseById(i.id)?.title ?? i.id).join(' | '), o.subtotal ?? o.total, o.total])]))}>
            CSV
          </Button>
        </Stack>
      </Stack>
      <TextField size="small" fullWidth placeholder="Search order, payment ID, learner or course" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ mb: 2 }} />
      {list.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>{orders.length ? 'Nothing matches.' : 'No orders yet. When a learner buys a course it shows up here.'}</Typography>
      ) : (
        <Stack spacing={1.25}>
          {list.slice(0, limit).map(({ o, u }) => (
            <Box key={u.email + o.id} sx={(t) => ({ p: 1.5, borderRadius: '16px', border: `1px solid ${t.tx.line}` })}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={u.avatar} sx={{ width: 38, height: 38, fontWeight: 800, background: 'linear-gradient(135deg,#9333EA,#4F6BFF)', color: '#fff' }}>{u.name[0]?.toUpperCase()}</Avatar>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 800 }} noWrap>{u.name}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 12.5 }} noWrap>{u.email} · {ago(o.at)}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 17, flexShrink: 0 }}>{inr(o.total)}</Typography>
              </Stack>
              <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                {o.items.map((i) => <Chip key={i.id} size="small" label={`${courseById(i.id)?.title ?? i.id} · ${inr(i.price)}`} sx={{ maxWidth: '100%' }} />)}
              </Stack>
              <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.75, wordBreak: 'break-all' }}>
                Order {o.id}{o.paymentId ? ' · Payment ' + o.paymentId : ''} · {new Date(o.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                {o.discounts?.length ? ' · ' + o.discounts.map((d) => d.label).join(', ') : ''}
              </Typography>
            </Box>
          ))}
          {list.length > limit && <Button onClick={() => setLimit((x) => x + 50)}>Show more ({list.length - limit} left)</Button>}
        </Stack>
      )}
    </Box>
  );
}
