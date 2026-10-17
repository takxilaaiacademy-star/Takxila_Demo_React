import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tab, Tabs, TextField, Tooltip, Typography,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import BoldIcon from '@mui/icons-material/FormatBold';
import ItalicIcon from '@mui/icons-material/FormatItalic';
import UnderlineIcon from '@mui/icons-material/FormatUnderlined';
import StrikeIcon from '@mui/icons-material/StrikethroughS';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import MediaIcon from '@mui/icons-material/SmartDisplayOutlined';
import LinkIcon from '@mui/icons-material/Link';
import UnlinkIcon from '@mui/icons-material/LinkOff';
import FullIcon from '@mui/icons-material/Fullscreen';
import FullExitIcon from '@mui/icons-material/FullscreenExit';
import AlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import AlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LtrIcon from '@mui/icons-material/FormatTextdirectionLToR';
import RtlIcon from '@mui/icons-material/FormatTextdirectionRToL';
import OutdentIcon from '@mui/icons-material/FormatIndentDecrease';
import IndentIcon from '@mui/icons-material/FormatIndentIncrease';
import BulletIcon from '@mui/icons-material/FormatListBulleted';
import NumberIcon from '@mui/icons-material/FormatListNumbered';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import CodeIcon from '@mui/icons-material/Code';
import QuoteIcon from '@mui/icons-material/FormatQuote';
import TableIcon from '@mui/icons-material/TableChartOutlined';
import HrIcon from '@mui/icons-material/HorizontalRule';
import ClearIcon from '@mui/icons-material/FormatClear';
import ColorIcon from '@mui/icons-material/FormatColorText';
import CountIcon from '@mui/icons-material/Numbers';
import A11yIcon from '@mui/icons-material/AccessibilityNew';
import ManagerIcon from '@mui/icons-material/PermMediaOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import UploadIcon from '@mui/icons-material/UploadFileOutlined';
import SuperIcon from '@mui/icons-material/Superscript';
import SubIcon from '@mui/icons-material/Subscript';
import { toEmbedUrl } from '../../data/player';
import { fitImage } from '../../utils/image';
import { sanitizeHtml } from '../../utils/sanitize';
import { richSx } from '../RichText';

/**
 * TEXT EDITOR for the admin, modelled on the Moodle (TinyMCE) editor:
 *   menu bar   Edit · View · Insert · Format · Tools · Table · Help
 *   toolbar    undo/redo, paragraph style, bold/italic, image, media, link, full screen, align, direction, indent, lists, "…" for more
 *   status bar the element path (h1, div › p) and the word count
 *   Tools      Source code (edit the HTML directly), Word count, Accessibility checker, Media manager
 * Everything it produces is cleaned by sanitizeHtml before it is saved or shown.
 * Uncontrolled: `value` is read when the editor opens; `onChange` gets the HTML after each edit.
 */

type Dlg = null | 'source' | 'image' | 'media' | 'link' | 'table' | 'count' | 'a11y' | 'manager' | 'help';
type MenuKey = 'edit' | 'view' | 'insert' | 'format' | 'tools' | 'table' | 'help';

