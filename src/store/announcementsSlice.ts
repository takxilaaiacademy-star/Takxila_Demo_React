import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Announcement } from '../types';
import { load } from '../utils/storage';

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

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState: { items: load<Announcement[] | null>('announcements', null) ?? SEED },
  reducers: {
    added: (s, a: PayloadAction<Announcement>) => {
      s.items.unshift(a.payload);
    },
    updated: (s, a: PayloadAction<{ id: string; patch: Partial<Announcement> }>) => {
      const x = s.items.find((i) => i.id === a.payload.id);
      if (x) Object.assign(x, a.payload.patch);
    },
    removed: (s, a: PayloadAction<string>) => {
      s.items = s.items.filter((i) => i.id !== a.payload);
    },
    replied: (s, a: PayloadAction<{ id: string; reply: Announcement['replies'][number] }>) => {
      s.items.find((i) => i.id === a.payload.id)?.replies.push(a.payload.reply);
    },
  },
});

export const announcementActions = announcementsSlice.actions;
export default announcementsSlice.reducer;
