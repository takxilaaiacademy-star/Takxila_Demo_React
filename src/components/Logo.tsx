import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useBlobUrl } from '../utils/media';

const BLUE = { dark: '#5B7CFF', light: '#0B1F6B' };

/** The Takxila mark (T with the K wings) with the wordmark beside it. */
export default function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  const dark = useTheme().palette.mode === 'dark';
  const src = useBlobUrl(dark ? '/assets/logo-mark-dark.webp' : '/assets/logo-mark.webp');
  const blue = dark ? BLUE.dark : BLUE.light;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, '&:hover .tx-mark': { transform: 'rotate(-6deg) scale(1.08)', filter: `drop-shadow(0 0 14px ${blue})` } }}>
      <Box className="tx-mark" sx={{ width: size * 0.92, height: size, flex: 'none', transition: 'transform .5s cubic-bezier(.2,.8,.2,1), filter .5s' }}>
        {src && <Box component="img" src={src} alt="Takxila" sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />}
      </Box>
      {withText && (
        <Box sx={{ lineHeight: 1 }}>
          <Typography sx={{ fontWeight: 800, letterSpacing: '0.2em', fontSize: 17, lineHeight: 1.15 }}>
            TAK<Box component="span" sx={{ color: blue }}>X</Box>ILA
          </Typography>
          <Typography sx={{ fontWeight: 700, letterSpacing: '0.24em', fontSize: 9.5, color: blue }}>AI ACADEMY</Typography>
        </Box>
      )}
    </Box>
  );
}

/** The full logo with the tagline, for hero areas. */
export function LogoFull({ width = 320 }: { width?: number }) {
  const dark = useTheme().palette.mode === 'dark';
  const src = useBlobUrl(dark ? '/assets/logo-full-dark.webp' : '/assets/logo-full.webp');
  return (
    <Box sx={{ width, maxWidth: '100%', aspectRatio: '720 / 566' }}>
      {src && <Box component="img" src={src} alt="Takxila AI Academy: Master the AI frameworks. Own the AI future." sx={{ width: '100%', height: '100%', display: 'block' }} />}
    </Box>
  );
}
