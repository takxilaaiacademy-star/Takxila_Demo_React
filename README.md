# Takxila AI Academy (Vite + React + TypeScript + MUI)

A single-page app version of the Takxila demo site: 45 courses, categories, search, course pages,
cart with multi-select, dashboard and My courses, FAQ, an 11-question onboarding quiz with
recommendations, and the AI Course Calculator. Each course opens with a summary video, enrolled
courses have lessons and a Moodle-style grade report, and the profile menu has My purchases, Profile,
Grades, Calendar, Private files, Reports, Preferences and Language. Site announcements can be posted
from the app.

## Run it
Requires Node 20 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
npm run typecheck # tsc, no emit
npm run build     # tsc, then a production build in dist/
npm run preview   # serve the build at http://localhost:4173
```

The app opens on the public showcase page (`/`): an animated tour of the academy with the full course list,
challenges, combo packs, a comparison table and a learning-journey timeline. Visitors can preview any course
before signing up. **Log in / Start free** lead to the login page. Use the **Log in / Register** toggle to create an account
(any email and a 6+ character password). Everything after that needs a logged-in user.

## What is saved in localStorage
Every key starts with `tx_`:

| Key | What it holds |
| --- | --- |
| `tx_users` | Registered accounts: name, email, phone, hashed password, created date |
| `tx_session` | The logged-in user when "Keep me logged in" is ticked (otherwise kept in sessionStorage until the tab closes) |
| `tx_theme` | `dark` or `light` |
| `tx_last_email` | Last email used, pre-filled on the login form |
| `tx_user_<email>` | That user's cart, enrolled courses, completed lessons, orders, activity, profile (city, bio, photo), preferences, quiz and calculator answers, recently viewed courses |
| `tx_messages` | Messages sent from the Contact form |
| `tx_referrals` | Friends who enrolled with each referral code, and the ₹200 reward per friend |
| `tx_announcements` | Site announcements and their replies (shared by every account in this browser) |

Private files are stored in IndexedDB (database `tx_files`, 50 MB per file), in this browser only.

**Admin:** the first account registered in a browser is the admin. Only the admin sees
"Add announcement" and can pin or delete posts; everyone can reply.

This is a frontend-only demo login: the password is hashed with SHA-256 before saving, but anything
in the browser can be read by the user. Connect a real backend before taking payments or real accounts.

## Showcase, dashboard and rewards
- **Showcase page (`/`)**: motion effects in the style of Aceternity UI (spotlight, text generate, flip words,
  moving-border buttons, 3D tilt cards, infinite rows, scroll timeline, lamp, meteors, sparkles), rebuilt in
  `src/components/fx.tsx` with MUI and CSS, so there is no Tailwind or animation library to load.
  The previous home page is now at `/home`.
- **Dashboard** with a side menu: Dashboard, Certificates, Refer and Earn, Build Resume, Leaderboard, My purchases.
  It shows promo banners, enrolled courses (search, star, progress), a streak counter, a streak calendar,
  the leaderboard and numbered course picks.
- **Certificates**: completing every lesson issues a certificate with an ID made from the email and course
  (`TXC-…`). It downloads as a PNG, and the Verify box checks an ID against the accounts in this browser.
- **Refer and Earn**: each user gets a code. Signing up with `?ref=CODE` (or typing it) gives ₹200 off the first
  order and credits ₹200 to the friend's wallet, up to ₹1,000.
- **Resume builder**: form with a live A4 preview, saved per user. Download uses the browser's Save as PDF.
  Finished Takxila certificates are filled in for you.
- **Leaderboard**: learning hours from completed lessons (course length shared across its lessons), weekly and overall,
  with demo learners so it is never empty.
- **Pricing in the cart** (`src/data/showcase.ts`): combo packs, the All Access pack (₹4,999), 25% off any
  4+ other courses, then the referral discount. Pack contents, prices, the comparison rows and the demo
  leaderboard names all live in that file.
- The logo comes from `public/assets/logo-mark*.webp` and `logo-full*.webp` (the `-dark` files are recoloured for
  the dark theme).

## Round 5: login flow, mentorship, footer, covers
- **After login** you land on `/home` and the AI course calculator opens on top of it, every time.
  **Log out** returns to the public showcase page `/`.
- **Mentorship** (`/mentorship`, also in the dashboard menu, Contact menu and footer): topics, a booking form and
  your past requests. A floating chat button (bottom right, on every page) offers **Chat with a mentor** and
  **Chat on WhatsApp**. Contact details live in `src/utils/contact.ts`.
  - Mentor requests open the visitor's email app addressed to takxila.ai.academy@gmail.com with the subject and
    message filled in (`mailto:`); the visitor presses Send. A copy is kept in `tx_messages`. To send without the
    email app, post the same fields to a form service (for example FormSubmit or EmailJS) or your backend in
    `sendMentorMail`.
  - WhatsApp opens `https://wa.me/917992412683` with a prefilled message.
