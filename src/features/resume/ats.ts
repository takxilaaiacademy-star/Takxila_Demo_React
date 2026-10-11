/**
 * ATS (applicant tracking system) score. Pure and synchronous: give it the
 * text a parser would extract from a resume and it returns a 0-100 score, a
 * per-check breakdown and specific tips. Nothing leaves the browser.
 */

export type AtsSource = 'pdf' | 'docx' | 'txt' | 'builder';
export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface AtsCheck {
  id: string;
  label: string;
  status: CheckStatus;
  points: number;
  max: number;
  detail: string;
  tips: string[];
}

export interface AtsResult {
  score: number;
  band: 'excellent' | 'good' | 'fair' | 'poor';
  checks: AtsCheck[];
  keywords: { matched: string[]; missing: string[]; fromJob: boolean } | null;
  stats: { words: number; bullets: number; numbers: number; actionVerbs: number; sections: string[] };
  /** Notes that do not change the score (file type etc.) */
  notes: string[];
}

const ACTION_VERBS = [
  'achieved', 'analysed', 'analyzed', 'architected', 'automated', 'boosted', 'built', 'championed', 'coached', 'collaborated', 'conducted', 'configured', 'created',
  'cut', 'debugged', 'delivered', 'deployed', 'designed', 'developed', 'drove', 'enabled', 'engineered', 'established', 'evaluated', 'expanded', 'facilitated',
  'generated', 'grew', 'guided', 'handled', 'implemented', 'improved', 'increased', 'initiated', 'integrated', 'launched', 'led', 'managed', 'mentored', 'migrated',
  'modelled', 'modeled', 'negotiated', 'optimised', 'optimized', 'organised', 'organized', 'owned', 'planned', 'presented', 'produced', 'prototyped', 'reduced',
  'refactored', 'researched', 'resolved', 'scaled', 'saved', 'shipped', 'simplified', 'solved', 'spearheaded', 'streamlined', 'supported', 'tested', 'trained',
  'transformed', 'tuned', 'wrote', 'won', 'coordinated', 'curated', 'crafted', 'executed', 'fine-tuned', 'accelerated', 'audited', 'authored',
];
const VERB_SET = new Set(ACTION_VERBS);

/** Standard headings and the variants an ATS commonly maps to them. */
const SECTIONS: { id: string; label: string; weight: number; re: RegExp }[] = [
  { id: 'summary', label: 'Summary', weight: 4, re: /^(professional\s+)?(summary|profile|objective|about( me)?|career objective|professional profile)\b/i },
  { id: 'experience', label: 'Experience', weight: 5, re: /^(work\s+|professional\s+|relevant\s+)?(experience|employment( history)?|work history|internships?)\b/i },
  { id: 'education', label: 'Education', weight: 4, re: /^(education|academic( background| qualifications)?|qualifications)\b/i },
  { id: 'skills', label: 'Skills', weight: 4, re: /^((technical|key|core)\s+)?(skills|competencies|technologies|tech stack|skills? (&|and) tools)\b/i },
  { id: 'projects', label: 'Projects', weight: 2, re: /^((academic|personal|key)\s+)?projects?\b/i },
  { id: 'certs', label: 'Certifications', weight: 1, re: /^(certifications?|licen[cs]es?( (&|and) certifications)?|courses|achievements|awards)\b/i },
];

const STOP = new Set(
  (
    'a an and are as at be by for from has have in is it its of on or our that the to was we were will with you your this they their them who what when where which ' +
    'about across after all also am any can could do does each etc get how if into just more most must not now off only other out over per should so some such than ' +
    'then there these those through up us use using very via well while within without would able ability years year experience experienced strong good great excellent ' +
    'team teams work working role candidate candidates job position company looking join plus preferred required requirements responsibilities responsible including ' +
    'knowledge understanding skills skill familiarity familiar degree bachelor bachelors master new based environment etc opportunity opportunities apply ideal will ' +
    'hiring hire hires seeking seek join joining plus bonus nice wanted help make ensure across like within along day days week weeks month months high level levels multiple various key minimum least related relevant hands-on'
  ).split(/\s+/),
);

