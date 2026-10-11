import { useState } from 'react';
import { Button, Card, Divider, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { Heading, Page } from '../../components/Section';
import { useStore } from '../../context/StoreContext';
import { useThemeMode } from '../../context/ThemeModeContext';
import { LANGS } from '../../data/i18n';
import type { Lang } from '../../types';
import EmailPreview from '../../emails/EmailPreview';

function Row({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ py: 2 }}>
      <Stack sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {sub}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

export default function Preferences() {
  const { prefs, setPrefs, toast } = useStore();
  const { mode, toggleMode } = useThemeMode();
  const [preview, setPreview] = useState(false);
  const set = (p: Parameters<typeof setPrefs>[0]) => {
    setPrefs(p);
    toast('Preference saved.');
  };
  return (
    <Page maxWidth="md">
      <Heading kick="PREFERENCES" title="Make it" hl="yours" sub="Saved to your account in this browser." />
      <Card sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
        <Row title="Dark theme" sub="Navy and gold, easy on the eyes at night.">
          <FormControlLabel control={<Switch checked={mode === 'dark'} onChange={toggleMode} />} label="" />
        </Row>
        <Divider />
        <Row title="Language" sub="Menus and navigation. Course content stays in English.">
          <TextField select size="small" value={prefs.lang} onChange={(e) => set({ lang: e.target.value as Lang })} sx={{ minWidth: 160 }}>
            {LANGS.map(([code, label]) => (
              <MenuItem key={code} value={code}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Row>
        <Divider />
        <Row title="Autoplay course videos" sub="Start the summary video (muted) when a course or preview opens.">
          <FormControlLabel control={<Switch checked={prefs.autoplay} onChange={(e) => set({ autoplay: e.target.checked })} />} label="" />
        </Row>
        <Divider />
        <Row title="Reduce motion" sub="Turn off page and card animations and confetti.">
          <FormControlLabel control={<Switch checked={prefs.reduceMotion} onChange={(e) => set({ reduceMotion: e.target.checked })} />} label="" />
        </Row>
        <Divider />
        <Row title="Courses per page" sub="How many courses the catalog shows at once.">
          <TextField select size="small" value={prefs.pageSize} onChange={(e) => set({ pageSize: Number(e.target.value) })} sx={{ minWidth: 160 }}>
            {[6, 9, 12, 24].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Row>
        <Divider />
        <Row title="Announcement notifications" sub="Show a count on the bell when there is a new announcement.">
          <FormControlLabel control={<Switch checked={prefs.notify} onChange={(e) => set({ notify: e.target.checked })} />} label="" />
        </Row>
        <Divider />
        <Row title="Email me" sub="A confirmation when you buy or enroll in a course, and a congratulations email with your certificate when you finish one.">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" onClick={() => setPreview(true)}>
              Preview
            </Button>
            <FormControlLabel control={<Switch checked={prefs.emails} onChange={(e) => set({ emails: e.target.checked })} />} label="" />
          </Stack>
        </Row>
      </Card>
      {preview && <EmailPreview open onClose={() => setPreview(false)} />}
    </Page>
  );
}
