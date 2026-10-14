/**
 * Where each course's lessons play.
 *
 * Every enrolled learner sees the academy's player (a SCORM package on academy.takxila.in) inside the site.
 * `PLAYER_URLS` has one link per course. Courses without their own link use DEFAULT_PLAYER_URL.
 * The admin can also paste a different link per course in Admin > Course players (no code change needed).
 */
export const DEFAULT_PLAYER_URL =
  'https://academy.takxila.in/mod/scorm/loadSCO.php?a=15&scoid=30&currentorg=TAKXILA-ORG&mode=review&attempt=1';

/** courseId -> player link. Add a line here when a course gets its own package. */
export const PLAYER_URLS: Record<string, string> = {
  'mastery-14': DEFAULT_PLAYER_URL,
};

export const playerUrlFor = (courseId: string, overrides: Record<string, string> = {}) =>
  overrides[courseId] || PLAYER_URLS[courseId] || DEFAULT_PLAYER_URL;

/** Only https links to the academy are allowed inside the player frame. */
export const isAllowedPlayerUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && (u.hostname === 'academy.takxila.in' || u.hostname.endsWith('.takxila.in'));
  } catch {
    return false;
  }
};