/** Multi-word skills worth matching as one phrase. */
const PHRASES = [
  'machine learning', 'deep learning', 'data analysis', 'data science', 'data visualization', 'natural language processing', 'computer vision', 'prompt engineering',
  'generative ai', 'large language models', 'power bi', 'google analytics', 'project management', 'customer service', 'problem solving', 'rest api', 'rest apis',
  'web development', 'react native', 'node.js', 'next.js', 'ci/cd', 'a/b testing', 'digital marketing', 'social media', 'content writing', 'microsoft excel',
  'business analysis', 'cloud computing', 'unit testing', 'version control', 'agile methodology', 'stakeholder management', 'ui/ux', 'search engine optimization',
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const has = (text: string, term: string) => new RegExp(`(^|[^a-z0-9+#])${escapeRe(term)}($|[^a-z0-9+#])`, 'i').test(text);

/** The most useful keywords in a job description (phrases first, then frequent terms). */
export function jobKeywords(jd: string, max = 24): string[] {
  const low = jd.toLowerCase();
  const found: string[] = PHRASES.filter((p) => has(low, p));
  const counts = new Map<string, number>();
  for (const raw of low.match(/[a-z][a-z0-9+#.\-/]*[a-z0-9+#]|[a-z]/g) ?? []) {
    const w = raw.replace(/\.$/, '');
    if (w.length < 2 || STOP.has(w) || /^\d/.test(w)) continue;
    if (w.length < 3 && !/^(ai|ml|ui|ux|qa|bi|js|go|r|c#|c\+\+)$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const inPhrase = (w: string) => found.some((p) => p.split(/\s+/).includes(w));
  const ranked = [...counts.entries()]
    .filter(([w]) => !inPhrase(w))
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([w]) => w);
  return [...found, ...ranked].slice(0, max);
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const status = (points: number, max: number): CheckStatus => (points >= max * 0.8 ? 'pass' : points >= max * 0.45 ? 'warn' : 'fail');

export function scoreResume(rawText: string, opts: { source?: AtsSource; jobDescription?: string } = {}): AtsResult {
  const text = rawText.replace(/\r\n?/g, '\n');
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const words = (text.match(/[A-Za-z0-9][\w'’+#./-]*/g) ?? []).length;
  const checks: AtsCheck[] = [];
  const notes: string[] = [];

  // ---- 1. Contact information (15)
  const email = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  const phone = /(\+?\d[\d\s().-]{8,}\d)/.test(text);
  const linkedin = /linkedin\.com\/|linkedin/i.test(text);
  const otherLink = /(github\.com|gitlab\.com|behance\.net|portfolio|https?:\/\/|www\.)/i.test(text);
  const contactPts = (email ? 6 : 0) + (phone ? 5 : 0) + (linkedin ? 4 : otherLink ? 2 : 0);
  checks.push({
    id: 'contact', label: 'Contact information', points: contactPts, max: 15, status: status(contactPts, 15),
    detail: [email ? 'Email found' : 'No email', phone ? 'phone found' : 'no phone', linkedin ? 'LinkedIn found' : otherLink ? 'a profile link (no LinkedIn)' : 'no LinkedIn'].join(', ') + '.',
    tips: [
      !email && 'Add a professional email address at the top.',
      !phone && 'Add a phone number with country code, e.g. +91 98765 43210.',
      !linkedin && 'Add your LinkedIn URL (linkedin.com/in/your-name); recruiters check it first.',
    ].filter(Boolean) as string[],
  });

  // ---- 2. Standard section headings (20)
  const headingLines = lines.filter((l) => l.length <= 48 && !/[.,;]$/.test(l));
  const found = SECTIONS.filter((s) => headingLines.some((l) => s.re.test(l.replace(/[:\-–—|]+$/, '').trim())));
  const sectionPts = found.reduce((n, s) => n + s.weight, 0);
  const missingSections = SECTIONS.filter((s) => !found.includes(s));
  checks.push({
    id: 'sections', label: 'Standard section headings', points: sectionPts, max: 20, status: status(sectionPts, 20),
    detail: found.length ? `Found: ${found.map((s) => s.label).join(', ')}.` : 'No standard headings found.',
    tips: missingSections
      .filter((s) => s.weight >= 2)
      .map((s) => `Add a "${s.label}" section with that exact heading so the ATS can file it.`)
      .concat(found.length < 3 ? ['Avoid creative headings like "My Journey"; ATS parsers look for standard names.'] : []),
  });

  // ---- 3. Length (10)
  const lenPts = words >= 350 && words <= 900 ? 10 : words >= 250 && words <= 1100 ? 7 : words >= 150 && words <= 1400 ? 4 : words > 0 ? 2 : 0;
  checks.push({
    id: 'length', label: 'Length', points: lenPts, max: 10, status: status(lenPts, 10),
    detail: `${words} words (aim for 350–900, about one page for freshers, two for senior roles).`,
    tips: words < 350 ? ['Add 2–4 bullet points per role or project describing what you did and the result.'] : words > 900 ? ['Trim older or less relevant items; keep the strongest 3–5 bullets per role.'] : [],
  });

  // ---- 4. Bullets and action verbs (15)
  const bulletRe = /^([•●▪◦·*\-–—>]|\d+[.)])\s+/;
  const bulletLines = lines.filter((l) => bulletRe.test(l));
  const firstWords = (bulletLines.length ? bulletLines : lines).map((l) => l.replace(bulletRe, '').split(/\s+/)[0]?.toLowerCase().replace(/[^a-z-]/g, '') ?? '');
  const verbsUsed = new Set(firstWords.filter((w) => VERB_SET.has(w)));
  const bulletPts = clamp(bulletLines.length, 0, 8) * 0.875;
  const verbPts = clamp(verbsUsed.size, 0, 6) * (8 / 6);
  const bvPts = Math.min(15, Math.round(bulletPts + verbPts));
  checks.push({
    id: 'bullets', label: 'Bullet points and action verbs', points: bvPts, max: 15, status: status(bvPts, 15),
    detail: `${bulletLines.length} bullet point${bulletLines.length === 1 ? '' : 's'}, ${verbsUsed.size} different action verb${verbsUsed.size === 1 ? '' : 's'}${verbsUsed.size ? ` (${[...verbsUsed].slice(0, 5).join(', ')})` : ''}.`,
    tips: [
      bulletLines.length < 6 && 'Write experience and projects as bullet points, one achievement per line.',
      verbsUsed.size < 5 && 'Start bullets with strong verbs: Built, Automated, Led, Reduced, Launched, Improved.',
    ].filter(Boolean) as string[],
  });

  // ---- 5. Quantified results (10)
  const numberHits = lines.filter((l) => /(\d+(\.\d+)?\s?(%|x\b|k\b|\+|lakh|crore|hrs?|hours|users|clients|students|projects|days|weeks|months)|[₹$€£]\s?\d|\b\d{2,}\b)/i.test(l) && !/@|\b(19|20)\d{2}\b.*\b(19|20)\d{2}\b|^\+?\d[\d\s-]{8,}$/.test(l));
  const qPts = numberHits.length >= 5 ? 10 : numberHits.length >= 3 ? 7 : numberHits.length >= 1 ? 4 : 0;
  checks.push({
    id: 'numbers', label: 'Quantified results', points: qPts, max: 10, status: status(qPts, 10),
    detail: `${numberHits.length} line${numberHits.length === 1 ? '' : 's'} with numbers, percentages or amounts.`,
    tips: numberHits.length < 5 ? ['Add measurable impact: "cut report time by 40%", "served 1,200 users", "saved ₹2 lakh a year".'] : [],
  });

  // ---- 6. Keywords (20)
  const jd = (opts.jobDescription ?? '').trim();
  let keywords: AtsResult['keywords'] = null;
  if (jd.length >= 40) {
    const terms = jobKeywords(jd);
    const matched = terms.filter((k) => has(text, k));
    const missing = terms.filter((k) => !matched.includes(k));
    const ratio = terms.length ? matched.length / terms.length : 0;
    const kPts = Math.round(clamp(ratio / 0.75, 0, 1) * 20);
    keywords = { matched, missing, fromJob: true };
    checks.push({
      id: 'keywords', label: 'Job description keywords', points: kPts, max: 20, status: status(kPts, 20),
      detail: `${matched.length} of ${terms.length} key terms from the job description appear in your resume (${Math.round(ratio * 100)}%).`,
      tips: missing.length ? [`Work these in where they are true for you: ${missing.slice(0, 8).join(', ')}.`, 'Mirror the exact wording of the job post (e.g. "Power BI", not just "BI").'] : [],
    });
  } else {
    // No job description: judge the skills list instead.
    const skillLine = lines.findIndex((l) => SECTIONS[3].re.test(l));
    const skillText = skillLine >= 0 ? lines.slice(skillLine, skillLine + 6).join(', ') : '';
    const items = skillText.split(/[,;|•\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40).length;
    const kPts = skillLine < 0 ? 4 : items >= 10 ? 18 : items >= 6 ? 14 : 9;
    checks.push({
      id: 'keywords', label: 'Skills keywords', points: kPts, max: 20, status: status(kPts, 20),
      detail: skillLine < 0 ? 'No skills list found.' : `About ${items} skills listed. Paste a job description for an exact keyword match.`,
      tips: [skillLine < 0 ? 'Add a Skills section listing tools and technologies, comma separated.' : items < 10 ? 'List 10–15 specific tools and skills (e.g. Python, ChatGPT API, Power BI, Zapier).' : '', 'Paste the job description below to see matched and missing keywords.'].filter(Boolean),
    });
  }

  // ---- 7. Readability for parsers (10)
  const longLines = lines.filter((l) => l.length > 220).length;
  const capsWords = (text.match(/\b[A-Z]{4,}\b/g) ?? []).filter((w) => !/^(HTML|JSON|AWS|GCP|REST|HTTP|HTTPS|SQL|NLP|MERN|SAAS|CRUD|UI|UX|API|APIS|IELTS|TOEFL|GPA|CGPA|MBA|BTECH|MTECH|BCA|MCA)$/.test(w));
  const capsRatio = words ? capsWords.length / words : 0;
  const odd = text.match(/[✀-➿☀-⛿-\u{1F300}-\u{1FAFF}★☆✓✔✗✘➤➢►▶❖◆◇■□]/gu) ?? [];
  const tableish = lines.filter((l) => (l.match(/\s{4,}|\t/g) ?? []).length >= 3).length;
  let rPts = 10;
  const rTips: string[] = [];
  if (longLines) { rPts -= Math.min(3, longLines); rTips.push(`${longLines} very long line${longLines > 1 ? 's' : ''}: split long paragraphs into short bullets.`); }
  if (capsRatio > 0.06) { rPts -= 3; rTips.push('Too much ALL CAPS text; use normal case for body text (headings are fine).'); }
  if (odd.length) { rPts -= Math.min(4, Math.ceil(odd.length / 3)); rTips.push(`Remove symbols ATS software mangles (${[...new Set(odd)].slice(0, 6).join(' ')}); use plain "•" bullets.`); }
  if (tableish > 2) { rPts -= 2; rTips.push('Looks like tables or columns. Use a single-column layout so the text is read in order.'); }
  rPts = clamp(rPts, 0, 10);
  checks.push({
    id: 'readability', label: 'Readability for ATS parsers', points: rPts, max: 10, status: status(rPts, 10),
    detail: rTips.length ? `${rTips.length} issue${rTips.length > 1 ? 's' : ''} found.` : 'Clean text: no long lines, heavy caps or special symbols.',
    tips: rTips,
  });

  // ---- File type (informational)
  const src = opts.source ?? 'txt';
  if (src === 'pdf') notes.push('PDF with selectable text: fine for most ATS. If a portal asks for Word, upload a .docx instead.');
  else if (src === 'docx') notes.push('DOCX: the most widely supported format for ATS portals.');
  else if (src === 'txt') notes.push('Plain text is easy to parse but looks plain to humans; send a PDF or DOCX when you apply.');
  else notes.push('Scored from your builder resume. Download it as PDF; it uses real, selectable text in one column.');

  const score = clamp(Math.round(checks.reduce((n, c) => n + c.points, 0)), 0, 100);
  return {
    score,
    band: score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor',
    checks,
    keywords,
    stats: { words, bullets: bulletLines.length, numbers: numberHits.length, actionVerbs: verbsUsed.size, sections: found.map((s) => s.label) },
    notes,
  };
}
