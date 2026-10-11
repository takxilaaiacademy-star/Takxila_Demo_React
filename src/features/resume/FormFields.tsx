import { memo, type ReactNode } from 'react';
import { Box, IconButton, Stack, TextField, Tooltip, Typography, type TextFieldProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { ResumeEntry } from '../../types';

/**
 * Form building blocks for the resume builder.
 *
 * Typing speed: every input is a memoised <TxField> that receives only its own
 * value plus ONE stable `onValue(path, value)` callback. A keystroke therefore
 * re-renders a single TextField instead of the whole form.
 */

export type OnValue = (path: string, value: string) => void;

type TxFieldProps = { name: string; value: string; onValue: OnValue } & Omit<TextFieldProps, 'name' | 'value' | 'onChange'>;

export const TxField = memo(function TxField({ name, value, onValue, ...rest }: TxFieldProps) {
  return <TextField size="small" fullWidth {...rest} name={name} value={value} onChange={(e) => onValue(name, e.target.value)} />;
});

// Stable objects so memo() is not defeated by new props on every render.
const SHRINK = { shrink: true };
const MONTH_INPUT = { max: '2100-12' };

export const SectionTitle = memo(function SectionTitle({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
      {icon && (
        <Box sx={(t) => ({ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: '9px', color: 'secondary.main', bgcolor: t.palette.mode === 'dark' ? 'rgba(245,185,63,.12)' : 'rgba(43,43,214,.08)', '& svg': { fontSize: 18 } })}>
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{title}</Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
            {hint}
          </Typography>
        )}
      </Box>
    </Stack>
  );
});

export const AddRemove = memo(function AddRemove({ onAdd, onRemove, addLabel, canRemove }: { onAdd: () => void; onRemove: () => void; addLabel: string; canRemove: boolean }) {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title={addLabel}>
        <IconButton onClick={onAdd} aria-label={addLabel} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText', transform: 'scale(1.06)' }, transition: 'transform .2s' }}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove the last one">
        <span>
          <IconButton onClick={onRemove} disabled={!canRemove} aria-label="Remove the last one" sx={(t) => ({ border: `1px solid ${t.tx.line}` })}>
            <RemoveIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
});

/** One education / work / project entry. Re-renders only when its own entry changes. */
export const EntryCard = memo(function EntryCard({ list, index, entry, labels, onValue }: { list: string; index: number; entry: ResumeEntry; labels: readonly [string, string, string]; onValue: OnValue }) {
  const p = `${list}.${index}.`;
  return (
    <Stack spacing={1} sx={(t) => ({ p: 1.5, borderRadius: '14px', border: `1px dashed ${t.tx.line}`, animation: 'txrise .35s both' })}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <TxField name={p + 'title'} label={labels[0]} value={entry.title} onValue={onValue} />
        <TxField name={p + 'sub'} label={labels[1]} value={entry.sub} onValue={onValue} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <TxField name={p + 'from'} type="month" label="From" InputLabelProps={SHRINK} inputProps={MONTH_INPUT} value={entry.from} onValue={onValue} />
        <TxField name={p + 'to'} type="month" label="To" InputLabelProps={SHRINK} inputProps={MONTH_INPUT} value={entry.to} onValue={onValue} helperText={entry.from && !entry.to ? 'Empty means present' : ' '} />
      </Stack>
      <TxField name={p + 'points'} multiline minRows={2} maxRows={10} label={labels[2]} value={entry.points} onValue={onValue} />
    </Stack>
  );
});

export const EntryList = memo(function EntryList({ list, items, labels, onValue, onAdd, onRemove, addLabel }: { list: string; items: ResumeEntry[]; labels: readonly [string, string, string]; onValue: OnValue; onAdd: (list: string) => void; onRemove: (list: string) => void; addLabel: string }) {
  return (
    <Stack spacing={1.25}>
      {items.map((e, i) => (
        <EntryCard key={i} list={list} index={i} entry={e} labels={labels} onValue={onValue} />
      ))}
      <AddRemove onAdd={() => onAdd(list)} onRemove={() => onRemove(list)} addLabel={addLabel} canRemove={items.length > 1} />
    </Stack>
  );
});

export const LinkRow = memo(function LinkRow({ index, label, url, onValue }: { index: number; label: string; url: string; onValue: OnValue }) {
  return (
    <Stack direction="row" spacing={1}>
      <TxField name={`links.${index}.label`} label="Label" value={label} onValue={onValue} sx={LABEL_SX} fullWidth={false} />
      <TxField name={`links.${index}.url`} label="URL" placeholder="linkedin.com/in/your-name" value={url} onValue={onValue} />
    </Stack>
  );
});
const LABEL_SX = { width: { xs: 110, sm: 140 }, flex: 'none' };
