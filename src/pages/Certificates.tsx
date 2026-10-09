import { useMemo, useState } from 'react';
import { Alert, Box, Button, Grid, InputAdornment, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
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
import { blobUrl } from '../utils/media';
import { load } from '../utils/storage';
import type { Course, UserData } from '../types';

interface Cert {
  c: Course;
  id: string;
  at: string;
}

const dateText = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

/** Draws the certificate on a canvas and saves it as a PNG. */
async function downloadCert(name: string, cert: Cert) {
  const W = 1600;
  const H = 1130;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  if (!g) return;
  await document.fonts?.ready;
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0A1022');
  bg.addColorStop(1, '#1B2160');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#F5B93F';
  g.lineWidth = 6;
  g.strokeRect(40, 40, W - 80, H - 80);
  g.lineWidth = 1.5;
  g.strokeRect(62, 62, W - 124, H - 124);
  try {
    const img = new Image();
    img.src = await blobUrl('/assets/logo-mark-dark.webp');
    await img.decode();
    g.drawImage(img, W / 2 - 60, 110, 120, 132);
  } catch {
    /* the certificate still works without the logo */
  }
  g.textAlign = 'center';
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  g.fillStyle = '#C0C7DE';
  g.font = `700 26px ${font}`;
  g.fillText('T A K X I L A   A I   A C A D E M Y', W / 2, 300);
  g.fillStyle = '#F5B93F';
  g.font = `800 64px ${font}`;
  g.fillText('CERTIFICATE OF COMPLETION', W / 2, 400);
  g.fillStyle = '#C0C7DE';
  g.font = `500 28px ${font}`;
  g.fillText('This certifies that', W / 2, 480);
  g.fillStyle = '#FFFFFF';
  g.font = `800 72px ${font}`;
  g.fillText(name, W / 2, 575);
  g.fillStyle = '#C0C7DE';
  g.font = `500 28px ${font}`;
  g.fillText('has successfully completed the course', W / 2, 650);
  g.fillStyle = '#FFFFFF';
  g.font = `800 ${cert.c.title.length > 44 ? 38 : 46}px ${font}`;
  g.fillText(cert.c.title, W / 2, 725);
  g.fillStyle = '#C0C7DE';
  g.font = `500 24px ${font}`;
  g.fillText(`${lessonsFor(cert.c).length} lessons · ${cert.c.meta.join(' · ')}`, W / 2, 780);
  g.textAlign = 'left';
  g.font = `600 24px ${font}`;
  g.fillText('Date: ' + dateText(cert.at), 140, 960);
  g.textAlign = 'right';
  g.fillText('Certificate ID: ' + cert.id, W - 140, 960);
  g.textAlign = 'center';
  g.fillStyle = '#F5B93F';
  g.font = `italic 600 26px ${font}`;
  g.fillText('Master the AI frameworks. Own the AI future.', W / 2, 1030);
  const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Takxila-certificate-${cert.c.id}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function CertCard({ name, cert, index, onCopy }: { name: string; cert: Cert; index: number; onCopy: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Box sx={{ animation: `txrise .5s ${index * 70}ms both`, height: '100%' }}>
      <Box
        sx={{
          position: 'relative', borderRadius: '18px', p: 2.5, color: '#fff', overflow: 'hidden', aspectRatio: '1.42', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          background: 'linear-gradient(135deg, #0A1022, #1B2160)', border: '3px solid #F5B93F', boxShadow: 'inset 0 0 0 6px #0A1022, inset 0 0 0 7px rgba(245,185,63,.6)',
          transition: 'transform .4s cubic-bezier(.2,.8,.2,1)', '&:hover': { transform: 'translateY(-6px) rotate(-.5deg)' },
          '&::after': {
            content: '""', position: 'absolute', top: 0, bottom: 0, width: '40%', left: '-60%',
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.18), transparent)', animation: 'txshine 4.5s ease-in-out infinite',
          },
        }}
      >
        <Box component="img" src="/assets/logo-mark-dark.webp" alt="" sx={{ width: 34, mt: 0.5 }} />
        <Typography sx={{ fontSize: { xs: 9, sm: 10 }, letterSpacing: '.3em', color: '#C0C7DE', mt: 0.5 }}>TAKXILA AI ACADEMY</Typography>
        <Typography sx={{ fontWeight: 800, color: '#F5B93F', fontSize: { xs: 13, sm: 15 }, mt: 0.5 }}>CERTIFICATE OF COMPLETION</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 22 }, mt: 'auto' }}>{name}</Typography>
        <Typography sx={{ fontSize: 11, color: '#C0C7DE' }}>has completed</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, sm: 13 }, lineHeight: 1.3, mb: 'auto', px: 1 }}>{cert.c.title}</Typography>
        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', fontSize: 10, color: '#C0C7DE' }}>
          <span>{dateText(cert.at)}</span>
          <span>{cert.id}</span>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={busy}
          sx={{ flex: 1 }}
          onClick={async () => {
            setBusy(true);
            await downloadCert(name, cert);
            setBusy(false);
          }}
        >
          Download PNG
        </Button>
        <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => onCopy(cert.id)}>
          ID
        </Button>
      </Stack>
    </Box>
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

  const copy = (id: string) => {
    void navigator.clipboard?.writeText(id);
    toast('Certificate ID copied: ' + id);
  };

  // Looks the ID up across every account saved in this browser.
  const verify = () => {
    const id = check.trim().toUpperCase();
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
          <Typography color="text.secondary">Complete every lesson of a course and its certificate appears here, with a unique ID anyone can verify.</Typography>
        </Box>

        {certs.length ? (
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {certs.map((cert, i) => (
              <Grid item xs={12} sm={6} lg={4} key={cert.id}>
                <CertCard name={user.name} cert={cert} index={i} onCopy={copy} />
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
      </DashShell>
    </Page>
  );
}
