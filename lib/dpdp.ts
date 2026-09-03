/**
 * DPDP Act 2023 — the facts this site has to state, in one place.
 *
 * The privacy notice should render these rather than restate them in prose.
 * Prose drifts from code; a rendered array cannot. That drift is the usual way
 * a privacy notice becomes false, and this site's placeholder notice is already
 * an example: it says FAIITA does "not sell or share your personal data with
 * third parties" while the code sends every submission to Resend and stores it
 * in a hosted database.
 *
 * **Authority.** FAIITA is the Data Fiduciary. Webnet Asia builds and maintains
 * this site as a Data Processor on the federation's instructions. Everything
 * here that is a legal statement — who the Grievance Officer is, how long data
 * is kept — is FAIITA's to decide. Where FAIITA has not decided, this file says
 * so rather than inventing something plausible.
 */

/** The Data Fiduciary — the federation, not its developer. */
export const FIDUCIARY = {
  name: "Federation of All India IT Associations (FAIITA)",
  country: "India",
} as const;

/**
 * The Grievance Officer — DPDP Sec. 8(9) and Sec. 13, and the single most
 * commonly missed requirement in the Act.
 *
 * **Not yet appointed.** Deliberately `null` rather than a plausible guess.
 *
 * The Act wants a named individual with a direct contact method, published in
 * the notice and reachable from the site; a role inbox with nobody behind it is
 * specifically what the requirement exists to prevent. The person must be able
 * to act — to delete a record and to answer the Data Protection Board on
 * FAIITA's behalf — so it has to be an office bearer of the federation.
 *
 * It must **not** be anyone at Webnet Asia. We are the Processor; we could not
 * honour a deletion request against FAIITA's records even if we wanted to, so
 * naming us would publish a contact that cannot act.
 *
 * Until this is filled in, the site cannot publish a compliant grievance route.
 * The notice should say the appointment is pending rather than name an inbox
 * and imply otherwise.
 */
export const GRIEVANCE_OFFICER: {
  name: string;
  role: string;
  email: string;
  responseDays: number;
} | null = null;

/** Published commitment once an Officer exists. The Act sets no number. */
export const GRIEVANCE_RESPONSE_DAYS = 30;

export type DataRecipient = {
  name: string;
  purpose: string;
  /** What they actually receive — not "your data". */
  receives: string;
  country: string;
};

/**
 * Every third party that receives personal data from this site — Sec. 16.
 *
 * The misconception the Act does not accept is "our host handles compliance".
 * Each of these is a Data Processor and the liability stays with FAIITA.
 * Transfers are permitted to any country the Central Government has not
 * restricted, and none has been.
 *
 * **If a dependency that touches personal data is added, it goes in this array
 * in the same commit.**
 */
export const DATA_RECIPIENTS: DataRecipient[] = [
  {
    name: "Vercel",
    purpose: "Hosting and content delivery",
    // Stated explicitly because it is the claim most easily got wrong: every
    // host logs the requesting address, so "we do not collect IP addresses"
    // would be false no matter what this codebase does.
    receives:
      "Requests to the site — the pages you open, your IP address and browser, kept in Vercel's request logs",
    country: "United States",
  },
  {
    name: "Vercel Postgres / the hosted database",
    purpose: "Stores contact submissions, newsletter subscribers and site content",
    receives:
      "Your contact submission, or your email address if you subscribe to the newsletter",
    country: "United States",
  },
  {
    name: "Vercel Blob",
    purpose: "Stores images and files uploaded through the admin area",
    receives: "Uploaded files, which may contain personal data if a photograph is uploaded",
    country: "United States",
  },
  {
    name: "Resend",
    purpose: "Sends the notification email telling FAIITA that a form was submitted",
    receives:
      "The contents of that notification — your name, contact details and message",
    country: "United States",
  },
  {
    name: "Vercel Analytics",
    purpose: "Counts page views",
    // The same judgement as elsewhere in this estate: no cookies, no persistent
    // identifier, so the counts are treated as statistics rather than personal
    // data and are not consent-gated. It is a judgement, and it is disclosed so
    // a visitor can disagree.
    receives: "That a page was opened, and roughly from where. No cookie, no identifier",
    country: "United States",
  },
];

export type RetentionRule = {
  what: string;
  period: string;
  /** Stated honestly. "pending" means FAIITA has not set a period yet. */
  enforcement: "manual" | "processor" | "automated" | "pending";
};

/**
 * How long each thing is kept.
 *
 * **FAIITA has not set defined periods.** This file says so instead of
 * publishing a number nobody decided. A retention period the data disproves is
 * worse than admitting there is not one, and inventing figures is a failure
 * this estate has already made once and corrected.
 *
 * Note that `deletedAt` on every Prisma model is a **soft delete**. It hides a
 * row from the admin UI; the data is still in the database in full. Soft delete
 * is not erasure, and nothing currently purges soft-deleted rows.
 */
export const RETENTION: RetentionRule[] = [
  {
    what: "Contact form submissions",
    period: "No period set — currently kept indefinitely",
    enforcement: "pending",
  },
  {
    what: "Newsletter subscribers",
    period:
      "Until you unsubscribe. Unsubscribing marks the record deleted; it is not yet purged from the database",
    enforcement: "pending",
  },
  {
    what: "Rows marked deleted in the admin area",
    // Said plainly because the opposite claim is the one that gets made by
    // accident. There is no purge job anywhere in this codebase.
    period: "Hidden from the admin area, but retained in the database indefinitely",
    enforcement: "pending",
  },
  {
    what: "Vercel request logs (these include your IP address)",
    period: "Retained by Vercel on their plan's schedule",
    enforcement: "processor",
  },
];

/**
 * The notice shown where the newsletter is offered — Sec. 5.
 *
 * Typing an address into a box labelled "subscribe" is a clear affirmative
 * action for that purpose, so a separate checkbox is not what is missing here.
 * What was missing is the **notice**: what is collected, what for, and how to
 * withdraw. Sec. 6(4) requires withdrawal to be as easy as giving consent —
 * giving it is typing an address and pressing a button, so withdrawing has to
 * be the same, which is what `/unsubscribe` now provides.
 *
 * **This wording is a statement on FAIITA's behalf and should be approved by
 * the federation.** It is written to describe only what the code does.
 */
export const NEWSLETTER_NOTICE_VERSION = "2026-08-30a";

export const NEWSLETTER_PURPOSE =
  "We use your email address only to send FAIITA updates. You can unsubscribe at any time.";
