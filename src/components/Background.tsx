import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// The soft glowing orbs behind every page. They are radial gradients on their own GPU layer
// (no CSS blur filter), so they cost nothing while you scroll or type.
export default function Background() {
  const { tx } = useTheme();
  const orb = (color: string) => ({
    position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, willChange: 'transform',
    background: `radial-gradient(circle at center, ${color} 0%, transparent 68%)`,
  });
  return (
    <>
      <Box aria-hidden sx={{ ...orb(tx.orb1), width: 720, height: 720, left: -240, top: -40, animation: 'txdrift 18s ease-in-out infinite' }} />
      <Box aria-hidden sx={{ ...orb(tx.orb2), width: 820, height: 820, right: -260, top: 280, animation: 'txdrift 24s ease-in-out -8s infinite reverse' }} />
      <Box aria-hidden sx={{ ...orb(tx.orb3), width: 680, height: 680, left: '28%', bottom: -300, animation: 'txdrift 30s ease-in-out -14s infinite' }} />
    </>
  );
}
