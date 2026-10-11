import { Suspense, useEffect, useRef, useState } from 'react';
import type { Theme } from '@mui/material/styles';
import {
  AppBar, Avatar, Badge, Box, Button, CircularProgress, Container, Divider, Drawer, IconButton, LinearProgress, List, ListItemButton,
  ListItemText, ListSubheader, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography, useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useThemeMode } from '../context/ThemeModeContext';
import { GROUP_PILLS } from '../data/courses';
import { LANGS, translate, type StrKey } from '../data/i18n';
import Background from './Background';
import Footer from './Footer';
import Logo from './Logo';
import ChatWidget from './ChatWidget';
import CartUpsell from './CartUpsell';
import NotificationBell from './NotificationBell';
import { useBackToTop } from '../utils/scrollFx';
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
    subs: [['All courses', '/courses'], ...GROUP_PILLS.map(([id, l]): [string, string] => [l, '/courses?cat=' + id]), ['Free courses', '/courses?cat=free']],
  },
  { key: 'dashboard', to: '/dashboard' },
  { key: 'myCourses', to: '/my-courses' },
  { key: 'calculator', to: '/calculator' },
  { key: 'about', to: '/about' },
  { key: 'helpdesk', to: '/helpdesk' },
  { key: 'policies', to: '/policies', subs: [['Privacy policy', '/policies#privacy'], ['Refund policy', '/policies#refund'], ['Terms of use', '/policies#terms']] },
  { key: 'contact', to: '/contact', subs: [['Contact form', '/contact'], ['Mentorship', '/mentorship'], ['Announcements', '/announcements'], ['Helpdesk', '/helpdesk']] },
];

// The profile menu, in the same order as the academy's Moodle site.
const PROFILE_MENU: [StrKey, string][] = [
  ['purchases', '/purchases'], ['profile', '/profile'], ['grades', '/grades'], ['calendar', '/calendar'],
  ['files', '/files'], ['reports', '/reports'], ['certificates', '/certificates'], ['refer', '/refer'], ['resume', '/resume'], ['leaderboard', '/leaderboard'], ['mentorship', '/mentorship'],
];

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** Shown while a page's code loads (pages are split into their own files). */
export function PageLoader({ full = false }: { full?: boolean }) {
  return (
    <>
      <LinearProgress color="secondary" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000, height: 3 }} />
      {full && (
        // The spinner only fades in if the page takes more than 300 ms, so quick page changes show no flash.
        <Box role="status" aria-live="polite" sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1, animation: 'txfade .2s .3s both' }}>
          <Stack alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative', width: 72, height: 72, display: 'grid', placeItems: 'center' }}>
              <CircularProgress color="secondary" size={72} thickness={2.5} sx={{ position: 'absolute', inset: 0 }} />
              <Logo size={40} withText={false} />
            </Box>
            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
              Loading…
            </Typography>
          </Stack>
        </Box>
      )}
    </>
  );
}

/** Rendered after the page's code has loaded (it sits in the same Suspense boundary as the page). */
function PageReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Waits (at most `max` ms) for the images visible in the first screen of the page to finish loading. */
function waitForVisibleImages(root: HTMLElement | null, max: number): Promise<void> {
  if (!root) return Promise.resolve();
  const imgs = [...root.querySelectorAll('img')].filter((i) => !i.complete && i.getBoundingClientRect().top < innerHeight);
  const all = Promise.all(imgs.map((i) => new Promise<void>((r) => { i.addEventListener('load', () => r(), { once: true }); i.addEventListener('error', () => r(), { once: true }); })));
  return Promise.race([all.then(() => undefined), new Promise<void>((r) => setTimeout(r, max))]);
}

export default function Layout() {
  const user = useUser();
  const { logout } = useAuth();
  const { cart, ready, openQuiz, prefs, setPrefs } = useStore();
  const { mode, toggleMode } = useThemeMode();
  const nav = useNavigate();
  const loc = useLocation();
  const isXs = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; item: NavItem } | null>(null);
  const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
  const [langMenu, setLangMenu] = useState<HTMLElement | null>(null);
  const t = (k: StrKey) => translate(prefs.lang, k);
  const mainRef = useRef<HTMLDivElement>(null);
  const [readyPath, setReadyPath] = useState('');
  const loading = readyPath !== loc.pathname;
  const markReady = () => {
    const path = loc.pathname;
    void waitForVisibleImages(mainRef.current, 250).then(() => setReadyPath(path));
  };
  // Safety net: never keep a page hidden for more than 2.5 seconds.
  useEffect(() => {
    if (!loading) return;
    const path = loc.pathname;
    const tm = setTimeout(() => setReadyPath(path), 2500);
    return () => clearTimeout(tm);
  }, [loading, loc.pathname]);

  useEffect(() => {
    if (!loc.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [loc.pathname, loc.hash]);

  // Right after login: open the AI course calculator on top of Home, then clear the flag so a refresh doesn't reopen it.
  useEffect(() => {
    if (!ready || !(loc.state as { calc?: boolean } | null)?.calc) return;
    openQuiz('calc');
    nav(loc.pathname + loc.search, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loc.state]);

  useBackToTop();
  useEffect(() => {
    document.documentElement.lang = prefs.lang;
  }, [prefs.lang]);

  const active = (to: string) => (to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to));
  const go = (to: string) => {
    setMenu(null);
    setUserMenu(null);
    setDrawer(false);
    nav(to);
  };
  const doLogout = () => {
    setUserMenu(null);
    // Leave the protected pages first, so the login guard doesn't send us to /auth on the way out.
    nav('/', { replace: true });
    setTimeout(logout, 0);
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
              <NotificationBell label={t('notifications')} empty={t('noNotifications')} seeAll={t('seeAll')} onGo={go} />
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

        {/* The page and footer appear together once the page has loaded; until then a loader shows. */}
        <Box component="main" ref={mainRef} sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
          {loading && <PageLoader full />}
          <Box key={loc.pathname} sx={loading ? { position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', overflow: 'hidden' } : { animation: 'txfade .18s ease both' }}>
            <Suspense fallback={null}>
              <Outlet />
              <PageReady key={loc.pathname} onReady={markReady} />
            </Suspense>
          </Box>
        </Box>

        {!loading && <Footer />}

        <SearchDialog open={search} onClose={() => setSearch(false)} />
        <QuizDialog />
        <SelectionBar />
        <ChatWidget />
        <CartUpsell />
      </Box>
    </PreviewProvider>
  );
}
