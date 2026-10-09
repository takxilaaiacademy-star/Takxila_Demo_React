import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Box, Button, GlobalStyles, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import LinkIcon from '@mui/icons-material/Link';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { DashShell, Panel } from '../components/Learning';
import { Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { certificateId } from '../data/showcase';
import type { Resume as ResumeData, ResumeEntry } from '../types';

const entry = (): ResumeEntry => ({ title: '', sub: '', from: '', to: '', points: '' });
type ListKey = 'education' | 'work' | 'projects';

/** Turns "2023-01" into "Jan 2023". */
const month = (v: string) => (v ? new Date(v + '-01T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
const span = (e: ResumeEntry) => [month(e.from), e.to ? month(e.to) : e.from ? 'Present' : ''].filter(Boolean).join(' – ');

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#0B1030', borderBottom: '1.5px solid #0B1030', pb: 0.25, mb: 0.75 }}>{title}</Typography>
      {children}
    </Box>
  );
}

/** The printable A4 preview. Always light, whatever the app theme is. */
function Preview({ r }: { r: ResumeData }) {
  const bullets = (s: string) =>
    s.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => (
      <Box component="li" key={l} sx={{ fontSize: 11 }}>
        {l.replace(/^[-•]\s*/, '')}
      </Box>
    ));
  const list = (items: ResumeEntry[]) =>
    items.filter((e) => e.title || e.sub).map((e, i) => (
      <Box key={i} sx={{ mb: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 12 }}>{e.title}</Typography>
        {e.sub && <Typography sx={{ fontSize: 11.5, color: '#2B2BD6' }}>{e.sub}</Typography>}
        {span(e) && <Typography sx={{ fontSize: 10.5, color: '#666' }}>{span(e)}</Typography>}
        {e.points && <Box component="ul" sx={{ m: 0, pl: 2.25, color: '#222' }}>{bullets(e.points)}</Box>}
      </Box>
    ));
  const line = (s: string) => <Typography sx={{ fontSize: 11.5, color: '#333' }}>{s}</Typography>;
  return (
    <Box id="tx-resume" sx={{ bgcolor: '#fff', color: '#111', p: { xs: 2.5, sm: 4 }, borderRadius: '6px', boxShadow: '0 30px 80px rgba(0,0,0,.35)', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", aspectRatio: { md: '1 / 1.414' }, overflow: 'hidden' }}>
      <Box sx={{ textAlign: 'center', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#0B1030' }}>{r.name || 'Your Name'}</Typography>
        <Typography sx={{ fontSize: 13, color: '#2B2BD6', fontWeight: 600 }}>{r.role || 'Your role'}</Typography>
        <Stack direction="row" justifyContent="center" flexWrap="wrap" columnGap={1.5} sx={{ mt: 0.5, fontSize: 11, color: '#333', '& svg': { fontSize: 12, verticalAlign: 'middle', mr: 0.25 } }}>
          {r.phone && <span><PhoneIcon />{r.phone}</span>}
          {r.email && <span><EmailIcon />{r.email}</span>}
          {r.city && <span><PlaceIcon />{r.city}</span>}
        </Stack>
        <Stack direction="row" justifyContent="center" flexWrap="wrap" columnGap={1.5} sx={{ fontSize: 10.5, color: '#2B2BD6', '& svg': { fontSize: 11, verticalAlign: 'middle', mr: 0.25 } }}>
          {r.links.filter((l) => l.url).map((l) => (
            <span key={l.label + l.url}>
              <LinkIcon />
              {l.url}
            </span>
          ))}
        </Stack>
      </Box>
      <Box sx={{ borderTop: '2px solid #0B1030', pt: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.3fr' }, columnGap: 3 }}>
        <Box>
          {r.summary && <Section title="Summary">{line(r.summary)}</Section>}
          {r.education.some((e) => e.title) && <Section title="Education">{list(r.education)}</Section>}
          {r.skills && <Section title="Technical skills">{line(r.skills)}</Section>}
          {r.soft && <Section title="Soft skills">{line(r.soft)}</Section>}
          {r.languages && <Section title="Languages">{line(r.languages)}</Section>}
          {r.certs && (
            <Section title="Certifications">
              {r.certs.split('\n').filter(Boolean).map((c) => (
                <Typography key={c} sx={{ fontSize: 11, color: '#333', mb: 0.25 }}>
                  {c}
                </Typography>
              ))}
            </Section>
          )}
        </Box>
        <Box>
          {r.work.some((e) => e.title) && <Section title="Work experience">{list(r.work)}</Section>}
          {r.projects.some((e) => e.title) && <Section title="Projects">{list(r.projects)}</Section>}
        </Box>
      </Box>
    </Box>
  );
}

export default function Resume() {
  const user = useUser();
  const { resume, saveResume, owned, prog } = useStore();
  const certLines = useMemo(
    () =>
      owned
        .filter((id) => (prog[id] || 0) >= 100)
        .map((id) => `${courseById(id)?.title} – Takxila AI Academy (${certificateId(user.email, id)})`)
        .join('\n'),
    [owned, prog, user.email],
  );
  const blank = useMemo<ResumeData>(
    () => ({
      name: user.name, role: '', phone: user.phone, email: user.email, city: user.city || '', summary: user.bio || '',
      links: [{ label: 'LinkedIn', url: '' }, { label: 'GitHub', url: '' }, { label: 'Portfolio', url: '' }],
      education: [entry()], work: [entry()], projects: [entry()],
      skills: owned.length ? owned.slice(0, 6).map((id) => courseById(id)?.title.split(/[–:-]/)[0].trim()).join(', ') : '',
      soft: 'Communication, Teamwork, Problem solving', languages: 'English, Hindi', certs: certLines,
    }),
    [user, owned, certLines],
  );
  const [r, setR] = useState<ResumeData>(() => resume ?? blank);
  useEffect(() => {
    if (resume) setR(resume);
  }, [resume]);

  const set = (k: keyof ResumeData) => (e: ChangeEvent<HTMLInputElement>) => setR((s) => ({ ...s, [k]: e.target.value }));
  const setItem = (list: ListKey, i: number, k: keyof ResumeEntry) => (e: ChangeEvent<HTMLInputElement>) =>
    setR((s) => ({ ...s, [list]: s[list].map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)) }));
  const add = (list: ListKey) => setR((s) => ({ ...s, [list]: [...s[list], entry()] }));
  const drop = (list: ListKey) => setR((s) => ({ ...s, [list]: s[list].length > 1 ? s[list].slice(0, -1) : s[list] }));

  const field = { size: 'small' as const, fullWidth: true };
  const AddRemove = ({ list }: { list: ListKey }) => (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Add another">
        <IconButton onClick={() => add(list)} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }} aria-label="Add another">
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove the last one">
        <IconButton onClick={() => drop(list)} sx={(t) => ({ border: `1px solid ${t.tx.line}` })} aria-label="Remove the last one">
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
  const entries = (list: ListKey, labels: [string, string]) => (
    <Stack spacing={1.25}>
      {r[list].map((e, i) => (
        <Stack key={i} spacing={1} sx={(t) => ({ p: 1.5, borderRadius: '12px', border: `1px dashed ${t.tx.line}`, animation: 'txrise .35s both' })}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField {...field} label={labels[0]} value={e.title} onChange={setItem(list, i, 'title')} />
            <TextField {...field} label={labels[1]} value={e.sub} onChange={setItem(list, i, 'sub')} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField {...field} type="month" label="From" InputLabelProps={{ shrink: true }} value={e.from} onChange={setItem(list, i, 'from')} />
            <TextField {...field} type="month" label="To" InputLabelProps={{ shrink: true }} value={e.to} onChange={setItem(list, i, 'to')} helperText={e.from && !e.to ? 'Empty means present' : ' '} />
          </Stack>
          <TextField {...field} multiline minRows={2} label="Highlights (one per line)" value={e.points} onChange={setItem(list, i, 'points')} />
        </Stack>
      ))}
      <AddRemove list={list} />
    </Stack>
  );

  return (
    <Page maxWidth="xl">
      <GlobalStyles
        styles={{
          '@media print': {
            'body *': { visibility: 'hidden' },
            '#tx-resume, #tx-resume *': { visibility: 'visible' },
            '#tx-resume': { position: 'absolute', left: 0, top: 0, width: '100%', boxShadow: 'none !important', aspectRatio: 'auto !important' },
            '@page': { size: 'A4', margin: '12mm' },
          },
        }}
      />
      <DashShell>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">
              BUILD RESUME
            </Typography>
            <Typography variant="h4">Resume builder</Typography>
            <Typography color="text.secondary">Fill in the form and watch the preview update. Your Takxila certificates are added for you.</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => saveResume(r)}>
              Save resume
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => window.print()}>
              Download PDF
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Panel>
              <Stack spacing={2.25}>
                <Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Personal information</Typography>
                  <Grid container spacing={1}>
                    {(
                      [
                        ['name', 'Full name'], ['role', 'Role, e.g. AI Automation Specialist'], ['phone', 'Phone'], ['email', 'Email'], ['city', 'City, Country'],
                      ] as const
                    ).map(([k, l]) => (
                      <Grid item xs={12} sm={k === 'role' || k === 'city' ? 12 : 6} key={k}>
                        <TextField {...field} label={l} value={r[k]} onChange={set(k)} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Social links</Typography>
                  <Stack spacing={1}>
                    {r.links.map((l, i) => (
                      <Stack direction="row" spacing={1} key={i}>
                        <TextField size="small" label="Label" value={l.label} sx={{ width: 140 }} onChange={(e) => setR((s) => ({ ...s, links: s.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) }))} />
                        <TextField {...field} label="URL" value={l.url} onChange={(e) => setR((s) => ({ ...s, links: s.links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) }))} />
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => setR((s) => ({ ...s, links: [...s.links, { label: 'Website', url: '' }] }))} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }} aria-label="Add link">
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => setR((s) => ({ ...s, links: s.links.slice(0, -1) }))} sx={(t) => ({ border: `1px solid ${t.tx.line}` })} aria-label="Remove last link">
                        <RemoveIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
                <TextField {...field} multiline minRows={3} label="Summary" value={r.summary} onChange={set('summary')} />
                <Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Education</Typography>
                  {entries('education', ['School or college', 'Degree or certificate'])}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Work experience</Typography>
                  {entries('work', ['Company', 'Position'])}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>Projects</Typography>
                  {entries('projects', ['Project name', 'Tools used'])}
                </Box>
                <TextField {...field} label="Technical skills" value={r.skills} onChange={set('skills')} />
                <TextField {...field} label="Soft skills" value={r.soft} onChange={set('soft')} />
                <TextField {...field} label="Languages" value={r.languages} onChange={set('languages')} />
                <Box>
                  <TextField {...field} multiline minRows={2} label="Certifications (one per line)" value={r.certs} onChange={set('certs')} />
                  {certLines && certLines !== r.certs && (
                    <Button size="small" startIcon={<AutoFixHighIcon />} sx={{ mt: 0.5 }} onClick={() => setR((s) => ({ ...s, certs: certLines }))}>
                      Use my Takxila certificates
                    </Button>
                  )}
                </Box>
              </Stack>
            </Panel>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 }, animation: 'txpop .5s both' }}>
              <Preview r={r} />
            </Box>
          </Grid>
        </Grid>
      </DashShell>
    </Page>
  );
}