const BLOCKS: [string, string][] = [['p', 'Paragraph'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['h4', 'Heading 4'], ['blockquote', 'Quote'], ['pre', 'Code block']];
const COLORS = ['#0B1030', '#E11D48', '#F97316', '#F5B93F', '#16A34A', '#0EA5E9', '#4F46E5', '#9333EA', '#64748B'];

const words = (t: string) => (t.trim().match(/\S+/g) ?? []).length;

function Btn({ title, onClick, on, children }: { title: string; onClick: () => void; on?: boolean; children: ReactNode }) {
  return (
    <Tooltip title={title} disableInteractive>
      <IconButton
        size="small"
        aria-label={title}
        aria-pressed={on}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        sx={(t) => ({ borderRadius: '8px', color: 'text.primary', ...(on && { bgcolor: t.palette.mode === 'dark' ? 'rgba(245,185,63,.22)' : 'rgba(43,43,214,.14)', color: t.tx.hl }) })}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
const Sep = () => <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />;

function RichEditor({ value, onChange, minHeight = 220, label }: { value: string; onChange: (html: string) => void; minHeight?: number; label?: string }) {
  const area = useRef<HTMLDivElement>(null);
  const saved = useRef<Range | null>(null);
  const [menu, setMenu] = useState<{ key: MenuKey; el: HTMLElement } | null>(null);
  const [dlg, setDlg] = useState<Dlg>(null);
  const [full, setFull] = useState(false);
  const [more, setMore] = useState(false);
  const [path, setPath] = useState('p');
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState('p');
  const [active, setActive] = useState<Record<string, boolean>>({});

  // Fill the editable area once.
  useEffect(() => {
    if (area.current) area.current.innerHTML = sanitizeHtml(value) || '<p><br></p>';
    setCount(words(area.current?.innerText ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = useCallback(() => {
    const el = area.current;
    if (!el) return;
    setCount(words(el.innerText));
    onChange(el.innerHTML);
  }, [onChange]);

  // Element path + active buttons, like the TinyMCE status bar.
  const refresh = useCallback(() => {
    const el = area.current;
    const sel = window.getSelection();
    if (!el || !sel || !sel.rangeCount || !el.contains(sel.anchorNode)) return;
    const names: string[] = [];
    let n: Node | null = sel.anchorNode;
    while (n && n !== el) {
      if (n.nodeType === 1) names.unshift((n as Element).tagName.toLowerCase());
      n = n.parentNode;
    }
    setPath(names.join(' › ') || 'p');
    const b = names.find((x) => BLOCKS.some(([k]) => k === x));
    setBlock(b ?? 'p');
    setActive({
      bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), underline: document.queryCommandState('underline'),
      ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList'),
      left: document.queryCommandState('justifyLeft'), center: document.queryCommandState('justifyCenter'), right: document.queryCommandState('justifyRight'),
    });
    saved.current = sel.getRangeAt(0).cloneRange();
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refresh);
    return () => document.removeEventListener('selectionchange', refresh);
  }, [refresh]);

  const restore = () => {
    const el = area.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (saved.current && sel) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
  };
  const exec = (cmd: string, arg?: string) => {
    restore();
    document.execCommand(cmd, false, arg);
    emit();
    refresh();
  };
  const insertHtml = (html: string) => exec('insertHTML', sanitizeHtml(html));
  const formatBlock = (tag: string) => exec('formatBlock', tag);
  const setDir = (dir: 'ltr' | 'rtl') => {
    restore();
    const sel = window.getSelection();
    let n: Node | null | undefined = sel?.anchorNode;
    while (n && n !== area.current && !(n.nodeType === 1 && /^(P|H\d|LI|DIV|BLOCKQUOTE|PRE)$/.test((n as Element).tagName))) n = n.parentNode;
    if (n && n !== area.current) (n as Element).setAttribute('dir', dir);
    else area.current?.setAttribute('dir', dir);
    emit();
  };

  // ---------- Table helpers ----------
  const cell = () => {
    let n: Node | null | undefined = saved.current?.startContainer;
    while (n && n !== area.current && !(n.nodeType === 1 && /^(TD|TH)$/.test((n as Element).tagName))) n = n.parentNode;
    return n && n !== area.current ? (n as HTMLTableCellElement) : null;
  };
  const tableOp = (op: 'row' | 'col' | 'delRow' | 'delCol' | 'delTable') => {
    const c = cell();
    if (!c) return;
    const row = c.parentElement as HTMLTableRowElement;
    const table = c.closest('table');
    if (!table) return;
    const idx = c.cellIndex;
    if (op === 'row') {
      const r = row.cloneNode(true) as HTMLTableRowElement;
      r.querySelectorAll('td,th').forEach((x) => (x.innerHTML = '<br>'));
      row.after(r);
    } else if (op === 'col') [...table.rows].forEach((r) => r.cells[idx]?.after(Object.assign(document.createElement(r.cells[idx]?.tagName === 'TH' ? 'th' : 'td'), { innerHTML: '<br>' })));
    else if (op === 'delRow') (table.rows.length > 1 ? row.remove() : table.remove());
    else if (op === 'delCol') [...table.rows].forEach((r) => (r.cells.length > 1 ? r.cells[idx]?.remove() : table.remove()));
    else table.remove();
    emit();
  };

  const closeMenu = () => setMenu(null);
  const open = (d: Dlg) => {
    closeMenu();
    setDlg(d);
  };
  const html = () => area.current?.innerHTML ?? '';

  const MENUS: Record<MenuKey, [string, () => void, ReactNode?][]> = {
    edit: [['Undo', () => exec('undo')], ['Redo', () => exec('redo')], ['Select all', () => exec('selectAll')], ['Clear formatting', () => exec('removeFormat')]],
    view: [['Source code', () => open('source')], [full ? 'Exit full screen' : 'Full screen', () => setFull((x) => !x)], [more ? 'Hide extra buttons' : 'Show all buttons', () => setMore((x) => !x)]],
    insert: [['Image…', () => open('image')], ['Media (YouTube, Vimeo, Drive)…', () => open('media')], ['Link…', () => open('link')], ['Table…', () => open('table')], ['Horizontal line', () => exec('insertHorizontalRule')]],
    format: [
      ['Bold', () => exec('bold')], ['Italic', () => exec('italic')], ['Underline', () => exec('underline')], ['Strikethrough', () => exec('strikeThrough')],
      ['Superscript', () => exec('superscript')], ['Subscript', () => exec('subscript')],
      ...BLOCKS.map(([k, l]): [string, () => void] => [l, () => formatBlock(k)]), ['Clear formatting', () => exec('removeFormat')],
    ],
    tools: [['Source code', () => open('source'), <CodeIcon fontSize="small" key="i" />], ['Word count', () => open('count'), <CountIcon fontSize="small" key="i" />], ['Accessibility checker', () => open('a11y'), <A11yIcon fontSize="small" key="i" />], ['Media manager', () => open('manager'), <ManagerIcon fontSize="small" key="i" />]],
    table: [['Insert table…', () => open('table')], ['Row after', () => tableOp('row')], ['Column after', () => tableOp('col')], ['Delete row', () => tableOp('delRow')], ['Delete column', () => tableOp('delCol')], ['Delete table', () => tableOp('delTable')]],
    help: [['Keyboard shortcuts', () => open('help')]],
  };

  return (
    <Box
      sx={(t) => ({
        border: `1px solid ${t.tx.line}`,
        borderRadius: '16px',
        background: t.palette.background.paper,
        overflow: 'hidden',
        '&:focus-within': { borderColor: t.tx.hl, boxShadow: `0 0 0 3px ${t.tx.glow}` },
        ...(full && { position: 'fixed', inset: { xs: 0, md: 24 }, zIndex: 1600, display: 'flex', flexDirection: 'column', borderRadius: { xs: 0, md: '18px' }, boxShadow: '0 30px 80px rgba(0,0,0,.45)' }),
      })}
    >
      {label && <Typography sx={{ px: 1.5, pt: 1, fontSize: 12.5, fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>}
      {/* Menu bar */}
      <Stack direction="row" sx={{ px: 0.75, pt: 0.5, overflowX: 'auto' }}>
        {(['edit', 'view', 'insert', 'format', 'tools', 'table', 'help'] as MenuKey[]).map((k) => (
          <Button
            key={k}
            size="small"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => setMenu({ key: k, el: e.currentTarget })}
            sx={{ textTransform: 'capitalize', color: 'text.primary', fontWeight: 600, minWidth: 0, px: 1.1, borderRadius: '8px', background: 'none !important', boxShadow: 'none', ...(menu?.key === k && { bgcolor: 'action.selected' }) }}
          >
            {k}
          </Button>
        ))}
      </Stack>
      <Menu anchorEl={menu?.el} open={!!menu} onClose={closeMenu} slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 220 } } }} sx={{ zIndex: 1700 }}>
        {menu &&
          MENUS[menu.key].map(([l, fn, icon]) => (
            <MenuItem key={l} dense onMouseDown={(e) => e.preventDefault()} onClick={() => { closeMenu(); fn(); }}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{l}</ListItemText>
            </MenuItem>
          ))}
      </Menu>

      {/* Toolbar */}
      <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ px: 0.75, pb: 0.5, rowGap: 0.25 }}>
        <Btn title="Undo (Ctrl+Z)" onClick={() => exec('undo')}><UndoIcon fontSize="small" /></Btn>
        <Btn title="Redo (Ctrl+Y)" onClick={() => exec('redo')}><RedoIcon fontSize="small" /></Btn>
        <Sep />
        <TextField
          select
          size="small"
          value={block}
          onChange={(e) => formatBlock(e.target.value)}
          SelectProps={{ MenuProps: { sx: { zIndex: 1700 } }, onMouseDown: () => refresh() }}
          sx={{ width: 132, '& .MuiInputBase-root': { height: 32, fontSize: 13.5, borderRadius: '10px' } }}
          inputProps={{ 'aria-label': 'Paragraph style' }}
        >
          {BLOCKS.map(([k, l]) => <MenuItem key={k} value={k} dense>{l}</MenuItem>)}
        </TextField>
        <Sep />
        <Btn title="Bold (Ctrl+B)" on={active.bold} onClick={() => exec('bold')}><BoldIcon fontSize="small" /></Btn>
        <Btn title="Italic (Ctrl+I)" on={active.italic} onClick={() => exec('italic')}><ItalicIcon fontSize="small" /></Btn>
        <Btn title="Underline (Ctrl+U)" on={active.underline} onClick={() => exec('underline')}><UnderlineIcon fontSize="small" /></Btn>
        <Sep />
        <Btn title="Image" onClick={() => open('image')}><ImageIcon fontSize="small" /></Btn>
        <Btn title="Media: YouTube, Vimeo, Google Drive" onClick={() => open('media')}><MediaIcon fontSize="small" /></Btn>
        <Btn title="Link (Ctrl+K)" onClick={() => open('link')}><LinkIcon fontSize="small" /></Btn>
        <Btn title="Remove link" onClick={() => exec('unlink')}><UnlinkIcon fontSize="small" /></Btn>
        <Sep />
        <Btn title={full ? 'Exit full screen' : 'Full screen'} onClick={() => setFull((x) => !x)}>{full ? <FullExitIcon fontSize="small" /> : <FullIcon fontSize="small" />}</Btn>
        <Sep />
        <Btn title="Align left" on={active.left} onClick={() => exec('justifyLeft')}><AlignLeftIcon fontSize="small" /></Btn>
        <Btn title="Align centre" on={active.center} onClick={() => exec('justifyCenter')}><AlignCenterIcon fontSize="small" /></Btn>
        <Btn title="Align right" on={active.right} onClick={() => exec('justifyRight')}><AlignRightIcon fontSize="small" /></Btn>
        <Sep />
        <Btn title="Left to right" onClick={() => setDir('ltr')}><LtrIcon fontSize="small" /></Btn>
        <Btn title="Right to left" onClick={() => setDir('rtl')}><RtlIcon fontSize="small" /></Btn>
        <Sep />
        <Btn title="Decrease indent" onClick={() => exec('outdent')}><OutdentIcon fontSize="small" /></Btn>
        <Btn title="Increase indent" onClick={() => exec('indent')}><IndentIcon fontSize="small" /></Btn>
        <Btn title="More" on={more} onClick={() => setMore((x) => !x)}><MoreIcon fontSize="small" /></Btn>
        {more && (
          <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ width: '100%', rowGap: 0.25 }}>
            <Btn title="Bullet list" on={active.ul} onClick={() => exec('insertUnorderedList')}><BulletIcon fontSize="small" /></Btn>
            <Btn title="Numbered list" on={active.ol} onClick={() => exec('insertOrderedList')}><NumberIcon fontSize="small" /></Btn>
            <Btn title="Strikethrough" onClick={() => exec('strikeThrough')}><StrikeIcon fontSize="small" /></Btn>
            <Btn title="Superscript" onClick={() => exec('superscript')}><SuperIcon fontSize="small" /></Btn>
            <Btn title="Subscript" onClick={() => exec('subscript')}><SubIcon fontSize="small" /></Btn>
            <Btn title="Quote" onClick={() => formatBlock('blockquote')}><QuoteIcon fontSize="small" /></Btn>
            <Btn title="Horizontal line" onClick={() => exec('insertHorizontalRule')}><HrIcon fontSize="small" /></Btn>
            <Btn title="Table" onClick={() => open('table')}><TableIcon fontSize="small" /></Btn>
            <Btn title="Source code" onClick={() => open('source')}><CodeIcon fontSize="small" /></Btn>
            <Btn title="Clear formatting" onClick={() => exec('removeFormat')}><ClearIcon fontSize="small" /></Btn>
            <Sep />
            <ColorIcon fontSize="small" sx={{ mx: 0.5, color: 'text.secondary' }} />
            {COLORS.map((c) => (
              <Box
                key={c}
                component="button"
                type="button"
                aria-label={'Text colour ' + c}
                onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                onClick={() => exec('foreColor', c)}
                sx={{ width: 20, height: 20, mx: 0.25, borderRadius: '6px', border: '2px solid rgba(255,255,255,.7)', bgcolor: c, cursor: 'pointer', p: 0 }}
              />
            ))}
          </Stack>
        )}
      </Stack>

      {/* Editable area */}
      <Box
        ref={area}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={label || 'Text editor'}
        onInput={emit}
        onKeyUp={refresh}
        onMouseUp={refresh}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            refresh();
            setDlg('link');
          }
        }}
        onPaste={(e) => {
          // Pasted pages keep their formatting but lose scripts and odd styles.
          const h = e.clipboardData.getData('text/html');
          if (h) {
            e.preventDefault();
            document.execCommand('insertHTML', false, sanitizeHtml(h));
            emit();
          }
        }}
        sx={(t) => ({
          ...richSx(t),
          borderTop: `1px solid ${t.tx.line}`,
          borderBottom: `1px solid ${t.tx.line}`,
          px: { xs: 1.5, md: 2 },
          py: 1.5,
          minHeight,
          maxHeight: full ? 'none' : 460,
          flex: full ? 1 : undefined,
          overflowY: 'auto',
          resize: full ? 'none' : 'vertical',
          outline: 'none',
          '& iframe': { ...(richSx(t)['& iframe, & video'] as object), pointerEvents: 'none', outline: `2px dashed ${t.tx.line}` },
        })}
      />

      {/* Status bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.5, py: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
        <Box component="span" sx={{ color: 'secondary.main', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</Box>
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Box component="button" type="button" onClick={() => setDlg('count')} sx={{ all: 'unset', cursor: 'pointer' }}>{count} words</Box>
          <span>Takxila editor</span>
        </Stack>
      </Stack>

      {dlg === 'source' && <SourceDialog html={html()} onClose={() => setDlg(null)} onSave={(h) => { if (area.current) area.current.innerHTML = sanitizeHtml(h) || '<p><br></p>'; emit(); setDlg(null); }} />}
      {dlg === 'image' && <ImageDialog onClose={() => setDlg(null)} onInsert={(h) => { setDlg(null); insertHtml(h); }} />}
      {dlg === 'media' && <MediaDialog onClose={() => setDlg(null)} onInsert={(h) => { setDlg(null); insertHtml(h); }} />}
      {dlg === 'link' && <LinkDialog text={saved.current?.toString() ?? ''} onClose={() => setDlg(null)} onInsert={(url, text, blank) => { setDlg(null); const sel = saved.current?.toString(); if (sel) { exec('createLink', url); if (blank) area.current?.querySelectorAll(`a[href="${CSS.escape(url)}"]`).forEach((a) => a.setAttribute('target', '_blank')); emit(); } else insertHtml(`<a href="${url}"${blank ? ' target="_blank"' : ''}>${(text || url).replace(/</g, '&lt;')}</a>`); }} />}
      {dlg === 'table' && <TableDialog onClose={() => setDlg(null)} onInsert={(h) => { setDlg(null); insertHtml(h); }} />}
      {dlg === 'count' && <CountDialog text={area.current?.innerText ?? ''} sel={saved.current?.toString() ?? ''} onClose={() => setDlg(null)} />}
      {dlg === 'a11y' && <A11yDialog root={area.current} onClose={() => setDlg(null)} />}
      {dlg === 'manager' && <ManagerDialog root={area.current} onChange={emit} onClose={() => setDlg(null)} />}
      {dlg === 'help' && <HelpDialog onClose={() => setDlg(null)} />}
    </Box>
  );
}

export default memo(RichEditor);

// ---------------- Dialogs ----------------

const dlgSx = { zIndex: 1700, '& .MuiDialog-paper': { borderRadius: '20px' } };

function SourceDialog({ html, onClose, onSave }: { html: string; onClose: () => void; onSave: (h: string) => void }) {
  // Pretty-print a little so the HTML is readable: one block per line.
  const [v, setV] = useState(() => html.replace(/(<\/(p|h\d|li|ul|ol|blockquote|pre|table|tr|div|figure)>)/g, '$1\n').replace(/\n{2,}/g, '\n').trim());
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" sx={dlgSx}>
      <DialogTitle>Source code</DialogTitle>
      <DialogContent>
        <TextField
          value={v}
          onChange={(e) => setV(e.target.value)}
          multiline
          minRows={14}
          maxRows={24}
          fullWidth
          autoFocus
          inputProps={{ spellCheck: false, 'aria-label': 'HTML source' }}
          sx={{ '& textarea': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.55 } }}
        />
        <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 1 }}>Scripts, forms and event handlers are removed when you save. YouTube, Vimeo, Google Drive and academy iframes are kept.</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(v)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function ImageDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (h: string) => void }) {
  const [tab, setTab] = useState(0);
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [deco, setDeco] = useState(false);
  const [width, setWidth] = useState('');
  const [err, setErr] = useState('');
  const pick = async (f?: File) => {
    if (!f) return;
    try {
      setSrc(await fitImage(f, 1200));
      setErr('');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not use that picture.');
    }
  };
  const ok = src && (alt.trim() || deco);
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={dlgSx}>
      <DialogTitle>Insert image</DialogTitle>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ px: 3 }}>
        <Tab label="Upload" />
        <Tab label="From a link" />
      </Tabs>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {err && <Alert severity="error">{err}</Alert>}
          {tab === 0 ? (
            <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ py: 2, borderStyle: 'dashed' }}>
              {src.startsWith('data:') ? 'Choose a different picture' : 'Choose a picture'}
              <input hidden type="file" accept="image/*" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
            </Button>
          ) : (
            <TextField label="Image link (https://…)" value={src.startsWith('data:') ? '' : src} onChange={(e) => setSrc(e.target.value)} fullWidth />
          )}
          {src && <Box component="img" src={src} alt="" sx={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: '12px', alignSelf: 'center' }} />}
          <TextField label="Describe this image (for screen readers)" value={alt} onChange={(e) => setAlt(e.target.value)} disabled={deco} fullWidth />
          <FormControlLabel control={<Checkbox checked={deco} onChange={(e) => setDeco(e.target.checked)} />} label="This image is decorative only" />
          <TextField label="Width in pixels (optional)" type="number" value={width} onChange={(e) => setWidth(e.target.value)} sx={{ maxWidth: 220 }} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!ok} onClick={() => onInsert(`<img src="${src}" alt="${deco ? '' : alt.replace(/"/g, '&quot;')}"${Number(width) > 0 ? ` width="${Math.round(Number(width))}"` : ''}>`)}>Insert image</Button>
      </DialogActions>
    </Dialog>
  );
}

function MediaDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (h: string) => void }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const embed = url.trim() ? toEmbedUrl(url) : '';
  const isFile = /\.(mp4|webm)(\?|$)/i.test(embed);
  const okFrame = sanitizeHtml(`<iframe src="${embed}"></iframe>`).includes('src=');
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={dlgSx}>
      <DialogTitle>Insert media</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="YouTube, Vimeo, Google Drive or .mp4 link" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth autoFocus />
          <TextField label="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          {embed && !isFile && !okFrame && <Alert severity="warning">That site cannot be embedded. Use a YouTube, Vimeo, Google Drive, Loom or academy link, or insert it as a link.</Alert>}
          {embed && (isFile || okFrame) && (
            <Box sx={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '16 / 9', bgcolor: '#000' }}>
              {isFile ? <video src={embed} controls style={{ width: '100%', height: '100%' }} /> : <iframe src={embed} title="Preview" style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!embed || (!isFile && !okFrame)}
          onClick={() => onInsert(isFile ? `<video src="${embed}" controls></video><p></p>` : `<iframe src="${embed}" title="${(title || 'Video').replace(/"/g, '&quot;')}" allowfullscreen></iframe><p></p>`)}
        >
          Insert media
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LinkDialog({ text, onClose, onInsert }: { text: string; onClose: () => void; onInsert: (url: string, text: string, blank: boolean) => void }) {
  const [url, setUrl] = useState('');
  const [t, setT] = useState(text);
  const [blank, setBlank] = useState(true);
  const clean = /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(url.trim()) ? url.trim() : url.trim() ? 'https://' + url.trim() : '';
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={dlgSx}>
      <DialogTitle>Insert link</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Link (https://…, /courses, mailto:…)" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth autoFocus />
          <TextField label="Text to display" value={t} onChange={(e) => setT(e.target.value)} disabled={!!text} helperText={text ? 'Uses the text you selected' : ' '} fullWidth />
          <FormControlLabel control={<Checkbox checked={blank} onChange={(e) => setBlank(e.target.checked)} />} label="Open in a new tab" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!clean} onClick={() => onInsert(clean, t, blank)}>Insert link</Button>
      </DialogActions>
    </Dialog>
  );
}

function TableDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (h: string) => void }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [head, setHead] = useState(true);
  const build = () => {
    const r = Math.min(30, Math.max(1, rows));
    const c = Math.min(10, Math.max(1, cols));
    const tr = (tag: string) => '<tr>' + Array.from({ length: c }, () => `<${tag}><br></${tag}>`).join('') + '</tr>';
    return `<table>${head ? '<thead>' + tr('th') + '</thead>' : ''}<tbody>${Array.from({ length: head ? r - 1 || 1 : r }, () => tr('td')).join('')}</tbody></table><p></p>`;
  };
  return (
    <Dialog open onClose={onClose} sx={dlgSx}>
      <DialogTitle>Insert table</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <TextField label="Rows" type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} sx={{ width: 110 }} />
          <TextField label="Columns" type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} sx={{ width: 110 }} />
        </Stack>
        <FormControlLabel control={<Checkbox checked={head} onChange={(e) => setHead(e.target.checked)} />} label="First row is a header" />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onInsert(build())}>Insert table</Button>
      </DialogActions>
    </Dialog>
  );
}

function CountDialog({ text, sel, onClose }: { text: string; sel: string; onClose: () => void }) {
  const row = (t: string) => [words(t), t.replace(/\n/g, '').length, t.replace(/\s/g, '').length];
  const [a, b] = [row(text), row(sel)];
  const labels = ['Words', 'Characters (with spaces)', 'Characters (no spaces)'];
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" sx={dlgSx}>
      <DialogTitle>Word count</DialogTitle>
      <DialogContent>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { py: 1, borderBottom: 1, borderColor: 'divider', textAlign: 'right' }, '& td:first-of-type, & th:first-of-type': { textAlign: 'left' } }}>
          <thead><tr><th>Count</th><th>Document</th><th>Selection</th></tr></thead>
          <tbody>{labels.map((l, i) => <tr key={l}><td>{l}</td><td>{a[i]}</td><td>{b[i]}</td></tr>)}</tbody>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}

/** Finds the common problems Moodle's accessibility checker reports. */
function a11yIssues(root: HTMLElement | null): string[] {
  if (!root) return [];
  const out: string[] = [];
  root.querySelectorAll('img').forEach((img, i) => {
    if (!img.hasAttribute('alt')) out.push(`Image ${i + 1} has no description (alt text).`);
  });
  let last = 0;
  root.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    const lvl = Number(h.tagName[1]);
    if (!h.textContent?.trim()) out.push(`An empty ${h.tagName.toLowerCase()} heading.`);
    if (last && lvl > last + 1) out.push(`"${h.textContent?.trim().slice(0, 40)}" jumps from heading ${last} to heading ${lvl}.`);
    last = lvl;
  });
  root.querySelectorAll('a').forEach((a) => {
    const t = a.textContent?.trim() ?? '';
    if (!t) out.push('A link has no text.');
    else if (/^(click here|here|read more|link)$/i.test(t)) out.push(`Link text "${t}" does not say where it goes.`);
  });
  root.querySelectorAll('table').forEach((t, i) => {
    if (!t.querySelector('th')) out.push(`Table ${i + 1} has no header row.`);
  });
  root.querySelectorAll('iframe').forEach((f, i) => {
    if (!f.getAttribute('title')) out.push(`Media ${i + 1} has no title.`);
  });
  return out;
}

