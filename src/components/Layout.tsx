import { Suspense, useEffect, useMemo, useState } from 'react';
import type { Theme } from '@mui/material/styles';
import {
  AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, Grid, IconButton, LinearProgress, List, ListItemButton,
  ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Popover, Stack, Toolbar, Tooltip, Typography, useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CampaignIcon from '@mui/icons-material/CampaignOutlined';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../context/AuthContext';
import { useAnnouncements } from '../context/AnnouncementsContext';
import { useStore } from '../context/StoreContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { CAT_PILLS } from '../data/courses';
import { LANGS, translate, type StrKey } from '../data/i18n';
import Background from './Background';
import Logo from './Logo';
import { PreviewProvider } from './Preview';
import QuizDialog from './QuizDialog';
import SearchDialog from './SearchDialog';
import SelectionBar from './SelectionBar';

interface NavItem {
  key: StrKey;
  to: string;
  subs?: [label: string, to: string][];
}

const NAV: NavItem[] = [
  { key: 'home', to: '/home' },
  {
    key: 'courses', to: '/courses',
    subs: [['All courses', '/courses'], ...CAT_PILLS.map(([id, l]): [string, string] => [l, '/courses?cat=' + id]), ['Free courses', '/courses?cat=free']],
  },
  { key: 'dashboard', to: '/dashboard' },
  { key: 'myCourses', to: '/my-courses' },
  { key: 'calculator', to: '/calculator' },
  { key: 'about', to: '/about' },
  { key: 'helpdesk', to: '/helpdesk' },
  { key: 'policies', to: '/policies', subs: [['Privacy policy', '/policies#privacy'], ['Refund policy', '/policies#refund'], ['Terms of use', '/policies#terms']] },
  { key: 'contact', to: '/contact', subs: [['Contact form', '/contact'], ['Announcements', '/announcements'], ['Helpdesk', '/helpdesk']] },
];

// The profile menu, in the same order as the academy's Moodle site.
const PROFILE_MENU: [StrKey, string][] = [
  ['purchases', '/purchases'], ['profile', '/profile'], ['grades', '/grades'], ['calendar', '/calendar'],
  ['files', '/files'], ['reports', '/reports'], ['certificates', '/certificates'], ['refer', '/refer'], ['resume', '/resume'], ['leaderboard', '/leaderboard'],
];

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** Shown while a page's code loads (pages are split into their own files). */
export function PageLoader() {
  return <LinearProgress color="secondary" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000, height: 3 }} />;
}

