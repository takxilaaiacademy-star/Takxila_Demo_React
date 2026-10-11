import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import WorkIcon from '@mui/icons-material/WorkOutline';
import RocketIcon from '@mui/icons-material/RocketLaunchOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import PsychologyIcon from '@mui/icons-material/PsychologyOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import PaletteIcon from '@mui/icons-material/PaletteOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDoneIcon from '@mui/icons-material/CloudDoneOutlined';
import { DashShell } from '../components/Learning';
import { Page } from '../components/Section';
import { useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { certificateId } from '../data/showcase';
import { load, save } from '../utils/storage';
import type { Resume as ResumeData, ResumeEntry } from '../types';
import { AddRemove, EntryList, LinkRow, SectionTitle, TxField, type OnValue } from '../features/resume/FormFields';
import { ResumePaper } from '../features/resume/ResumePreview';
import { ThemePicker } from '../features/resume/ThemePicker';
import { AtsCard } from '../features/resume/AtsCard';
import { buildDoc, docToText, hasContent } from '../features/resume/model';
import { countPdfPages, downloadResumePdf, loadJsPdf } from '../features/resume/pdf';
import { DEFAULT_THEME, themeById } from '../features/resume/themes';

const entry = (): ResumeEntry => ({ title: '', sub: '', from: '', to: '', points: '' });
type ListKey = 'education' | 'work' | 'projects';
const LISTS: readonly string[] = ['education', 'work', 'projects'];

const PERSONAL = [
  ['name', 'Full name', 6],
  ['role', 'Role, e.g. AI Automation Specialist', 6],
  ['phone', 'Phone', 6],
  ['email', 'Email', 6],
  ['city', 'City, Country', 12],
] as const;

const LABELS = {
  work: ['Company', 'Position', 'Highlights (one per line, start with a verb)'],
  projects: ['Project name', 'Tools used', 'What you built and the result (one per line)'],
  education: ['School or college', 'Degree or certificate', 'Highlights (grade, awards; one per line)'],
} as const;

const AUTOSAVE_MS = 500;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Cards around each form section. No backdrop blur: repainting blur on every keystroke is what made typing feel slow. */
const card = { p: { xs: 1.75, md: 2.25 }, borderRadius: '18px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' } as const;

export default function Resume() {
  return (
    <Page maxWidth="xl">
      <DashShell>
        {/* Typing state lives inside the workspace so the dashboard shell never re-renders per keystroke. */}
        <ResumeWorkspace />
      </DashShell>
    </Page>
  );
}

const Toolbar = memo(function Toolbar({ status, busy, onSave, onDownload }: { status: 'saved' | 'editing'; busy: boolean; onSave: () => void; onDownload: () => void }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} spacing={1.5} sx={{ mb: 2.5 }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="overline" color="text.secondary">
          BUILD RESUME
        </Typography>
        <Typography variant="h4">Resume builder</Typography>
        <Typography color="text.secondary">Pick an ATS-approved theme, fill in the form and download a clean, text-based PDF. Your Takxila certificates are added for you.</Typography>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip
          size="small"
          icon={status === 'saved' ? <CloudDoneIcon /> : <CircularProgress size={12} />}
          label={status === 'saved' ? 'Draft saved' : 'Saving…'}
          variant="outlined"
          sx={{ fontWeight: 600, '& .MuiChip-icon': { ml: '6px' } }}
        />
        <Button variant="text" startIcon={<SpeedIcon />} href="#ats-score">
          ATS score
        </Button>
        <Button variant="outlined" startIcon={<SaveIcon />} onClick={onSave}>
          Save
        </Button>
        <Button variant="contained" startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />} onClick={onDownload} disabled={busy}>
          Download PDF
        </Button>
      </Stack>
    </Stack>
  );
});

