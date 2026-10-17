import { Box, Button, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { adminActions } from '../../store/adminSlice';

/**
 * The strip above the navbar, for the admin account only.
 *   Admin mode     : nothing (the admin navbar has every tool).
 *   Learner preview: blue strip. The site looks exactly as a learner sees it; nothing is saved and no email is sent.
 * Learners never see this strip.
 */
export default function AdminBar() {
  const { isAdminAccount, isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  if (!isAdminAccount) return null;

  if (!isAdmin) {
    return (
      <Box sx={{ background: 'linear-gradient(90deg,#2a3a8f,#3b52d9)', color: '#fff', px: 2, py: 0.75 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" flexWrap="wrap" useFlexGap>
          <VisibilityIcon fontSize="small" />
          <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>Learner preview (test only): nothing is saved, no emails are sent, no real payment.</Typography>
          <Button size="small" variant="contained" color="secondary" onClick={() => { dispatch(adminActions.modeSet('admin')); nav('/admin'); }} sx={{ py: 0.25 }}>
            Back to admin mode
          </Button>
        </Stack>
      </Box>
    );
  }

  // Admin mode: the admin navbar already has every tool, so no extra strip.
  return null;
}

/** The announcement strip the admin sets in Admin > Navbar & banner. Shown to everyone. */
export function SiteBannerStrip() {
  const banner = useAppSelector((s) => s.site.banner);
  const nav = useNavigate();
  if (!banner.show || !banner.text.trim()) return null;
  const go = () => {
    if (!banner.link) return;
    if (banner.link.startsWith('/')) nav(banner.link);
    else window.open(banner.link, '_blank', 'noopener,noreferrer');
  };
  return (
    <Box
      onClick={go}
      sx={{ background: 'linear-gradient(90deg,#6A3FE0,#8b5cf6)', color: '#fff', textAlign: 'center', px: 2, py: 0.9, fontWeight: 700, fontSize: 14, cursor: banner.link ? 'pointer' : 'default' }}
    >
      {banner.text}
    </Box>
  );
}
