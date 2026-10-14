import { useState } from 'react';
import { Box, Button, Divider, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { LEARNER_NAV } from '../Layout';
import { useAppDispatch, useAppSelector } from '../../store';
import { siteActions } from '../../store/siteSlice';

/** Admin > Navbar & banner: rename or hide the learners' navbar items, and show an announcement strip on every page. */
export default function AdminSite() {
  const dispatch = useAppDispatch();
  const hidden = useAppSelector((s) => s.site.navHidden);
  const labels = useAppSelector((s) => s.site.navLabels);
  const banner = useAppSelector((s) => s.site.banner);
  const [text, setText] = useState(banner.text);
  const [link, setLink] = useState(banner.link);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Navbar</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
          What learners see at the top of every page. You always see the admin navbar in Admin mode; use "Preview as learner" to check the result.
        </Typography>
        <Stack spacing={1.5}>
          {LEARNER_NAV.map((n) => (
            <Stack key={n.key} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
              <Typography sx={{ width: { sm: 140 }, fontWeight: 700, flexShrink: 0 }}>{n.label}</Typography>
              <TextField
                size="small"
                label="Shown as"
                placeholder={n.label}
                defaultValue={labels[n.key] ?? ''}
                onBlur={(e) => dispatch(siteActions.navLabelSet({ key: n.key, label: e.target.value }))}
                helperText=" "
                sx={{ flexGrow: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={!hidden.includes(n.key)} onChange={(e) => dispatch(siteActions.navHiddenSet({ key: n.key, hidden: !e.target.checked }))} />}
                label="Show to learners"
                sx={{ flexShrink: 0, mb: 2 }}
              />
            </Stack>
          ))}
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Announcement banner</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>A coloured strip at the very top of every page, for offers and news.</Typography>
        <Stack spacing={2}>
          <FormControlLabel control={<Switch checked={banner.show} onChange={(e) => dispatch(siteActions.bannerSet({ show: e.target.checked }))} />} label="Show the banner" />
          <TextField label="Banner text" value={text} onChange={(e) => setText(e.target.value)} fullWidth />
          <TextField label="Link when clicked (optional)" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/courses or https://..." fullWidth />
          <Box><Button variant="contained" onClick={() => dispatch(siteActions.bannerSet({ text: text.trim(), link: link.trim() }))}>Save banner</Button></Box>
        </Stack>
      </Box>
    </Stack>
  );
}
