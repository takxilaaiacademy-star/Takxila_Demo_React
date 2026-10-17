import { memo, useMemo } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { sanitizeHtml } from '../utils/sanitize';

/** Shared look for HTML written in the admin's editor: the editor and the course page use the same styles. */
export const richSx = (t: Theme) => ({
  fontSize: 15,
  lineHeight: 1.7,
  wordBreak: 'break-word' as const,
  '& > :first-of-type': { mt: 0 },
  '& h1': { fontSize: { xs: 26, md: 32 }, fontWeight: 800, lineHeight: 1.15, m: '0.6em 0 0.35em' },
  '& h2': { fontSize: { xs: 22, md: 26 }, fontWeight: 800, lineHeight: 1.2, m: '0.6em 0 0.35em' },
  '& h3': { fontSize: 20, fontWeight: 800, m: '0.6em 0 0.3em' },
  '& h4, & h5, & h6': { fontSize: 17, fontWeight: 800, m: '0.6em 0 0.3em' },
  '& p': { m: '0 0 0.9em' },
  '& ul, & ol': { pl: 3, m: '0 0 0.9em' },
  '& li': { mb: 0.5 },
  '& a': { color: t.tx.hl, fontWeight: 600 },
  '& img': { maxWidth: '100%', height: 'auto', borderRadius: '12px' },
  '& iframe, & video': { width: '100%', aspectRatio: '16 / 9', height: 'auto', border: 0, borderRadius: '14px', display: 'block', my: 1.5, bgcolor: '#000' },
  '& blockquote': { m: '0 0 1em', p: '10px 16px', borderLeft: `4px solid ${t.tx.ac}`, background: t.tx.surface, borderRadius: '0 12px 12px 0' },
  '& pre, & code': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13.5 },
  '& pre': { p: 1.5, borderRadius: '12px', background: t.palette.mode === 'dark' ? 'rgba(0,0,0,.35)' : 'rgba(20,32,138,.06)', overflowX: 'auto' },
  '& table': { borderCollapse: 'collapse', width: '100%', my: 1.5, display: 'block', overflowX: 'auto' },
  '& th, & td': { border: `1px solid ${t.tx.line}`, p: '8px 10px', textAlign: 'left', verticalAlign: 'top' },
  '& th': { background: t.tx.surface, fontWeight: 800 },
  '& hr': { border: 0, borderTop: `1px solid ${t.tx.line}`, my: 2 },
});

/** Shows admin-written HTML (always sanitised first). */
function RichText({ html, sx }: { html: string; sx?: SxProps<Theme> }) {
  const clean = useMemo(() => sanitizeHtml(html), [html]);
  return <Box className="rich-text" sx={[richSx, ...(Array.isArray(sx) ? sx : [sx])]} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default memo(RichText);
