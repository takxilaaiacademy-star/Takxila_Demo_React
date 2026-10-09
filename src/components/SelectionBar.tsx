import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useStore } from '../context/StoreContext';
import { courseById } from '../data/recommend';

export default function SelectionBar() {
  const { sel, addMany, clearSel } = useStore();
  if (!sel.length) return null;
  const total = sel.reduce((a, id) => a + (courseById(id)?.price ?? 0), 0);
  return (
    <Paper
      elevation={12}
      sx={{
        position: 'fixed', zIndex: 1200, left: '50%', bottom: 16, transform: 'translateX(-50%)',
        width: 'min(640px, calc(100% - 32px))', px: { xs: 2, sm: 2.5 }, py: 1.25, borderRadius: 999,
        border: 1, borderColor: 'secondary.main', backdropFilter: 'blur(22px)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ fontWeight: 700, flexGrow: 1, whiteSpace: 'nowrap' }}>
          {sel.length} selected · ₹{total}
        </Typography>
        <Button color="inherit" onClick={clearSel}>
          Clear
        </Button>
        <Button variant="contained" onClick={() => addMany(sel)} sx={{ whiteSpace: 'nowrap', px: { xs: 1.5, sm: 2.25 } }}>
          Add all
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>
            to cart
          </Box>
        </Button>
      </Stack>
    </Paper>
  );
}
