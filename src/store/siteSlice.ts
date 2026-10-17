import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CourseContent } from '../data/courseContent';
import type { CourseEdit, CustomCourse } from '../types';
import { load } from '../utils/storage';

/**
 * Everything the admin changes from the website itself (no code needed).  -> tx_site
 *
 *   courseEdits     changes to the built-in courses (title, price, image, video, what you learn ...)
 *   customCourses   courses the admin created from Admin > Courses
 *   hiddenCourses   built-in courses taken off the catalog
 *   contentEdits    the course page text: sections, lectures, requirements, description ...
 *   openCourses     courses everybody who has an account can watch for free (open access)
 *   navHidden       navbar items hidden from learners
 *   navLabels       renamed navbar items (learners see the new name)
 *   banner          the announcement strip shown at the top of every page
 *
 * Frontend-only: this is saved in the browser the admin uses. To make the changes appear on every
 * visitor's device, connect a server (see "BACKEND HOOK" in src/store/index.ts) or use Admin > Backup.
 */
export interface SiteBanner {
  show: boolean;
  text: string;
  link: string;
}

export interface SiteData {
  courseEdits: Record<string, CourseEdit>;
  customCourses: CustomCourse[];
  hiddenCourses: string[];
  contentEdits: Record<string, Partial<CourseContent>>;
  openCourses: string[];
  navHidden: string[];
  navLabels: Record<string, string>;
  banner: SiteBanner;
}

export const EMPTY_SITE: SiteData = {
  courseEdits: {},
  customCourses: [],
  hiddenCourses: [],
  contentEdits: {},
  openCourses: [],
  navHidden: [],
  navLabels: {},
  banner: { show: false, text: '', link: '' },
};

/** Fills anything missing, so an old or imported file can never break the site. */
export const cleanSite = (x: Partial<SiteData> | null | undefined): SiteData => ({
  ...EMPTY_SITE,
  ...(x ?? {}),
  banner: { ...EMPTY_SITE.banner, ...(x?.banner ?? {}) },
});

interface SiteState extends SiteData {
  /** Goes up on every change: pages watch it to redraw, and the saver watches it to write tx_site */
  rev: number;
  /** Course id (or 'new') open in the course editor; not saved */
  editing: string | null;
}

const initialState: SiteState = { ...cleanSite(load<Partial<SiteData> | null>('site', null)), rev: 0, editing: null };

/** The part of the state that is saved. */
export const siteDataOf = (s: SiteState): SiteData => ({
  courseEdits: s.courseEdits,
  customCourses: s.customCourses,
  hiddenCourses: s.hiddenCourses,
  contentEdits: s.contentEdits,
  openCourses: s.openCourses,
  navHidden: s.navHidden,
  navLabels: s.navLabels,
  banner: s.banner,
});

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    courseEdited: (s, a: PayloadAction<{ id: string; patch: CourseEdit }>) => {
      s.courseEdits[a.payload.id] = { ...s.courseEdits[a.payload.id], ...a.payload.patch };
      s.rev++;
    },
    courseAdded: (s, a: PayloadAction<CustomCourse>) => {
      if (!s.customCourses.some((c) => c.id === a.payload.id)) s.customCourses.push(a.payload);
      s.rev++;
    },
    /** Custom course: deleted for good. Built-in course: taken off the catalog (it can be restored). */
    courseRemoved: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      if (s.customCourses.some((c) => c.id === id)) {
        s.customCourses = s.customCourses.filter((c) => c.id !== id);
        delete s.courseEdits[id];
        delete s.contentEdits[id];
        s.openCourses = s.openCourses.filter((x) => x !== id);
      } else if (!s.hiddenCourses.includes(id)) s.hiddenCourses.push(id);
      s.rev++;
    },
    /** Show a hidden course again, and (optionally) throw away the admin's edits so it is back to the original. */
    courseRestored: (s, a: PayloadAction<{ id: string; resetEdits?: boolean }>) => {
      s.hiddenCourses = s.hiddenCourses.filter((x) => x !== a.payload.id);
      if (a.payload.resetEdits) {
        delete s.courseEdits[a.payload.id];
        delete s.contentEdits[a.payload.id];
      }
      s.rev++;
    },
    /** Admin > course editor > Course visibility: Show / Hide, for built-in and created courses alike. */
    visibilitySet: (s, a: PayloadAction<{ id: string; hidden: boolean }>) => {
      const rest = s.hiddenCourses.filter((x) => x !== a.payload.id);
      s.hiddenCourses = a.payload.hidden ? [...rest, a.payload.id] : rest;
      s.rev++;
    },
    contentEdited: (s, a: PayloadAction<{ id: string; patch: Partial<CourseContent> }>) => {
      s.contentEdits[a.payload.id] = { ...s.contentEdits[a.payload.id], ...a.payload.patch };
      s.rev++;
    },
    openSet: (s, a: PayloadAction<{ ids: string[]; open: boolean }>) => {
      const set = new Set(s.openCourses);
      a.payload.ids.forEach((id) => (a.payload.open ? set.add(id) : set.delete(id)));
      s.openCourses = [...set];
      s.rev++;
    },
    navHiddenSet: (s, a: PayloadAction<{ key: string; hidden: boolean }>) => {
      const set = new Set(s.navHidden);
      if (a.payload.hidden) set.add(a.payload.key);
      else set.delete(a.payload.key);
      s.navHidden = [...set];
      s.rev++;
    },
    navLabelSet: (s, a: PayloadAction<{ key: string; label: string }>) => {
      const label = a.payload.label.trim();
      if (label) s.navLabels[a.payload.key] = label;
      else delete s.navLabels[a.payload.key];
      s.rev++;
    },
    bannerSet: (s, a: PayloadAction<Partial<SiteBanner>>) => {
      s.banner = { ...s.banner, ...a.payload };
      s.rev++;
    },
    /** Admin > Backup: put back a file exported earlier. */
    siteReplaced: (s, a: PayloadAction<Partial<SiteData>>) => {
      Object.assign(s, cleanSite(a.payload));
      s.rev++;
    },
    /** Admin > Backup: undo every admin change and go back to the built-in site. */
    siteReset: (s) => {
      Object.assign(s, EMPTY_SITE);
      s.rev++;
    },
    editorOpened: (s, a: PayloadAction<string | null>) => {
      s.editing = a.payload;
    },
  },
});

export const siteActions = siteSlice.actions;
export default siteSlice.reducer;
