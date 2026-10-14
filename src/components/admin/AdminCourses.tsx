import { useMemo, useState } from 'react';
import { Avatar, Box, Button, Chip, FormControlLabel, InputAdornment, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { COURSES, HIDDEN_COURSES } from '../../data/courses';
import { priceText } from '../../data/recommend';
import { useStoreActions } from '../../context/StoreContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { siteActions } from '../../store/siteSlice';

/** Admin > Courses: every course in one list. Edit anything, add new courses, open a course to everybody, hide or restore. */
export default function AdminCourses() {
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const site = useAppSelector((s) => s.site);
  const [q, setQ] = useState('');

  // COURSES / HIDDEN_COURSES are rebuilt whenever site.rev changes, so this list is always current.
  const all = useMemo(
    () => [...COURSES.map((c) => ({ c, hidden: false })), ...HIDDEN_COURSES.map((c) => ({ c, hidden: true }))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site.rev],
  );
  const list = all.filter(({ c }) => c.title.toLowerCase().includes(q.toLowerCase()) || c.id.includes(q.toLowerCase()));
  const edit = (id: string) => dispatch(siteActions.editorOpened(id));
  const visibleIds = COURSES.map((c) => c.id);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }} alignItems={{ md: 'center' }}>
        <TextField
          size="small"
          placeholder="Search a course"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => edit('new')}>Add a course</Button>
        <Tooltip title="Every course in the catalog can be watched by anybody with an account">
          <Button variant="outlined" onClick={() => { dispatch(siteActions.openSet({ ids: visibleIds, open: true })); toast('All courses are now open to everyone.'); }}>Open all to everyone</Button>
        </Tooltip>
        <Button color="warning" disabled={!site.openCourses.length} onClick={() => { dispatch(siteActions.openSet({ ids: site.openCourses, open: false })); toast('Open access turned off for every course.'); }}>
          Close all
        </Button>
      </Stack>

      <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
        {COURSES.length} in the catalog · {HIDDEN_COURSES.length} hidden · {site.openCourses.length} open to everyone · {site.customCourses.length} created by you
      </Typography>

      <Stack spacing={1.25}>
        {list.map(({ c, hidden }) => {
          const open = site.openCourses.includes(c.id);
          const edited = !!site.courseEdits[c.id] || !!site.contentEdits[c.id];
          const custom = site.customCourses.some((x) => x.id === c.id);
          return (
            <Stack
              key={c.id}
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ md: 'center' }}
              sx={(t) => ({ p: 1.5, borderRadius: '16px', border: `1px solid ${t.tx.line}`, opacity: hidden ? 0.65 : 1 })}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
                <Avatar variant="rounded" src={c.img} sx={{ width: 84, height: 40, borderRadius: '10px' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }} noWrap>{c.title}</Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>{priceText(c)}</Typography>
                    {hidden && <Chip size="small" color="warning" label="Hidden" />}
                    {custom && <Chip size="small" color="secondary" label="Created by you" />}
                    {edited && !custom && <Chip size="small" variant="outlined" label="Edited" />}
                    {open && <Chip size="small" color="success" label="Open to everyone" />}
                  </Stack>
                </Box>
              </Stack>
              <FormControlLabel
                control={<Switch size="small" checked={open} onChange={(e) => dispatch(siteActions.openSet({ ids: [c.id], open: e.target.checked }))} />}
                label={<Typography sx={{ fontSize: 13 }}>Open access</Typography>}
                sx={{ mr: 0, flexShrink: 0 }}
              />
              <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => edit(c.id)} sx={{ flexShrink: 0 }}>Edit</Button>
              {hidden && <Button size="small" onClick={() => dispatch(siteActions.courseRestored({ id: c.id }))}>Show again</Button>}
            </Stack>
          );
        })}
        {list.length === 0 && <Typography color="text.secondary">No course matches your search.</Typography>}
      </Stack>
    </Box>
  );
}
