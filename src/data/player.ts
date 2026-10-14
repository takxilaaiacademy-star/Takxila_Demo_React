/**
 * Where each course's lessons play.
 *
 * Every enrolled learner sees the academy's player (a SCORM package on academy.takxila.in) inside the site.
 * `PLAYER_URLS` has one link per course. Courses without their own link use DEFAULT_PLAYER_URL.
 * The admin can also paste a different link per course in Admin > Course players (no code change needed).
 * YouTube, Vimeo and Google Drive links are converted to their embed form automatically.
 */
export const DEFAULT_PLAYER_URL =
  'https://academy.takxila.in/mod/scorm/loadSCO.php?a=15&scoid=30&currentorg=TAKXILA-ORG&mode=review&attempt=1';

/** courseId -> player link. Add a line here when a course gets its own package. */
export const PLAYER_URLS: Record<string, string> = {
  'mastery-14': DEFAULT_PLAYER_URL,
};

export const playerUrlFor = (courseId: string, overrides: Record<string, string> = {}) =>
  toEmbedUrl(overrides[courseId] || PLAYER_URLS[courseId] || DEFAULT_PLAYER_URL);

/**
 * Only https links are accepted inside the player frame. The admin chooses the link, so any https site is allowed
 * (the academy, YouTube, Vimeo, Google Drive ...). To lock it to your own domain again, check u.hostname here.
 */
export const isAllowedPlayerUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

/** Turns a normal YouTube / Vimeo / Google Drive link into the embeddable version, so the admin can paste what they copied. */
export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return 'https://www.youtube.com/embed/' + u.pathname.slice(1) + u.search;
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const list = u.searchParams.get('list');
      const v = u.searchParams.get('v');
      if (u.pathname === '/watch' && v) return 'https://www.youtube.com/embed/' + v + (list ? '?list=' + list : '');
      if (u.pathname === '/playlist' && list) return 'https://www.youtube.com/embed/videoseries?list=' + list;
    }
    if (host === 'vimeo.com' && /^\/\d+/.test(u.pathname)) return 'https://player.vimeo.com/video' + u.pathname;
    if (host === 'drive.google.com') {
      const m = /\/file\/d\/([^/]+)/.exec(u.pathname);
      if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
    }
    return url.trim();
  } catch {
    return url.trim();
  }
}
