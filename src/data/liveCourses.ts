import type { Course } from '../types';
import { BASE_DATA, buildCourse, replaceCourses } from './courses';
import { clearLessonCache } from './curriculum';
import { refreshPaid } from './showcase';
import type { SiteData } from '../store/siteSlice';

/**
 * Applies the admin's changes (tx_site) on top of the built-in catalog in src/data/courses.ts.
 * Runs once when the app starts and again every time the admin saves something.
 * Built-in course + courseEdits[id]   ->  what learners see
 * customCourses                        ->  added to the end of the catalog
 * hiddenCourses                        ->  removed from the catalog (still opens for people who own them)
 */
export function applySite(site: SiteData) {
  const visible: Course[] = [];
  const hidden: Course[] = [];
  const all = [...BASE_DATA, ...site.customCourses];
  for (const base of all) {
    const course = buildCourse({ ...base, ...(site.courseEdits[base.id] ?? {}), id: base.id });
    (site.hiddenCourses.includes(base.id) ? hidden : visible).push(course);
  }
  replaceCourses(visible, hidden);
  clearLessonCache();
  refreshPaid();
}
