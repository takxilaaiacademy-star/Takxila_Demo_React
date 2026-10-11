import { memo, useEffect, useState } from 'react';
import { Box, Skeleton, type SxProps, type Theme } from '@mui/material';
import { CERT_H, CERT_W, renderCertificate, type CertificateData } from './renderCertificate';

// Rendered previews are kept for the session, so reopening the page or the dialog is instant.
const cache = new Map<string, Promise<string>>();
const keyOf = (d: CertificateData) => [d.name, d.course, d.category, d.issuedAt, d.id].join('|');

function previewUrl(d: CertificateData): Promise<string> {
  const k = keyOf(d);
  let p = cache.get(k);
  if (!p) {
    p = renderCertificate(d, 1)
      .then((cv) => new Promise<Blob | null>((r) => cv.toBlob(r, 'image/jpeg', 0.9)))
      .then((b) => {
        if (!b) throw new Error('preview');
        return URL.createObjectURL(b);
      });
    p.catch(() => cache.delete(k));
    cache.set(k, p);
  }
  return p;
}

/** The certificate exactly as it downloads, drawn once and shown as an image. */
export const CertificatePreview = memo(function CertificatePreview({ data, sx }: { data: CertificateData; sx?: SxProps<Theme> }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const key = keyOf(data);

  useEffect(() => {
    let live = true;
    setFailed(false);
    previewUrl(data)
      .then((u) => live && setSrc(u))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: `${CERT_W} / ${CERT_H}`, borderRadius: 1.5, overflow: 'hidden', bgcolor: '#f4f2ec', ...sx }}>
      {src ? (
        <Box
          component="img"
          src={src}
          alt={`Certificate of completion for ${data.course}, issued to ${data.name}`}
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', animation: 'txfade .35s both', '@keyframes txfade': { from: { opacity: 0 }, to: { opacity: 1 } } }}
        />
      ) : failed ? (
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#3b3f4c', fontSize: 13, p: 2, textAlign: 'center' }}>
          Preview unavailable. Downloads still work.
        </Box>
      ) : (
        <Skeleton variant="rectangular" animation="wave" sx={{ position: 'absolute', inset: 0, height: '100%', bgcolor: 'rgba(27,35,64,.08)' }} />
      )}
    </Box>
  );
});
