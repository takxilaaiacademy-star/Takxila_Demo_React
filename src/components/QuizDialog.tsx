import { Box, Button, Dialog, DialogContent, IconButton, LinearProgress, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { questionsFor, recommend } from '../data/recommend';
import { PlanStats, RecGrid } from './Recommendations';
import type { Answers, QuizState } from '../types';

// One dialog for both the post-login onboarding questions and the AI Course Calculator.
export default function QuizDialog() {
  const theme = useTheme();
  const full = useMediaQuery(theme.breakpoints.down('sm'));
  const nav = useNavigate();
  const { quiz, setQuiz, closeQuiz, saveProfile, saveCalc, owned, toast } = useStore();
  if (!quiz) return null;

  const list = questionsFor(quiz.mode);
  const cur = quiz.step < list.length ? list[quiz.step] : null;
  const ans = quiz.ans;
  const set = (p: Partial<QuizState>) => setQuiz({ ...quiz, ...p });

  const finish = (a: Answers) => {
    if (quiz.mode === 'onboard') saveProfile(a);
    else saveCalc(a);
    set({ ans: a, step: list.length });
  };
  const next = (a: Answers = ans) => (quiz.step + 1 >= list.length ? finish(a) : set({ ans: a, step: quiz.step + 1 }));
  const onNext = () => {
    if (!cur) return;
    const v = ans[cur.id];
    if (!cur.optional && (v == null || (cur.multi && !v.length))) return toast('Pick an answer to continue.');
    next();
  };
  const pick = (v: string) => {
    if (!cur) return;
    if (cur.multi) {
      const prev = ans[cur.id];
      const now = Array.isArray(prev) ? prev : [];
      const on = now.includes(v);
      if (!on && now.length >= (cur.max ?? Infinity)) return toast('Pick up to ' + cur.max + '. Unselect one first.');
      set({ ans: { ...ans, [cur.id]: on ? now.filter((x) => x !== v) : now.concat(v) } });
    } else next({ ...ans, [cur.id]: v });
  };
  const close = () => {
    if (quiz.mode === 'onboard' && cur) {
      try {
        sessionStorage.setItem('tx_onboard_dismissed', '1');
      } catch {
        /* ignore */
      }
      toast('You can answer later from your Dashboard.');
    }
    closeQuiz();
  };

  const recs = cur ? [] : recommend(ans, owned);
  const kick = quiz.mode === 'calc' ? 'AI COURSE CALCULATOR' : 'WELCOME TO TAKXILA · QUICK QUESTIONS';

  return (
    <Dialog open onClose={close} fullScreen={full} maxWidth={cur ? 'sm' : 'lg'} fullWidth>
      <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ flexGrow: 1 }}>
            {kick}
          </Typography>
          <IconButton onClick={close} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Stack>

        {cur ? (
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Question {quiz.step + 1} of {list.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((100 * quiz.step) / list.length)}%
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={(100 * quiz.step) / list.length} sx={{ mb: 3 }} />
            <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, mb: 0.75 }}>
              {cur.q}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              {cur.sub}
            </Typography>
            <Stack spacing={1.25}>
              {cur.opts.map(([v, label]) => {
                const on = cur.multi ? (ans[cur.id] || []).includes(v) : ans[cur.id] === v;
                return (
                  <Button
                    key={v}
                    onClick={() => pick(v)}
                    variant={on ? 'contained' : 'outlined'}
                    endIcon={on ? <CheckCircleIcon /> : null}
                    sx={{ justifyContent: 'space-between', textAlign: 'left', minHeight: 54, px: 2.25, fontSize: 15 }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {quiz.step > 0 && (
                <Button variant="outlined" onClick={() => set({ step: quiz.step - 1 })}>
                  ← Back
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {cur.optional && (
                <Button color="inherit" onClick={() => next()}>
                  Skip
                </Button>
              )}
              {(cur.multi || ans[cur.id] != null) && (
                <Button variant="contained" onClick={onNext}>
                  {quiz.step + 1 >= list.length ? 'See my courses' : 'Next'}
                </Button>
              )}
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 40 }, mb: 1 }}>
              Your best-fit{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                AI courses
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Picked from your answers. Add one, or add the whole plan to your cart.
            </Typography>
            {recs.length === 0 ? (
              <Typography sx={{ mb: 3 }}>You already own every course that fits these answers. Try different topics.</Typography>
            ) : (
              <>
                <PlanStats recs={recs} />
                <RecGrid recs={recs} onNavigate={closeQuiz} />
              </>
            )}
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => set({ step: 0 })}>
                Change my answers
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  closeQuiz();
                  nav(quiz.mode === 'calc' ? '/calculator' : '/dashboard');
                }}
              >
                Done
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
