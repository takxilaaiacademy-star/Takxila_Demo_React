import type { Course } from '../types';

// Lessons for a course, built from its "learn" items and module count (max 12).
const cache = new Map<string, string[]>();
/** Called when the admin edits a course, so lesson lists are rebuilt from the new text. */
export const clearLessonCache = () => cache.clear();
export function lessonsFor(c: Course): string[] {
  const hit = cache.get(c.id);
  if (hit) return hit;
  const m = /(\d+)\s*(Modules|Missions|easy steps)/i.exec(c.meta.join(' '));
  const n = Math.max(Math.min(m ? +m[1] : c.learn.length, 12), c.learn.length);
  const list = Array.from({ length: n }, (_, i) => (i < c.learn.length ? c.learn[i] : 'Hands-on project ' + (i - c.learn.length + 1)));
  cache.set(c.id, list);
  return list;
}

export const pctOf = (c: Course, done: number): number => Math.round((100 * Math.min(done, lessonsFor(c).length)) / lessonsFor(c).length);

export interface GradeRow {
  index: number;
  name: string;
  weight: number;
  grade: number | null;
  percent: number | null;
  contribution: number | null;
}

// Moodle-style user report: every lesson is a grade item worth an equal share.
// A completed lesson scores 100, a lesson not done yet has no grade.
export function gradeReport(c: Course, done: number): { rows: GradeRow[]; total: number } {
  const lessons = lessonsFor(c);
  const weight = 100 / lessons.length;
  const rows = lessons.map((name, i) => {
    const grade = i < done ? 100 : null;
    return { index: i, name, weight, grade, percent: grade, contribution: grade == null ? null : (weight * grade) / 100 };
  });
  return { rows, total: rows.reduce((a, r) => a + (r.contribution || 0), 0) };
}
