import { memo, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';

/**
 * Small SVG bar chart for the admin dashboard (no chart library, so it costs almost nothing to load).
 * One or more series stack in each bar; hover or tap a bar for its numbers. Single axis, recessive grid,
 * 4px rounded tops, a 2px gap between stacked parts, total printed above each bar.
 */
export interface Series {
  key: string;
  label: string;
  /** [light, dark] */
  color: [string, string];
  values: number[];
}

const H = 220;
const PAD = { t: 22, r: 8, b: 26, l: 36 };

function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const m = [1, 2, 2.5, 5, 10].find((x) => x * p >= v) ?? 10;
  return m * p;
}

function BarChart({ labels, series, format = (n) => String(n), height = H }: { labels: string[]; series: Series[]; format?: (n: number) => string; height?: number }) {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totals = labels.map((_, i) => series.reduce((n, s) => n + (s.values[i] || 0), 0));
  const max = niceMax(Math.max(...totals, 0));
  const iw = w - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const step = iw / labels.length;
  const bw = Math.max(6, Math.min(36, step * 0.62));
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const ink = theme.palette.text.secondary;
  const grid = dark ? 'rgba(255,255,255,.10)' : 'rgba(20,32,138,.10)';
  const surface = theme.palette.background.paper;
  const showEvery = step < 34 ? 2 : 1;
  const tip = hover != null ? { x: PAD.l + step * hover + step / 2, i: hover } : null;

  return (
    <Box ref={box} sx={{ position: 'relative', width: '100%' }}>
      {series.length > 1 && (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          {series.map((s) => (
            <Stack key={s.key} direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: s.color[dark ? 1 : 0] }} />
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary', fontWeight: 600 }}>{s.label}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
      <svg width={w} height={height} role="img" aria-label={series.map((s) => s.label).join(', ') + ' by month'} style={{ display: 'block', overflow: 'visible' }} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={w - PAD.r} y1={y(t)} y2={y(t)} stroke={grid} strokeWidth={1} />
            <text x={PAD.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={ink}>{format(Math.round(t))}</text>
          </g>
        ))}
        {labels.map((l, i) => {
          const cx = PAD.l + step * i + step / 2;
          let base = 0;
          const parts = series.map((s, k) => {
            const v = s.values[i] || 0;
            const y0 = y(base);
            base += v;
            const y1 = y(base);
            const top = series.slice(k + 1).every((n) => !(n.values[i] || 0));
            const hgt = Math.max(0, y0 - y1 - (k > 0 && v ? 2 : 0));
            if (!v || hgt <= 0) return null;
            const r = top ? Math.min(4, hgt, bw / 2) : 0;
            const x = cx - bw / 2;
            // Rounded top corners only, square at the baseline.
            const d = `M${x},${y0}V${y1 + r}${r ? `Q${x},${y1} ${x + r},${y1}` : ''}H${x + bw - r}${r ? `Q${x + bw},${y1} ${x + bw},${y1 + r}` : ''}V${y0}Z`;
            return <path key={s.key} d={d} fill={s.color[dark ? 1 : 0]} opacity={hover == null || hover === i ? 1 : 0.45} />;
          });
          return (
            <g key={l + i}>
              {parts}
              {totals[i] > 0 && (
                <text x={cx} y={y(totals[i]) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={theme.palette.text.primary}>
                  {format(totals[i])}
                </text>
              )}
              {i % showEvery === 0 && (
                <text x={cx} y={height - 8} textAnchor="middle" fontSize={11} fill={ink}>{l}</text>
              )}
              {/* Hit area larger than the bar */}
              <rect x={PAD.l + step * i} y={PAD.t} width={step} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
            </g>
          );
        })}
        <line x1={PAD.l} x2={w - PAD.r} y1={y(0)} y2={y(0)} stroke={ink} strokeOpacity={0.5} />
      </svg>
      {tip && (
        <Box
          sx={{
            position: 'absolute', top: 4, left: Math.min(Math.max(tip.x - 80, 0), w - 170), width: 170, pointerEvents: 'none',
            p: 1.25, borderRadius: '12px', bgcolor: surface, boxShadow: '0 10px 30px rgba(0,0,0,.25)', border: 1, borderColor: 'divider', zIndex: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 0.5 }}>{labels[tip.i]}</Typography>
          {series.map((s) => (
            <Stack key={s.key} direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: s.color[dark ? 1 : 0] }} />
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{s.label}</Typography>
              </Stack>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>{format(s.values[tip.i] || 0)}</Typography>
            </Stack>
          ))}
          {series.length > 1 && (
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, pt: 0.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>Total</Typography>
              <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>{format(totals[tip.i])}</Typography>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default memo(BarChart);
