import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, sx }: { children: ReactNode; delay?: number; sx?: SxProps<Theme> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Box
      ref={ref}
      sx={[
        { opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(36px)', transition: `opacity .7s ease ${delay}ms, transform .8s cubic-bezier(.2,.8,.2,1) ${delay}ms` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

/** Counts up to `value` once on mount (numbers in stat tiles). */
export function CountUp({ value, prefix = '', suffix = '', ms = 900 }: { value: number; prefix?: string; suffix?: string; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (document.documentElement.classList.contains('tx-reduce') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(value);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return (
    <>
      {prefix}
      {n}
      {suffix}
    </>
  );
}
