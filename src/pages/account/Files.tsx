import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { Box, Button, Card, Dialog, DialogContent, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Heading, Page } from '../../components/Section';
import { useUser } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { addFile, deleteFile, formatSize, listFiles } from '../../utils/files';
import type { PrivateFile } from '../../types';

const MAX = 50 * 1024 * 1024;
interface Shown extends PrivateFile {
  url: string;
}

export default function Files() {
  const user = useUser();
  const { toast } = useStore();
  const [files, setFiles] = useState<Shown[]>([]);
  const [drag, setDrag] = useState(false);
  const [view, setView] = useState<Shown | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const list = await listFiles(user.email);
    setFiles((old) => {
      old.forEach((f) => URL.revokeObjectURL(f.url));
      return list.map((f) => ({ ...f, url: URL.createObjectURL(f.blob) }));
    });
  }, [user.email]);

  useEffect(() => {
    refresh().catch(() => toast('Private files are not available in this browser.'));
  }, [refresh, toast]);
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.url)), [files]);

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    const ok = Array.from(list).filter((f) => f.size <= MAX);
    if (ok.length < list.length) toast('Files over 50 MB were skipped.');
    for (const f of ok) await addFile(user.email, f);
    await refresh();
    if (ok.length) toast(ok.length + (ok.length > 1 ? ' files uploaded.' : ' file uploaded.'));
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    upload(e.dataTransfer.files);
  };
  const used = files.reduce((a, f) => a + f.size, 0);

  return (
    <Page>
      <Heading kick="PRIVATE FILES" title="Your" hl="files" sub="Notes, certificates and project files. They are stored in this browser only and opened as blob URLs." />
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => input.current?.click()}
        sx={(t) => ({
          p: { xs: 3, md: 5 }, mb: 3, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: `2px dashed ${drag ? t.tx.hl : t.tx.line}`,
          background: drag ? t.tx.glow : t.tx.surface, transition: 'all .25s', '&:hover': { borderColor: t.tx.hl },
        })}
      >
        <CloudUploadIcon sx={{ fontSize: 52, color: 'secondary.main', animation: drag ? 'txfloat 1.2s ease-in-out infinite' : 'none' }} />
        <Typography variant="h6">Drop files here or click to upload</Typography>
        <Typography color="text.secondary" variant="body2">
          Up to 50 MB each · {files.length} files · {formatSize(used)} used
        </Typography>
        <input ref={input} type="file" multiple hidden onChange={(e) => upload(e.target.files).then(() => (e.target.value = ''))} />
      </Box>
      <Grid container spacing={2}>
        {files.map((f, i) => (
          <Grid item xs={6} sm={4} md={3} key={f.id}>
            <Card sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', animation: `txpop .4s ${i * 40}ms both` }}>
              <Box onClick={() => setView(f)} sx={{ aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', cursor: 'pointer', bgcolor: 'rgba(0,0,0,.15)', overflow: 'hidden' }}>
                {f.type.startsWith('image/') ? (
                  <Box component="img" src={f.url} alt={f.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : f.type.startsWith('video/') ? (
                  <Box component="video" src={f.url} muted sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                )}
              </Box>
              <Box sx={{ p: 1.5, flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap title={f.name}>
                  {f.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(f.size)} · {new Date(f.at).toLocaleDateString()}
                </Typography>
              </Box>
              <Stack direction="row" justifyContent="flex-end" sx={{ px: 1, pb: 1 }}>
                <Tooltip title="Download">
                  <IconButton size="small" component="a" href={f.url} download={f.name}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={async () => {
                      await deleteFile(f.id);
                      await refresh();
                      toast('File deleted.');
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!files.length && (
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          No files yet.
        </Typography>
      )}
      <Dialog open={!!view} onClose={() => setView(null)} maxWidth="md" fullWidth>
        <DialogContent>
          {view && (
            <>
              <Typography sx={{ fontWeight: 800, mb: 1.5 }}>{view.name}</Typography>
              {view.type.startsWith('image/') ? (
                <Box component="img" src={view.url} alt={view.name} sx={{ width: '100%', borderRadius: '12px' }} />
              ) : view.type.startsWith('video/') ? (
                <Box component="video" src={view.url} controls autoPlay sx={{ width: '100%', borderRadius: '12px' }} />
              ) : view.type === 'application/pdf' ? (
                <Box component="iframe" src={view.url} title={view.name} sx={{ width: '100%', height: '70vh', border: 0, borderRadius: '12px', bgcolor: '#fff' }} />
              ) : (
                <Typography color="text.secondary">No preview for this file type. Use Download to open it.</Typography>
              )}
              <Button href={view.url} download={view.name} variant="contained" startIcon={<DownloadIcon />} sx={{ mt: 2 }}>
                Download
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
