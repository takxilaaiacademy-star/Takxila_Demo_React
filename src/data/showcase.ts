import type { Activity, Course, PriceLine } from "../types";
import { COURSES } from "./courses";
import { courseById } from "./recommend";
import { lessonsFor } from "./curriculum";

// ---------- Course length ----------

/** Course length in hours, read from its meta ("12+ Hours", "30 Min", "28 Days"). */
export function hoursOf(c: Course): number {
  const m = c.meta.join(" ");
  const h = /(\d+)\+?\s*Hours/i.exec(m);
  if (h) return +h[1];
  const min = /(\d+)\s*Min/i.exec(m);
  if (min) return +min[1] / 60;
  const d = /(\d+)\s*Days/i.exec(m);
  if (d) return +d[1]; // challenges: about an hour a day
  return 6;
}

export function durationText(c: Course): string {
  const m = c.meta.join(" ");
  const d = /(\d+)\s*Days/i.exec(m);
  if (d) return d[1] + " days";
  const h = hoursOf(c);
  if (h < 1) return Math.round(h * 60) + " min";
  return h + (/\+\s*Hours/i.test(m) ? "+" : "") + " hours";
}

/** Hours of learning one lesson of this course is worth. */
export const hoursPerLesson = (c: Course) => hoursOf(c) / lessonsFor(c).length;

// ---------- Combo packs and plans ----------

export type PackGroup = "build" | "create" | "market" | "career";
export const PACK_GROUPS: [PackGroup | "all", string][] = [
  ["all", "All"],
  ["build", "Agents & Building"],
  ["create", "Creative & Film"],
  ["market", "Marketing & Business"],
  ["career", "Career & Productivity"],
];

export interface Pack {
  id: string;
  title: string;
  group: PackGroup;
  courses: string[];
  price: number;
  rating: number;
}

/** Pack price: 30% off the courses' own prices, ending in 9 (so it always beats the 25% customized pack). */
const packPrice = (ids: string[]) =>
  Math.round(
    (ids.reduce((a, id) => a + (courseById(id)?.price ?? 0), 0) * 0.7) / 10,
  ) *
    10 -
  1;

export const PACKS: Pack[] = (
  [
    {
      id: "agent-builder",
      title: "AI Agent Builder",
      group: "build",
      courses: ["agentic", "wa-mastery", "claude-code", "job-agent"],
      rating: 4.9,
    },
    {
      id: "claude-pro",
      title: "Claude Pro",
      group: "build",
      courses: ["claude-master", "claude-code", "claude-deep", "claude-excel"],
      rating: 4.8,
    },
    {
      id: "nocode-founder",
      title: "No-Code Founder",
      group: "build",
      courses: ["lovable", "nocode-web", "wa-mastery", "ai-pm"],
      rating: 4.7,
    },
    {
      id: "content-creator",
      title: "AI Content Creator",
      group: "create",
      courses: ["omni-master", "mj-advanced", "kling-master", "canva-ai"],
      rating: 4.8,
    },
    {
      id: "filmmaker",
      title: "AI Filmmaker",
      group: "create",
      courses: [
        "film-1",
        "film-2",
        "film-3",
        "film-4",
        "film-5",
        "film-6",
        "film-7",
        "film-8",
        "film-9",
      ],
      rating: 4.9,
    },
    {
      id: "marketer",
      title: "AI Marketer",
      group: "market",
      courses: ["ai-marketing", "meta-ads", "gads-mastery", "ai-seo"],
      rating: 4.7,
    },
    {
      id: "business",
      title: "AI for Business",
      group: "market",
      courses: ["ai-finance", "ai-pm", "ai-projects", "claude-excel"],
      rating: 4.6,
    },
    {
      id: "power-user",
      title: "AI Power User",
      group: "career",
      courses: [
        "chatgpt-deep",
        "gemini",
        "perplexity",
        "deepseek",
        "genai-complete",
      ],
      rating: 4.8,
    },
    {
      id: "career-starter",
      title: "Career Starter",
      group: "career",
      courses: ["portfolio", "job-agent", "ready", "chatgpt-deep"],
      rating: 4.7,
    },
  ] as Omit<Pack, "price">[]
).map((p) => ({ ...p, price: packPrice(p.courses) }));

