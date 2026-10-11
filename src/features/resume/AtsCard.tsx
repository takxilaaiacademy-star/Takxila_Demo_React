import { memo, useCallback, useDeferredValue, useMemo, useRef, useState, type DragEvent } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Collapse, Grid, Stack, TextField, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/LockOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { scoreResume, type AtsCheck, type AtsResult, type AtsSource } from './ats';
import { ACCEPT, ExtractError, extractText } from './extract';

const BAND = {
  excellent: { color: '#16A34A', label: 'Excellent', note: 'Ready to send. ATS software will read this cleanly.' },
  good: { color: '#65A30D', label: 'Good', note: 'Solid. A few fixes below will push it over 85.' },
  fair: { color: '#F59E0B', label: 'Needs work', note: 'Some recruiters’ filters may skip it. Fix the red items first.' },
  poor: { color: '#DC2626', label: 'Low', note: 'Likely to be filtered out. Start with the red items below.' },
} as const;

/** Circular score gauge with colour bands. */
export const ScoreGauge = memo(function ScoreGauge({ score, band }: { score: number; band: AtsResult['band'] }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const color = BAND[band].color;
  return (
    <Box sx={{ position: 'relative', width: 148, height: 148, flex: 'none' }} role="img" aria-label={`ATS score ${score} out of 100, ${BAND[band].label}`}>
      <svg width="148" height="148" viewBox="0 0 148 148">
        <defs>
          <linearGradient id="tx-ats-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx="74" cy="74" r={r} fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="12" />
        <circle
          cx="74" cy="74" r={r} fill="none" stroke="url(#tx-ats-ring)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 74 74)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1), stroke .4s' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 38, lineHeight: 1, color }}>{score}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            out of 100
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

const ICON = { pass: <CheckCircleIcon sx={{ color: '#16A34A' }} />, warn: <WarningAmberIcon sx={{ color: '#F59E0B' }} />, fail: <CancelIcon sx={{ color: '#DC2626' }} /> };

const CheckRow = memo(function CheckRow({ c }: { c: AtsCheck }) {
  return (
    <Stack direction="row" spacing={1.25} sx={(t) => ({ p: 1.25, borderRadius: '12px', border: `1px solid ${t.tx.line}`, background: t.tx.surface })}>
      <Box sx={{ pt: 0.25, '& svg': { fontSize: 20 } }}>{ICON[c.status]}</Box>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography sx={{ fontWeight: 800, fontSize: 14.5, flexGrow: 1 }}>{c.label}</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: 'text.secondary', flex: 'none' }}>
            {c.points}/{c.max}
          </Typography>
        </Stack>
        <Box sx={(t) => ({ height: 4, borderRadius: 4, bgcolor: t.tx.line, my: 0.75, overflow: 'hidden' })}>
          <Box sx={{ height: '100%', width: `${(c.points / c.max) * 100}%`, bgcolor: c.status === 'pass' ? '#16A34A' : c.status === 'warn' ? '#F59E0B' : '#DC2626', transition: 'width .8s' }} />
        </Box>
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          {c.detail}
        </Typography>
        {c.tips.length > 0 && (
          <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.25, fontSize: 13, '& li': { mb: 0.25 } }}>
            {c.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
});

type Scored = { text: string; source: AtsSource; label: string };

/**
 * "Check your ATS score": upload a PDF / DOCX / TXT (or score the builder
 * draft) and get a 0-100 score with a breakdown. Runs fully in the browser.
 */
export const AtsCard = memo(function AtsCard({ getBuilderText }: { getBuilderText: () => string }) {
  const [input, setInput] = useState<Scored | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const [jd, setJd] = useState('');
  const deferredJd = useDeferredValue(jd);
  const fileRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => (input ? scoreResume(input.text, { source: input.source, jobDescription: deferredJd }) : null), [input, deferredJd]);

  const onFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { text, source } = await extractText(file);
      setInput({ text, source, label: file.name });
    } catch (e) {
      setInput(null);
      setError(e instanceof ExtractError ? e.message : 'Something went wrong while reading the file. Please try another one.');
      if (!(e instanceof ExtractError)) console.error(e);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    void onFile(e.dataTransfer.files?.[0]);
  };

  const scoreBuilder = () => {
    setError('');
    const text = getBuilderText();
    if (text.replace(/\s/g, '').length < 40) return setError('Your builder resume is almost empty. Fill in a few sections first.');
    setInput({ text, source: 'builder', label: 'Your builder resume' });
  };

  const band = result ? BAND[result.band] : null;

  return (
    <Box id="ats-score" sx={(t) => ({ p: { xs: 2, md: 3 }, borderRadius: '24px', border: `1px solid ${t.tx.line}`, background: t.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(245,185,63,.08), rgba(72,104,255,.10))' : 'linear-gradient(135deg, rgba(43,43,214,.06), rgba(60,200,230,.08))', scrollMarginTop: 96 })}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" color="secondary.main">
            ATS CHECKER
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Check your ATS score
          </Typography>
          <Typography color="text.secondary">Upload any resume to see how applicant tracking systems read it, with specific fixes.</Typography>
        </Box>
        <Chip icon={<LockIcon />} label="Private: your file never leaves this browser" variant="outlined" sx={{ fontWeight: 600, alignSelf: { xs: 'flex-start', sm: 'center' }, maxWidth: '100%' }} />
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Stack spacing={1.5}>
            <Box
              component="label"
              onDragOver={(e: DragEvent) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              sx={(t) => ({
                display: 'block', textAlign: 'center', cursor: 'pointer', p: { xs: 2.5, sm: 3 }, borderRadius: '18px', border: `2px dashed ${drag ? t.palette.secondary.main : t.tx.line}`,
                background: drag ? (t.palette.mode === 'dark' ? 'rgba(245,185,63,.10)' : 'rgba(43,43,214,.07)') : t.tx.surface, transition: 'all .2s',
                '&:hover': { borderColor: t.palette.secondary.main }, '&:focus-within': { outline: `2px solid ${t.palette.secondary.main}`, outlineOffset: 2 },
              })}
            >
              <input ref={fileRef} type="file" accept={ACCEPT} hidden aria-label="Upload your resume" onChange={(e) => void onFile(e.target.files?.[0])} data-testid="ats-file" />
              {busy ? <CircularProgress size={40} /> : <UploadFileIcon sx={{ fontSize: 44, color: 'secondary.main' }} />}
              <Typography sx={{ fontWeight: 800, mt: 1 }}>{busy ? 'Reading your resume…' : 'Drop your resume here'}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                PDF, DOCX or TXT, up to 5 MB
              </Typography>
              <Button component="span" variant="contained" startIcon={<UploadFileIcon />} disabled={busy}>
                Upload resume
              </Button>
            </Box>
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} onClick={scoreBuilder} disabled={busy}>
              Score my builder resume
            </Button>
            <TextField
              multiline minRows={3} maxRows={8} size="small" fullWidth value={jd} onChange={(e) => setJd(e.target.value)}
              label="Job description (optional)" placeholder="Paste the job post to see matched and missing keywords" helperText="Matching keywords is the biggest ATS factor."
            />
            <Collapse in={!!error}>
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            </Collapse>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          {!result || !band ? (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={(t) => ({ height: '100%', minHeight: 220, p: 3, borderRadius: '18px', border: `1px dashed ${t.tx.line}`, textAlign: 'center' })}>
              <DescriptionIcon sx={{ fontSize: 42, color: 'text.secondary', opacity: 0.6 }} />
              <Typography sx={{ fontWeight: 700 }}>Your score appears here</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
                We check contact details, section headings, length, bullet points, action verbs, numbers, keywords and formatting.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5} aria-live="polite" data-testid="ats-result">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="center" sx={(t) => ({ p: 2, borderRadius: '18px', border: `1px solid ${t.tx.line}`, background: t.tx.surface })}>
                <ScoreGauge score={result.score} band={result.band} />
                <Box sx={{ minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', overflowWrap: 'anywhere' }}>
                    {input?.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: band.color }} data-testid="ats-band">
                    {band.label}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {band.note}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Chip size="small" label={`${result.stats.words} words`} />
                    <Chip size="small" label={`${result.stats.bullets} bullets`} />
                    <Chip size="small" label={`${result.stats.actionVerbs} action verbs`} />
                    <Chip size="small" label={`${result.stats.numbers} numbers`} />
                  </Stack>
                </Box>
              </Stack>

              {result.keywords && (
                <Box sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px solid ${t.tx.line}` })}>
                  <Typography sx={{ fontWeight: 800, mb: 0.75 }}>Keywords from the job description</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {result.keywords.matched.map((k) => (
                      <Chip key={k} size="small" icon={<CheckCircleIcon />} label={k} sx={{ bgcolor: 'rgba(22,163,74,.14)', color: 'inherit', '& svg': { color: '#16A34A !important' } }} />
                    ))}
                    {result.keywords.missing.map((k) => (
                      <Chip key={k} size="small" icon={<CancelIcon />} label={k} variant="outlined" sx={{ borderColor: 'rgba(220,38,38,.45)', '& svg': { color: '#DC2626 !important' } }} />
                    ))}
                  </Stack>
                </Box>
              )}

              {result.checks.map((c) => (
                <CheckRow key={c.id} c={c} />
              ))}
              {result.notes.map((n) => (
                <Stack key={n} direction="row" spacing={1} alignItems="flex-start" sx={{ color: 'text.secondary', fontSize: 13, px: 0.5 }}>
                  <InfoIcon sx={{ fontSize: 18, mt: '1px' }} />
                  <span>{n}</span>
                </Stack>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
});
