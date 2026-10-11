import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  InputAdornment, LinearProgress, Stack, TextField, Tooltip, Typography, useMediaQuery, type Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/LockOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate } from 'react-router-dom';
import { DashShell, Panel } from '../components/Learning';
import { CourseIcon } from '../components/CourseIcon';
import { Page } from '../components/Section';
import { useAuth, useUser } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';
import { lessonsFor } from '../data/curriculum';
import { certificateId } from '../data/showcase';
import { CertificatePreview, downloadCertificate, idSuffix, issuedText, warmCertificate, type CertificateData, type CertificateFormat } from '../features/certificate';
import { load } from '../utils/storage';
import type { Course, UserData } from '../types';

interface Cert {
  c: Course;
  id: string;
  at: string;
}

const certData = (name: string, cert: Cert): CertificateData => ({
  name,
  course: cert.c.title,
  category: cert.c.catLabel,
  issuedAt: cert.at,
  id: cert.id,
});

/** Runs one certificate download at a time and reports which format is busy. */
function useCertDownload(toast: (m: string) => void) {
  const [busy, setBusy] = useState<CertificateFormat | null>(null);
  const run = useCallback(
    async (format: CertificateFormat, data: CertificateData, courseId: string) => {
      setBusy(format);
      try {
        await downloadCertificate(format, data, courseId);
        toast(`Certificate downloaded as ${format.toUpperCase()}`);
      } catch {
        toast('Could not create the certificate. Please try again.');
      } finally {
        setBusy(null);
      }
    },
    [toast],
  );
  return { busy, run };
}

function DownloadButtons({ busy, onDownload, size = 'medium' }: { busy: CertificateFormat | null; onDownload: (f: CertificateFormat) => void; size?: 'small' | 'medium' | 'large' }) {
  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      <Button
        variant="contained"
        size={size}
        disabled={!!busy}
        onClick={() => onDownload('png')}
        startIcon={busy === 'png' ? <CircularProgress size={16} color="inherit" /> : <ImageIcon />}
        sx={{ flex: 1, whiteSpace: 'nowrap' }}
      >
        {busy === 'png' ? 'Preparing…' : 'PNG'}
      </Button>
      <Button
        variant="outlined"
        size={size}
        disabled={!!busy}
        onClick={() => onDownload('pdf')}
        startIcon={busy === 'pdf' ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
        sx={{ flex: 1, whiteSpace: 'nowrap' }}
      >
        {busy === 'pdf' ? 'Preparing…' : 'PDF'}
      </Button>
    </Stack>
  );
}

const CertCard = memo(function CertCard({ name, cert, index, onCopy, onView }: { name: string; cert: Cert; index: number; onCopy: (id: string) => void; onView: (cert: Cert) => void }) {
  const { toast } = useStore();
  const { busy, run } = useCertDownload(toast);
  const data = useMemo(() => certData(name, cert), [name, cert]);
  return (
    <Panel sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column', animation: `txrise .5s ${index * 70}ms both` }}>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`View certificate for ${cert.c.title}`}
        onClick={() => onView(cert)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onView(cert)}
        sx={{
          position: 'relative', cursor: 'zoom-in', borderRadius: 1.5, outline: 'none',
          boxShadow: '0 10px 30px rgba(10,16,34,.18)', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s',
          '@media (hover: hover)': {
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 40px rgba(10,16,34,.28)' },
            '&:hover .tx-zoom': { opacity: 1 },
          },
          '&:focus-visible': { boxShadow: (t: Theme) => `0 0 0 3px ${t.palette.secondary.main}` },
          '&:focus-visible .tx-zoom': { opacity: 1 },
        }}
      >
        <CertificatePreview data={data} />
        <Box className="tx-zoom" sx={{ position: 'absolute', inset: 0, borderRadius: 1.5, display: 'grid', placeItems: 'center', bgcolor: 'rgba(10,16,34,.35)', color: '#fff', opacity: 0, transition: 'opacity .25s' }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ fontWeight: 700 }}>
            <ZoomInIcon />
            <span>View</span>
          </Stack>
        </Box>
      </Box>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1.75, mb: 1.5 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cert.c.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Issued {issuedText(cert.at)}
          </Typography>
        </Box>
        <Tooltip title="Copy certificate ID">
          <Chip size="small" icon={<ContentCopyIcon />} label={cert.id} onClick={() => onCopy(cert.id)} sx={{ fontFamily: 'monospace', fontWeight: 700, maxWidth: 150 }} />
        </Tooltip>
      </Stack>
      <Box sx={{ mt: 'auto' }}>
        <DownloadButtons busy={busy} onDownload={(f) => void run(f, data, cert.c.id)} />
      </Box>
    </Panel>
  );
});

