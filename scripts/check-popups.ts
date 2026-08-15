/**
 * Self-check for the pop-up poster window. Run: npm run popups:check
 *
 * Same reasoning as scripts/check-admin-forms.ts. Two callers depend on this
 * arithmetic agreeing — the homepage decides what to show, the nightly cron
 * decides what to delete for ever — so an off-by-one here either loses an
 * editor's poster a day early or bins it while it is still on screen.
 */

import assert from "node:assert/strict";
import { endsAt, hasExpired, isLive } from "../lib/popups";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse("2026-08-15T09:00:00Z");
const on = (iso: string, days: number, isActive = true) => ({
  startsAt: new Date(iso),
  days,
  isActive,
});

// Independence Day, published for the day itself.
const today = on("2026-08-15T00:00:00Z", 1);
assert.equal(isLive(today, now), true, "a poster started this morning is on screen");
assert.equal(hasExpired(today, now), false);
assert.equal(endsAt(today), Date.parse("2026-08-16T00:00:00Z"), "one day means one day");

// The boundary, from both sides. The window is closed at the start and open at
// the end, so a one-day poster is gone the instant its day is up rather than
// lingering for one more request.
assert.equal(isLive(today, endsAt(today) - 1), true, "live right up to the last millisecond");
assert.equal(isLive(today, endsAt(today)), false, "not live on the boundary itself");
assert.equal(hasExpired(today, endsAt(today)), true, "and the cron may take it from there");

// Scheduled ahead: uploaded now, not shown until the festival arrives.
const dussehra = on("2026-10-20T00:00:00Z", 3);
assert.equal(isLive(dussehra, now), false, "a future poster stays off the homepage");
assert.equal(hasExpired(dussehra, now), false, "and must not be deleted while it waits");

// Held back by the Live tick-box. It stays off the site, but the clock keeps
// running — otherwise an unticked poster would sit in blob storage for ever.
const heldBack = on("2026-08-14T00:00:00Z", 1, false);
assert.equal(isLive(heldBack, now), false, "unticked is unticked");
assert.equal(hasExpired(heldBack, now), true, "but expiry ignores the tick-box");

// A long run, to catch a days-vs-hours slip that a 1-day case would not.
const monthLong = on("2026-08-01T00:00:00Z", 30);
assert.equal(isLive(monthLong, now), true);
assert.equal(endsAt(monthLong) - Date.parse("2026-08-01T00:00:00Z"), 30 * DAY);

console.log("Pop-up windows: all checks passed.");
