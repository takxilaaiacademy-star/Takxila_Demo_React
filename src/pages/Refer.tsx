import { useMemo } from 'react';
import { Box, Button, Chip, Grid, IconButton, LinearProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplayOutlined';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import CloseIcon from '@mui/icons-material/Close';
import BlockIcon from '@mui/icons-material/Block';
import StarIcon from '@mui/icons-material/Star';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';
import { DashShell, Panel } from '../components/Learning';
import { CountUp } from '../components/Motion';
import { Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { REFERRAL_LIMIT, REFERRAL_REWARD, referralCode } from '../data/showcase';
import { load } from '../utils/storage';
import type { ReferralRec } from '../types';

const WAYS: [typeof ArticleIcon, string, string, string][] = [
  [ArticleIcon, 'Blog or article', 'Shows up on Google and gets read for months.', '#1 Best results'],
  [SmartDisplayIcon, 'YouTube video or Instagram reel', 'Show what you learned and built.', '#2'],
  [ForumIcon, 'X or Reddit post', 'Post on your own profile. Follow community rules.', '#3'],
];
const DONTS: [string, string][] = [
  ["Don't post in others' comments", 'No codes on other people’s posts, threads or coupon sites.'],
  ["Don't make false claims", 'No promises like “guaranteed job”.'],
];

export default function Refer() {
  const nav = useNavigate();
  const user = useUser();
  const { withdrawals, withdraw, toast } = useStore();
  const code = referralCode(user.name, user.email);
  const link = `${location.origin}/auth?ref=${code}`;
  const refs = useMemo(() => load<Record<string, ReferralRec[]>>('referrals', {})[code] || [], [code]);
  const earned = Math.min(REFERRAL_LIMIT, refs.reduce((a, r) => a + r.reward, 0));
  const out = withdrawals.reduce((a, w) => a + w.amount, 0);
  const wallet = Math.max(0, earned - out);

  const copy = (text: string, what: string) => {
    void navigator.clipboard?.writeText(text);
    toast(what + ' copied');
  };
  const share = async () => {
    const text = `Learn AI with Takxila AI Academy. Use my code ${code} and get ₹${REFERRAL_REWARD} off your first order: ${link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Takxila AI Academy', text, url: link });
      } catch {
        /* closed the share sheet */
      }
    } else copy(text, 'Invite message');
  };

  return (
    <Page maxWidth="xl">
      <DashShell>
        <Box
          sx={(t) => ({
            position: 'relative', overflow: 'hidden', borderRadius: '22px', p: { xs: 2.5, md: 3.5 }, mb: 2.5, border: `1px solid ${t.tx.line}`,
            background: t.palette.mode === 'dark' ? 'linear-gradient(120deg, rgba(91,124,255,.25), rgba(194,91,255,.18))' : 'linear-gradient(120deg, #E8E4FF, #F6EEFF)',
            animation: 'txrise .5s both',
          })}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" color="secondary.main">
                REFER A FRIEND
              </Typography>
              <Typography variant="h4" sx={{ mb: 1.5 }}>
                Share your code with friends
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
                <Chip label={<span>Your friend gets <b>₹{REFERRAL_REWARD} off</b></span>} variant="outlined" />
                <Chip label={<span>You get <b>₹{REFERRAL_REWARD}</b></span>} variant="outlined" />
              </Stack>
              <Typography variant="body2" color="warning.main" sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                <WarningAmberIcon fontSize="small" /> Share only on your own channels. Codes posted in others' comments or on coupon sites get deactivated.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={(t) => ({ p: 2, borderRadius: '16px', bgcolor: t.palette.background.paper, boxShadow: `0 18px 40px ${t.tx.glow}` })}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={(t) => ({ flexGrow: 1, border: `2px dashed ${t.tx.hl}`, borderRadius: '10px', py: 1, textAlign: 'center', fontWeight: 800, fontSize: 22, letterSpacing: '.18em', color: 'secondary.main' })}>
                    {code}
                  </Box>
                  <Button variant="contained" startIcon={<ContentCopyIcon />} onClick={() => copy(code, 'Code')}>
                    Copy code
                  </Button>
                  <Tooltip title="Share">
                    <IconButton onClick={share} aria-label="Share" sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={(t) => ({ mt: 1.5, px: 1.5, py: 1, borderRadius: '10px', bgcolor: t.tx.surface })}>
                  <Typography noWrap variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {link}
                  </Typography>
                  <Button size="small" onClick={() => copy(link, 'Link')} sx={{ minHeight: 30, whiteSpace: 'nowrap', flex: 'none' }}>
                    Copy link
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={4}>
            <Panel sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={(t) => ({ p: 1, borderRadius: '10px', bgcolor: t.tx.surface, display: 'grid' })}>
                  <CurrencyRupeeIcon color="secondary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total earnings
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 24 }}>
                    <CountUp value={earned} prefix="₹" />
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress variant="determinate" value={(earned / REFERRAL_LIMIT) * 100} color="secondary" sx={{ mt: 1.5 }} />
              <Typography variant="caption" color="text.secondary">
                ₹{earned} of ₹{REFERRAL_LIMIT.toLocaleString('en-IN')} limit
              </Typography>
            </Panel>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Panel sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={(t) => ({ p: 1, borderRadius: '10px', bgcolor: t.tx.surface, display: 'grid' })}>
                  <PeopleIcon color="secondary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Friends referred
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 24 }}>
                    <CountUp value={refs.length} />
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Friends who enrolled with your code
              </Typography>
            </Panel>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Panel sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={(t) => ({ p: 1, borderRadius: '10px', bgcolor: t.tx.surface, display: 'grid' })}>
                  <AccountBalanceWalletIcon color="secondary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Wallet balance
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 24 }}>
                    <CountUp value={wallet} prefix="₹" />
                  </Typography>
                </Box>
              </Stack>
              <Button fullWidth variant="contained" disabled={!wallet} onClick={() => withdraw(wallet)}>
                Withdraw amount
              </Button>
            </Panel>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} md={6}>
            <Panel sx={{ height: '100%' }}>
              <Chip icon={<StarIcon />} label="BEST WAY TO EARN MORE" size="small" color="primary" sx={{ fontWeight: 800, mb: 1 }} />
              <Typography variant="h6">Create your own content</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Post an honest review with your code, and mention that you earn a reward.
              </Typography>
              <Stack spacing={1}>
                {WAYS.map(([Icon, t, d, tag], i) => (
                  <Stack
                    key={t}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={(th) => ({ p: 1.25, borderRadius: '12px', border: `1px solid ${i === 0 ? th.tx.hl : th.tx.line}`, background: i === 0 ? th.tx.glow : 'transparent', animation: `txrise .4s ${i * 70}ms both`, transition: 'transform .25s', '&:hover': { transform: 'translateX(6px)' } })}
                  >
                    <Icon color="secondary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d}
                      </Typography>
                    </Box>
                    <Chip label={tag} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                  </Stack>
                ))}
              </Stack>
            </Panel>
          </Grid>
          <Grid item xs={12} md={6}>
            <Panel sx={{ height: '100%' }}>
              <Chip icon={<BlockIcon />} label="AVOID THESE" size="small" color="error" variant="outlined" sx={{ fontWeight: 800, mb: 1 }} />
              <Typography variant="h6">What not to do</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Breaking these can get your code <b>deactivated</b>.
              </Typography>
              <Stack spacing={1}>
                {DONTS.map(([t, d]) => (
                  <Stack key={t} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25, borderRadius: '12px', border: '1px solid rgba(255,90,90,.35)', bgcolor: 'rgba(255,90,90,.07)' }}>
                    <CloseIcon color="error" />
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Panel>
          </Grid>
        </Grid>

        <Panel sx={{ mb: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <HelpOutlineIcon color="secondary" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>Need help with referrals?</Typography>
              <Typography variant="body2" color="text.secondary">
                Reach us through the Helpdesk, also if you want to raise your ₹{REFERRAL_LIMIT.toLocaleString('en-IN')} limit.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<WhatsAppIcon />} onClick={() => nav('/helpdesk')}>
              Contact support
            </Button>
          </Stack>
        </Panel>

        <Panel>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Your referrals
            </Typography>
            <Chip size="small" label={refs.length + ' enrolled'} />
          </Stack>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  {['Name', 'Course enrolled', 'Date of purchase', 'Your reward'].map((h, i) => (
                    <TableCell key={h} align={i === 3 ? 'right' : 'left'} sx={{ fontWeight: 800, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {refs.length ? (
                  refs.map((r, i) => (
                    <TableRow key={r.email + r.at} sx={{ animation: `txfade .4s ${i * 50}ms both` }}>
                      <TableCell sx={{ fontWeight: 700 }}>{r.name}</TableCell>
                      <TableCell>{r.courses.map((id) => courseById(id)?.title).join(', ')}</TableCell>
                      <TableCell>{new Date(r.at).toLocaleDateString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'success.main' }}>
                        +₹{r.reward}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No referrals yet. Share your code to start earning rewards.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Panel>
      </DashShell>
    </Page>
  );
}
