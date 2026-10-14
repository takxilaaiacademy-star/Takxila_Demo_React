import { Box, Button, Stack, Typography } from '@mui/material';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseById } from '../../data/recommend';
import { useAppDispatch, useAppSelector } from '../../store';
import { adminActions } from '../../store/adminSlice';
import { siteActions } from '../../store/siteSlice';

/**
 * The strip above the navbar, for the admin account only.
 *   Admin mode     : gold strip with the quick tools (Admin panel, Add course, Edit this course) and "Preview as learner".
 *   Learner preview: blue strip. The whole site (navbar included) looks exactly as a learner sees it. Nothing is changed.
 * Learners never see this strip.
 */
export default function AdminBar() {
  const { isAdminAccount, isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  if (!isAdminAccount) return null;

  const m = /^\/(?:courses|learn)\/([^/]+)/.exec(loc.pathname);
  const courseId = m && courseById(m[1]) ? m[1] : null;

  if (!isAdmin) {
    return (
      <Box sx={{ background: 'linear-gradient(90deg,#2a3a8f,#3b52d9)', color: '#fff', px: 2, py: 0.75 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" flexWrap="wrap" useFlexGap>
          <VisibilityIcon fontSize="small" />
          <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>Learner preview: this is exactly what a learner sees.</Typography>
          <Button size="small" variant="contained" color="secondary" onClick={() => dispatch(adminActions.modeSet('admin'))} sx={{ py: 0.25 }}>
            Back to admin mode
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ background: 'linear-gradient(90deg,#F5B93F,#FFD98A)', color: '#0A1022', px: 2, py: 0.75 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="center" flexWrap="wrap" useFlexGap>
        <AdminIcon fontSize="small" />
        <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>ADMIN MODE: you are editing the live site</Typography>
        <Button size="small" variant="outlined" color="inherit" onClick={() => nav('/admin?tab=courses')} sx={{ py: 0.25, borderColor: 'rgba(10,16,34,.4)' }}>
          Admin panel
        </Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={() => dispatch(siteActions.editorOpened('new'))} sx={{ py: 0.25, borderColor: 'rgba(10,16,34,.4)' }}>
          Add course
        </Button>
        {courseId && (
          <Button size="small" variant="contained" startIcon={<EditIcon />} onClick={() => dispatch(siteActions.editorOpened(courseId))} sx={{ py: 0.25, bgcolor: '#0A1022', color: '#fff', '&:hover': { bgcolor: '#1b2550' } }}>
            Edit this course
          </Button>
        )}
        <Button size="small" variant="outlined" color="inherit" startIcon={<VisibilityIcon />} onClick={() => dispatch(adminActions.modeSet('user'))} sx={{ py: 0.25, borderColor: 'rgba(10,16,34,.4)' }}>
          Preview as learner
        </Button>
      </Stack>
    </Box>
  );
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
