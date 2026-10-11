/**
 * Resume themes. One config object drives BOTH the HTML preview and the jsPDF
 * renderer, so what the learner sees is what they download.
 *
 * Every theme is ATS-safe: one column, standard headings, real text, standard
 * fonts (Helvetica / Times), no tables, icons or images in the text flow.
 * All sizes are in PDF points (1pt = 1/72in); the preview uses CSS `pt` too.
 */

export type PdfFont = 'helvetica' | 'times';
export type HeadingStyle = 'rule' | 'accent' | 'smallcaps' | 'hairline' | 'twotone';

export interface ResumeTheme {
  id: string;
  name: string;
  blurb: string;
  font: PdfFont;
  /** Name block alignment */
  align: 'left' | 'center';
  /** Professional: the name sits on a solid colour band at the top of page 1 */
  band: boolean;
  margin: { x: number; top: number; bottom: number };
  size: { name: number; role: number; contact: number; heading: number; body: number; title: number; meta: number };
  nameBold: boolean;
  nameUpper: boolean;
  /** Line height as a multiple of the font size */
  lh: number;
  /** Space before each section heading */
  sectionGap: number;
  /** Space between entries inside a section */
  entryGap: number;
  heading: HeadingStyle;
  headingUpper: boolean;
  color: {
    name: string;
    role: string;
    heading: string;
    rule: string;
    /** Second tone for the 'twotone' heading bar */
    rule2: string;
    text: string;
    muted: string;
    sub: string;
    band: string;
    bandText: string;
  };
}

const base = {
  band: false,
  margin: { x: 50, top: 46, bottom: 46 },
  nameBold: true,
  nameUpper: false,
  lh: 1.32,
  sectionGap: 13,
  entryGap: 7,
  headingUpper: true,
} as const;

export const THEMES: ResumeTheme[] = [
  {
    ...base,
    id: 'classic',
    name: 'Classic',
    blurb: 'Times serif, centred name, ruled headings',
    font: 'times',
    align: 'center',
    size: { name: 24, role: 12, contact: 10, heading: 11.5, body: 10.5, title: 11, meta: 10 },
    heading: 'rule',
    color: { name: '#111111', role: '#333333', heading: '#111111', rule: '#111111', rule2: '#111111', text: '#1A1A1A', muted: '#555555', sub: '#333333', band: '#FFFFFF', bandText: '#111111' },
  },
  {
    ...base,
    id: 'modern',
    name: 'Modern',
    blurb: 'Helvetica, left aligned, blue accent headings',
    font: 'helvetica',
    align: 'left',
    size: { name: 26, role: 12, contact: 9.5, heading: 11, body: 9.8, title: 10.5, meta: 9.2 },
    heading: 'accent',
    color: { name: '#0F172A', role: '#2563EB', heading: '#2563EB', rule: '#2563EB', rule2: '#2563EB', text: '#1E293B', muted: '#64748B', sub: '#2563EB', band: '#FFFFFF', bandText: '#0F172A' },
  },
  {
    ...base,
    id: 'professional',
    name: 'Professional',
    blurb: 'Navy name band, small-caps headings',
    font: 'helvetica',
    align: 'left',
    band: true,
    margin: { x: 46, top: 40, bottom: 44 },
    size: { name: 24, role: 11.5, contact: 9.2, heading: 10, body: 9.8, title: 10.5, meta: 9.2 },
    heading: 'smallcaps',
    color: { name: '#FFFFFF', role: '#C7D2FE', heading: '#1E3A5F', rule: '#CBD5E1', rule2: '#CBD5E1', text: '#1F2937', muted: '#6B7280', sub: '#1E3A5F', band: '#1E3A5F', bandText: '#E2E8F0' },
  },
  {
    ...base,
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Airy spacing, light name, hairline rules',
    font: 'helvetica',
    align: 'left',
    margin: { x: 62, top: 58, bottom: 54 },
    size: { name: 22, role: 11, contact: 9, heading: 8.8, body: 9.6, title: 10, meta: 8.8 },
    nameBold: false,
    lh: 1.48,
    sectionGap: 18,
    entryGap: 9,
    heading: 'hairline',
    color: { name: '#111827', role: '#6B7280', heading: '#6B7280', rule: '#D1D5DB', rule2: '#D1D5DB', text: '#262626', muted: '#8A8A8A', sub: '#525252', band: '#FFFFFF', bandText: '#111827' },
  },
  {
    ...base,
    id: 'executive',
    name: 'Executive',
    blurb: 'Bold serif name, two-tone maroon headings',
    font: 'times',
    align: 'left',
    size: { name: 28, role: 12.5, contact: 10, heading: 12, body: 10.5, title: 11.2, meta: 10 },
    nameUpper: true,
    heading: 'twotone',
    headingUpper: false,
    color: { name: '#1F2937', role: '#7F1D1D', heading: '#1F2937', rule: '#7F1D1D', rule2: '#D6D3D1', text: '#1C1917', muted: '#6B6B6B', sub: '#7F1D1D', band: '#FFFFFF', bandText: '#1F2937' },
  },
];

/** The sixth card: shown, but not selectable yet. */
export const COMING_SOON = { id: 'creative', name: 'Creative', blurb: 'Two-column layout with a photo' };

export const DEFAULT_THEME = THEMES[1];
export const themeById = (id: string | null | undefined): ResumeTheme => THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;

/** CSS font stacks that match the jsPDF built-in fonts. */
export const cssFont = (f: PdfFont) => (f === 'times' ? "'Times New Roman', Times, 'Liberation Serif', serif" : "Helvetica, Arial, 'Liberation Sans', sans-serif");

/** A4 in points */
export const PAGE = { w: 595.28, h: 841.89 };
