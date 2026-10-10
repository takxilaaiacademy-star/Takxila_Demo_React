import { Box, Container, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgentOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { translate, type StrKey } from '../data/i18n';

// Same columns as the footer on the academy's main website.
export const SUPPORT_EMAIL = 'support@takxila.in';
export const SUPPORT_PHONE = '+91 7276607776';
export const SOCIAL: [label: string, url: string, Icon: typeof FacebookIcon][] = [
  ['Facebook', 'https://www.facebook.com/', FacebookIcon],
  ['Instagram', 'https://www.instagram.com/', InstagramIcon],
  ['YouTube', 'https://www.youtube.com/', YouTubeIcon],
  ['LinkedIn', 'https://www.linkedin.com/', LinkedInIcon],
  ['X - Twitter', 'https://x.com/', XIcon],
];

type Col = [StrKey, [label: string, to: string, needsLogin?: boolean][]];

export default function Footer() {
  const { isAuthed } = useAuth();
  const { prefs } = useStore();
  const t = (k: StrKey) => translate(prefs.lang, k);
  const cols: Col[] = [
    // Logged-out visitors stay on the showcase page and jump to its sections.
    ['explore', isAuthed
      ? [['All Courses', '/courses'], ['Challenges', '/courses?cat=challenge'], ['Career Accelerator', '/courses?cat=career'], ['Master AI Tools', '/courses?cat=tools'], ['AI Film Making', '/courses?cat=film']]
      : [['All Courses', '/#courses'], ['Challenges', '/#challenges'], ['Career Accelerator', '/#packs'], ['Master AI Tools', '/#courses'], ['AI Film Making', '/#courses']]],
    ['company', [['Home', isAuthed ? '/home' : '/'], ['My Courses', '/my-courses', true], ['Mentorship', '/mentorship', true], ['About Us', '/about', true], ['Contact Us', '/contact', true], ['Help Desk', '/helpdesk', true]]],
    ['legal', [['Privacy Policy', '/policies#privacy', true], ['Terms & Conditions', '/policies#terms', true], ['Refund Policy', '/policies#refund', true], ['Subscription & Purchase Terms', '/policies#terms', true]]],
  ];
  const linkSx = {
    color: 'text.secondary', textDecoration: 'none', fontSize: 14.5, display: 'inline-block', transition: 'color .2s, transform .25s',
    '&:hover': { color: 'secondary.main', transform: 'translateX(4px)' },
  } as const;
  const to = (path: string, needsLogin?: boolean) => (needsLogin && !isAuthed ? '/auth' : path);

  return (
    <Box component="footer" sx={{ position: 'relative', zIndex: 1, px: { xs: 1.5, md: 3 }, pb: { xs: 12, md: 4 }, mt: 6 }}>
      <Container
        maxWidth="lg"
        sx={(th) => ({
          borderRadius: '22px', border: `1px solid ${th.tx.line}`, py: { xs: 4, md: 5 }, px: { xs: 3, md: 5 },
          background: th.palette.mode === 'dark' ? 'rgba(16,23,48,.82)' : '#FFFFFF', backdropFilter: 'blur(20px)',
          boxShadow: th.palette.mode === 'dark' ? 'none' : '0 20px 60px rgba(20,32,138,.08)',
        })}
      >
        <Grid container spacing={{ xs: 3.5, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '.04em', mb: 1 }}>TAKXILA™</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14.5, lineHeight: 1.7 }}>
              Master the AI frameworks.
              <br />
              Own the AI future.
            </Typography>
          </Grid>
          {cols.map(([head, links]) => (
            <Grid item xs={6} sm={4} md={head === 'legal' ? 3 : 2.5} key={head}>
              <Typography sx={{ fontWeight: 800, mb: 1.5 }}>{t(head)}</Typography>
              <Stack spacing={1.1}>
                {links.map(([l, path, gated]) => (
                  <Box key={l}>
                    <Box component={RouterLink} to={to(path, gated)} sx={linkSx}>
                      {l}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>{t('support')}</Typography>
            <Stack spacing={1.1}>
              <Link href={'mailto:' + SUPPORT_EMAIL} sx={{ ...linkSx, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MailOutlineIcon fontSize="small" /> {SUPPORT_EMAIL}
              </Link>
              <Box component={RouterLink} to={to('/helpdesk', true)} sx={{ ...linkSx, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SupportAgentIcon fontSize="small" /> Help Desk
              </Box>
              <Link href={'tel:' + SUPPORT_PHONE.replace(/\s/g, '')} sx={{ ...linkSx, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" /> {SUPPORT_PHONE}
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>{t('followUs')}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {SOCIAL.map(([l, url, Icon]) => (
                <Tooltip key={l} title={l}>
                  <IconButton component="a" href={url} target="_blank" rel="noopener noreferrer" aria-label={l} sx={(th) => ({ border: `1px solid ${th.tx.line}` })}>
                    <Icon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} TAKXILA. All rights reserved.
          </Typography>
        </Stack>
      </Container>
      <BackToTop />
    </Box>
  );
}

/** Round "back to top" button that appears after scrolling down. */
function BackToTop() {
  return (
    <IconButton
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="tx-totop"
      sx={(th) => ({
        position: 'fixed', right: { xs: 18, md: 26 }, bottom: { xs: 90, md: 100 }, zIndex: 1200, width: 44, height: 44,
        bgcolor: th.palette.mode === 'dark' ? 'rgba(16,23,48,.9)' : '#fff', border: `1px solid ${th.tx.line}`, boxShadow: `0 10px 30px ${th.tx.glow}`,
        opacity: 'var(--tx-totop, 0)', pointerEvents: 'var(--tx-totop-pe, none)' as 'none', transition: 'opacity .3s, transform .25s',
        '&:hover': { bgcolor: th.palette.mode === 'dark' ? 'rgba(16,23,48,.95)' : '#fff' },
      })}
    >
      <KeyboardArrowUpIcon />
    </IconButton>
  );
}
