import type { Lang } from '../types';

// Interface labels in English and Hindi. Course content stays in English.
const STRINGS = {
  home: ['Home', 'होम'],
  courses: ['Courses', 'कोर्स'],
  dashboard: ['Dashboard', 'डैशबोर्ड'],
  myCourses: ['My courses', 'मेरे कोर्स'],
  calculator: ['AI Calculator', 'AI कैलकुलेटर'],
  announcements: ['Announcements', 'घोषणाएँ'],
  about: ['About Us', 'हमारे बारे में'],
  helpdesk: ['Helpdesk', 'हेल्पडेस्क'],
  policies: ['Policies', 'नीतियाँ'],
  contact: ['Contact Us', 'संपर्क करें'],
  purchases: ['My purchases', 'मेरी खरीदारी'],
  profile: ['Profile', 'प्रोफ़ाइल'],
  grades: ['Grades', 'ग्रेड'],
  calendar: ['Calendar', 'कैलेंडर'],
  files: ['Private files', 'निजी फ़ाइलें'],
  reports: ['Reports', 'रिपोर्ट'],
  preferences: ['Preferences', 'प्राथमिकताएँ'],
  language: ['Language', 'भाषा'],
  logout: ['Log out', 'लॉग आउट'],
  search: ['Search courses', 'कोर्स खोजें'],
  cart: ['Cart', 'कार्ट'],
  notifications: ['Notifications', 'सूचनाएँ'],
  course: ['Course', 'कोर्स'],
  updateAnswers: ['Update my answers', 'मेरे उत्तर बदलें'],
  noNotifications: ['You are all caught up.', 'कोई नई सूचना नहीं है।'],
  seeAll: ['See all announcements', 'सभी घोषणाएँ देखें'],
  certificates: ['Certificates', 'प्रमाणपत्र'],
  refer: ['Refer and Earn', 'रेफ़र करें और कमाएँ'],
  resume: ['Build Resume', 'रिज़्यूमे बनाएँ'],
  leaderboard: ['Leaderboard', 'लीडरबोर्ड'],
  showcase: ['Showcase', 'शोकेस'],
  support: ['Support', 'सहायता'],
} satisfies Record<string, [string, string]>;

export type StrKey = keyof typeof STRINGS;
export const LANGS: [Lang, string][] = [['en', 'English'], ['hi', 'हिन्दी']];
export const translate = (lang: Lang, key: StrKey): string => STRINGS[key][lang === 'hi' ? 1 : 0];
