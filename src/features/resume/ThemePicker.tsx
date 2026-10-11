import { memo } from 'react';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { COMING_SOON, cssFont, THEMES, type ResumeTheme } from './themes';

/** A tiny drawing of the theme: name, headings and text lines in its own colours and fonts. */
function Thumb({ t }: { t: ResumeTheme }) {
  const bar = (w: string, c = '#D7DBE6', h = 3) => <Box sx={{ height: h, width: w, bgcolor: c, borderRadius: 2, mb: '3px' }} />;
  const heading = (label: string) => (
    <Box sx={{ mt: '6px', mb: '3px' }}>
      <Box
        sx={{
          fontFamily: cssFont(t.font), fontSize: 6.5, fontWeight: t.heading === 'hairline' ? 400 : 700, color: t.color.heading, lineHeight: 1.2, letterSpacing: t.heading === 'hairline' ? '.08em' : 0,
          textTransform: t.headingUpper ? 'uppercase' : 'none', pb: '1.5px',
          borderBottom: t.heading === 'rule' ? `1px solid ${t.color.rule}` : t.heading === 'smallcaps' || t.heading === 'hairline' ? `0.5px solid ${t.color.rule}` : 'none',
          backgroundImage: t.heading === 'twotone' ? `linear-gradient(${t.color.rule},${t.color.rule}), linear-gradient(${t.color.rule2},${t.color.rule2})` : 'none',
          backgroundSize: '14px 1.5px, 100% 0.5px', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat',
        }}
      >
        {label}
      </Box>
    </Box>
  );
  return (
    <Box aria-hidden sx={{ width: '100%', aspectRatio: '1 / 1.18', bgcolor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(8,12,40,.16)', p: t.heading === 'hairline' ? '12px 13px' : '9px 10px', textAlign: t.align }}>
      <Box sx={t.band ? { bgcolor: t.color.band, m: '-9px -10px 4px', p: '9px 10px 7px' } : undefined}>
        <Box sx={{ fontFamily: cssFont(t.font), fontSize: 10.5, fontWeight: t.nameBold ? 700 : 400, color: t.color.name, lineHeight: 1.1, textTransform: t.nameUpper ? 'uppercase' : 'none', whiteSpace: 'nowrap' }}>Asha Verma</Box>
        <Box sx={{ fontFamily: cssFont(t.font), fontSize: 6, color: t.color.role, mt: '1px' }}>AI Automation Specialist</Box>
        <Box sx={{ display: 'flex', justifyContent: t.align === 'center' ? 'center' : 'flex-start', mt: '3px' }}>{bar('70%', t.band ? 'rgba(255,255,255,.45)' : '#C9CEDC', 2)}</Box>
      </Box>
      {heading('Summary')}
      {bar('100%')}
      {bar('86%')}
      {heading('Experience')}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {bar('46%', '#9AA1B5')}
        {bar('20%', '#C9CEDC')}
      </Box>
      {bar('92%')}
      {bar('78%')}
      {heading('Skills')}
      {bar('88%')}
    </Box>
  );
}

const Card = memo(function Card({ t, active, onPick }: { t: ResumeTheme; active: boolean; onPick: (id: string) => void }) {
  return (
    <ButtonBase
      onClick={() => onPick(t.id)}
      aria-pressed={active}
      aria-label={`${t.name} theme${active ? ' (selected)' : ''}`}
      sx={(th) => ({
        display: 'block', textAlign: 'left', width: '100%', p: 1, borderRadius: '16px', position: 'relative', border: `1.5px solid ${active ? th.palette.secondary.main : th.tx.line}`,
        background: active ? (th.palette.mode === 'dark' ? 'rgba(245,185,63,.10)' : 'rgba(43,43,214,.06)') : th.tx.surface,
        boxShadow: active ? `0 10px 30px ${th.tx.glow}` : 'none', transition: 'transform .2s, border-color .2s, box-shadow .2s',
        '&:hover': { transform: 'translateY(-3px)', borderColor: th.palette.secondary.main },
        '&:focus-visible': { outline: `2px solid ${th.palette.secondary.main}`, outlineOffset: 2 },
      })}
    >
      <Thumb t={t} />
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14, flexGrow: 1 }} noWrap>
          {t.name}
        </Typography>
        {active && <CheckCircleIcon sx={{ fontSize: 18, color: 'secondary.main' }} />}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.25, color: 'success.main' }}>
        <VerifiedIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>ATS approved</Typography>
      </Stack>
    </ButtonBase>
  );
});

function ComingSoon() {
  return (
    <Box aria-disabled sx={(th) => ({ position: 'relative', p: 1, borderRadius: '16px', border: `1.5px dashed ${th.tx.line}`, overflow: 'hidden', cursor: 'not-allowed' })} title={COMING_SOON.blurb}>
      <Box aria-hidden sx={{ width: '100%', aspectRatio: '1 / 1.18', bgcolor: '#fff', borderRadius: '8px', display: 'grid', gridTemplateColumns: '36% 1fr', overflow: 'hidden', filter: 'grayscale(.6)', opacity: 0.55 }}>
        <Box sx={{ background: 'linear-gradient(180deg,#7C3AED,#DB2777)', p: '8px 6px' }}>
          <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.75)', mx: 'auto', mb: '6px' }} />
          {['80%', '60%', '70%', '50%'].map((w, i) => (
            <Box key={i} sx={{ height: 3, width: w, bgcolor: 'rgba(255,255,255,.6)', borderRadius: 2, mb: '4px' }} />
          ))}
        </Box>
        <Box sx={{ p: '9px 8px' }}>
          {['70%', '100%', '90%', '40%', '100%', '80%', '60%'].map((w, i) => (
            <Box key={i} sx={{ height: i % 3 === 0 ? 5 : 3, width: w, bgcolor: i % 3 === 0 ? '#C4B5FD' : '#E5E7EB', borderRadius: 2, mb: '5px' }} />
          ))}
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: -34, transform: 'rotate(35deg)', bgcolor: '#F5B93F', color: '#0A1022', fontSize: 10.5, fontWeight: 800, px: 4.5, py: 0.25, letterSpacing: '.04em', boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
        COMING SOON
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: 14, mt: 1, opacity: 0.7 }}>{COMING_SOON.name}</Typography>
      <Typography color="text.secondary" sx={{ fontSize: 11.5, fontWeight: 700 }}>
        Coming soon
      </Typography>
    </Box>
  );
}

export const ThemePicker = memo(function ThemePicker({ value, onPick }: { value: string; onPick: (id: string) => void }) {
  return (
    <Box role="group" aria-label="Resume theme" sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', lg: 'repeat(6, minmax(0,1fr))' } }}>
      {THEMES.map((t) => (
        <Card key={t.id} t={t} active={t.id === value} onPick={onPick} />
      ))}
      <ComingSoon />
    </Box>
  );
});
