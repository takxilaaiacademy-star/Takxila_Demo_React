export type CatId = 'challenge' | 'agents' | 'claude' | 'tools' | 'creative' | 'nocode' | 'business' | 'career' | 'film';
export type CatFilter = CatId | 'all' | 'free';

export interface CourseData {
  id: string;
  cat: CatId;
  title: string;
  short: string;
  desc: string;
  meta: string[];
  learn: string[];
  price: number;
  was: number | null;
  img: string;
  featured: boolean;
  tags: string[];
}

export interface Course extends CourseData {
  catLabel: string;
  /** 10-second summary video, rendered by tools/render-videos.mjs */
  video: string;
  /** Lower-cased text used by search, built once at load */
  search: string;
}

/** [value, label, tag weights, budget cap] */
export type QuizOption = [value: string, label: string, weights?: Record<string, number>, budgetCap?: number];

export interface Question {
  id: string;
  q: string;
  sub: string;
  opts: QuizOption[];
  only?: 'onboard';
  optional?: boolean;
  multi?: boolean;
  max?: number;
}

export type QuizMode = 'onboard' | 'calc';
export type Answers = Record<string, string | string[] | undefined>;

export interface QuizState {
  mode: QuizMode;
  step: number;
  ans: Answers;
}

export interface Recommendation {
  id: string;
  match: number;
  why: string[];
}

export interface Plan {
  ids: string[];
  n: number;
  total: number;
  save: number;
  hours: number;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passHash: string;
  createdAt: string;
  city?: string;
  bio?: string;
  /** Small JPEG data URL, resized in the browser before saving */
  avatar?: string;
  /** Referral code entered at sign-up */
  refBy?: string;
}
export type User = Omit<StoredUser, 'passHash'>;

export interface Session {
  email: string;
  loginAt: string;
  remember: boolean;
}

export interface Profile {
  ans: Answers;
  at: string;
}

export type Lang = 'en' | 'hi';

export interface Preferences {
  autoplay: boolean;
  reduceMotion: boolean;
  pageSize: number;
  lang: Lang;
  notify: boolean;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface Order {
  id: string;
  at: string;
  items: { id: string; price: number }[];
  total: number;
  subtotal?: number;
  discounts?: PriceLine[];
}

export interface ResumeEntry {
  title: string;
  sub: string;
  from: string;
  to: string;
  points: string;
}

export interface Resume {
  name: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  summary: string;
  links: { label: string; url: string }[];
  education: ResumeEntry[];
  work: ResumeEntry[];
  projects: ResumeEntry[];
  skills: string;
  soft: string;
  languages: string;
  certs: string;
}

/** A friend who enrolled with someone's referral code (tx_referrals, keyed by code) */
export interface ReferralRec {
  name: string;
  email: string;
  courses: string[];
  at: string;
  reward: number;
}

export type ActivityType = 'enroll' | 'lesson' | 'complete' | 'purchase';
export interface Activity {
  type: ActivityType;
  courseId: string;
  at: string;
  detail?: string;
}

/** Per-user data saved under tx_user_<email>. */
export interface UserData {
  cart: string[];
  owned: string[];
  /** Number of completed lessons per course (progress and grades come from this) */
  lessons: Record<string, number>;
  enrolledAt: Record<string, string>;
  profile: Profile | null;
  calc: Answers | null;
  recent: string[];
  orders: Order[];
  activity: Activity[];
  prefs: Preferences;
  /** When this user last opened the announcements */
  annSeen: string | null;
  /** Starred courses on the dashboard */
  favorites: string[];
  /** Days (YYYY-MM-DD) the user opened the app, for streaks */
  visits: string[];
  resume: Resume | null;
  withdrawals: { at: string; amount: number }[];
  /** The ₹200 friend discount from a referral code has been used */
  refUsed: boolean;
}

export interface Reply {
  id: string;
  author: string;
  body: string;
  at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  authorEmail: string;
  at: string;
  pinned?: boolean;
  replies: Reply[];
}

export interface PrivateFile {
  id: string;
  owner: string;
  name: string;
  type: string;
  size: number;
  at: string;
  blob: Blob;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  at: string;
}
