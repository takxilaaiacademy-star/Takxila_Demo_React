import { useDeferredValue, useMemo, useState } from 'react';
import { Dialog, DialogContent, InputAdornment, List, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { COURSES } from '../data/courses';
import { priceText } from '../data/recommend';
import { BlobImg } from './Media';

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const s = useDeferredValue(q.toLowerCase().trim());
  const results = useMemo(() => {
    const words = s.split(/\s+/).filter(Boolean);
    return words.length ? COURSES.filter((c) => words.every((w) => c.search.includes(w))) : COURSES.filter((c) => c.featured);
  }, [s]);
  const go = (id: string) => {
    onClose();
    setQ('');
    nav('/courses/' + id);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { alignSelf: 'flex-start', mt: { xs: 2, md: 10 } } }}>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search 45 courses: Claude, n8n, Midjourney, ads…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && results[0] && go(results[0].id)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <Typography variant="overline" color="text.secondary" component="div" sx={{ mt: 2 }}>
          {s ? results.length + ' results' : 'Popular courses'}
        </Typography>
        <List dense sx={{ maxHeight: '55vh', overflow: 'auto' }}>
          {results.map((c) => (
            <ListItemButton key={c.id} onClick={() => go(c.id)} sx={{ borderRadius: '10px' }}>
              <ListItemAvatar>
                <BlobImg src={c.img} alt="" ratio="375 / 110" sx={{ width: 76, mr: 1.5, borderRadius: '6px' }} />
              </ListItemAvatar>
              <ListItemText primary={c.title} secondary={c.catLabel} primaryTypographyProps={{ fontWeight: 600, noWrap: true }} />
              <Typography sx={{ fontWeight: 800, ml: 1 }}>{priceText(c)}</Typography>
            </ListItemButton>
          ))}
          {!results.length && <Typography sx={{ p: 2 }}>No courses match that search yet.</Typography>}
        </List>
      </DialogContent>
    </Dialog>
  );
}
