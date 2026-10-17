import type { ReactNode } from 'react';
import type { Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import KeyIcon from '@mui/icons-material/VpnKeyOutlined';
import WebIcon from '@mui/icons-material/WebOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import LoginIcon from '@mui/icons-material/LoginRounded';
import CartIcon from '@mui/icons-material/ShoppingBagOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import type { LogKind } from '../../store/logSlice';

/** Shared look of the admin panels. */
export const panelSx = (t: Theme) => ({ p: { xs: 2, md: 3 }, borderRadius: '22px', background: t.tx.surface, border: `1px solid ${t.tx.line}`, backdropFilter: 'blur(22px)' });

/** Colour, icon and name of each kind of activity-log line. */
export const KIND_META: Record<LogKind, { label: string; color: string; icon: ReactNode }> = {
  content: { label: 'Content change', color: '#4F46E5', icon: <EditIcon /> },
  access: { label: 'Access', color: '#F97316', icon: <KeyIcon /> },
  site: { label: 'Navbar & banner', color: '#0EA5E9', icon: <WebIcon /> },
  signup: { label: 'Sign-up', color: '#16A34A', icon: <PersonAddIcon /> },
  login: { label: 'Login', color: '#64748B', icon: <LoginIcon /> },
  purchase: { label: 'Purchase', color: '#9333EA', icon: <CartIcon /> },
  enroll: { label: 'Enrolment', color: '#2a78d6', icon: <SchoolIcon /> },
  complete: { label: 'Finished', color: '#D97706', icon: <TrophyIcon /> },
};
