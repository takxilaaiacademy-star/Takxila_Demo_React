import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import { CourseVideo } from './Media';
import { Price } from './CourseCard';

const PreviewContext = createContext<(id: string) => void>(() => undefined);
export const usePreview = () => useContext(PreviewContext);

/** Quick preview: summary video, what you learn and the price, without leaving the page. */
export function PreviewProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useMemo(() => (cid: string) => setId(cid), []);
  return (
    <PreviewContext.Provider value={open}>
      {children}
      {id && <PreviewDialog id={id} onClose={() => setId(null)} />}
    </PreviewContext.Provider>
  );
}

function PreviewDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const theme = useTheme();
  const full = useMediaQuery(theme.breakpoints.down('sm'));
  const nav = useNavigate();
  const { owned, cart, addToCart, prefs } = useStore();
  const { isAuthed } = useAuth();
  const c = courseById(id);
  if (!c) return null;
  const isOwned = owned.includes(c.id);
  const inCart = cart.includes(c.id);
  const go = (to: string) => {
    onClose();
    nav(to);
  };
  return (
    <Dialog open onClose={onClose} fullScreen={full} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ flexGrow: 1 }}>
            COURSE PREVIEW · {c.catLabel}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close preview">
            <CloseIcon />
          </IconButton>
        </Stack>
        <CourseVideo src={c.video} poster={c.img} autoPlay={prefs.autoplay} title={c.title} />
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" sx={{ mb: 1, animation: 'txrise .5s .1s both' }}>
              {c.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {c.desc}
            </Typography>
            <Stack spacing={0.75}>
              {c.learn.map((l, i) => (
                <Stack key={l} direction="row" spacing={1} alignItems="center" sx={{ animation: `txrise .45s ${0.15 + i * 0.07}s both` }}>
                  <CheckCircleIcon color="secondary" fontSize="small" />
                  <Typography>{l}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
              {c.meta.map((m) => (
                <Chip key={m} label={m} size="small" variant="outlined" />
              ))}
              <Chip label={lessonsFor(c).length + ' lessons'} size="small" variant="outlined" />
            </Stack>
            {!isOwned && <Price c={c} size={30} />}
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {isAuthed ? (
                <>
                  <Button variant="contained" size="large" onClick={() => (isOwned ? go('/courses/' + c.id) : inCart ? go('/cart') : addToCart(c.id))}>
                    {isOwned ? 'Continue learning' : c.price === 0 ? 'Enroll for free' : inCart ? 'In cart · go to cart' : 'Add to cart'}
                  </Button>
                  <Button variant="outlined" onClick={() => go('/courses/' + c.id)}>
                    Open the course page
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" size="large" onClick={() => go('/auth#register')}>
                    {c.price === 0 ? 'Register and start free' : 'Register to enroll'}
                  </Button>
                  <Button variant="outlined" onClick={() => go('/auth')}>
                    I already have an account
                  </Button>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ height: 4 }} />
      </DialogContent>
    </Dialog>
  );
}
