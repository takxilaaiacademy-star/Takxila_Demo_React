import { Button, Card, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Heading, Page } from '../../components/Section';
import { useStore } from '../../context/StoreContext';
import { gradeReport, lessonsFor } from '../../data/curriculum';
import { courseById } from '../../data/recommend';
import type { Course } from '../../types';

/** Grades overview: one row per enrolled course, linking to its user report. */
export default function Grades() {
  const nav = useNavigate();
  const { owned, lessons } = useStore();
  const courses = owned.map(courseById).filter((c): c is Course => !!c);
  return (
    <Page>
      <Heading kick="GRADES" title="Grades" hl="overview" sub="Your course totals. Open a course to see every grade item." />
      {!courses.length ? (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Enroll in a course to start earning grades.
          </Typography>
          <Button variant="contained" onClick={() => nav('/courses')}>
            Browse courses
          </Button>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Course name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Lessons</TableCell>
                <TableCell sx={{ fontWeight: 800, width: '30%' }}>Grade</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c, i) => {
                const done = lessons[c.id] || 0;
                const { total } = gradeReport(c, done);
                return (
                  <TableRow key={c.id} hover sx={{ animation: `txfade .4s ${i * 50}ms both` }}>
                    <TableCell>
                      <Typography component={RouterLink} to={'/courses/' + c.id + '/grades'} sx={{ color: 'secondary.main', textDecoration: 'none', fontWeight: 600 }}>
                        {c.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {done} / {lessonsFor(c).length}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <LinearProgress variant="determinate" value={total} sx={{ flexGrow: 1 }} color={total >= 100 ? 'success' : 'primary'} />
                        <Typography sx={{ fontWeight: 800, minWidth: 56 }}>{total.toFixed(2)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => nav('/courses/' + c.id + '/grades')}>
                        User report
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Page>
  );
}
