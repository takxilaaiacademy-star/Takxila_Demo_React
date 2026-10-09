import { Box, Button, Card, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { Heading } from './Section';
import { BlobImg } from './Media';
import type { Course } from '../types';

export default function OwnedCourses() {
  const nav = useNavigate();
  const { owned, prog } = useStore();
  const items = owned.map(courseById).filter((c): c is Course => !!c);
  return (
    <Box>
      <Heading kick="MY COURSES" title="Continue" hl="learning" />
      <Grid container spacing={2.5}>
        {items.map((c) => {
          const pct = prog[c.id] || 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <BlobImg src={c.img} alt="" ratio="375 / 110" onClick={() => nav('/courses/' + c.id)} sx={{ cursor: 'pointer' }} />
                <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1.3, mb: 2, flexGrow: 1 }}>{c.title}</Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {pct}% complete
                    </Typography>
                    {pct >= 100 && (
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                        Completed
                      </Typography>
                    )}
                  </Stack>
                  <LinearProgress variant="determinate" value={pct} color={pct >= 100 ? 'success' : 'primary'} sx={{ mb: 2 }} />
                  <Button variant="contained" onClick={() => nav('/courses/' + c.id)}>
                    {pct >= 100 ? 'Review course' : pct ? 'Continue' : 'Start course'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => nav('/courses')}
            sx={(t) => ({ height: '100%', minHeight: 220, display: 'grid', placeItems: 'center', cursor: 'pointer', borderStyle: 'dashed', '&:hover': { borderColor: t.tx.hl } })}
          >
            <Stack alignItems="center" spacing={1}>
              <AddIcon fontSize="large" color="secondary" />
              <Typography sx={{ fontWeight: 700 }}>{items.length ? 'Add another course' : 'Enroll in your first course'}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
