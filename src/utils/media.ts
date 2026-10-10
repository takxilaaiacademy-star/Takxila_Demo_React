import { useEffect, useState } from 'react';

// Every image and video is fetched once, kept in the Cache API (so it survives reloads)
// and handed to the page as a blob: URL. Repeat renders reuse the same blob URL.
const CACHE = 'tx-media-v2';
const pending = new Map<string, Promise<string>>();
const ready = new Map<string, string>();
/** blob: URLs whose image is already decoded, so it can be shown with no fade or shimmer */
export const decoded = new Set<string>();
const TIMEOUT = 6000;

// Drop the cache from older builds, which could hold half-written responses.
if (typeof caches !== 'undefined') void caches.delete('tx-media-v1').catch(() => undefined);

const isMedia = (res: Response) => /^(image|video)\//.test(res.headers.get('content-type') || '');

async function fetchCached(src: string): Promise<Response> {
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(src);
      // A cached entry that is not an image or video (an SPA fallback page, a cut-off write) is thrown away.
      if (hit && isMedia(hit)) return hit;
      if (hit) await cache.delete(src);
      const res = await fetch(src);
      if (res.ok && isMedia(res)) void cache.put(src, res.clone()).catch(() => undefined);
      return res;
    } catch {
      /* Cache API blocked (private mode or http): fall back to a plain fetch */
    }
  }
  return fetch(src);
}

export function blobUrl(src: string): Promise<string> {
  const known = pending.get(src);
  if (known) return known;
  const work = fetchCached(src)
    .then((res) => {
      if (!res.ok || !isMedia(res)) throw new Error(res.status + ' ' + src);
      return res.blob();
    })
    .then(async (b) => {
      if (!b.size) throw new Error('empty ' + src);
      const url = URL.createObjectURL(b);
      // Decode images before handing them out, so they paint in one frame.
      if (b.type.startsWith('image/')) {
        const img = new Image();
        img.src = url;
        try {
          await img.decode();
          decoded.add(url);
        } catch {
          URL.revokeObjectURL(url);
          throw new Error('decode ' + src);
        }
      }
      ready.set(src, url);
      return url;
    });
  // Never leave a picture blank: if the blob route fails or is slow, use the file directly.
  const p = Promise.race([work, new Promise<string>((_, j) => setTimeout(() => j(new Error('slow')), TIMEOUT))]).catch(() => {
    pending.delete(src); // let a later render retry the blob route
    return src;
  });
  pending.set(src, p);
  return p;
}

/** Warm the cache for images the user is likely to see next. */
export const prefetch = (srcs: string[]) => {
  const run = () => srcs.forEach((s) => void blobUrl(s));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run);
  else setTimeout(run, 200);
};

/** True when src is already fetched and decoded, so it paints in the first frame. */
export const isReady = (src: string) => ready.has(src);

/** Resolves when every src is ready, or after cap ms, whichever comes first. */
export const whenReady = (srcs: string[], cap: number) =>
  Promise.race([Promise.all(srcs.map((s) => blobUrl(s))).then(() => undefined), new Promise<void>((r) => setTimeout(r, cap))]);

/** Returns a blob: URL for src (undefined while it loads). */
export function useBlobUrl(src: string | undefined): string | undefined {
  const [url, setUrl] = useState(() => (src ? ready.get(src) : undefined));
  useEffect(() => {
    if (!src) return setUrl(undefined);
    const hit = ready.get(src);
    if (hit) return setUrl(hit);
    setUrl(undefined);
    let live = true;
    blobUrl(src).then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
  }, [src]);
  return url;
}
