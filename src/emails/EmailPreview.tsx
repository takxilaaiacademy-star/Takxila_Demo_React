import { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../context/AuthContext';
import { emailData } from './send';
import { renderEmail, type EmailKind } from './templates';

const KINDS: [EmailKind, string][] = [
  ['purchase', 'Course bought'],
  ['enroll', 'Free enrolment'],
  ['completed', 'Course completed'],
];

/** Shows the learner emails exactly as they are sent, filled in with this account's name. */
export default function EmailPreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useUser();
  const theme = useTheme();
  const full = useMediaQuery(theme.breakpoints.down('sm'));
  const [kind, setKind] = useState<EmailKind>('purchase');
  const mail = useMemo(() => {
    const ids = kind === 'purchase' ? ['claude-code', 'agentic'] : kind === 'enroll' ? ['wa-agent'] : ['claude-code'];
    const d = emailData(kind, user.name, user.email, { ids, orderId: 'TXSAMPLE01', paymentId: 'pay_SAMPLE123', total: 0 });
    if (kind === 'purchase') d.total = d.courses.reduce((n, c) => n + (c.price ?? 0), 0);
    return renderEmail(kind, d);
  }, [kind, user.name, user.email]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={full} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Email preview
        <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ToggleButtonGroup exclusive size="small" color="secondary" value={kind} onChange={(_, v) => v && setKind(v)} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
          {KINDS.map(([k, l]) => (
            <ToggleButton key={k} value={k}>
              {l}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Subject: <b>{mail.subject}</b>
        </Typography>
        <Box component="iframe" title="Email preview" srcDoc={mail.html} sx={{ width: '100%', height: { xs: '70vh', md: 640 }, border: 0, borderRadius: '12px', background: '#EEF0F7' }} />
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button onClick={onClose}>Close</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
