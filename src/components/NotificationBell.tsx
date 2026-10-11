import { memo, useMemo, useState } from 'react';
import { Badge, Box, Button, Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CampaignIcon from '@mui/icons-material/CampaignOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useAnnouncements } from '../context/AnnouncementsContext';
import { useStoreActions } from '../context/StoreContext';
import { useAppSelector } from '../store';
import type { NotificationKind } from '../types';

/** One row in the bell: a learner notification or a site announcement. */
interface Item {
  id: string;
  kind: NotificationKind | 'announcement';
  title: string;
  body: string;
  at: string;
  unread: boolean;
  to: string;
}

const ICON: Record<Item['kind'], { icon: typeof InfoIcon; color: string }> = {
  purchase: { icon: ShoppingBagIcon, color: '#22c55e' },
  enroll: { icon: SchoolIcon, color: '#3b82f6' },
  complete: { icon: EmojiEventsIcon, color: '#F5B93F' },
  certificate: { icon: WorkspacePremiumIcon, color: '#a855f7' },
  info: { icon: InfoIcon, color: '#64748b' },
  announcement: { icon: CampaignIcon, color: '#f97316' },
};

function ago(at: string) {
  const s = (Date.now() - new Date(at).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + ' min ago';
  if (s < 86400) return Math.floor(s / 3600) + ' h ago';
  if (s < 7 * 86400) return Math.floor(s / 86400) + ' d ago';
  return new Date(at).toLocaleDateString();
}

/**
 * The bell in the top bar. Lists purchases, enrolments, completed courses, ready certificates
 * and new announcements; each one has an X to remove it.
 */
function NotificationBell({ label, empty, seeAll, onGo }: { label: string; empty: string; seeAll: string; onGo: (to: string) => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const notes = useAppSelector((s) => s.learner.data.notifications);
  const dismissed = useAppSelector((s) => s.learner.data.dismissedAnns);
  const annSeen = useAppSelector((s) => s.learner.data.annSeen);
  const notify = useAppSelector((s) => s.learner.data.prefs.notify);
  const { items: anns } = useAnnouncements();
  const a = useStoreActions();

  const items = useMemo<Item[]>(() => {
    const fromAnns: Item[] = anns
      .filter((x) => !dismissed.includes(x.id))
      .slice(0, 6)
      .map((x) => ({ id: x.id, kind: 'announcement', title: x.title, body: 'Announcement by ' + x.author, at: x.at, unread: !annSeen || x.at > annSeen, to: '/announcements#' + x.id }));
    const mine: Item[] = notes.map((n) => ({ id: n.id, kind: n.kind, title: n.title, body: n.body, at: n.at, unread: !n.read, to: n.to || '/dashboard' }));
    return [...mine, ...fromAnns].sort((x, y) => y.at.localeCompare(x.at));
  }, [notes, anns, dismissed, annSeen]);

  const unread = notify ? items.filter((i) => i.unread).length : 0;
  const remove = (i: Item) => (i.kind === 'announcement' ? a.dismissAnnouncement(i.id) : a.removeNotification(i.id));
  const open = (i: Item) => {
    if (i.kind !== 'announcement') a.readNotification(i.id);
    setAnchor(null);
    onGo(i.to);
  };
  const close = () => {
    setAnchor(null);
    a.readAllNotifications();
  };

  return (
    <>
      <Tooltip title={label}>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label={label + (unread ? ` (${unread} new)` : '')}>
          <Badge badgeContent={unread} color="error" sx={{ '& .MuiBadge-badge': unread ? { animation: 'txpulse 1.8s ease-out infinite' } : {} }}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 380, maxWidth: 'calc(100vw - 24px)', borderRadius: '16px', mt: 1, overflow: 'hidden' } }}
      >
        <Stack direction="row" alignItems="center" sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Typography sx={{ fontWeight: 800, flexGrow: 1 }}>
            {label}
            {unread > 0 && (
              <Box component="span" sx={{ ml: 1, px: 1, py: 0.25, borderRadius: 99, fontSize: 12, bgcolor: 'error.main', color: '#fff' }}>
                {unread} new
              </Box>
            )}
          </Typography>
          {items.some((i) => i.unread) && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={a.readAllNotifications} aria-label="Mark all as read">
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        <Divider />
        {items.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 4, px: 2 }}>
            <NotificationsIcon sx={{ fontSize: 40, opacity: 0.35 }} />
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              {empty}
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ maxHeight: 'min(60vh, 440px)', overflowY: 'auto' }}>
            {items.map((i) => (
              <Row key={i.id} item={i} onOpen={open} onRemove={remove} />
            ))}
          </Box>
        )}
        <Divider />
        <Stack direction="row">
          <Button fullWidth onClick={() => { setAnchor(null); onGo('/announcements'); }} sx={{ borderRadius: 0 }}>
            {seeAll}
          </Button>
          {items.length > 0 && (
            <Button color="inherit" onClick={() => a.clearNotifications(items.filter((i) => i.kind === 'announcement').map((i) => i.id))} sx={{ borderRadius: 0, flex: 'none', px: 2, color: 'text.secondary' }}>
              Clear all
            </Button>
          )}
        </Stack>
      </Popover>
    </>
  );
}

const Row = memo(function Row({ item: i, onOpen, onRemove }: { item: Item; onOpen: (i: Item) => void; onRemove: (i: Item) => void }) {
  const { icon: Icon, color } = ICON[i.kind];
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={(t) => ({
        position: 'relative', px: 2, py: 1.25, cursor: 'pointer', alignItems: 'flex-start',
        borderBottom: `1px solid ${t.tx.line}`,
        bgcolor: i.unread ? alpha(t.palette.secondary.main, t.palette.mode === 'dark' ? 0.08 : 0.1) : 'transparent',
        '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.08) },
        '&:hover .tx-x, & .tx-x:focus-visible': { opacity: 1 },
      })}
      onClick={() => onOpen(i)}
    >
      <Box sx={{ width: 36, height: 36, flex: 'none', borderRadius: '10px', display: 'grid', placeItems: 'center', color, bgcolor: alpha(color, 0.15) }}>
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0, flexGrow: 1, pr: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: i.unread ? 700 : 500, lineHeight: 1.35 }}>{i.title}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 12.5, lineHeight: 1.4, mt: 0.25 }}>
          {i.body}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 11.5, mt: 0.5, opacity: 0.8 }}>
          {ago(i.at)}
        </Typography>
      </Box>
      {i.unread && <Box sx={{ position: 'absolute', right: 44, top: 18, width: 8, height: 8, borderRadius: 99, bgcolor: 'secondary.main' }} />}
      <IconButton
        className="tx-x"
        size="small"
        aria-label={'Remove notification: ' + i.title}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(i);
        }}
        sx={{ position: 'absolute', right: 8, top: 8, opacity: { xs: 1, md: 0.55 }, transition: 'opacity .15s' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
});

export default memo(NotificationBell);
