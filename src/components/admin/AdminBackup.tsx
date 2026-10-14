import { useRef, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import UploadIcon from '@mui/icons-material/UploadFileOutlined';
import { useStoreActions } from '../../context/StoreContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { adminActions } from '../../store/adminSlice';
import { siteActions, siteDataOf } from '../../store/siteSlice';

/** Admin > Backup & restore: save everything you changed to a file, load it back (on this or another computer), or start over. */
export default function AdminBackup() {
  const dispatch = useAppDispatch();
  const { toast } = useStoreActions();
  const site = useAppSelector((s) => s.site);
  const admin = useAppSelector((s) => s.admin);
  const file = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');

  const download = () => {
    const data = { app: 'takxila', version: 1, exportedAt: new Date().toISOString(), site: siteDataOf(site), grants: admin.grants, playerUrls: admin.playerUrls };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'takxila-site-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (f?: File) => {
    if (!f) return;
    try {
      const data = JSON.parse(await f.text()) as { app?: string; site?: object; grants?: Record<string, string[]>; playerUrls?: Record<string, string> };
      if (data.app !== 'takxila' || !data.site) throw new Error('This is not a Takxila backup file.');
      if (!window.confirm('Replace your current course edits, access list and player links with the ones in this file?')) return;
      dispatch(siteActions.siteReplaced(data.site));
      dispatch(adminActions.replaced({ grants: data.grants, playerUrls: data.playerUrls }));
      setErr('');
      toast('Backup restored.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not read that file.');
    }
  };

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        Your changes are saved in this browser. Download a backup now and then, and use it to move your edits to another computer.
        To show the changes to every visitor on their own devices, the site needs a server: ask your host or developer to connect the "BACKEND HOOK" in src/store/index.ts (see the README).
      </Alert>
      {err && <Alert severity="error" onClose={() => setErr('')}>{err}</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={download}>Download backup</Button>
        <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => file.current?.click()}>Restore from a backup file</Button>
        <input ref={file} hidden type="file" accept="application/json,.json" onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ''; }} />
      </Stack>
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Start over</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mb: 1.5 }}>Removes every course edit, new course, hidden course, open-access setting, navbar change and banner, and goes back to the built-in site. Access you gave to learners is not touched.</Typography>
        <Button color="error" variant="outlined" onClick={() => { if (window.confirm('Remove ALL your course, navbar and banner changes?')) { dispatch(siteActions.siteReset()); toast('The site is back to the original.'); } }}>Reset all site edits</Button>
      </Box>
    </Stack>
  );
}
