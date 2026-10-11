import { useMemo } from 'react';
import type { Announcement } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { announcementActions as A } from '../store/announcementsSlice';

/** Site announcements (shared by every account in this browser), read from the Redux store. */
interface AnnValue {
  /** Pinned first, then newest first */
  items: Announcement[];
  add: (a: Omit<Announcement, 'id' | 'at' | 'replies'>) => void;
  update: (id: string, patch: Partial<Announcement>) => void;
  remove: (id: string) => void;
  reply: (id: string, author: string, body: string) => void;
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export function useAnnouncements(): AnnValue {
  const dispatch = useAppDispatch();
  const raw = useAppSelector((s) => s.announcements.items);
  const items = useMemo(() => [...raw].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at)), [raw]);
  const actions = useMemo(
    () => ({
      add: (a: Omit<Announcement, 'id' | 'at' | 'replies'>) => dispatch(A.added({ ...a, id: uid(), at: new Date().toISOString(), replies: [] })),
      update: (id: string, patch: Partial<Announcement>) => dispatch(A.updated({ id, patch })),
      remove: (id: string) => dispatch(A.removed(id)),
      reply: (id: string, author: string, body: string) => dispatch(A.replied({ id, reply: { id: uid(), author, body, at: new Date().toISOString() } })),
    }),
    [dispatch],
  );
  return useMemo(() => ({ items, ...actions }), [items, actions]);
}
