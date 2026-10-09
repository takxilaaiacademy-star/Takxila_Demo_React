import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';


// The soft glowing orbs behind every page.
export default function Background() {
  const { tx } = useTheme();
  const orb = { position: 'fixed', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 };
  return (
    <>
      <Box aria-hidden sx={{ ...orb, width: 520, height: 520, left: -140, top: 60, background: tx.orb1, animation: 'txdrift 18s ease-in-out infinite' }} />
      <Box aria-hidden sx={{ ...orb, width: 620, height: 620, right: -160, top: 380, background: tx.orb2, animation: 'txdrift 24s ease-in-out -8s infinite reverse' }} />
      <Box aria-hidden sx={{ ...orb, width: 480, height: 480, left: '30%', bottom: -200, background: tx.orb3, animation: 'txdrift 30s ease-in-out -14s infinite' }} />
    </>
  );
}