- **Footer** (`src/components/Footer.tsx`) matches the main website: Explore, Company, Legal, Support, Follow Us,
  a back-to-top button. The social links in `SOCIAL` are placeholders; put the academy's real profile URLs there.
- **Scroll animations were removed** (they hid cards and the footer on some screens). Content is always visible; a back-to-top button appears after scrolling down.
- **Themed scrollbars** (gold in dark mode, indigo in light) in `src/theme/theme.ts`.
- **Languages**: English, Hindi, Bengali, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam and Punjabi for menus
  and navigation (`src/data/i18n.ts`). Course content stays in English.
- **Course covers**: 40 courses have their own generated cover in `public/assets/covers/<id>.webp`, each showing what
  the course is about (chat, terminal, spreadsheet, video editor, ads, SEO results, kanban, avatar and so on).
  The 5 courses with real photo banners keep them. The design is `tools/covers.html`; regenerate with
  `node tools/render-covers.mjs [course-id ...]` (needs Playwright). The summary videos were re-rendered with them.

## Round 6: login page, email, loaders, speed

### Social sign-in (Gmail, Facebook, Microsoft)
The buttons work once you give the app your own app IDs. Copy `.env.example` to `.env` (next to `package.json`) and fill it in:

```
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_MICROSOFT_CLIENT_ID=your-azure-application-client-id
```

Then rebuild (`npm run build`). In each provider console, add this redirect URI (use your real domain, and
`http://localhost:5173/oauth-callback.html` for local testing):

`https://YOUR-DOMAIN/oauth-callback.html`

- **Google**: Google Cloud console, APIs & Services, Credentials, OAuth client ID of type "Web application".
  Add your domain under Authorised JavaScript origins and the URI above under Authorised redirect URIs.
- **Facebook**: developers.facebook.com, create an app with Facebook Login, add the URI under
  Valid OAuth Redirect URIs and request the `email` permission.
- **Microsoft**: Azure portal, App registrations, new registration for "Accounts in any organizational directory and
  personal Microsoft accounts". Add a Web platform redirect with the URI above and tick "ID tokens".

Until an ID is set, the button opens a short dialog saying which line is missing. The sign-in runs in a popup
(`src/utils/social.ts`, `public/oauth-callback.html`). As with the rest of this demo, accounts are stored in the
browser and the token is not checked by a server, so add a backend before relying on it for real accounts.