function CertDialog({ name, cert, onClose, onCopy }: { name: string; cert: Cert | null; onClose: () => void; onCopy: (id: string) => void }) {
  const { toast } = useStore();
  const { busy, run } = useCertDownload(toast);
  const fullScreen = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  // Keep the last certificate while the dialog animates out.
  const [shown, setShown] = useState<Cert | null>(cert);
  useEffect(() => {
    if (cert) setShown(cert);
  }, [cert]);
  const data = useMemo(() => (shown ? certData(name, shown) : null), [name, shown]);
  return (
    <Dialog open={!!cert} onClose={onClose} maxWidth="lg" fullWidth fullScreen={fullScreen}>
      {shown && data && (
        <>
          <DialogTitle sx={{ pr: 7 }}>
            <Typography component="span" variant="overline" color="text.secondary" sx={{ display: 'block' }}>
              Certificate of completion
            </Typography>
            <Typography component="span" variant="h6" sx={{ display: 'block', lineHeight: 1.3 }}>
              {shown.c.title}
            </Typography>
            <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'action.hover', p: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column' }}>
            <CertificatePreview
              data={data}
              // Sized so the whole certificate fits on screen without scrolling.
              sx={{ flexShrink: 0, my: 'auto', mx: 'auto', maxWidth: { sm: 'calc((100vh - 280px) * 1.5)' }, boxShadow: '0 16px 50px rgba(10,16,34,.25)', borderRadius: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: 1.5 }}>
            <Button startIcon={<ContentCopyIcon />} onClick={() => onCopy(shown.id)} sx={{ mr: { sm: 'auto' }, fontFamily: 'monospace' }}>
              {shown.id}
            </Button>
            <Box sx={{ width: { xs: '100%', sm: 320 }, m: '0 !important' }}>
              <DownloadButtons busy={busy} size="large" onDownload={(f) => void run(f, data, shown.c.id)} />
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default function Certificates() {
  const nav = useNavigate();
  const user = useUser();
  const { members } = useAuth();
  const { owned, prog, lessons, activity, enrolledAt, toast } = useStore();
  const [check, setCheck] = useState('');
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const certs = useMemo<Cert[]>(
    () =>
      owned
        .filter((id) => (prog[id] || 0) >= 100)
        .map((id) => {
          const c = courseById(id)!;
          const at = activity.find((a) => a.type === 'complete' && a.courseId === id)?.at || enrolledAt[id] || new Date().toISOString();
          return { c, id: certificateId(user.email, id), at };
        }),
    [owned, prog, activity, enrolledAt, user.email],
  );
  const locked = owned.filter((id) => (prog[id] || 0) < 100).map((id) => courseById(id)).filter((c): c is Course => !!c);

  const [viewing, setViewing] = useState<Cert | null>(null);
  useEffect(warmCertificate, []);

  const copy = useCallback(
    (id: string) => {
      void navigator.clipboard?.writeText(id);
      toast('Certificate ID copied: ' + id);
    },
    [toast],
  );

  // Looks the ID up across every account saved in this browser.
  const verify = () => {
    // Accept the ID as printed on the certificate too ("TKX-AIA·TXC-…").
    const id = idSuffix(check.trim().toUpperCase());
    if (!id) return;
    for (const m of members) {
      const d = load<Partial<UserData>>('user_' + m.email, {});
      const mine = m.email === user.email;
      const done = mine ? lessons : d.lessons || {};
      for (const cid of (mine ? owned : d.owned) || []) {
        const c = courseById(cid);
        if (c && (done[cid] || 0) >= lessonsFor(c).length && certificateId(m.email, cid) === id) {
          return setResult({ ok: true, text: `Valid. Issued to ${m.name} for “${c.title}”.` });
        }
      }
    }
    setResult({ ok: false, text: 'No certificate with this ID was found.' });
  };

  return (
    <Page maxWidth="xl">
      <DashShell>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            CERTIFICATES
          </Typography>
          <Typography variant="h4">Your certificates</Typography>
          <Typography color="text.secondary">Complete every lesson of a course and its certificate appears here, with a unique ID anyone can verify. Download each one as a PNG image or a print-ready PDF.</Typography>
        </Box>

        {certs.length ? (
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {certs.map((cert, i) => (
              <Grid item xs={12} sm={6} xl={4} key={cert.id}>
                <CertCard name={user.name} cert={cert} index={i} onCopy={copy} onView={setViewing} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Panel sx={{ mb: 4, textAlign: 'center', py: 5 }}>
            <WorkspacePremiumIcon sx={{ fontSize: 56, color: 'secondary.main', animation: 'txfloat 3s ease-in-out infinite' }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              No certificates yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Finish all lessons in a course to earn one. The free AI agent course has just 4 lessons.
            </Typography>
            <Button variant="contained" onClick={() => nav(owned.length ? '/my-courses' : '/courses/wa-agent')}>
              {owned.length ? 'Continue learning' : 'Start the free course'}
            </Button>
          </Panel>
        )}

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <Panel>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                In progress
              </Typography>
              {locked.length ? (
                <Stack spacing={1.5}>
                  {locked.map((c, i) => (
                    <Stack key={c.id} direction="row" spacing={1.5} alignItems="center" sx={{ animation: `txrise .4s ${i * 50}ms both`, cursor: 'pointer' }} onClick={() => nav('/courses/' + c.id)}>
                      <CourseIcon c={c} size={38} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 700 }}>
                          {c.title}
                        </Typography>
                        <LinearProgress variant="determinate" value={prog[c.id] || 0} color="secondary" />
                      </Box>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                        <LockIcon fontSize="small" />
                        <Typography variant="body2">{prog[c.id] || 0}%</Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">Nothing in progress.</Typography>
              )}
            </Panel>
          </Grid>
          <Grid item xs={12} md={5}>
            <Panel>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Verify a certificate
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="TXC-XXXXXXX"
                  value={check}
                  onChange={(e) => {
                    setCheck(e.target.value);
                    setResult(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && verify()}
                  InputProps={{ startAdornment: <InputAdornment position="start"><VerifiedIcon fontSize="small" /></InputAdornment> }}
                />
                <Button variant="contained" onClick={verify}>
                  Verify
                </Button>
              </Stack>
              {result && (
                <Alert severity={result.ok ? 'success' : 'warning'} sx={{ mt: 1.5, animation: 'txpop .3s both' }}>
                  {result.text}
                </Alert>
              )}
            </Panel>
          </Grid>
        </Grid>
        <CertDialog name={user.name} cert={viewing} onClose={() => setViewing(null)} onCopy={copy} />
      </DashShell>
    </Page>
  );
}
