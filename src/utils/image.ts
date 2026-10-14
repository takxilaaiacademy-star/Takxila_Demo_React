// Resizes a picked photo to a square JPEG data URL so it fits in localStorage.
export function resizeImage(file: File, size = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('That file is not an image.'));
    img.src = url;
  });
}

/** Shrinks a picked picture to at most `maxWidth` pixels wide (keeping its shape) and returns a small JPEG data URL. Used for course banners. */
export function fitImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = Math.min(img.width, maxWidth);
      const h = Math.round((img.height * w) / img.width);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('That file is not an image.'));
    img.src = url;
  });
}

/** Reads a small file (for example a short video) as a data URL. Bigger files are refused: the browser only has about 5 MB of room. */
export function readSmallFile(file: File, maxBytes = 2_500_000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) return reject(new Error('That file is ' + (file.size / 1e6).toFixed(1) + ' MB. Upload it to your hosting or YouTube and paste the link instead (limit here: ' + (maxBytes / 1e6).toFixed(1) + ' MB).'));
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Could not read that file.'));
    r.readAsDataURL(file);
  });
}
