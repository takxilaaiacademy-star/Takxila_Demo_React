export type CatId =
  | "challenge"
  | "agents"
  | "claude"
  | "tools"
  | "creative"
  | "nocode"
  | "business"
  | "career"
  | "film";
export type GroupId = "challenge" | "agents" | "toolkit" | "career" | "film";
export type CatFilter = GroupId | "all" | "free";

export interface CourseData {
  id: string;
  cat: CatId;
  /** One of the five website categories */
  group: GroupId;
  /** Small line above the title on the card */
  kicker: string;
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

/** Admin changes to a course. Any field left out keeps its built-in value. */
export interface CourseEdit extends Partial<Omit<CourseData, "id">> {
  /** Summary video: a link or a small uploaded file */
  video?: string;
}
/** A course the admin created from the panel (not in src/data/courses.ts) */
export type CustomCourse = CourseData & { video?: string };

export interface Course extends CourseData {
  catLabel: string;
  /** 10-second summary video, rendered by tools/render-videos.mjs */
  video: string;
  /** Lower-cased text used by search, built once at load */
  search: string;
}

/** [value, label, tag weights, budget cap] */
export type QuizOption = [
  value: string,
  label: string,
  weights?: Record<string, number>,
  budgetCap?: number,
];

export interface Question {
  id: string;
  q: string;
  sub: string;
  opts: QuizOption[];
  only?: "onboard";
  optional?: boolean;
  multi?: boolean;
  max?: number;
}

export type QuizMode = "onboard" | "calc";
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
  /** Set when the account was created with Google, Facebook or Microsoft */
  provider?: "google" | "facebook" | "microsoft";
  /** 'admin' for the academy admin account (support@takxila.in) */
  role?: "admin";
}
export type User = Omit<StoredUser, "passHash">;

export interface Session {
  email: string;
  loginAt: string;
  remember: boolean;
}

export interface Profile {
  ans: Answers;
  at: string;
}

export type Lang =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "gu"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "pa"
  | "es_ar"
  | "es"
  | "fr_ca"
  | "fr"
  | "ru"
  | "ko"
  | "ja"
  | "zh_cn";

export interface Preferences {
  autoplay: boolean;
  reduceMotion: boolean;
  pageSize: number;
  lang: Lang;
  notify: boolean;
  /** Send emails about purchases, enrolments and completed courses */
  emails: boolean;
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
  /** Razorpay payment id, when the order was paid through Razorpay */
  paymentId?: string;
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

export type ActivityType = "enroll" | "lesson" | "complete" | "purchase";
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
  /** Bell notifications: purchases, enrolments, completed courses, certificates */
  notifications: AppNotification[];
  /** Announcements this user removed from the bell */
  dismissedAnns: string[];
}

export type NotificationKind =
  | "purchase"
  | "enroll"
  | "complete"
  | "certificate"
  | "info";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  /** Page to open when the notification is clicked */
  to?: string;
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