### Forms send email to takxila.ai.academy@gmail.com
The Contact form, the mentor form, the chat widget and "Lost password?" send their message through
[FormSubmit](https://formsubmit.co) (`src/utils/mail.ts`), with no server needed. **The first time anyone sends a
form, FormSubmit emails takxila.ai.academy@gmail.com an activation link. Click it once**; from then on every
message arrives in that inbox. If the service cannot be reached, the visitor's email app opens with the message
filled in instead. To change the inbox, edit `INBOX` in `src/utils/mail.ts`.

### Login page blocks
Below the login card: Latest announcements, a calendar (today highlighted, dots on announcement days) and a
visitor counter. The counter uses the free counterapi.dev service (`VisitorCounter` in
`src/components/AuthExtras.tsx`) and falls back to a count for this browser if that service is blocked.
"I'm not a robot" is a simple tick box, not a real CAPTCHA; swap in Google reCAPTCHA or Cloudflare Turnstile
if you add a backend.

### Loader, theme and catalog speed
- Every page shows a full-page loader (logo spinner plus a progress bar) until its content and the images on
  screen are ready; the footer appears only after the page, never on its own.
- The dark/light switch now changes instantly (no colour fade across hundreds of elements).
- Course covers are WebP (about 60% smaller). All 45 covers are fetched once in the background when the
  catalog opens, so changing page, filter or sort is instant. While a page of covers is still loading,
  skeleton cards and a "Loading courses…" spinner show that the courses are on their way.
- The mentor chat's Topic dropdown no longer closes the chat when you pick an option.

## Speed and media
- Every image and video is fetched once, stored in the Cache API (`tx-media-v2`) and shown from a
  `blob:` URL (`src/utils/media.ts`), so revisits and page changes don't reload them. Images are decoded
  before they are shown, so a revisited page paints them in the first frame. Anything that is not an image
  or video is never cached, and if the blob route fails or takes over 6 seconds the image loads straight from its file.
- Pages are code-split and preloaded when the browser is idle; the next page of course banners is prefetched.
- The catalog is paginated (6/9/12/24 per page, set in Preferences). Search is deferred and runs over a
  prebuilt lowercase index, so typing never blocks. Category, sort, search and page live in the URL.
- Course cards are memoized and the store's actions are stable, so only the card that changed re-renders.
- Animations (page transitions, staggered cards, scroll reveal, count-up stats, confetti on enrol,
  checkout and course completion) can be switched off with **Preferences → Reduce motion**.

## Course summary videos
`public/media/videos/<id>.mp4` (H.264) and `<id>.webm` (VP9), 10 seconds each, are generated from the
course banner and details. The player uses MP4 where the browser supports H.264 and WebM otherwise.
To use a real recording, replace both files for that course id. To regenerate them:

```bash
npm i -D playwright      # plus ffmpeg on PATH
node tools/render-videos.mjs            # all courses
node tools/render-videos.mjs claude-code film-1
```

## Grades
Each lesson of a course is a grade item with equal weight. Marking a lesson complete scores it 100;
the course total is the weighted sum, shown on the course's Grades tab and on the Grades overview.

## Project layout
- `src/main.tsx` – providers (router, theme, auth, store)
- `src/App.tsx` – routes; everything except `/auth` is behind `ProtectedRoute`
- `src/types.ts` – the shared types: `Course`, `Question`, `Answers`, `Recommendation`, `StoredUser`, `UserData` and the rest
- `src/context/` – `AuthContext` (register, login, logout, change password, admin), `ThemeModeContext` (dark/light, animation keyframes), `StoreContext` (cart, courses, lessons, orders, preferences, quiz, toasts), `AnnouncementsContext`
- `src/theme/theme.ts` – MUI theme with the navy/gold (dark) and lavender/indigo (light) palettes; it augments MUI's `Theme` so `theme.tx.*` is typed
- `src/data/courses.ts` – the 45 courses (generated from `takxila-site/tools/courses.py`)
- `src/data/quiz.ts` – question bank for onboarding and the calculator; `src/data/recommend.ts` – scoring and plan totals
- `src/data/curriculum.ts` – lessons, progress and grade report; `src/data/i18n.ts` – English/Hindi menu labels
- `src/components/` – Layout (header, bell, profile menu), CourseCard, Media (blob images, video), Preview dialog, GradeReport, Motion, Confetti
- `src/pages/` – Auth, Home, Courses, CourseDetail, Cart, Dashboard, MyCourses, Calculator, Announcements, About, Helpdesk, Contact, Policies
- `src/pages/account/` – Purchases, Profile, Grades, Calendar, Files, Reports, Preferences
- `tools/` – the video template and renderer
- `public/assets/` – logos, hero images and course banners

## TypeScript
The whole app is TypeScript with `strict` on, plus `noUnusedLocals` and `noUnusedParameters`; there are no
`any` casts and no `@ts-ignore`. `npm run build` type-checks first, so a type error fails the build.
`useAuth`, `useStore` and `useThemeMode` throw if used outside their provider, so they never return null;
pages behind the login use `useUser()`, which gives a `User` rather than `User | null`.

## Routes
`/` (public showcase), `/auth` (`?ref=CODE`), `/home`, `/courses` (`?cat=claude&sort=low&page=2&q=agent&view=list`), `/courses/:id`, `/courses/:id/grades`, `/cart`,
`/dashboard`, `/certificates`, `/refer`, `/resume`, `/leaderboard`, `/mentorship`, `/my-courses`, `/calculator`, `/announcements`, `/purchases`, `/profile`, `/grades`, `/calendar`,
`/files`, `/reports`, `/preferences`, `/about`, `/helpdesk`, `/contact`, `/policies`.

## Deploying
It uses browser routes, so the host must send unknown paths to `index.html`.
`public/_redirects` already does this for Netlify. On Vercel add a rewrite to `/index.html`;
on Apache/Nginx add the usual SPA fallback.