function A11yDialog({ root, onClose }: { root: HTMLElement | null; onClose: () => void }) {
  const issues = a11yIssues(root);
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={dlgSx}>
      <DialogTitle>Accessibility checker</DialogTitle>
      <DialogContent>
        {issues.length === 0 ? (
          <Alert severity="success">Congratulations, no accessibility issues found.</Alert>
        ) : (
          <List dense>
            {issues.map((x, i) => (
              <ListItem key={i} disableGutters><Alert severity="warning" sx={{ width: '100%' }}>{x}</Alert></ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}

function ManagerDialog({ root, onChange, onClose }: { root: HTMLElement | null; onChange: () => void; onClose: () => void }) {
  const [, force] = useState(0);
  const items = root ? [...root.querySelectorAll<HTMLElement>('img,iframe,video')] : [];
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={dlgSx}>
      <DialogTitle>Media manager</DialogTitle>
      <DialogContent>
        {items.length === 0 ? (
          <Typography color="text.secondary">No images or videos in this text yet.</Typography>
        ) : (
          <Stack spacing={1.25}>
            {items.map((el, i) => {
              const src = el.getAttribute('src') ?? '';
              return (
                <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={(t) => ({ p: 1, borderRadius: '12px', border: `1px solid ${t.tx.line}` })}>
                  {el.tagName === 'IMG' ? <Box component="img" src={src} alt="" sx={{ width: 64, height: 40, objectFit: 'cover', borderRadius: '8px' }} /> : <MediaIcon />}
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{el.tagName === 'IMG' ? 'Image' : 'Video'}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12.5 }} noWrap>{src.startsWith('data:') ? 'Uploaded picture' : src}</Typography>
                  </Box>
                  <IconButton aria-label="Remove" onClick={() => { el.remove(); onChange(); force((x) => x + 1); }}><DeleteIcon /></IconButton>
                </Stack>
              );
            })}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const keys: [string, string][] = [['Ctrl + B', 'Bold'], ['Ctrl + I', 'Italic'], ['Ctrl + U', 'Underline'], ['Ctrl + K', 'Insert link'], ['Ctrl + Z', 'Undo'], ['Ctrl + Y', 'Redo'], ['Shift + Enter', 'New line in the same paragraph']];
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" sx={dlgSx}>
      <DialogTitle>Keyboard shortcuts</DialogTitle>
      <DialogContent>
        {keys.map(([k, l]) => (
          <Stack key={k} direction="row" justifyContent="space-between" sx={{ py: 0.75, borderBottom: 1, borderColor: 'divider' }}>
            <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{k}</Typography>
            <Typography>{l}</Typography>
          </Stack>
        ))}
        <Typography color="text.secondary" sx={{ fontSize: 13, mt: 1.5 }}>On a Mac use ⌘ instead of Ctrl.</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button variant="contained" onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
}