export const packById = (id: string) => PACKS.find((p) => p.id === id);
export const PAID = COURSES.filter((c) => c.price > 0);
/** Called when the admin changes prices or adds courses, so the "All Access" lists stay right. */
export const refreshPaid = () => {
  PAID.length = 0;
  PAID.push(...COURSES.filter((c) => c.price > 0));
};
export const listPrice = (ids: string[]) =>
  ids.reduce((a, id) => a + (courseById(id)?.price ?? 0), 0);
export const packList = (p: Pack) => listPrice(p.courses);

export const ALL_ACCESS_PRICE = 4999;
export const CUSTOM_MIN = 4;
export const CUSTOM_OFF = 0.25;
export const REFERRAL_REWARD = 200;
export const REFERRAL_LIMIT = 1000;

/**
 * Prices a cart. Order of discounts:
 * 1. every paid course still to buy is in the cart -> All Access price
 * 2. complete combo packs -> pack price (scaled down if some pack courses are already owned)
 * 3. 4 or more other courses -> 25% off them ("Customized pack")
 * 4. referral code on a first order -> ₹200 off
 */
export function priceCart(cart: string[], owned: string[], referral: boolean) {
  const ids = cart.filter((id) => !owned.includes(id));
  const subtotal = listPrice(ids);
  const lines: PriceLine[] = [];
  const toBuy = PAID.filter((c) => !owned.includes(c.id)).map((c) => c.id);
  if (
    ids.length &&
    toBuy.length > CUSTOM_MIN &&
    toBuy.every((id) => ids.includes(id))
  ) {
    const full = listPrice(PAID.map((c) => c.id));
    const price = Math.round((ALL_ACCESS_PRICE * subtotal) / full);
    lines.push({ label: "All Access pack", amount: subtotal - price });
  } else {
    let rest = ids.slice();
    const packs = PACKS.map((p) => {
      const left = p.courses.filter((id) => !owned.includes(id));
      const list = listPrice(left);
      return {
        p,
        left,
        save: list - Math.round((p.price * list) / packList(p)),
      };
    })
      .filter((x) => x.left.length > 1)
      .sort((a, b) => b.save - a.save);
    packs.forEach(({ p, left, save }) => {
      if (left.every((id) => rest.includes(id))) {
        lines.push({ label: p.title + " combo pack", amount: save });
        rest = rest.filter((id) => !left.includes(id));
      }
    });
    if (
      rest.filter((id) => (courseById(id)?.price ?? 0) > 0).length >= CUSTOM_MIN
    ) {
      lines.push({
        label: `Customized pack (${rest.length} courses, 25% off)`,
        amount: Math.round(listPrice(rest) * CUSTOM_OFF),
      });
    }
  }
  let total = subtotal - lines.reduce((a, l) => a + l.amount, 0);
  if (referral && total > REFERRAL_REWARD) {
    lines.push({ label: "Referral discount", amount: REFERRAL_REWARD });
    total -= REFERRAL_REWARD;
  }
  return { ids, subtotal, lines, total };
}

// ---------- Comparison table ----------

export const COMPARE_COLS = ["Takxila", "YouTube", "Other platforms"] as const;
export const COMPARE_PRICE = ["₹159 – ₹399", "FREE", "₹10K – 50K"];
export const COMPARE_ROWS: [
  feature: string,
  takxila: boolean,
  youtube: boolean,
  others: boolean,
][] = [
  ["Affordable for everyone", true, true, false],
  ["Step-by-step structured path", true, false, true],
  ["Hands-on projects in every course", true, false, true],
  ["Certificate with a unique ID", true, false, true],
  ["Progress tracking and grades", true, false, true],
  ["Learning streaks and leaderboard", true, false, false],
  ["Course summary video before you buy", true, true, false],
  ["Hindi menus and regional-language challenges", true, false, false],
];
export const COMPARE_SAVE = 50000 - 499;

// ---------- Challenges ----------

export const challengeDays = (c: Course) =>
  +(/(\d+)\s*Days/i.exec(c.meta.join(" "))?.[1] ?? 0);
export const isChallenge = (c: Course) => challengeDays(c) > 0;

