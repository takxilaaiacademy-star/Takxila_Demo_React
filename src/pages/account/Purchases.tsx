import { Box, Button, Card, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Heading, Page } from '../../components/Section';
import { CountUp } from '../../components/Motion';
import { useStore } from '../../context/StoreContext';
import { courseById } from '../../data/recommend';

export default function Purchases() {
  const nav = useNavigate();
  const { orders } = useStore();
  const spent = orders.reduce((a, o) => a + o.total, 0);
  return (
    <Page>
      <Heading kick="ACCOUNT" title="My" hl="purchases" sub="Every checkout you made, with the courses in it." />
      {!orders.length ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No purchases yet. Free courses you enroll in show up in My courses.
          </Typography>
          <Button variant="contained" onClick={() => nav('/courses')}>
            Browse courses
          </Button>
        </Card>
      ) : (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ p: 2.5, flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 32, color: 'secondary.main' }}>
                <CountUp value={orders.length} />
              </Typography>
              <Typography color="text.secondary">Orders</Typography>
            </Card>
            <Card sx={{ p: 2.5, flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 32, color: 'secondary.main' }}>
                <CountUp value={spent} prefix="₹" />
              </Typography>
              <Typography color="text.secondary">Total spent</Typography>
            </Card>
          </Stack>
          <TableContainer component={Card}>
            <Table sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  {['Order', 'Date', 'Courses', 'Total', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o, i) => (
                  <TableRow key={o.id} hover sx={{ animation: `txfade .4s ${i * 50}ms both`, verticalAlign: 'top' }}>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {o.id}
                      {o.paymentId && (
                        <Typography component="div" color="text.secondary" sx={{ fontSize: 12, fontWeight: 400 }}>
                          Razorpay {o.paymentId}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{new Date(o.at).toLocaleString()}</TableCell>
                    <TableCell>
                      {o.items.map((it) => (
                        <Box key={it.id} sx={{ mb: 0.5 }}>
                          <Typography component={RouterLink} to={'/courses/' + it.id} sx={{ color: 'secondary.main', textDecoration: 'none', fontSize: 14 }}>
                            {courseById(it.id)?.title ?? it.id}
                          </Typography>{' '}
                          <Typography component="span" color="text.secondary" sx={{ fontSize: 13 }}>
                            ₹{it.price}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>
                      ₹{o.total}
                      {o.discounts?.map((d) => (
                        <Typography key={d.label} sx={{ fontSize: 12, color: 'success.main', fontWeight: 500 }}>
                          {d.label} −₹{d.amount}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" color="success" label="Paid (demo)" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Page>
  );
}
