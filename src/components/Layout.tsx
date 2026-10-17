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
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Link as RouterLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
import { useAppDispatch, useAppSelector } from '../store';
import { adminActions } from '../store/adminSlice';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import AdminBar, { SiteBannerStrip } from './admin/AdminBar';
import { CourseEditorHost } from './admin/CourseEditor';
import { useBackToTop } from '../utils/scrollFx';
import { PreviewProvider } from './Preview';
import QuizDialog from './QuizDialog';
import SearchDialog from './SearchDialog';
import SelectionBar from './SelectionBar';

interface NavItem {
  key: string;
  label?: string;
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

// Admin mode: the admin panel's big sections get their own navbar tabs.
const ADMIN_NAV: NavItem[] = [
  NAV[1],
  { key: 'admin-dash', label: 'Dashboard', to: '/admin?tab=overview' },
  { key: 'admin-users', label: 'Users', to: '/admin?tab=users' },
  {
    key: 'admin-content', label: 'Content', to: '/admin?tab=courses',
    subs: [['Courses', '/admin?tab=courses'], ['Give access', '/admin?tab=access'], ['Course players', '/admin?tab=players'], ['Navbar & banner', '/admin?tab=site']],
  },
  { key: 'admin-orders', label: 'Orders', to: '/admin?tab=orders' },
  { key: 'admin-activity', label: 'Activity', to: '/admin?tab=activity' },
  { key: 'admin-more', label: 'More', to: '/admin?tab=emails', subs: [['Emails', '/admin?tab=emails'], ['Backup & restore', '/admin?tab=backup'], ['Announcements', '/announcements']] },
];


export const LEARNER_NAV: { key: string; label: string }[] = NAV.map((n) => ({ key: n.key, label: n.label ?? translate('en', n.key as StrKey) }));

const PROFILE_MENU: [StrKey, string][] = [
  ['purchases', '/purchases'], ['profile', '/profile'], ['grades', '/grades'], ['calendar', '/calendar'],
  ['files', '/files'], ['reports', '/reports'], ['certificates', '/certificates'], ['refer', '/refer'], ['resume', '/resume'], ['leaderboard', '/leaderboard'], ['mentorship', '/mentorship'],
];


const ADMIN_PROFILE_KEYS: StrKey[] = ['profile'];
/** Learner-only pages. In Admin mode they send the admin to the dashboard ("Preview as learner" shows them). */
const LEARNER_ONLY = ['/home', '/dashboard', '/cart', '/my-courses', '/calculator', '/purchases', '/grades', '/certificates', '/refer', '/resume', '/leaderboard', '/mentorship', '/files', '/reports', '/calendar'];

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function PageLoader({ full = false }: { full?: boolean }) {
  return (
    <>
      <LinearProgress color="secondary" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000, height: 3 }} />
      {full && (
        
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
  const { logout, isAdminAccount } = useAuth();
  const dispatch = useAppDispatch();
  const { isAdmin } = useAuth();
  const siteRev = useAppSelector((s) => s.site.rev);
  const navHidden = useAppSelector((s) => s.site.navHidden);
  const navLabels = useAppSelector((s) => s.site.navLabels);
  // Admin mode has its own navbar. Learners (and the admin's "Preview as learner") get the normal one, minus what the admin hid.
  const navItems = isAdmin ? ADMIN_NAV : NAV.filter((n) => !navHidden.includes(n.key));
  const navText = (n: NavItem) => navLabels[n.key] || n.label || translate(prefs.lang, n.key as StrKey);
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
    // The AI calculator is for learners only: the admin in Admin mode never gets it.
    if (!isAdmin) openQuiz('calc');
    nav(loc.pathname + loc.search, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loc.state]);

  useBackToTop();
  useEffect(() => {
    document.documentElement.lang = prefs.lang;
  }, [prefs.lang]);

  const active = (to: string): boolean => {
    const [path, query] = to.split('?');
    if (query) return loc.pathname === path && (loc.search.includes(query) || (path === '/admin' && !loc.search && query === 'tab=overview'));
    return path === '/' ? loc.pathname === '/' : loc.pathname.startsWith(path);
  };
  const itemActive = (n: NavItem) => (n.to.includes('?') && n.subs ? n.subs.some(([, to]) => active(to)) : active(n.to));
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
        <AdminBar />
        <SiteBannerStrip />
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ top: 0, zIndex: 1100, pt: { xs: 1, md: 1.5 }, px: { xs: 1, md: 2 } }}>
          <Container
            maxWidth="xl"
            sx={(th) => ({ borderRadius: '18px', border: `1px solid ${th.tx.line}`, background: th.palette.mode === 'dark' ? 'rgba(16,23,48,.72)' : 'rgba(255,255,255,.72)', backdropFilter: 'blur(22px) saturate(160%)' })}
          >
            <Toolbar disableGutters sx={{ gap: { xs: 0.25, sm: 1 }, minHeight: { xs: 60, md: 68 } }}>
              <IconButton sx={{ display: { lg: 'none' } }} onClick={() => setDrawer(true)} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
              <Box component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none', mr: 2, '&:hover': { textDecoration: 'none' } }}>
                <Logo size={42} withText={!isXs} />
              </Box>
              <Stack direction="row" spacing={0.25} sx={{ display: { xs: 'none', lg: 'flex' }, flexGrow: 1 }}>
                {navItems.map((n) => (
                  <Button
                    key={n.key}
                    color="inherit"
                    endIcon={n.subs ? <KeyboardArrowDownIcon /> : null}
                    onClick={(e) => (n.subs ? setMenu({ anchor: e.currentTarget, item: n }) : go(n.to))}
                    sx={{
                      fontWeight: 600, fontSize: 14, px: 1.1, minHeight: 40, borderRadius: '10px', position: 'relative',
                      color: itemActive(n) ? 'secondary.main' : 'text.primary',
                      '& .MuiButton-endIcon': { ml: 0.25 },
                      '&::after': { content: '""', position: 'absolute', left: 10, right: 10, bottom: 4, height: 2, borderRadius: 2, bgcolor: 'secondary.main', transform: itemActive(n) ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .3s cubic-bezier(.2,.8,.2,1)' },
                      '&:hover::after': { transform: 'scaleX(1)' },
                    }}
                  >
                    {navText(n)}
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
              {/* Learner tools: hidden in Admin mode, shown in "Preview as learner" */}
              {!isAdmin && (
                <>
                  <Tooltip title={t('cart')}>
                    <IconButton onClick={() => go('/cart')}>
                      <Badge badgeContent={cart.length} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <NotificationBell label={t('notifications')} empty={t('noNotifications')} seeAll={t('seeAll')} onGo={go} />
                </>
              )}
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
          {/* Admin mode shows a short menu; "Preview as learner" shows the full learner menu. */}
          {PROFILE_MENU.filter(([k]) => !isAdmin || ADMIN_PROFILE_KEYS.includes(k)).map(([k, to]) => (
            <MenuItem key={k} onClick={() => go(to)} selected={active(to)}>
              {t(k)}
            </MenuItem>
          ))}
          <Divider />
          {isAdminAccount && [
            <MenuItem key="adm" onClick={() => go('/admin')} selected={active('/admin')}><AdminIcon fontSize="small" sx={{ mr: 1 }} /> Admin panel</MenuItem>,
            <MenuItem key="mode" onClick={() => { setUserMenu(null); dispatch(adminActions.modeSet(isAdmin ? 'user' : 'admin')); nav(isAdmin ? '/home' : '/admin'); }}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> {isAdmin ? 'Preview as learner' : 'Back to admin mode'}
            </MenuItem>,
            <Divider key="d" />,
          ]}
          {!isAdmin && <MenuItem onClick={() => go('/preferences')}>{t('preferences')}</MenuItem>}
          <MenuItem onClick={(e) => setLangMenu(e.currentTarget)} sx={{ justifyContent: 'space-between' }}>
            {t('language')} <ChevronRightIcon fontSize="small" />
          </MenuItem>
          {!isAdmin && <MenuItem onClick={() => { setUserMenu(null); openQuiz('onboard'); }}>{t('updateAnswers')}</MenuItem>}
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
            {navItems.map((n) =>
              n.subs ? (
                <Box key={n.key}>
                  <ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 700 }}>{navText(n)}</ListSubheader>
                  {n.subs.map(([l, to]) => (
                    <ListItemButton key={l} selected={active(to)} onClick={() => go(to)} sx={{ pl: 4 }}>
                      <ListItemText primary={l} />
                    </ListItemButton>
                  ))}
                </Box>
              ) : (
                <ListItemButton key={n.key} selected={active(n.to)} onClick={() => go(n.to)}>
                  <ListItemText primary={navText(n)} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              ),
            )}
            {!navItems.some((n) => n.key === 'announcements') && (
              <ListItemButton onClick={() => go('/announcements')}>
                <ListItemText primary={t('announcements')} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            )}
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
          <Box key={loc.pathname + (loc.pathname.startsWith('/admin') ? '' : ':' + siteRev)} sx={loading ? { position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', overflow: 'hidden' } : { animation: 'txfade .18s ease both' }}>
            <Suspense fallback={null}>
              {isAdmin && LEARNER_ONLY.includes(loc.pathname) ? <Navigate to="/admin" replace /> : <Outlet />}
              <PageReady key={loc.pathname} onReady={markReady} />
            </Suspense>
          </Box>
        </Box>

        {!loading && <Footer />}

        <SearchDialog open={search} onClose={() => setSearch(false)} />
        {isAdminAccount && <CourseEditorHost />}
        <QuizDialog />
        <SelectionBar />
        {!isAdmin && <ChatWidget />}
        <CartUpsell />
      </Box>
    </PreviewProvider>
  );
}
