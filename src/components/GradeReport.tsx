import { Avatar, Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FunctionsIcon from '@mui/icons-material/Functions';
import MenuBookIcon from '@mui/icons-material/MenuBookOutlined';
import { useUser } from '../context/AuthContext';
import { gradeReport } from '../data/curriculum';
import type { Course } from '../types';

const f2 = (n: number | null) => (n == null ? '-' : n.toFixed(2));

/** Moodle-style "User report": every lesson is a grade item, plus the course total. */
export default function GradeReport({ c, done, onOpenLesson }: { c: Course; done: number; onOpenLesson?: (i: number) => void }) {
  const user = useUser();
  const { rows, total } = gradeReport(c, done);
  return (
    <Box sx={{ animation: 'txrise .5s both' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar src={user.avatar} sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}>
          {user.name[0]}
        </Avatar>
        <Typography variant="h6">{user.name}</Typography>
      </Stack>
      <TableContainer sx={(t) => ({ border: `1px solid ${t.tx.line}`, borderRadius: '14px', background: t.tx.surface })}>
        <Table size="small" sx={{ minWidth: 760, '& td, & th': { borderColor: 'divider' } }}>
          <TableHead>
            <TableRow>
              {['Grade item', 'Calculated weight', 'Grade', 'Range', 'Percentage', 'Feedback', 'Contribution to course total'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 800, py: 1.5 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} sx={{ fontWeight: 800 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <ExpandMoreIcon fontSize="small" />
                  <span>{c.title}</span>
                </Stack>
              </TableCell>
            </TableRow>
            {rows.map((r) => (
              <TableRow key={r.index} hover sx={{ animation: `txfade .4s ${r.index * 40}ms both` }}>
                <TableCell sx={{ pl: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MenuBookIcon fontSize="small" color="disabled" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 700, fontSize: 10 }}>
                        Lesson {r.index + 1}
                      </Typography>
                      <Link component="button" onClick={() => onOpenLesson?.(r.index)} sx={{ color: 'secondary.main', textAlign: 'left' }}>
                        {r.name}
                      </Link>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{r.weight.toFixed(2)} %</TableCell>
                <TableCell sx={{ fontWeight: r.grade ? 700 : 400, color: r.grade ? 'success.main' : 'text.secondary' }}>{f2(r.grade)}</TableCell>
                <TableCell>0–100</TableCell>
                <TableCell>{r.percent == null ? '-' : r.percent.toFixed(2) + ' %'}</TableCell>
                <TableCell>{r.grade ? 'Completed' : ''}</TableCell>
                <TableCell>{r.contribution == null ? '-' : r.contribution.toFixed(2) + ' %'}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={(t) => ({ background: t.tx.surface })}>
              <TableCell sx={{ pl: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FunctionsIcon fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, fontSize: 10 }}>
                      AGGREGATION
                    </Typography>
                    <Typography sx={{ fontWeight: 800 }}>Course total</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>-</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>{total.toFixed(2)}</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>0–100</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>{total.toFixed(2)} %</TableCell>
              <TableCell />
              <TableCell sx={{ fontWeight: 800 }}>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        Each lesson scores 100 when you mark it complete. The course total is the weighted sum of all lessons.
      </Typography>
    </Box>
  );
}
