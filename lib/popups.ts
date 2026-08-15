/**
 * When a poster is on screen, and when it has outlived itself.
 *
 * The homepage and the cleanup cron both answer this question and must agree,
 * so the arithmetic lives here rather than twice. `days` is stored instead of
 * an end date because that is what an editor is asked for — deriving the end
 * on read means there is no second column to drift out of step with it.
 */

export type PopupWindow = { startsAt: Date; days: number; isActive: boolean };

const DAY_MS = 24 * 60 * 60 * 1000;

export function endsAt(popup: PopupWindow): number {
  return popup.startsAt.getTime() + popup.days * DAY_MS;
}

export function isLive(popup: PopupWindow, now = Date.now()): boolean {
  return popup.isActive && popup.startsAt.getTime() <= now && endsAt(popup) > now;
}

/** Past its window — true regardless of isActive, so an unpublished poster
 *  still gets cleaned up rather than sitting in blob storage forever. */
export function hasExpired(popup: PopupWindow, now = Date.now()): boolean {
  return endsAt(popup) <= now;
}
