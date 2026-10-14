import type { Answers, Course, Plan, Question, QuizMode, Recommendation } from '../types';
import { COURSES, HIDDEN_COURSES } from './courses';
import { QB } from './quiz';

export const courseById = (id: string): Course | undefined => COURSES.find((c) => c.id === id) ?? HIDDEN_COURSES.find((c) => c.id === id);
export const optOf = (q: Question, v: string | undefined) => q.opts.find((o) => o[0] === v);
export const questionsFor = (mode: QuizMode): Question[] => QB.filter((q) => !q.only || q.only === mode);

export const priceText = (c: Course): string => (c.price === 0 ? 'FREE' : '₹' + c.price);
export const offText = (c: Course): string => (c.was ? Math.round((1 - c.price / c.was) * 100) + '% off' : '');

const single = (v: Answers[string]): string | undefined => (Array.isArray(v) ? v[0] : v);
const many = (v: Answers[string]): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

export function labelOf(id: string, v: string | undefined): string {
  const q = QB.find((x) => x.id === id);
  const o = q && v != null ? optOf(q, v) : undefined;
  return o ? o[1] : '';
}

export function profileLine(ans: Answers | null | undefined): string {
  if (!ans) return '';
  return [labelOf('prof', single(ans.prof)), labelOf('level', single(ans.level)), many(ans.interests).map((v) => labelOf('interests', v)).join(', ')]
    .filter(Boolean)
    .join(' · ');
}

// Scores every course against the answers' tag weights, applies level, kids and
// budget rules and returns the top 6 with a match % and reasons.
export function recommend(ans: Answers, owned: string[] = []): Recommendation[] {
  const tw: Record<string, number> = {};
  const why: Record<string, string[]> = {};
  QB.forEach((q) => {
    many(ans[q.id]).forEach((v) => {
      const o = optOf(q, v);
      const weights = o?.[2];
      if (!o || !weights) return;
      Object.entries(weights).forEach(([tg, w]) => {
        tw[tg] = (tw[tg] || 0) + w;
        (why[tg] = why[tg] || []).push(o[1]);
      });
    });
  });
  const budgetQ = QB.find((q) => q.id === 'budget');
  const bo = budgetQ ? optOf(budgetQ, single(ans.budget)) : undefined;
  const cap = bo?.[3] ?? 1e9;
  const kid = ans.age === 'kid';
  const parent = ans.prof === 'parent';
  const lv = ans.level;
  const scored = COURSES.filter((c) => !owned.includes(c.id))
    .map((c) => {
      let sc = 0;
      const rs: string[] = [];
      c.tags.forEach((tg) => {
        if (tw[tg]) {
          sc += tw[tg];
          why[tg].forEach((r) => !rs.includes(r) && rs.push(r));
        }
      });
      if ((lv === 'new' || lv === 'tried') && c.tags.includes('advanced')) sc -= 4;
      if (lv === 'build' && c.tags.includes('beginner')) sc -= 2;
      if (kid) sc = c.tags.includes('kids') ? sc + 20 : -99;
      else if (!parent && c.tags.includes('kids')) sc -= 10;
      return { c, sc, rs, over: c.price > cap };
    })
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc);
  let pick = scored.filter((x) => !x.over).slice(0, 6);
  if (pick.length < 3) pick = pick.concat(scored.filter((x) => x.over).slice(0, 3 - pick.length));
  const top = pick.length ? pick[0].sc : 1;
  return pick.map((x) => ({
    id: x.c.id,
    match: Math.max(55, Math.round(60 + (38 * x.sc) / top)),
    why: (x.over ? ['A little above your budget'] : []).concat(x.rs.slice(0, 2)),
  }));
}

// Totals for a list of recommendations: courses, price, savings and hours.
export function plan(recs: Recommendation[], owned: string[] = []): Plan {
  const items = recs.map((r) => courseById(r.id)).filter((c): c is Course => !!c && !owned.includes(c.id));
  const total = items.reduce((a, c) => a + c.price, 0);
  const was = items.reduce((a, c) => a + (c.was || c.price), 0);
  const hrs = items.reduce((a, c) => {
    const m = /([\d.]+)\+?\s*(Hours|Min|Days)/i.exec(c.meta.join(' '));
    return a + (!m ? 0 : /min/i.test(m[2]) ? +m[1] / 60 : +m[1]);
  }, 0);
  return { ids: items.map((c) => c.id), n: items.length, total, save: was - total, hours: Math.round(hrs) };
}