export function howItWorks(
  c: Course,
): [title: string, hl: string, rest: string][] {
  const d = challengeDays(c);
  if (d)
    return [
      [
        "Join the challenge ",
        "by paying " + (c.price ? "₹" + c.price : "nothing"),
        "",
      ],
      ["Complete the ", "daily missions", ` in ${d} days`],
      ["Earn your ", "certificate", " and a leaderboard rank"],
    ];
  return [
    ["Enroll in ", "the course", c.price ? " for ₹" + c.price : " for free"],
    ["Finish the ", "lessons and projects", " at your pace"],
    ["Get a ", "certificate", " you can verify by its ID"],
  ];
}

export const PERKS: string[] = [
  "End-to-end curriculum: beginner to advanced",
  "Help with resume building and portfolio",
  "Notes, resources and project files",
  "Certificate with a unique verifiable ID",
  "Hands-on project after every module",
  "Grades, streaks and a learning leaderboard",
  "1:1 guidance through the Helpdesk",
];

export const COURSE_FAQ: [q: string, a: string][] = [
  [
    "Why take this course?",
    "Every lesson is practical and ends in something you can use. You learn with the real tools, step by step, and track your progress on your dashboard.",
  ],
  [
    "What is the benefit for me?",
    "You finish with working projects, a certificate you can share, and skills you can use at work or in your own business straight away.",
  ],
  [
    "How long do I have to finish?",
    "Learn at your own pace. Your progress, grades and streak are saved on your account.",
  ],
  [
    "Do I get a certificate?",
    "Yes. Complete every lesson and a certificate with a unique ID appears under Certificates, ready to download.",
  ],
];

// ---------- Leaderboard ----------

/** Demo learners so the leaderboard is never empty. Hours: [this week, overall]. */
export const LEADERS: [name: string, week: number, overall: number][] = [
  ["Ananya Iyer", 21, 412],
  ["Rohan Mehta", 18, 365],
  ["Priya Nair", 24, 331],
  ["Arjun Reddy", 12, 298],
  ["Sneha Kulkarni", 16, 244],
  ["Vikram Singh", 9, 207],
  ["Kavya Sharma", 14, 176],
  ["Aditya Rao", 7, 151],
  ["Meera Pillai", 11, 123],
  ["Siddharth Jain", 5, 98],
  ["Ishita Bose", 8, 74],
  ["Karan Malhotra", 4, 52],
];

/** Learning hours from completed lessons; `since` limits it to recent lessons. */
export function hoursFrom(activity: Activity[], since?: number): number {
  return activity.reduce((a, x) => {
    if (x.type !== "lesson") return a;
    if (since && new Date(x.at).getTime() < since) return a;
    const c = courseById(x.courseId);
    return a + (c ? hoursPerLesson(c) : 0);
  }, 0);
}

// ---------- Streaks ----------

export const dayKey = (d: Date) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

/** Days with learning activity or a visit. */
export function activeDays(
  activity: Activity[],
  visits: string[],
): Set<string> {
  const s = new Set(visits);
  activity.forEach((a) => s.add(dayKey(new Date(a.at))));
  return s;
}

export function streaks(days: Set<string>): {
  current: number;
  longest: number;
} {
  const d = new Date();
  let current = 0;
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1); // today not done yet: count up to yesterday
  while (days.has(dayKey(d))) {
    current++;
    d.setDate(d.getDate() - 1);
  }
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  sorted.forEach((k) => {
    const cur = new Date(k + "T00:00:00");
    run = prev && (cur.getTime() - prev.getTime()) / 864e5 === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = cur;
  });
  return { current, longest: Math.max(longest, current) };
}

// ---------- Codes ----------

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Referral code: first letters of the name plus 4 characters from the email. */
export function referralCode(name: string, email: string): string {
  const letters = (
    name.replace(/[^a-z]/gi, "").slice(0, 4) || "TX"
  ).toUpperCase();
  return (
    letters + hash(email.toLowerCase()).toString(36).slice(0, 4).toUpperCase()
  );
}

/** Certificate ID for one learner and one course, the same every time. */
export const certificateId = (email: string, courseId: string) =>
  "TXC-" +
  hash(email.toLowerCase() + "|" + courseId)
    .toString(36)
    .toUpperCase()
    .padStart(7, "0");
