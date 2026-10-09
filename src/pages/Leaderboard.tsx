import { useState } from 'react';
import { Avatar, Box, Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DashShell, initials, LeaderboardList, Panel, StreakTiles, useLeaderboard } from '../components/Learning';
import { Page } from '../components/Section';
import { CountUp } from '../components/Motion';

const PODIUM = [
  { place: 1, h: 150, color: '#F5B93F' },
  { place: 0, h: 115, color: '#C0C7DE' },
  { place: 2, h: 95, color: '#CD7F32' },
];

export default function Leaderboard() {
  const [mode, setMode] = useState<'weekly' | 'overall'>('weekly');
  const rows = useLeaderboard(mode);
  const youAt = rows.findIndex((r) => r.you);
  const you = rows[youAt];
  return (
    <Page maxWidth="xl">
      <DashShell>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1.5} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              LEADERBOARD
            </Typography>
            <Typography variant="h4">Who learned the most</Typography>
            <Typography color="text.secondary">Ranked by learning hours from completed lessons.</Typography>
          </Box>
          <ToggleButtonGroup exclusive value={mode} onChange={(_, v) => v && setMode(v)} color="secondary">
            <ToggleButton value="weekly" sx={{ fontWeight: 700, textTransform: 'none', px: 2.5 }}>
              This week
            </ToggleButton>
            <ToggleButton value="overall" sx={{ fontWeight: 700, textTransform: 'none', px: 2.5 }}>
              Overall
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <Panel sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={{ xs: 1, sm: 2 }} key={mode} sx={{ pt: 2 }}>
                {PODIUM.map(({ place, h, color }, i) => {
                  const r = rows[place];
                  if (!r) return null;
                  return (
                    <Stack key={place} alignItems="center" sx={{ width: { xs: 96, sm: 130 } }}>
                      <Avatar sx={{ width: 56, height: 56, mb: 1, bgcolor: color, color: '#0A1022', fontWeight: 800, boxShadow: `0 0 0 4px ${color}55`, animation: `txpop .5s ${300 + i * 150}ms both` }}>
                        {initials(r.name)}
                      </Avatar>
                      <Typography noWrap sx={{ fontWeight: 800, fontSize: 14, maxWidth: '100%' }}>
                        {r.name.split(' ')[0]}
                        {r.you ? ' (you)' : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {r.hours} hr
                      </Typography>
                      <Box
                        sx={{
                          width: '100%', height: h, borderRadius: '14px 14px 4px 4px', display: 'grid', placeItems: 'center',
                          background: `linear-gradient(180deg, ${color}, ${color}33)`, transformOrigin: 'bottom', animation: `txpop .6s ${i * 120}ms cubic-bezier(.2,.8,.2,1) both`,
                        }}
                      >
                        <Stack alignItems="center">
                          <EmojiEventsIcon sx={{ color: '#0A1022' }} />
                          <Typography sx={{ fontWeight: 800, fontSize: 28, color: '#0A1022' }}>{place + 1}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Panel>
            <Panel>
              <LeaderboardList mode={mode} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
              <Panel>
                <Typography variant="overline" color="text.secondary">
                  YOUR RANK
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 56, lineHeight: 1, color: 'secondary.main' }}>
                  #<CountUp value={youAt + 1} key={mode} />
                </Typography>
                <Typography color="text.secondary">
                  {you?.hours ?? 0} learning hours {mode === 'weekly' ? 'this week' : 'in total'}.{' '}
                  {youAt > 0 ? `${Math.max(0.1, Math.round((rows[youAt - 1].hours - (you?.hours ?? 0) + 0.1) * 10) / 10)} hr more to pass ${rows[youAt - 1].name.split(' ')[0]}.` : 'You are at the top. Keep it up!'}
                </Typography>
              </Panel>
              <StreakTiles />
              <Panel>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  How hours are counted
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Each course length is shared across its lessons. Marking a lesson complete adds that lesson&apos;s hours. The weekly board counts lessons from the last 7 days.
                </Typography>
              </Panel>
            </Stack>
          </Grid>
        </Grid>
      </DashShell>
    </Page>
  );
}