export default function Layout() {
  const user = useUser();
  const { logout } = useAuth();
  const { cart, profile, ready, quiz, openQuiz, prefs, setPrefs, annSeen, markAnnouncementsSeen } = useStore();
  const { items: anns } = useAnnouncements();
  const { mode, toggleMode } = useThemeMode();
  const nav = useNavigate();
  const loc = useLocation();
  const isXs = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; item: NavItem } | null>(null);
  const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
  const [langMenu, setLangMenu] = useState<HTMLElement | null>(null);
  const [bell, setBell] = useState<HTMLElement | null>(null);
  const t = (k: StrKey) => translate(prefs.lang, k);

  const unread = useMemo(() => (prefs.notify ? anns.filter((a) => !annSeen || a.at > annSeen).length : 0), [anns, annSeen, prefs.notify]);

  useEffect(() => {
    if (!loc.hash) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loc.pathname, loc.hash]);

  // First visit after login: ask the onboarding questions once per browser session.
  useEffect(() => {
    if (!ready || profile || quiz) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem('tx_onboard_dismissed') === '1';
    } catch {
      /* ignore */
    }
    if (dismissed) return;
    const tm = setTimeout(() => openQuiz('onboard'), 700);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profile]);

  const active = (to: string) => (to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to));
  const go = (to: string) => {
    setMenu(null);
    setUserMenu(null);
    setDrawer(false);
    setBell(null);
    nav(to);
  };
  const doLogout = () => {
    setUserMenu(null);
    logout();
    nav('/auth', { replace: true });
  };

  return (
    <PreviewProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'clip' }}>
        <Background />
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0, zIndex: 1100, pt: { xs: 1, md: 1.5 }, px: { xs: 1, md: 2 } }}>
          <Container
            maxWidth="xl"
            sx={(th) => ({ borderRadius: '18px', border: `1px solid ${th.tx.line}`, background: th.palette.mode === 'dark' ? 'rgba(16,23,48,.72)' : 'rgba(255,255,255,.72)', backdropFilter: 'blur(22px) saturate(160%)' })}
          >
            <Toolbar disableGutters sx={{ gap: { xs: 0.25, sm: 1 }, minHeight: { xs: 60, md: 68 } }}>
              <IconButton sx={{ display: { lg: 'none' } }} onClick={() => setDrawer(true)} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
              <Box component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none', mr: 2 }}>
                <Logo size={42} withText={!isXs} />
              </Box>
              <Stack direction="row" spacing={0.25} sx={{ display: { xs: 'none', lg: 'flex' }, flexGrow: 1 }}>
                {NAV.map((n) => (
                  <Button
                    key={n.key}
                    color="inherit"
                    endIcon={n.subs ? <KeyboardArrowDownIcon /> : null}
                    onClick={(e) => (n.subs ? setMenu({ anchor: e.currentTarget, item: n }) : go(n.to))}
                    sx={{
                      fontWeight: 600, fontSize: 14, px: 1.1, minHeight: 40, borderRadius: '10px', position: 'relative',
                      color: active(n.to) ? 'secondary.main' : 'text.primary',
                      '& .MuiButton-endIcon': { ml: 0.25 },
                      '&::after': { content: '""', position: 'absolute', left: 10, right: 10, bottom: 4, height: 2, borderRadius: 2, bgcolor: 'secondary.main', transform: active(n.to) ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .3s cubic-bezier(.2,.8,.2,1)' },
                      '&:hover::after': { transform: 'scaleX(1)' },
                    }}
                  >
                    {t(n.key)}
                  </Button>
                ))}
              </Stack>
              <Box sx={{ flexGrow: 1, display: { lg: 'none' } }} />
              <Tooltip title={t('search')}>
                <IconButton onClick={() => setSearch(true)}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={mode === 'dark' ? 'Light theme' : 'Dark theme'}>
                <IconButton onClick={toggleMode} sx={{ display: { xs: 'none', sm: 'inline-flex' }, transition: 'transform .5s', '&:hover': { transform: 'rotate(40deg)' } }}>
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={t('cart')}>
                <IconButton onClick={() => go('/cart')}>
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title={t('notifications')}>
                <IconButton onClick={(e) => setBell(e.currentTarget)}>
                  <Badge badgeContent={unread} color="error" sx={{ '& .MuiBadge-badge': unread ? { animation: 'txpulse 1.8s ease-out infinite' } : {} }}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Button onClick={(e) => setUserMenu(e.currentTarget)} color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ p: 0.5, minWidth: 0, borderRadius: 99, '& .MuiButton-endIcon': { ml: 0.25, display: { xs: 'none', sm: 'inherit' } } }} aria-label="Account menu">
                <Avatar src={user.avatar} sx={{ width: 38, height: 38, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800, fontSize: 15, border: 2, borderColor: 'secondary.main' }}>
                  {initials(user.name)}
                </Avatar>
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Menu anchorEl={menu?.anchor} open={!!menu} onClose={() => setMenu(null)}>
          {(menu?.item.subs ?? []).map(([l, to]) => (
            <MenuItem key={l} onClick={() => go(to)} sx={{ minWidth: 220 }}>
              {l}
            </MenuItem>
          ))}
        </Menu>

        <Popover
          open={!!bell}
          anchorEl={bell}
          onClose={() => {
            setBell(null);
            markAnnouncementsSeen();
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: 340, maxWidth: 'calc(100vw - 24px)', borderRadius: '16px', mt: 1 } }}
        >
          <Typography sx={{ fontWeight: 800, px: 2, pt: 1.5, pb: 1 }}>{t('notifications')}</Typography>
          <Divider />
          {unread === 0 && <Typography color="text.secondary" sx={{ px: 2, py: 1.5, fontSize: 14 }}>{t('noNotifications')}</Typography>}
          <List dense disablePadding>
            {anns.slice(0, 4).map((a) => (
              <ListItemButton key={a.id} onClick={() => go('/announcements#' + a.id)} sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                  <CampaignIcon color={!annSeen || a.at > annSeen ? 'secondary' : 'disabled'} />
                </ListItemIcon>
                <ListItemText primary={a.title} secondary={a.author + ' · ' + new Date(a.at).toLocaleDateString()} primaryTypographyProps={{ fontWeight: !annSeen || a.at > annSeen ? 700 : 500 }} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Button fullWidth onClick={() => go('/announcements')} sx={{ borderRadius: 0 }}>
            {t('seeAll')}
          </Button>
        </Popover>

        <Menu
          anchorEl={userMenu}
          open={!!userMenu}
          onClose={() => setUserMenu(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { minWidth: 230, mt: 1, borderRadius: '14px' } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Divider />
          {PROFILE_MENU.map(([k, to]) => (
            <MenuItem key={k} onClick={() => go(to)} selected={active(to)}>
              {t(k)}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => go('/preferences')}>{t('preferences')}</MenuItem>
          <MenuItem onClick={(e) => setLangMenu(e.currentTarget)} sx={{ justifyContent: 'space-between' }}>
            {t('language')} <ChevronRightIcon fontSize="small" />
          </MenuItem>
          <MenuItem onClick={() => { setUserMenu(null); openQuiz('onboard'); }}>{t('updateAnswers')}</MenuItem>
          <Divider />
          <MenuItem onClick={doLogout}>{t('logout')}</MenuItem>
        </Menu>
        <Menu anchorEl={langMenu} open={!!langMenu} onClose={() => setLangMenu(null)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          {LANGS.map(([code, label]) => (
            <MenuItem
              key={code}
              selected={prefs.lang === code}
              onClick={() => {
                setPrefs({ lang: code });
                setLangMenu(null);
                setUserMenu(null);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>

        <Drawer open={drawer} onClose={() => setDrawer(false)} PaperProps={{ sx: { width: 290 } }}>
          <Box sx={{ p: 2 }}>
            <Logo size={40} />
          </Box>
          <Divider />
          <List>
            {NAV.map((n) =>
              n.subs ? (
                <Box key={n.key}>
                  <ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 700 }}>{t(n.key)}</ListSubheader>
                  {n.subs.map(([l, to]) => (
                    <ListItemButton key={l} onClick={() => go(to)} sx={{ pl: 4 }}>
                      <ListItemText primary={l} />
                    </ListItemButton>
                  ))}
                </Box>
              ) : (
                <ListItemButton key={n.key} selected={active(n.to)} onClick={() => go(n.to)}>
                  <ListItemText primary={t(n.key)} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              ),
            )}
            <ListItemButton onClick={() => go('/announcements')}>
              <ListItemText primary={t('announcements')} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton onClick={toggleMode}>
              <ListItemText primary={mode === 'dark' ? 'Light theme' : 'Dark theme'} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton onClick={doLogout}>
              <ListItemText primary={t('logout')} primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
          {/* Keyed by path so every page change fades and lifts in */}
          <Box key={loc.pathname} sx={{ animation: 'txrise .5s cubic-bezier(.2,.8,.2,1) both' }}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>

        <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 6, py: 5, position: 'relative', zIndex: 1, pb: 12 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Logo size={46} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" flexWrap="wrap" gap={2}>
                  {[...NAV.map((n): [StrKey, string] => [n.key, n.to]), ['announcements', '/announcements'] as [StrKey, string]].map(([k, to]) => (
                    <Typography key={k} component={RouterLink} to={to} sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: 14, '&:hover': { color: 'secondary.main' } }}>
                      {t(k)}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  academy.takxila.in
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <SearchDialog open={search} onClose={() => setSearch(false)} />
        <QuizDialog />
        <SelectionBar />
      </Box>
    </PreviewProvider>
  );
}
