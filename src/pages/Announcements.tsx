import { Fragment, useEffect, useState, type ReactNode } from 'react';
import {
  Avatar, Box, Button, Card, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Link, MenuItem,
  Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import PushPinIcon from '@mui/icons-material/PushPinOutlined';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Page } from '../components/Section';
import { useAuth, useUser } from '../context/AuthContext';
import { useAnnouncements } from '../context/AnnouncementsContext';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { courseById } from '../data/recommend';
import type { Announcement } from '../types';
import FastField from '../components/FastField';

// Turns **bold**, course links (/courses/<id>) and web links into elements.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+|\/courses\/[a-z0-9-]+)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part))
      return (
        <Link key={i} href={part} target="_blank" rel="noopener noreferrer" color="secondary.main">
          {part}
        </Link>
      );
    if (/^\/courses\//.test(part)) {
      const c = courseById(part.split('/')[2]);
      return (
        <Link key={i} component={RouterLink} to={part} color="secondary.main">
          {c ? 'Open: ' + c.title.split(':')[0] : part}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Renders a post: paragraphs, numbered lists and bullet lists. */
function Body({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? 'ol' : 'ul';
    blocks.push(
      <Box component={Tag} key={blocks.length} sx={{ pl: 3, my: 1, '& li': { mb: 0.75 } }}>
        {list.items.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </Box>,
    );
    list = null;
  };
  text.split('\n').forEach((line) => {
    const m = /^\s*(\d+\.|[-*])\s+(.*)$/.exec(line);
    if (m) {
      const ordered = /\d/.test(m[1]);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push(m[2]);
    } else {
      flush();
      if (line.trim()) blocks.push(<Typography key={blocks.length} sx={{ my: 1 }}>{inline(line)}</Typography>);
    }
  });
  flush();
  return <>{blocks}</>;
}

function Post({ a, highlight }: { a: Announcement; highlight: boolean }) {
  const user = useUser();
  const { isAdmin } = useAuth();
  const { reply, update, remove } = useAnnouncements();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  return (
    <Card id={a.id} sx={(t) => ({ p: { xs: 2, md: 3 }, scrollMarginTop: 110, ...(highlight && { borderColor: t.tx.hl, boxShadow: `0 0 0 2px ${t.tx.hl}` }) })}>
      <Stack direction="row" spacing={2}>
        <Avatar src="/assets/logo-mark.webp" variant="rounded" sx={{ width: 48, height: 48, bgcolor: '#fff', p: 0.75, display: { xs: 'none', sm: 'flex' } }} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                {a.pinned && <PushPinIcon fontSize="small" color="secondary" sx={{ verticalAlign: 'middle', mr: 0.5 }} />}
                {a.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by <Box component="span" sx={{ color: 'secondary.main' }}>{a.author}</Box> –{' '}
                {new Date(a.at).toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </Typography>
            </Box>
            {isAdmin && (
              <>
                <Tooltip title={a.pinned ? 'Unpin' : 'Pin to top'}>
                  <IconButton size="small" onClick={() => update(a.id, { pinned: !a.pinned })}>
                    <PushPinIcon fontSize="small" color={a.pinned ? 'secondary' : 'inherit'} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => window.confirm('Delete this announcement?') && remove(a.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          <Box sx={{ mt: 1.5 }}>
            <Body text={a.body} />
          </Box>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <Link component={RouterLink} to={'/announcements#' + a.id} color="secondary.main" underline="hover">
              Permalink
            </Link>
            <Typography variant="body2">
              <Link component="button" onClick={() => setOpen((o) => !o)} color="secondary.main" underline="hover">
                Discuss this topic
              </Link>{' '}
              ({a.replies.length} {a.replies.length === 1 ? 'reply' : 'replies'} so far)
            </Typography>
          </Stack>
          <Collapse in={open} unmountOnExit>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {a.replies.map((r) => (
                <Box key={r.id} sx={(t) => ({ p: 1.5, borderRadius: '12px', background: t.tx.surface, border: `1px solid ${t.tx.line}`, animation: 'txrise .35s both' })}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {r.author} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>· {new Date(r.at).toLocaleString()}</Box>
                  </Typography>
                  <Typography variant="body2">{r.body}</Typography>
                </Box>
              ))}
              <Stack direction="row" spacing={1}>
                <FastField size="small" fullWidth placeholder="Write a reply" value={text} onChange={(e) => setText(e.target.value)} />
                <Button
                  variant="contained"
                  disabled={!text.trim()}
                  onClick={() => {
                    reply(a.id, user.name, text.trim());
                    setText('');
                  }}
                >
                  Reply
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Box>
      </Stack>
    </Card>
  );
}

function NewAnnouncement({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useUser();
  const { add } = useAnnouncements();
  const { toast } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [course, setCourse] = useState('');
  const post = () => {
    add({ title: title.trim(), body: body.trim(), author: user.name, authorEmail: user.email, pinned });
    setTitle('');
    setBody('');
    setPinned(false);
    toast('Announcement posted.');
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>Add a new announcement</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FastField label="Subject" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
          <FastField
            label="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            minRows={7}
            required
            helperText="Use **bold**, start lines with 1. or - for lists. Course links like /courses/claude-code become buttons."
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <TextField
              select
              size="small"
              label="Insert a course link"
              value={course}
              onChange={(e) => {
                const c = courseById(e.target.value);
                if (c) setBody((b) => (b ? b.replace(/\s*$/, '\n') : '') + `- Launched **${c.title}**: /courses/${c.id}`);
                setCourse('');
              }}
              sx={{ minWidth: 280 }}
            >
              {COURSES.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel control={<Switch checked={pinned} onChange={(e) => setPinned(e.target.checked)} />} label="Pin to top" />
          </Stack>
          {body.trim() && (
            <Box sx={(t) => ({ p: 2, borderRadius: '12px', border: `1px dashed ${t.tx.line}` })}>
              <Typography variant="overline" color="text.secondary">
                Preview
              </Typography>
              <Typography sx={{ fontWeight: 800 }}>{title || 'Subject'}</Typography>
              <Body text={body} />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!title.trim() || !body.trim()} onClick={post}>
          Post to forum
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Announcements() {
  const { items } = useAnnouncements();
  const { isAdmin } = useAuth();
  const { prefs, setPrefs, markAnnouncementsSeen } = useStore();
  const { hash } = useLocation();
  const [compose, setCompose] = useState(false);
  useEffect(() => {
    markAnnouncementsSeen();
  }, [markAnnouncementsSeen]);
  useEffect(() => {
    if (!hash) return;
    const tm = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    return () => clearTimeout(tm);
  }, [hash]);

  return (
    <Page maxWidth="md">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
          Site announcements
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel control={<Switch checked={prefs.notify} onChange={(e) => setPrefs({ notify: e.target.checked })} />} label="Subscribe to forum" />
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCompose(true)}>
              Add announcement
            </Button>
          )}
        </Stack>
      </Stack>
      {!isAdmin && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Only the site admin can post announcements. You can reply to any topic.
        </Typography>
      )}
      <Stack spacing={2.5}>
        {items.map((a, i) => (
          <Box key={a.id} sx={{ animation: `txrise .5s ${i * 70}ms both` }}>
            <Post a={a} highlight={hash.slice(1) === a.id} />
          </Box>
        ))}
        {!items.length && <Typography color="text.secondary">No announcements yet.</Typography>}
      </Stack>
      <NewAnnouncement open={compose} onClose={() => setCompose(false)} />
    </Page>
  );
}
