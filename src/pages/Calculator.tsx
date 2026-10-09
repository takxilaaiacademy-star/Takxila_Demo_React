import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import CalculateIcon from '@mui/icons-material/CalculateOutlined';
import { PlanStats, RecGrid } from '../components/Recommendations';
import { Page } from '../components/Section';
import { useStore } from '../context/StoreContext';
import { COURSES } from '../data/courses';
import { questionsFor, recommend } from '../data/recommend';

export default function Calculator() {
  const { calc, owned, openQuiz } = useStore();
  const recs = calc ? recommend(calc, owned) : [];
  return (
    <Page>
      <Card sx={{ p: { xs: 3, md: 6 }, mb: 5 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="overline" color="text.secondary">
              AI COURSE CALCULATOR
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 52 }, my: 1 }}>
              Find your perfect{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                AI course
              </Box>{' '}
              in 60 seconds
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 17, mb: 3 }}>
              Answer {questionsFor('calc').length} quick questions about you, your goals, your time and your budget. We score all {COURSES.length} courses and build your learning plan with the total price.
            </Typography>
            <Button variant="contained" size="large" startIcon={<CalculateIcon />} onClick={() => openQuiz('calc')}>
              {calc ? 'Recalculate' : 'Start the calculator'}
            </Button>
          </Grid>
          <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Stack alignItems="center">
              <CalculateIcon sx={{ fontSize: 180, color: 'secondary.main', opacity: 0.85, animation: 'txfloat 7s ease-in-out infinite' }} />
            </Stack>
          </Grid>
        </Grid>
      </Card>
      {calc && (
        <>
          {recs.length ? (
            <>
              <PlanStats recs={recs} />
              <RecGrid recs={recs} />
            </>
          ) : (
            <Typography color="text.secondary">You already own every course that fits these answers. Try different topics.</Typography>
          )}
        </>
      )}
    </Page>
  );
}