function ResumeWorkspace() {
  const user = useUser();
  const { resume, saveResume, owned, prog, toast } = useStore();
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

  // ---------- Draft state (local, so typing never waits on the global store) ----------
  const draftKey = 'resume_draft_' + user.email;
  const [r, setR] = useState<ResumeData>(() => ({ ...blank, ...(load<ResumeData | null>(draftKey, null) ?? resume ?? {}) }));
  const rRef = useRef(r);
  rRef.current = r;
  const savedRef = useRef<ResumeData | null>(resume);

  // Accept resumes that arrive from elsewhere (another tab, a fresh login), never our own echo.
  useEffect(() => {
    if (resume && resume !== savedRef.current && !same(resume, savedRef.current)) {
      savedRef.current = resume;
      setR({ ...blank, ...resume });
    }
  }, [resume]);

  // Debounced, silent autosave of the draft. The store save (which shows a toast) happens on Save and when leaving the page.
  const [status, setStatus] = useState<'saved' | 'editing'>('saved');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus('editing');
    const id = window.setTimeout(() => {
      save(draftKey, r);
      setStatus('saved');
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(id);
  }, [r, draftKey]);

  const persist = useCallback(() => {
    const cur = rRef.current;
    save(draftKey, cur);
    if (!same(cur, savedRef.current)) {
      savedRef.current = cur;
      saveResume(cur);
    }
  }, [draftKey, saveResume]);
  const persistRef = useRef(persist);
  persistRef.current = persist;

  // Flush on tab close and when leaving the page.
  useEffect(() => {
    const flush = () => save(draftKey, rRef.current);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      persistRef.current();
    };
  }, [draftKey]);

  // ---------- Stable updaters (memoised fields depend on these never changing) ----------
  const onValue = useCallback<OnValue>((path, v) => {
    const [k, i, f] = path.split('.');
    setR((s) => {
      if (i === undefined) return { ...s, [k]: v };
      const idx = Number(i);
      if (k === 'links') return { ...s, links: s.links.map((x, j) => (j === idx ? { ...x, [f]: v } : x)) };
      if (!LISTS.includes(k)) return s;
      const list = k as ListKey;
      return { ...s, [list]: s[list].map((x, j) => (j === idx ? { ...x, [f]: v } : x)) };
    });
  }, []);
  const addEntry = useCallback((list: string) => setR((s) => ({ ...s, [list as ListKey]: [...s[list as ListKey], entry()] })), []);
  const dropEntry = useCallback((list: string) => setR((s) => {
    const l = s[list as ListKey];
    return l.length > 1 ? { ...s, [list as ListKey]: l.slice(0, -1) } : s;
  }), []);
  const addLink = useCallback(() => setR((s) => ({ ...s, links: [...s.links, { label: 'Website', url: '' }] })), []);
  const dropLink = useCallback(() => setR((s) => ({ ...s, links: s.links.slice(0, -1) })), []);

  // ---------- Theme ----------
  const [themeId, setThemeId] = useState(() => themeById(load<string>('resume_theme', DEFAULT_THEME.id)).id);
  const theme = themeById(themeId);
  const pickTheme = useCallback((id: string) => {
    setThemeId(id);
    save('resume_theme', id);
  }, []);

  // ---------- Preview: rendered from a deferred copy so it never blocks typing ----------
  const deferred = useDeferredValue(r);
  const doc = useMemo(() => buildDoc(deferred), [deferred]);
  const [pages, setPages] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => {
      countPdfPages(doc, theme).then(setPages, () => setPages(null));
    }, 400);
    return () => window.clearTimeout(id);
  }, [doc, theme]);
  useEffect(() => {
    const id = window.setTimeout(() => void loadJsPdf(), 800); // warm up so the first download is instant
    return () => window.clearTimeout(id);
  }, []);

  // ---------- Actions ----------
  const [busy, setBusy] = useState(false);
  const onSave = useCallback(() => {
    savedRef.current = rRef.current;
    save(draftKey, rRef.current);
    saveResume(rRef.current);
  }, [draftKey, saveResume]);
  const onDownload = useCallback(async () => {
    const d = buildDoc(rRef.current);
    if (!hasContent(d)) return toast('Add your name and at least one section before downloading.');
    setBusy(true);
    try {
      const n = await downloadResumePdf(d, theme);
      toast(`PDF downloaded: ${n} page${n > 1 ? 's' : ''}, ${theme.name} theme.`);
    } catch (e) {
      console.error(e);
      toast('Could not create the PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [theme, toast]);
  const getBuilderText = useCallback(() => docToText(buildDoc(rRef.current)), []);
  const applyCerts = useCallback(() => setR((s) => ({ ...s, certs: certLines })), [certLines]);

  return (
    <>
      <Toolbar status={status} busy={busy} onSave={onSave} onDownload={onDownload} />

      <Box sx={{ ...card, mb: 2.5, bgcolor: 'transparent', background: (t) => t.tx.surface }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} sx={{ mb: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <SectionTitle icon={<PaletteIcon />} title="Choose a theme" hint="All five are ATS approved: one column, standard headings, real selectable text." />
          </Box>
        </Stack>
        <ThemePicker value={themeId} onPick={pickTheme} />
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
          <Stack spacing={2}>
            <Box sx={card}>
              <SectionTitle icon={<PersonIcon />} title="Personal information" />
              <Grid container spacing={1.25}>
                {PERSONAL.map(([k, label, sm]) => (
                  <Grid item xs={12} sm={sm} key={k}>
                    <TxField name={k} label={label} value={r[k]} onValue={onValue} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<LinkIcon />} title="Profile links" hint="LinkedIn matters most to recruiters." />
              <Stack spacing={1.25}>
                {r.links.map((l, i) => (
                  <LinkRow key={i} index={i} label={l.label} url={l.url} onValue={onValue} />
                ))}
                <AddRemove onAdd={addLink} onRemove={dropLink} addLabel="Add link" canRemove={r.links.length > 0} />
              </Stack>
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<NotesIcon />} title="Summary" hint="2–3 lines: who you are, what you do best, what you want next." />
              <TxField name="summary" multiline minRows={3} maxRows={10} label="Summary" value={r.summary} onValue={onValue} />
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<WorkIcon />} title="Work experience" hint="Internships and freelance work count too." />
              <EntryList list="work" items={r.work} labels={LABELS.work} onValue={onValue} onAdd={addEntry} onRemove={dropEntry} addLabel="Add another role" />
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<RocketIcon />} title="Projects" />
              <EntryList list="projects" items={r.projects} labels={LABELS.projects} onValue={onValue} onAdd={addEntry} onRemove={dropEntry} addLabel="Add another project" />
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<SchoolIcon />} title="Education" />
              <EntryList list="education" items={r.education} labels={LABELS.education} onValue={onValue} onAdd={addEntry} onRemove={dropEntry} addLabel="Add another school" />
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<PsychologyIcon />} title="Skills" hint="Comma separated. Use the exact names from job posts." />
              <Stack spacing={1.25}>
                <TxField name="skills" label="Technical skills" value={r.skills} onValue={onValue} />
                <TxField name="soft" label="Soft skills" value={r.soft} onValue={onValue} />
                <TxField name="languages" label="Languages" value={r.languages} onValue={onValue} />
              </Stack>
            </Box>

            <Box sx={card}>
              <SectionTitle icon={<WorkspacePremiumIcon />} title="Certifications" />
              <TxField name="certs" multiline minRows={2} maxRows={10} label="Certifications (one per line)" value={r.certs} onValue={onValue} />
              {certLines && certLines !== r.certs && (
                <Button size="small" startIcon={<AutoFixHighIcon />} sx={{ mt: 0.75 }} onClick={applyCerts}>
                  Use my Takxila certificates
                </Button>
              )}
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 }, animation: 'txpop .5s both' }}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.25 }}>
              <Typography sx={{ fontWeight: 800, flexGrow: 1 }}>Live preview</Typography>
              <Chip size="small" label={`${theme.name} theme`} sx={{ fontWeight: 700 }} />
              {pages !== null && pages > 0 && (
                <Chip size="small" color={pages === 1 ? 'success' : 'default'} variant="outlined" label={`PDF: ${pages} page${pages > 1 ? 's' : ''}`} sx={{ fontWeight: 700 }} data-testid="pdf-pages" />
              )}
            </Stack>
            <ResumePaper doc={doc} theme={theme} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <AtsCard getBuilderText={getBuilderText} />
      </Box>
    </>
  );
}
