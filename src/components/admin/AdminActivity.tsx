import { useMemo, useState } from 'react';
import { Box, Button, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import { useStoreActions } from '../../context/StoreContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { logActions, type LogKind } from '../../store/logSlice';
import { ago, csv, download } from '../../utils/adminStats';
import { KIND_META, panelSx } from './adminUi';


const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date(Date.now() - 86_400_000);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

/** Admin > Activity: every content change, access change, sign-up, login and purchase, newest first. */
export default function AdminActivity() {
  const items = useAppSelector((s) => s.log.items);
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const [kinds, setKinds] = useState<LogKind[]>([]);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(60);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((e) => (!kinds.length || kinds.includes(e.kind)) && (!t || e.text.toLowerCase().includes(t) || (e.who ?? '').includes(t)));
  }, [items, kinds, q]);
  const counts = useMemo(() => items.reduce<Record<string, number>>((m, e) => ((m[e.kind] = (m[e.kind] ?? 0) + 1), m), {}), [items]);
  const toggle = (k: LogKind) => setKinds((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]));

  let lastDay = '';
  return (
    <Box sx={panelSx}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Activity log</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13.5 }}>Your content changes, access changes, sign-ups, logins and purchases in this browser. The last 500 are kept.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />} disabled={!items.length} onClick={() => download('takxila-activity.csv', csv([['When', 'Type', 'Who', 'What'], ...items.map((e) => [e.at, KIND_META[e.kind].label, e.who ?? '', e.text])]))}>CSV</Button>
          <Button size="small" color="warning" disabled={!items.length} onClick={() => { if (window.confirm('Clear the whole activity log?')) { dispatch(logActions.cleared()); toast('Activity log cleared.'); } }}>Clear</Button>
        </Stack>
      </Stack>

      <TextField
        size="small"
        fullWidth
        placeholder="Search the log (course, email, order…)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        sx={{ mb: 1.5 }}
      />
      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
        {(Object.keys(KIND_META) as LogKind[]).map((k) => (
          <Chip
            key={k}
            size="small"
            label={`${KIND_META[k].label} ${counts[k] ?? 0}`}
            onClick={() => toggle(k)}
            variant={kinds.includes(k) ? 'filled' : 'outlined'}
            sx={kinds.includes(k) ? { bgcolor: KIND_META[k].color, color: '#fff', '&:hover': { bgcolor: KIND_META[k].color } } : undefined}
          />
        ))}
        {kinds.length > 0 && <Chip size="small" label="Show all" onClick={() => setKinds([])} />}
      </Stack>

      {list.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>{items.length ? 'Nothing matches.' : 'Nothing logged yet. Edit a course or give access and it appears here.'}</Typography>
      ) : (
        <Stack spacing={0.5}>
          {list.slice(0, limit).map((e) => {
            const m = KIND_META[e.kind];
            const day = dayLabel(e.at);
            const head = day !== lastDay;
            lastDay = day;
            return (
              <Box key={e.id}>
                {head && <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'text.secondary', mt: 1.5, mb: 0.75 }}>{day}</Typography>}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={(t) => ({ p: 1.1, borderRadius: '14px', '&:hover': { background: t.tx.surface } })}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: m.color, color: '#fff', flexShrink: 0, '& svg': { fontSize: 18 } }}>{m.icon}</Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-word' }}>{e.text}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12.5, wordBreak: 'break-all' }}>{m.label}{e.who ? ' · ' + e.who : ''}</Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ fontSize: 12, flexShrink: 0 }} title={new Date(e.at).toLocaleString()}>{ago(e.at)}</Typography>
                </Stack>
              </Box>
            );
          })}
          {list.length > limit && <Button onClick={() => setLimit((x) => x + 100)}>Show more ({list.length - limit} left)</Button>}
        </Stack>
      )}
    </Box>
  );
}
