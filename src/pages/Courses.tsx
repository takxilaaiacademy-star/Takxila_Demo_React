import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Box, Chip, InputAdornment, MenuItem, Pagination, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModuleOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import { NumberedGrid } from '../components/Showcase';
import { useSearchParams } from 'react-router-dom';
import { CourseGrid } from '../components/CourseCard';
import { Heading, Page } from '../components/Section';
import { useStore } from '../context/StoreContext';
import { CAT_PILLS, COURSES } from '../data/courses';
import { prefetch } from '../utils/media';
import type { CatFilter, Course } from '../types';

type SortKey = 'popular' | 'low' | 'high' | 'az';
const SORTS: Record<SortKey, string> = { popular: 'Most popular', low: 'Price: low to high', high: 'Price: high to low', az: 'Title: A to Z' };
const PILLS: [CatFilter, string][] = [['all', 'All Courses (' + COURSES.length + ')'], ...CAT_PILLS, ['free', 'Free']];

// Counts per category, computed once.
const COUNTS = COURSES.reduce<Record<string, number>>((a, c) => ({ ...a, [c.cat]: (a[c.cat] || 0) + 1, ...(c.price === 0 && { free: (a.free || 0) + 1 }) }), {});

const SORTERS: Record<SortKey, (a: Course, b: Course) => number> = {
  popular: (a, b) => Number(b.featured) - Number(a.featured),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  az: (a, b) => a.title.localeCompare(b.title),
};

export default function Courses() {
  const { prefs } = useStore();
  const [params, setParams] = useSearchParams();
  const cat = (params.get('cat') || 'all') as CatFilter;
  const sort = (params.get('sort') || 'popular') as SortKey;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const view = params.get('view') === 'list' ? 'list' : 'cards';
  const [q, setQ] = useState(params.get('q') || '');
  // Typing stays instant; the list filters on a deferred copy of the query.
  const dq = useDeferredValue(q.toLowerCase().trim());

  const list = useMemo(() => {
    const words = dq.split(/\s+/).filter(Boolean);
    return COURSES.filter((c) => (cat === 'all' || (cat === 'free' ? c.price === 0 : c.cat === cat)) && words.every((w) => c.search.includes(w))).sort(SORTERS[sort] ?? SORTERS.popular);
  }, [cat, sort, dq]);

  const size = prefs.pageSize;
  const pages = Math.max(1, Math.ceil(list.length / size));
  const cur = Math.min(page, pages);
  const shown = useMemo(() => list.slice((cur - 1) * size, cur * size), [list, cur, size]);

  // Warm the banners of the next page so it opens instantly.
  useEffect(() => prefetch(list.slice(cur * size, (cur + 1) * size).map((c) => c.img)), [list, cur, size]);

  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v == null || v === '' ? next.delete(k) : next.set(k, v)));
    setParams(next, { replace: true });
  };
  useEffect(() => {
    const t = setTimeout(() => setParam({ q: q.trim() || null, page: null }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <Page>
      <Heading kick="COURSE CATALOG" title="Find your next" hl="AI skill" />
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {PILLS.map(([id, label], i) => (
          <Chip
            key={id}
            label={id === 'all' ? label : `${label} (${COUNTS[id] || 0})`}
            clickable
            onClick={() => setParam({ cat: id === 'all' ? null : id, page: null })}
            color={cat === id ? 'primary' : 'default'}
            variant={cat === id ? 'filled' : 'outlined'}
            sx={{ height: 38, fontSize: 14, transition: 'transform .2s', '&:hover': { transform: 'translateY(-2px)' }, animation: `txrise .4s ${i * 30}ms both` }}
          />
        ))}
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} alignItems={{ sm: 'center' }}>
        <TextField
          size="small"
          placeholder="Search courses, tools or skills"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { sm: 420 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField select size="small" value={sort} onChange={(e) => setParam({ sort: e.target.value === 'popular' ? null : e.target.value, page: null })} sx={{ minWidth: 200 }}>
          {(Object.keys(SORTS) as SortKey[]).map((k) => (
            <MenuItem key={k} value={k}>
              {SORTS[k]}
            </MenuItem>
          ))}
        </TextField>
        <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setParam({ view: v === 'cards' ? null : v })} aria-label="Layout">
          <ToggleButton value="cards" aria-label="Banner cards">
            <Tooltip title="Banner cards">
              <ViewModuleIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="list" aria-label="Compact tiles with icons">
            <Tooltip title="Compact tiles with icons">
              <AppsIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography color="text.secondary" sx={{ ml: { sm: 'auto !important' } }}>
          {list.length ? `Showing ${(cur - 1) * size + 1}–${Math.min(cur * size, list.length)} of ${list.length}` : '0 courses'}
        </Typography>
      </Stack>
      <Box key={cat + sort + dq + cur + view} sx={{ opacity: q.toLowerCase().trim() !== dq ? 0.6 : 1, transition: 'opacity .2s' }}>
        {view === 'list' ? <NumberedGrid courses={shown} start={(cur - 1) * size + 1} /> : <CourseGrid courses={shown} />}
      </Box>
      {!list.length && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No courses match that search yet.</Typography>
        </Box>
      )}
      {pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 5 }}>
          <Pagination
            count={pages}
            page={cur}
            color="primary"
            shape="rounded"
            size="large"
            onChange={(_, p) => {
              setParam({ page: p === 1 ? null : String(p) });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Stack>
      )}
    </Page>
  );
}
