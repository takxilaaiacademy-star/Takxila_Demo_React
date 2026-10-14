import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Stack, Switch, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import UploadIcon from '@mui/icons-material/UploadFileOutlined';
import { CAT_PILLS, GROUP_PILLS } from '../../data/courses';
import type { CourseContent } from '../../data/courseContent';
import { toEmbedUrl } from '../../data/player';
import { courseById } from '../../data/recommend';
import { useStoreActions } from '../../context/StoreContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { adminActions } from '../../store/adminSlice';
import { siteActions } from '../../store/siteSlice';
import type { CatId, CustomCourse, GroupId } from '../../types';
import { fitImage, readSmallFile } from '../../utils/image';

/**
 * COURSE EDITOR (admin only)
 * One dialog to change everything about a course: card text, price, banner, summary video, lesson player link,
 * the course page (sections, lectures, requirements ...) and who can watch it.
 * It opens from: Admin > Courses, the pencil on every course card, and "Admin: edit this course" on a course page.
 * Nothing here needs a developer: Save and the website updates straight away.
 */

const lines = (a: string[] | undefined) => (a ?? []).join('\n');
const toLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'course';

interface SectionDraft {
  title: string;
  lectures: { title: string; minutes: number }[];
}

interface Draft {
  // card
  title: string; kicker: string; short: string; desc: string;
  cat: CatId; group: GroupId; price: string; was: string; featured: boolean;
  tags: string; meta: string; learn: string;
  // media
  img: string; video: string; player: string;
  // course page
  subtitle: string; level: string; language: string;
  pageLearn: string; requirements: string; audience: string; description: string; includes: string;
  sections: SectionDraft[];
}

const BLANK: Draft = {
  title: '', kicker: 'New course', short: '', desc: '', cat: 'tools', group: 'toolkit', price: '0', was: '', featured: false,
  tags: '', meta: '1 Hour\nBeginner', learn: 'Lesson 1\nLesson 2\nLesson 3',
  img: '/assets/covers/gemini.webp', video: '/media/videos/ready.mp4', player: '',
  subtitle: '', level: 'Beginner', language: 'English', pageLearn: '', requirements: '', audience: '', description: '', includes: '',
  sections: [{ title: 'Section 1', lectures: [{ title: 'Welcome', minutes: 5 }] }],
};

