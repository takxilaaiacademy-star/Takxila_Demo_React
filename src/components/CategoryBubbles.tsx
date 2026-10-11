import { memo, useState } from 'react';
import { Avatar, AvatarGroup, Box, Button, Collapse, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GROUPS } from '../data/courses';
import type { Course, GroupId } from '../types';
import { CourseGrid } from './CourseCard';
import { BlobImg } from './Media';

const ORDER = Object.keys(GROUPS) as GroupId[];

/**
 * The five category "bubbles" from the main website: a bar per category that opens to show its courses.
 * Courses are only rendered once their bubble is opened, so the page stays light.
 */
export default function CategoryBubbles({ courses, open: initial = [] }: { courses: Course[]; open?: GroupId[] }) {
  const groups = ORDER.map((g) => ({ g, list: courses.filter((c) => c.group === g) })).filter((x) => x.list.length);
  const [open, setOpen] = useState<GroupId[]>(initial);
  const allOpen = groups.every((x) => open.includes(x.g));
  const toggle = (g: GroupId) => setOpen((o) => (o.includes(g) ? o.filter((x) => x !== g) : [...o, g]));

  return (
    <Box sx={(t) => ({ border: `1px solid ${t.tx.line}`, borderRadius: '16px', p: { xs: 1, sm: 1.5 }, background: t.tx.surface })}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button size="small" variant="outlined" onClick={() => setOpen(allOpen ? [] : groups.map((x) => x.g))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </Stack>
      <Stack spacing={1.25}>
        {groups.map(({ g, list }) => (
          <Bubble key={g} g={g} list={list} open={open.includes(g)} onToggle={toggle} />
        ))}
      </Stack>
    </Box>
  );
}

const Bubble = memo(function Bubble({ g, list, open, onToggle }: { g: GroupId; list: Course[]; open: boolean; onToggle: (g: GroupId) => void }) {
  const paid = list.filter((c) => c.price > 0).map((c) => c.price);
  const free = list.length - paid.length;
  const from = paid.length ? '₹' + Math.min(...paid) : '';
  const sub = [list.length + (list.length === 1 ? ' course' : ' courses'), free && free + ' free', from && 'from ' + from].filter(Boolean).join(' · ');
  return (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => onToggle(g)}
        aria-expanded={open}
        sx={{
          all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5,
          px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 1.75 }, borderRadius: '10px', color: '#fff',
          background: 'linear-gradient(90deg, #13215e, #1b2b78)', boxShadow: '0 6px 18px rgba(11,22,70,.25)',
          transition: 'transform .2s, box-shadow .2s',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 26px rgba(11,22,70,.35)' },
          '&:focus-visible': { outline: '2px solid #F5B93F', outlineOffset: 2 },
        }}
      >
        <ChevronRightIcon sx={{ transition: 'transform .25s', transform: open ? 'rotate(90deg)' : 'none' }} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, sm: 17 }, lineHeight: 1.3 }}>{GROUPS[g]}</Typography>
          <Typography sx={{ fontSize: 13, opacity: 0.8 }}>{sub}</Typography>
        </Box>
        <AvatarGroup max={4} sx={{ display: { xs: 'none', sm: 'flex' }, '& .MuiAvatar-root': { width: 34, height: 34, fontSize: 12, borderColor: '#1b2b78' } }}>
          {list.map((c) => (
            <Avatar key={c.id} alt="" variant="rounded" sx={{ bgcolor: '#2a3a8f' }}>
              <BlobImg src={c.img} alt="" sx={{ width: '100%', height: '100%' }} />
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
      <Collapse in={open} unmountOnExit timeout={250}>
        <Box sx={{ pt: 2, pb: 1, px: { xs: 0, sm: 0.5 } }}>
          <Typography sx={(t) => ({ fontWeight: 700, mb: 2, px: 1.5, py: 1, borderRadius: '8px', border: `1px solid ${t.tx.line}` })}>{GROUPS[g]}</Typography>
          <CourseGrid courses={list} />
        </Box>
      </Collapse>
    </Box>
  );
});
