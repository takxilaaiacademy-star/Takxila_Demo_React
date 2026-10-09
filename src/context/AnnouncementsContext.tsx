import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Announcement } from '../types';
import { load, save } from '../utils/storage';

// Site announcements are shared by every account in this browser (tx_announcements).
const SEED: Announcement[] = [
  {
    id: 'seed-launch',
    title: 'New AI Mastery Courses Launched',
    author: 'Admin User',
    authorEmail: 'admin@takxila.in',
    at: '2026-09-06T17:23:00.000Z',
    pinned: true,
    replies: [],
    body: [
      '**New Courses Launched :**',
      '',
      '1. Launched new course on- **Building Bulk WhatsApp Ai Agent** : Enrol and develop your own Bulk WhatsApp Agent : /courses/wa-agent',
      '2. Launched - **Advanced Level Midjourney Mastery Course** - join now and Course : /courses/mj-advanced',
      '3. Launched - **THE COMPLETE GENERATIVE AI MASTERY** , Join Now /courses/genai-complete',
      '4. Launched - **AI Powered Facebook Ads & Instagram Ads**, Join now and start your FB and IG Ads /courses/meta-ads',
      '5. Launched: **AI Agents & Agentic AI Mastery to Build Intelligent Autonomous Systems**, Join now and start Building Intelligent Autonomous Systems: /courses/agentic',
    ].join('\n'),
  },
];

interface AnnValue {
  items: Announcement[];
  add: (a: Omit<Announcement, 'id' | 'at' | 'replies'>) => void;
  update: (id: string, patch: Partial<Announcement>) => void;
  remove: (id: string) => void;
  reply: (id: string, author: string, body: string) => void;
}

const AnnContext = createContext<AnnValue | null>(null);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Announcement[]>(() => load<Announcement[] | null>('announcements', null) ?? SEED);
  useEffect(() => save('announcements', items), [items]);
  const value = useMemo<AnnValue>(
    () => ({
      items: [...items].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at)),
      add: (a) => setItems((l) => [{ ...a, id: crypto.randomUUID(), at: new Date().toISOString(), replies: [] }, ...l]),
      update: (id, patch) => setItems((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      remove: (id) => setItems((l) => l.filter((x) => x.id !== id)),
      reply: (id, author, body) =>
        setItems((l) => l.map((x) => (x.id === id ? { ...x, replies: [...x.replies, { id: crypto.randomUUID(), author, body, at: new Date().toISOString() }] } : x))),
    }),
    [items],
  );
  return <AnnContext.Provider value={value}>{children}</AnnContext.Provider>;
}

export function useAnnouncements(): AnnValue {
  const ctx = useContext(AnnContext);
  if (!ctx) throw new Error('useAnnouncements must be used inside AnnouncementsProvider');
  return ctx;
}
