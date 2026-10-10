import { memo, useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { decoded, useBlobUrl } from '../utils/media';

export const shimmer = (t: Theme) => ({
  background: `linear-gradient(90deg, ${t.tx.surface} 0%, ${t.tx.line} 50%, ${t.tx.surface} 100%)`,
  backgroundSize: '800px 100%',
  animation: 'txshimmer 1.3s linear infinite',
});

interface BlobImgProps {
  src: string;
  alt: string;
  ratio?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  eager?: boolean;
}

/** An image served from a blob: URL, with a shimmer while it loads and a soft fade in. */
export const BlobImg = memo(function BlobImg({ src, alt, ratio, sx, onClick, eager }: BlobImgProps) {
  const url = useBlobUrl(src);
  // Track which URL finished loading instead of a boolean that is reset in an effect:
  // a cached image can fire onLoad before that effect runs, which left it invisible.
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(undefined);
  const [broken, setBroken] = useState(false);
  const loaded = !!url && (loadedUrl === url || decoded.has(url));
  const show = broken ? src : url;
  return (
    <Box onClick={onClick} sx={[(t) => ({ position: 'relative', overflow: 'hidden', aspectRatio: ratio, ...(!loaded && !broken && shimmer(t)) }), ...(Array.isArray(sx) ? sx : [sx])]}>
      {show && (
        <Box
          component="img"
          src={show}
          alt={alt}
          loading={eager || (url && decoded.has(url)) ? 'eager' : 'lazy'}
          decoding="async"
          ref={(el: HTMLImageElement | null) => {
            if (el?.complete && el.naturalWidth && loadedUrl !== show) setLoadedUrl(show);
          }}
          onLoad={() => setLoadedUrl(show)}
          onError={() => !broken && setBroken(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded || broken || loadedUrl === show ? 1 : 0, transition: url && decoded.has(url) ? 'transform .7s cubic-bezier(.2,.8,.2,1)' : 'opacity .35s ease, transform .7s cubic-bezier(.2,.8,.2,1)' }}
        />
      )}
    </Box>
  );
});

interface VideoProps {
  src: string;
  poster: string;
  autoPlay?: boolean;
  title?: string;
}

const probe = typeof document !== 'undefined' ? document.createElement('video') : null;
/** MP4 (H.264) where the browser can play it, otherwise the WebM (VP9) copy next to it. */
const preferMp4 = !!probe?.canPlayType('video/mp4; codecs="avc1.42E01E"');
const swapExt = (src: string, ext: 'mp4' | 'webm') => src.replace(/\.(mp4|webm)$/, '.' + ext);

/** Course summary video. The file is fetched once and played from a blob: URL. */
export function CourseVideo({ src, poster, autoPlay = true, title }: VideoProps) {
  const [alt, setAlt] = useState(false);
  useEffect(() => setAlt(false), [src]);
  const first = preferMp4 ? 'mp4' : 'webm';
  const url = useBlobUrl(swapExt(src, alt ? (first === 'mp4' ? 'webm' : 'mp4') : first));
  const posterUrl = useBlobUrl(poster);
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !url || !autoPlay) return;
    v.muted = true;
    v.play().then(() => setStarted(true)).catch(() => undefined);
  }, [url, autoPlay]);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.currentTime = 0;
    v.play().then(() => setStarted(true)).catch(() => undefined);
  };

  return (
    <Box sx={(t) => ({ position: 'relative', borderRadius: '18px', overflow: 'hidden', aspectRatio: '16 / 9', bgcolor: '#0A1022', boxShadow: `0 24px 60px ${t.tx.glow}`, animation: 'txpop .6s cubic-bezier(.2,.8,.2,1) both', ...(!url && shimmer(t)) })}>
      {url && !failed && (
        <video
          ref={ref}
          src={url}
          poster={posterUrl}
          muted={muted}
          playsInline
          controls={started}
          loop={false}
          preload="auto"
          onPlay={() => setStarted(true)}
          onError={() => (alt ? setFailed(true) : setAlt(true))}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          aria-label={title ? 'Summary video: ' + title : 'Course summary video'}
        />
      )}
      {failed && posterUrl && <Box component="img" src={posterUrl} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      {!started && url && !failed && (
        <Stack
          onClick={play}
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'absolute', inset: 0, cursor: 'pointer', background: 'linear-gradient(180deg, rgba(10,16,34,0) 40%, rgba(10,16,34,.75))' }}
        >
          <Box sx={{ width: 76, height: 76, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', animation: 'txpulse 1.6s ease-out infinite', transition: 'transform .25s', '&:hover': { transform: 'scale(1.1)' } }}>
            <PlayArrowRoundedIcon sx={{ fontSize: 46 }} />
          </Box>
          <Typography sx={{ position: 'absolute', bottom: 16, left: 20, color: '#fff', fontWeight: 700 }}>Watch the course summary</Typography>
        </Stack>
      )}
      {started && (
        <IconButton
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(10,16,34,.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(10,16,34,.8)' } }}
        >
          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      )}
    </Box>
  );
}
