import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FAQ } from '../data/content';

export default function Faq() {
  return FAQ.map(([q, a]) => (
    <Accordion key={q} disableGutters sx={(t) => ({ mb: 1.25, borderRadius: '16px !important', border: `1px solid ${t.tx.line}`, background: t.tx.surface, '&:before': { display: 'none' } })}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 0.5 }}>
        <Typography sx={{ fontWeight: 700 }}>{q}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
        <Typography color="text.secondary">{a}</Typography>
      </AccordionDetails>
    </Accordion>
  ));
}