export default function CourseEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const isNew = id === 'new';
  const course = isNew ? undefined : courseById(id);
  const playerUrl = useAppSelector((s) => (isNew ? '' : s.admin.playerUrls[id] ?? ''));
  const isOpen = useAppSelector((s) => !isNew && s.site.openCourses.includes(id));
  const isHidden = useAppSelector((s) => !isNew && s.site.hiddenCourses.includes(id));
  const isCustom = useAppSelector((s) => !isNew && s.site.customCourses.some((c) => c.id === id));
  const contentEdit = useAppSelector((s) => (isNew ? undefined : s.site.contentEdits[id]));

  const [tab, setTab] = useState(0);
  const [d, setD] = useState<Draft | null>(isNew ? BLANK : null);
  const [err, setErr] = useState('');
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => (x ? { ...x, [k]: v } : x));

  // Fill the form from the live course and its page text (the page text is a separate file, loaded on demand).
  useEffect(() => {
    if (isNew || !course) return;
    let live = true;
    void import('../../data/courseContent').then((m) => {
      if (!live) return;
      const base: Partial<CourseContent> = { ...(m.CONTENT[id] ?? {}), ...(contentEdit ?? {}) };
      setD({
        title: course.title, kicker: course.kicker, short: course.short, desc: course.desc,
        cat: course.cat, group: course.group, price: String(course.price), was: course.was ? String(course.was) : '', featured: course.featured,
        tags: course.tags.join(', '), meta: lines(course.meta), learn: lines(course.learn),
        img: course.img, video: course.video, player: playerUrl,
        subtitle: base.subtitle ?? course.short, level: base.level ?? '', language: base.language ?? '',
        pageLearn: lines(base.learn ?? course.learn), requirements: lines(base.requirements), audience: lines(base.audience),
        description: lines(base.description ?? [course.desc]), includes: lines(base.includes),
        sections: (base.sections ?? []).map((s) => ({ title: s.title, lectures: s.lectures.map(([title, minutes]) => ({ title, minutes })) })),
      });
    });
    return () => {
      live = false;
    };
    // The form is filled once, when the editor opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!isNew && !course) return null;
  if (!d) return (
    <Dialog open onClose={onClose}><DialogContent><Typography>Loading the course…</Typography></DialogContent></Dialog>
  );

  const pickImage = async (f?: File) => {
    if (!f) return;
    try { set('img', await fitImage(f)); setErr(''); } catch (e) { setErr(e instanceof Error ? e.message : 'Could not use that image.'); }
  };
  const pickVideo = async (f?: File) => {
    if (!f) return;
    try { set('video', await readSmallFile(f)); setErr(''); } catch (e) { setErr(e instanceof Error ? e.message : 'Could not use that video.'); }
  };

  const save = () => {
    if (!d.title.trim()) { setTab(0); return setErr('Give the course a title.'); }
    const price = Math.max(0, Math.round(Number(d.price) || 0));
    const was = Math.max(0, Math.round(Number(d.was) || 0));
    const card = {
      title: d.title.trim(), kicker: d.kicker.trim(), short: d.short.trim(), desc: d.desc.trim(),
      cat: d.cat, group: d.group, price, was: was > price ? was : null, featured: d.featured,
      tags: d.tags.split(',').map((x) => x.trim()).filter(Boolean), meta: toLines(d.meta), learn: toLines(d.learn),
      img: d.img.trim(), video: d.video.trim(),
    };
    const page: Partial<CourseContent> = {
      subtitle: d.subtitle.trim(), learn: toLines(d.pageLearn), requirements: toLines(d.requirements), audience: toLines(d.audience),
      description: toLines(d.description), includes: toLines(d.includes), level: d.level.trim() || undefined, language: d.language.trim() || undefined,
      sections: d.sections.filter((s) => s.title.trim()).map((s) => ({ title: s.title.trim(), lectures: s.lectures.filter((l) => l.title.trim()).map((l) => [l.title.trim(), Math.max(1, Math.round(Number(l.minutes) || 1))] as [string, number]) })),
    };
    if (d.player.trim() && !/^https:\/\//i.test(d.player.trim())) { setTab(1); return setErr('The lesson player link must start with https://'); }

    let cid = id;
    if (isNew) {
      cid = slug(d.title);
      let n = 2;
      while (courseById(cid)) cid = slug(d.title) + '-' + n++;
      const fresh: CustomCourse = { id: cid, ...card, was: card.was };
      dispatch(siteActions.courseAdded(fresh));
    } else {
      dispatch(siteActions.courseEdited({ id: cid, patch: card }));
    }
    dispatch(siteActions.contentEdited({ id: cid, patch: page }));
    dispatch(adminActions.playerUrlSet({ id: cid, url: d.player.trim() ? toEmbedUrl(d.player) : '' }));
    toast(isNew ? 'Course added: it is now in the catalog.' : 'Saved: the website is updated.');
    onClose();
  };

  const remove = () => {
    const msg = isCustom || isNew ? 'Delete this course for good?' : 'Take this course off the catalog? You can bring it back from Admin > Courses.';
    if (!window.confirm(msg)) return;
    dispatch(siteActions.courseRemoved(id));
    toast(isCustom ? 'Course deleted.' : 'Course hidden from the catalog.');
    onClose();
  };

  const secs = d.sections;
  const setSec = (i: number, patch: Partial<SectionDraft>) => set('sections', secs.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 0.5 }}>
        {isNew ? 'Add a new course' : 'Edit course'}
        {!isNew && <Typography color="text.secondary" sx={{ fontSize: 13, wordBreak: 'break-word' }}>{course?.title}</Typography>}
      </DialogTitle>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} variant="scrollable" sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Basics" />
        <Tab label="Video & image" />
        <Tab label="Course page" />
        <Tab label="Curriculum" />
        <Tab label="Access" />
      </Tabs>
      <DialogContent dividers sx={{ minHeight: 380 }}>
        {err && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr('')}>{err}</Alert>}

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField label="Course title" value={d.title} onChange={(e) => set('title', e.target.value)} fullWidth />
            <TextField label="Line above the title (card)" value={d.kicker} onChange={(e) => set('kicker', e.target.value)} fullWidth />
            <TextField label="Short line (one sentence)" value={d.short} onChange={(e) => set('short', e.target.value)} fullWidth />
            <TextField label="Description" value={d.desc} onChange={(e) => set('desc', e.target.value)} multiline minRows={3} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Track" value={d.group} onChange={(e) => set('group', e.target.value as GroupId)} fullWidth>
                {GROUP_PILLS.map(([g, l]) => <MenuItem key={g} value={g}>{l}</MenuItem>)}
              </TextField>
              <TextField select label="Topic" value={d.cat} onChange={(e) => set('cat', e.target.value as CatId)} fullWidth>
                {CAT_PILLS.map(([c, l]) => <MenuItem key={c} value={c}>{l}</MenuItem>)}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <TextField label="Price (₹, 0 = free)" type="number" value={d.price} onChange={(e) => set('price', e.target.value)} fullWidth />
              <TextField label="Old price (₹, optional)" type="number" value={d.was} onChange={(e) => set('was', e.target.value)} helperText="Shown crossed out, with the % off" fullWidth />
              <FormControlLabel control={<Switch checked={d.featured} onChange={(e) => set('featured', e.target.checked)} />} label="Featured" sx={{ flexShrink: 0 }} />
            </Stack>
            <TextField label="Details shown on the card (one per line)" value={d.meta} onChange={(e) => set('meta', e.target.value)} multiline minRows={3} helperText="For example: 7 Days, Beginner to Advanced" fullWidth />
            <TextField label="What you learn / lessons (one per line)" value={d.learn} onChange={(e) => set('learn', e.target.value)} multiline minRows={4} helperText="Each line is also a lesson in the learner's progress and grade report." fullWidth />
            <TextField label="Search tags (comma separated)" value={d.tags} onChange={(e) => set('tags', e.target.value)} fullWidth />
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={3}>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Course banner image</Typography>
              <Box component="img" src={d.img} alt="" sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: '12px', mb: 1.5, bgcolor: 'action.hover' }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField size="small" label="Image link or path" value={d.img.startsWith('data:') ? '(uploaded picture)' : d.img} onChange={(e) => set('img', e.target.value)} disabled={d.img.startsWith('data:')} fullWidth />
                <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ flexShrink: 0 }}>
                  Upload
                  <input hidden type="file" accept="image/*" onChange={(e) => { void pickImage(e.target.files?.[0]); e.target.value = ''; }} />
                </Button>
                {d.img.startsWith('data:') && <Button onClick={() => set('img', course?.img.startsWith('data:') ? BLANK.img : course?.img ?? BLANK.img)}>Remove upload</Button>}
              </Stack>
              <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 0.5 }}>A wide picture works best (about 375 × 110). Uploads are shrunk automatically.</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Summary video (the short preview on the card and course page)</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField size="small" label="Video link or path (.mp4 / .webm)" value={d.video.startsWith('data:') ? '(uploaded video)' : d.video} onChange={(e) => set('video', e.target.value)} disabled={d.video.startsWith('data:')} fullWidth />
                <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ flexShrink: 0 }}>
                  Upload
                  <input hidden type="file" accept="video/mp4,video/webm" onChange={(e) => { void pickVideo(e.target.files?.[0]); e.target.value = ''; }} />
                </Button>
                {d.video.startsWith('data:') && <Button onClick={() => set('video', BLANK.video)}>Remove upload</Button>}
              </Stack>
              <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 0.5 }}>Direct video links work best. Uploads are limited to about 2.5 MB because the browser stores them; for longer videos paste a link.</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Lesson player link (what learners watch on the Learn page)</Typography>
              <TextField size="small" label="https link" value={d.player} onChange={(e) => set('player', e.target.value)} placeholder="YouTube, Vimeo, Google Drive or academy link" fullWidth />
              <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 0.5 }}>Paste a normal YouTube, Vimeo or Google Drive share link and it is converted for you. Empty uses the default player.</Typography>
            </Box>
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2}>
            <TextField label="Subtitle (under the title on the course page)" value={d.subtitle} onChange={(e) => set('subtitle', e.target.value)} multiline minRows={2} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Level" value={d.level} onChange={(e) => set('level', e.target.value)} placeholder="Beginner to Advanced" fullWidth />
              <TextField label="Language" value={d.language} onChange={(e) => set('language', e.target.value)} placeholder="English" fullWidth />
            </Stack>
            <TextField label={'"What you\'ll learn" (one per line)'} value={d.pageLearn} onChange={(e) => set('pageLearn', e.target.value)} multiline minRows={4} fullWidth />
            <TextField label="Requirements (one per line)" value={d.requirements} onChange={(e) => set('requirements', e.target.value)} multiline minRows={3} fullWidth />
            <TextField label={'"Who this course is for" (one per line)'} value={d.audience} onChange={(e) => set('audience', e.target.value)} multiline minRows={3} fullWidth />
            <TextField label="Description (one paragraph per line; start a line with • for a bullet)" value={d.description} onChange={(e) => set('description', e.target.value)} multiline minRows={4} fullWidth />
            <TextField label={'"This course includes" (one per line, optional)'} value={d.includes} onChange={(e) => set('includes', e.target.value)} multiline minRows={3} helperText="Empty keeps the standard list." fullWidth />
          </Stack>
        )}

        {tab === 3 && (
          <Stack spacing={2.5}>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>Sections and lectures on the course page. The counts and total length are worked out for you.</Typography>
            {secs.map((s, i) => (
              <Box key={i} sx={(t) => ({ p: 2, borderRadius: '14px', border: `1px solid ${t.tx.line}` })}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <TextField size="small" label={`Section ${i + 1} title`} value={s.title} onChange={(e) => setSec(i, { title: e.target.value })} fullWidth />
                  <IconButton aria-label="Delete section" onClick={() => set('sections', secs.filter((_, j) => j !== i))}><DeleteIcon /></IconButton>
                </Stack>
                <Stack spacing={1}>
                  {s.lectures.map((l, k) => (
                    <Stack key={k} direction="row" spacing={1} alignItems="center">
                      <TextField size="small" label="Lecture" value={l.title} onChange={(e) => setSec(i, { lectures: s.lectures.map((x, y) => (y === k ? { ...x, title: e.target.value } : x)) })} fullWidth />
                      <TextField size="small" label="Min" type="number" value={l.minutes} onChange={(e) => setSec(i, { lectures: s.lectures.map((x, y) => (y === k ? { ...x, minutes: Number(e.target.value) } : x)) })} sx={{ width: 90, flexShrink: 0 }} />
                      <IconButton size="small" aria-label="Delete lecture" onClick={() => setSec(i, { lectures: s.lectures.filter((_, y) => y !== k) })}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  ))}
                  <Box><Button size="small" startIcon={<AddIcon />} onClick={() => setSec(i, { lectures: [...s.lectures, { title: '', minutes: 5 }] })}>Add lecture</Button></Box>
                </Stack>
              </Box>
            ))}
            <Box><Button variant="outlined" startIcon={<AddIcon />} onClick={() => set('sections', [...secs, { title: '', lectures: [{ title: '', minutes: 5 }] }])}>Add section</Button></Box>
          </Stack>
        )}

        {tab === 4 && (
          <Stack spacing={2}>
            {isNew ? (
              <Typography color="text.secondary">Save the course first. Then open it again to set who can watch it.</Typography>
            ) : (
              <>
                <Box sx={(t) => ({ p: 2, borderRadius: '14px', border: `1px solid ${t.tx.line}` })}>
                  <FormControlLabel
                    control={<Switch checked={isOpen} onChange={(e) => dispatch(siteActions.openSet({ ids: [id], open: e.target.checked }))} />}
                    label={<Typography sx={{ fontWeight: 700 }}>Open access: everybody with an account can watch this course</Typography>}
                  />
                  <Typography color="text.secondary" sx={{ fontSize: 13.5, ml: 6 }}>
                    No purchase or enrollment needed. Learners see a green "Open access" tag and a "watch now" button. Turn it off to go back to paid / granted access.
                  </Typography>
                </Box>
                <Box sx={(t) => ({ p: 2, borderRadius: '14px', border: `1px solid ${t.tx.line}` })}>
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Visibility</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    {isHidden ? <Chip color="warning" size="small" label="Hidden from the catalog" /> : <Chip color="success" size="small" label="Shown in the catalog" />}
                    {isHidden && <Button size="small" onClick={() => dispatch(siteActions.courseRestored({ id }))}>Show again</Button>}
                    {!isHidden && <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={remove}>{isCustom ? 'Delete this course' : 'Hide from the catalog'}</Button>}
                  </Stack>
                  <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>Hidden courses stay open for learners who already own them.</Typography>
                </Box>
                {!isCustom && (
                  <Button color="warning" onClick={() => { if (window.confirm('Throw away all your edits to this course and go back to the original?')) { dispatch(siteActions.courseRestored({ id, resetEdits: true })); onClose(); } }}>
                    Reset this course to the original
                  </Button>
                )}
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>{isNew ? 'Add course' : 'Save changes'}</Button>
      </DialogActions>
    </Dialog>
  );
}

/** Mounted once in the Layout: opens the editor whenever something dispatches siteActions.editorOpened(id | 'new'). */
export function CourseEditorHost() {
  const editing = useAppSelector((s) => s.site.editing);
  const dispatch = useAppDispatch();
  if (!editing) return null;
  return <CourseEditor key={editing} id={editing} onClose={() => dispatch(siteActions.editorOpened(null))} />;
}
