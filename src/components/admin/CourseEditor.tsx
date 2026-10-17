import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
import { logActions } from '../../store/logSlice';
import type { CatId, CustomCourse, GroupId } from '../../types';
import { fitImage, readSmallFile } from '../../utils/image';
import { courseDays } from '../../utils/adminStats';
import { htmlToText, linesToHtml, sanitizeHtml } from '../../utils/sanitize';

// The text editor is only downloaded when the admin opens the Course page tab.
const RichEditor = lazy(() => import('./RichEditor'));

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
  // Moodle-style "General" settings
  shortName: string; idNumber: string; startDate: string; endDate: string; endOn: boolean; days: string;
  visible: 'show' | 'hide'; type: 'paid' | 'free';
  cat: CatId; group: GroupId; price: string; was: string; featured: boolean;
  tags: string; meta: string; learn: string;
  // media
  img: string; video: string; player: string;
  // course page
  subtitle: string; level: string; language: string;
  pageLearn: string; requirements: string; audience: string; description: string; includes: string;
  /** Course summary from the text editor (HTML) */
  html: string;
  sections: SectionDraft[];
}

const BLANK: Draft = {
  title: '', kicker: 'New course', short: '', desc: '',
  shortName: '', idNumber: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', endOn: false, days: '30', visible: 'show', type: 'paid', cat: 'tools', group: 'toolkit', price: '0', was: '', featured: false,
  tags: '', meta: '1 Hour\nBeginner', learn: 'Lesson 1\nLesson 2\nLesson 3',
  img: '/assets/covers/gemini.webp', video: '/media/videos/ready.mp4', player: '',
  subtitle: '', level: 'Beginner', language: 'English', pageLearn: '', requirements: '', audience: '', description: '', includes: '', html: '',
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
  const summaryTouched = useRef(false);
  const [d, setD] = useState<Draft | null>(isNew ? BLANK : null);
  const [err, setErr] = useState('');
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => (x ? { ...x, [k]: v } : x));
  // Curriculum edits only redraw the one section being changed, so long courses stay smooth.
  const updSec = useCallback((i: number, patch: Partial<SectionDraft>) => setD((x) => (x ? { ...x, sections: x.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) } : x)), []);
  const delSec = useCallback((i: number) => setD((x) => (x ? { ...x, sections: x.sections.filter((_, j) => j !== i) } : x)), []);
  const [openSec, setOpenSec] = useState(0);

  // Fill the form from the live course and its page text (the page text is a separate file, loaded on demand).
  useEffect(() => {
    if (isNew || !course) return;
    let live = true;
    void import('../../data/courseContent').then((m) => {
      if (!live) return;
      const base: Partial<CourseContent> = { ...(m.CONTENT[id] ?? {}), ...(contentEdit ?? {}) };
      setD({
        title: course.title, kicker: course.kicker, short: course.short, desc: course.desc,
        shortName: course.shortName ?? '', idNumber: course.idNumber ?? '', startDate: course.startDate ?? '', endDate: course.endDate ?? '', endOn: !!course.endDate,
        days: course.days ? String(course.days) : '', visible: isHidden ? 'hide' : 'show', type: course.price > 0 ? 'paid' : 'free',
        cat: course.cat, group: course.group, price: String(course.price), was: course.was ? String(course.was) : '', featured: course.featured,
        tags: course.tags.join(', '), meta: lines(course.meta), learn: lines(course.learn),
        img: course.img, video: course.video, player: playerUrl,
        subtitle: base.subtitle ?? course.short, level: base.level ?? '', language: base.language ?? '',
        pageLearn: lines(base.learn ?? course.learn), requirements: lines(base.requirements), audience: lines(base.audience),
        description: lines(base.description ?? [course.desc]), includes: lines(base.includes),
        html: base.html ?? linesToHtml(base.description ?? [course.desc]),
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
    const price = d.type === 'free' ? 0 : Math.max(0, Math.round(Number(d.price) || 0));
    if (d.type === 'paid' && price === 0) { setTab(0); return setErr('A paid course needs a price. Choose "Free" as the course type for a free course.'); }
    if (d.endOn && d.endDate && d.startDate && d.endDate < d.startDate) { setTab(0); return setErr('The end date is before the start date.'); }
    const was = Math.max(0, Math.round(Number(d.was) || 0));
    const card = {
      title: d.title.trim(), kicker: d.kicker.trim(), short: d.short.trim(), desc: d.desc.trim(),
      cat: d.cat, group: d.group, price, was: was > price ? was : null, featured: d.featured,
      tags: d.tags.split(',').map((x) => x.trim()).filter(Boolean), meta: toLines(d.meta), learn: toLines(d.learn),
      img: d.img.trim(), video: d.video.trim(),
      shortName: d.shortName.trim() || undefined, idNumber: d.idNumber.trim() || undefined,
      startDate: d.startDate || undefined, endDate: d.endOn && d.endDate ? d.endDate : undefined,
      days: Math.round(Number(d.days)) > 0 ? Math.round(Number(d.days)) : undefined,
    };
    const html = sanitizeHtml(d.html);
    const plain = html ? htmlToText(html).split('\n').map((x) => x.trim()).filter(Boolean) : [];
    const page: Partial<CourseContent> = {
      subtitle: d.subtitle.trim(), learn: toLines(d.pageLearn), requirements: toLines(d.requirements), audience: toLines(d.audience),
      description: plain.length ? plain : toLines(d.description), html: html || undefined, includes: toLines(d.includes), level: d.level.trim() || undefined, language: d.language.trim() || undefined,
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
    if ((d.visible === 'hide') !== isHidden) dispatch(siteActions.visibilitySet({ id: cid, hidden: d.visible === 'hide' }));
    dispatch(siteActions.contentEdited({ id: cid, patch: page }));
    dispatch(adminActions.playerUrlSet({ id: cid, url: d.player.trim() ? toEmbedUrl(d.player) : '' }));
    if (!isNew && course) {
      // One line in Admin > Activity saying what changed.
      const names: Record<string, string> = { title: 'name', kicker: 'kicker', short: 'short line', desc: 'description', price: 'price', was: 'old price', img: 'image', video: 'video', meta: 'details', learn: 'lessons', cat: 'topic', group: 'track', featured: 'featured', tags: 'tags', shortName: 'short name', idNumber: 'ID number', startDate: 'start date', endDate: 'end date', days: 'days to complete' };
      const changed = (Object.keys(names) as (keyof typeof card)[]).filter((k) => JSON.stringify(card[k] ?? null) !== JSON.stringify((course as unknown as Record<string, unknown>)[k] ?? null)).map((k) => names[k]);
      const priceNote = card.price !== course.price ? ` (₹${course.price} → ₹${card.price})` : '';
      if (summaryTouched.current) changed.push('summary');
      dispatch(logActions.added({ kind: 'content', text: `Edited ${card.title}: ${changed.length ? changed.join(', ') : 'course page'}${priceNote}` }));
    }
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

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 0.5 }}>
        {isNew ? 'Add a new course' : 'Edit course'}
        {!isNew && <Typography color="text.secondary" sx={{ fontSize: 13, wordBreak: 'break-word' }}>{course?.title}</Typography>}
      </DialogTitle>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} variant="scrollable" sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="General" />
        <Tab label="Video & image" />
        <Tab label="Course page" />
        <Tab label="Curriculum" />
        <Tab label="Access" />
      </Tabs>
      <DialogContent dividers sx={{ minHeight: 380 }}>
        {err && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr('')}>{err}</Alert>}

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField label="Course full name" required value={d.title} onChange={(e) => set('title', e.target.value)} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Course short name" value={d.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="JUNIOR AI CHALLENGE" fullWidth />
              <TextField label="Course ID number" value={d.idNumber} onChange={(e) => set('idNumber', e.target.value)} placeholder="TX-AICh-05" fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Course visibility" value={d.visible} onChange={(e) => set('visible', e.target.value as Draft['visible'])} fullWidth helperText="Hidden courses stay open for learners who own them">
                <MenuItem value="show">Show</MenuItem>
                <MenuItem value="hide">Hide</MenuItem>
              </TextField>
              <TextField select label="Course type" value={d.type} onChange={(e) => set('type', e.target.value as Draft['type'])} fullWidth helperText=" ">
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="free">Free</MenuItem>
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <TextField label="Course start date" type="date" value={d.startDate} onChange={(e) => set('startDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Course end date" type="date" value={d.endDate} disabled={!d.endOn} onChange={(e) => set('endDate', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <FormControlLabel control={<Switch checked={d.endOn} onChange={(e) => set('endOn', e.target.checked)} />} label="Enable" sx={{ flexShrink: 0 }} />
            </Stack>
            <TextField label="Days to complete after enrolling" type="number" placeholder={isNew ? '30' : String(courseDays(course))} InputLabelProps={{ shrink: true }} value={d.days} onChange={(e) => set('days', e.target.value)} helperText="Admin > Users shows each learner's days left. Empty: worked out from the course length (e.g. 28 Days), else 30." fullWidth />
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
              <TextField label="Price (₹)" type="number" disabled={d.type === 'free'} value={d.type === 'free' ? '0' : d.price} onChange={(e) => set('price', e.target.value)} fullWidth />
              <TextField label="Old price (₹, optional)" type="number" disabled={d.type === 'free'} value={d.was} onChange={(e) => set('was', e.target.value)} helperText="Shown crossed out, with the % off" fullWidth />
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
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Course summary</Typography>
              <Suspense fallback={<Box sx={{ height: 300, borderRadius: '16px', bgcolor: 'action.hover' }} />}>
                <RichEditor value={d.html} onChange={(h) => { summaryTouched.current = true; set('html', h); }} minHeight={260} />
              </Suspense>
              <Typography color="text.secondary" sx={{ fontSize: 12.5, mt: 0.5 }}>Shown as the Description on the course page. Tools &gt; Source code lets you paste or edit the HTML.</Typography>
            </Box>
            <TextField label={'"This course includes" (one per line, optional)'} value={d.includes} onChange={(e) => set('includes', e.target.value)} multiline minRows={3} helperText="Empty keeps the standard list." fullWidth />
          </Stack>
        )}

        {tab === 3 && (
          <Stack spacing={2.5}>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>Sections and lectures on the course page. The counts and total length are worked out for you.</Typography>
            {secs.map((s, i) => (
              <SectionEditor key={i} i={i} s={s} open={openSec === i} onOpen={setOpenSec} upd={updSec} del={delSec} />
            ))}
            <Box><Button variant="outlined" startIcon={<AddIcon />} onClick={() => { set('sections', [...secs, { title: '', lectures: [{ title: '', minutes: 5 }] }]); setOpenSec(secs.length); }}>Add section</Button></Box>
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

/** One curriculum section. Collapsed sections show only their title; lectures render when opened. */
const SectionEditor = memo(function SectionEditor({ i, s, open, onOpen, upd, del }: { i: number; s: SectionDraft; open: boolean; onOpen: (i: number) => void; upd: (i: number, p: Partial<SectionDraft>) => void; del: (i: number) => void }) {
  const mins = s.lectures.reduce((n, l) => n + (Number(l.minutes) || 0), 0);
  const setLec = (k: number, patch: Partial<SectionDraft['lectures'][number]>) => upd(i, { lectures: s.lectures.map((x, y) => (y === k ? { ...x, ...patch } : x)) });
  return (
    <Box sx={(t) => ({ p: { xs: 1.5, sm: 2 }, borderRadius: '14px', border: `1px solid ${open ? t.tx.hl : t.tx.line}` })}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField size="small" label={`Section ${i + 1} title`} value={s.title} onChange={(e) => upd(i, { title: e.target.value })} onFocus={() => onOpen(i)} fullWidth />
        <Button size="small" onClick={() => onOpen(open ? -1 : i)} sx={{ flexShrink: 0, minWidth: 0, whiteSpace: 'nowrap' }}>
          {open ? 'Close' : `${s.lectures.length} lectures · ${mins} min`}
        </Button>
        <IconButton aria-label="Delete section" onClick={() => { if (window.confirm('Delete this section and its lectures?')) del(i); }}><DeleteIcon /></IconButton>
      </Stack>
      {open && (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {s.lectures.map((l, k) => (
            <Stack key={k} direction="row" spacing={1} alignItems="center">
              <TextField size="small" label={`Lecture ${k + 1}`} value={l.title} onChange={(e) => setLec(k, { title: e.target.value })} fullWidth />
              <TextField size="small" label="Min" type="number" value={l.minutes} onChange={(e) => setLec(k, { minutes: Number(e.target.value) })} sx={{ width: 84, flexShrink: 0 }} />
              <IconButton size="small" aria-label="Delete lecture" onClick={() => upd(i, { lectures: s.lectures.filter((_, y) => y !== k) })}><DeleteIcon fontSize="small" /></IconButton>
            </Stack>
          ))}
          <Box><Button size="small" startIcon={<AddIcon />} onClick={() => upd(i, { lectures: [...s.lectures, { title: '', minutes: 5 }] })}>Add lecture</Button></Box>
        </Stack>
      )}
    </Box>
  );
});

/** Mounted once in the Layout: opens the editor whenever something dispatches siteActions.editorOpened(id | 'new'). */
export function CourseEditorHost() {
  const editing = useAppSelector((s) => s.site.editing);
  const dispatch = useAppDispatch();
  if (!editing) return null;
  return <CourseEditor key={editing} id={editing} onClose={() => dispatch(siteActions.editorOpened(null))} />;
}
