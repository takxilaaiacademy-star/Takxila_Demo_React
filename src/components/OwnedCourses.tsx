import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { Heading } from './Section';
import { BlobImg } from './Media';
import type { Course } from '../types';

/** "My courses": big glass cards. One tap on "Start learning" opens the course player (/learn/:id). */
export default function OwnedCourses() {
  const nav = useNavigate();
  const { owned, prog, lessons } = useStore();
  const items = owned.map(courseById).filter((c): c is Course => !!c);
  const inProgress = items.filter((c) => (prog[c.id] || 0) > 0 && (prog[c.id] || 0) < 100).length;
  const done = items.filter((c) => (prog[c.id] || 0) >= 100).length;

  return (
    <Box>
      <Heading kick="MY COURSES" title="Continue" hl="learning" />

      {/* Quick stats */}
      <Stack direction="row" gap={1.25} flexWrap="wrap" sx={{ mb: 3 }}>
        <Chip label={`${items.length} enrolled`} sx={{ fontWeight: 800 }} />
        <Chip label={`${inProgress} in progress`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        <Chip icon={<WorkspacePremiumIcon />} label={`${done} completed`} color="success" variant="outlined" sx={{ fontWeight: 800 }} />
      </Stack>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
        {items.map((c) => {
          const pct = prog[c.id] || 0;
          const started = (lessons[c.id] || 0) > 0;
          return (
            <Box
              key={c.id}
              sx={(t) => ({
                borderRadius: '26px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative',
                background: t.tx.surface, border: `1px solid ${t.tx.line}`, backdropFilter: 'blur(22px)',
                transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s',
                '&:hover': { transform: 'translateY(-6px)', borderColor: t.tx.hl, boxShadow: `0 24px 60px ${t.tx.glow}` },
                '&:hover .tx-play': { transform: 'scale(1.1)', opacity: 1 },
              })}
            >
              <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => nav('/learn/' + c.id)}>
                <BlobImg src={c.img} alt="" ratio="375 / 110" />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(8,12,30,.7))' }} />
                <Box
                  className="tx-play"
                  sx={{ position: 'absolute', right: 14, bottom: -22, width: 52, height: 52, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#0A1022', background: 'linear-gradient(135deg,#F5B93F,#FF8A3D)', boxShadow: '0 10px 28px rgba(245,185,63,.5)', opacity: 0.95, transition: 'transform .3s, opacity .3s' }}
                >
                  <PlayArrowRoundedIcon fontSize="large" />
                </Box>
              </Box>
              <Box sx={{ p: 2.75, pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 800, lineHeight: 1.3, mb: 2, flexGrow: 1, fontSize: 17 }}>{c.title}</Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{pct}% complete</Typography>
                  {pct >= 100 && <Typography variant="body2" color="success.main" sx={{ fontWeight: 800 }}>Completed</Typography>}
                </Stack>
                <LinearProgress variant="determinate" value={pct} color={pct >= 100 ? 'success' : 'secondary'} sx={{ mb: 2.25 }} />
                <Stack direction="row" spacing={1}>
                  <Button fullWidth variant="contained" startIcon={<PlayArrowRoundedIcon />} onClick={() => nav('/learn/' + c.id)}>
                    {pct >= 100 ? 'Watch again' : started ? 'Continue' : 'Start learning'}
                  </Button>
                  <Button variant="outlined" onClick={() => nav('/courses/' + c.id)} sx={{ flexShrink: 0 }}>Details</Button>
                </Stack>
              </Box>
            </Box>
          );
        })}

        <Box
          onClick={() => nav('/courses')}
          sx={(t) => ({ minHeight: 260, borderRadius: '26px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: `2px dashed ${t.tx.line}`, transition: 'border-color .3s, background .3s', '&:hover': { borderColor: t.tx.hl, background: t.tx.surface } })}
        >
          <Stack alignItems="center" spacing={1}>
            <AddIcon fontSize="large" color="secondary" />
            <Typography sx={{ fontWeight: 800 }}>{items.length ? 'Add another course' : 'Enroll in your first course'}</Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
