/**
 * The CMS, as data.
 *
 * Every editable section of the site is one entry in RESOURCES below. The list
 * screen, the edit form, the save/delete/restore actions, the audit diff and
 * the revalidation all read this file — there is no per-model screen and no
 * per-model action. Adding a section to the dashboard means adding an object
 * here, not a folder of pages.
 *
 * This file is imported by client components, so it must stay pure data: model
 * names are strings, and nothing here touches Prisma.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "relation"
  | "image"
  /** One item per line, "left | right", stored as a JSON array of objects. */
  | "lines";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** select */
  options?: string[];
  /** relation — the resource key whose rows fill the dropdown */
  relationTo?: string;
  /** lines — the two object keys each line maps to; the second is optional */
  keys?: [string, string];
  help?: string;
};

export type Resource = {
  /** URL segment: /admin/<key> */
  key: string;
  /** Prisma delegate name, e.g. prisma.news */
  model: string;
  label: string;
  singular: string;
  /** Only when it isn't `singular` + "s" — "story" would otherwise read "storys". */
  plural?: string;
  /** Field used to name a row in the list, the audit log and page titles */
  labelField: string;
  listFields: string[];
  orderBy: Record<string, "asc" | "desc">;
  fields: Field[];
  /** false = no deletedAt column, so delete is permanent */
  softDelete: boolean;
  /** Paths purged after every write. Paths containing [ ] revalidate as pages. */
  revalidate: string[];
  /** Fill an empty slug box from this field on save */
  slugFrom?: string;
  /** A "Photos →" style link from each row into a filtered child list */
  children?: { resource: string; foreignKey: string; label: string };
  /** This resource is normally reached filtered by a parent */
  parent?: { resource: string; foreignKey: string };
};

const SLUG: Field = {
  name: "slug",
  label: "URL slug",
  type: "text",
  help: "Leave blank to generate one. Changing it changes the page's address.",
};

const NEWS: Resource = {
  key: "news",
  model: "news",
  label: "News",
  singular: "story",
  plural: "stories",
  labelField: "title",
  listFields: ["title", "category", "publishedAt", "featured"],
  orderBy: { publishedAt: "desc" },
  slugFrom: "title",
  softDelete: true,
  revalidate: [
    "/",
    "/resources",
    "/resources/news",
    "/resources/news/[slug]",
    "/resources/news/rss.xml",
    "/sitemap.xml",
  ],
  fields: [
    { name: "title", label: "Headline", type: "text", required: true },
    SLUG,
    { name: "excerpt", label: "Summary", type: "textarea", required: true, help: "One or two sentences, shown on cards and in search results." },
    { name: "content", label: "Article", type: "textarea", required: true, help: "Blank lines separate paragraphs." },
    { name: "category", label: "Category", type: "select", required: true, options: ["Events", "Policy", "Initiative", "Press Release"] },
    { name: "publishedAt", label: "Published", type: "date", required: true },
    { name: "coverImage", label: "Card image", type: "image" },
    { name: "heroImage", label: "Article header image", type: "image" },
    { name: "sourceUrl", label: "Original coverage URL", type: "text" },
    { name: "relatedStateSlug", label: "Related state (slug)", type: "text", help: "Adds a link to that state's page, e.g. rajasthan." },
    { name: "relatedStateLabel", label: "Related state (link text)", type: "text", help: 'e.g. "in Rajasthan".' },
    { name: "featured", label: "Featured", type: "boolean", help: "Shown large at the top of the news page." },
    { name: "isDemo", label: "Placeholder content", type: "boolean", help: "Hidden from the homepage and the RSS feed." },
  ],
};

const EVENTS: Resource = {
  key: "events",
  model: "event",
  label: "Events",
  singular: "event",
  labelField: "title",
  listFields: ["title", "startDate", "city", "isUpcoming"],
  orderBy: { startDate: "desc" },
  slugFrom: "title",
  softDelete: true,
  revalidate: ["/", "/resources", "/resources/events", "/resources/events/[slug]", "/sitemap.xml"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    SLUG,
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: ["AGM", "Summit", "Workshop", "Conference"] },
    { name: "startDate", label: "Starts", type: "date", required: true },
    { name: "endDate", label: "Ends", type: "date" },
    { name: "city", label: "City", type: "text", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "venue", label: "Venue", type: "text" },
    { name: "coverImage", label: "Cover image", type: "image" },
    { name: "registrationLink", label: "Registration link", type: "text" },
    { name: "isUpcoming", label: "Upcoming", type: "boolean", help: "Shown in the homepage's upcoming list. The events page sorts by date regardless." },
    { name: "isDemo", label: "Placeholder content", type: "boolean" },
  ],
};

const GALLERY_ALBUMS: Resource = {
  key: "gallery",
  model: "galleryAlbum",
  label: "Gallery albums",
  singular: "album",
  labelField: "title",
  listFields: ["title", "eyebrow", "order"],
  orderBy: { order: "asc" },
  slugFrom: "title",
  softDelete: true,
  children: { resource: "gallery-photos", foreignKey: "albumId", label: "Photos" },
  revalidate: ["/resources", "/resources/gallery"],
  fields: [
    { name: "title", label: "Album title", type: "text", required: true },
    SLUG,
    { name: "eyebrow", label: "Eyebrow", type: "text", required: true, help: "The small line above the title, e.g. a date or place." },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "order", label: "Position", type: "number", help: "Lower numbers appear first." },
  ],
};

const GALLERY_PHOTOS: Resource = {
  key: "gallery-photos",
  model: "galleryPhoto",
  label: "Gallery photos",
  singular: "photo",
  labelField: "caption",
  listFields: ["src", "caption", "order"],
  orderBy: { order: "asc" },
  softDelete: false,
  parent: { resource: "gallery", foreignKey: "albumId" },
  revalidate: ["/resources", "/resources/gallery"],
  fields: [
    { name: "albumId", label: "Album", type: "relation", relationTo: "gallery", required: true },
    { name: "src", label: "Photograph", type: "image", required: true },
    { name: "caption", label: "Caption", type: "text", required: true, help: "Read aloud by screen readers, so describe the picture." },
    { name: "order", label: "Position", type: "number" },
  ],
};

const STATES: Resource = {
  key: "states",
  model: "stateAssociation",
  label: "State associations",
  singular: "state association",
  labelField: "stateName",
  listFields: ["stateName", "associationName", "region", "memberCount"],
  orderBy: { stateName: "asc" },
  slugFrom: "stateName",
  softDelete: true,
  children: { resource: "member-associations", foreignKey: "stateId", label: "Members" },
  revalidate: ["/", "/about", "/about/state-associations", "/about/state-associations/[slug]", "/sitemap.xml"],
  fields: [
    { name: "stateName", label: "State / UT", type: "text", required: true },
    SLUG,
    { name: "stateCode", label: "State code", type: "text", required: true, help: "Two letters, e.g. MH. Matches the map." },
    { name: "region", label: "Zone", type: "select", required: true, options: ["North", "South", "East", "West", "Central"] },
    { name: "associationName", label: "Association name", type: "text", required: true },
    { name: "foundedYear", label: "Founded", type: "number" },
    { name: "memberCount", label: "Members", type: "number" },
    { name: "presidentName", label: "President", type: "text" },
    { name: "secretaryName", label: "Secretary", type: "text" },
    { name: "contactEmail", label: "President's email", type: "text" },
    { name: "secretaryEmail", label: "Secretary's email", type: "text" },
    { name: "contactPhone", label: "Phone", type: "text" },
    { name: "websiteUrl", label: "Website", type: "text" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "description", label: "About", type: "textarea" },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "mapX", label: "Map position — across", type: "number", help: "0–100, from the left edge of the illustrated map." },
    { name: "mapY", label: "Map position — down", type: "number", help: "0–100, from the top edge." },
    { name: "isCovered", label: "Show as covered on the map", type: "boolean" },
  ],
};

const MEMBERS: Resource = {
  key: "member-associations",
  model: "memberAssociation",
  label: "Member associations",
  singular: "member association",
  labelField: "name",
  listFields: ["name", "stateId", "city", "memberCount"],
  orderBy: { name: "asc" },
  slugFrom: "name",
  softDelete: true,
  parent: { resource: "states", foreignKey: "stateId" },
  revalidate: ["/about/member-associations", "/about/member-associations/[slug]", "/about/state-associations/[slug]", "/sitemap.xml"],
  fields: [
    { name: "name", label: "Association name", type: "text", required: true },
    SLUG,
    { name: "stateId", label: "State chapter", type: "relation", relationTo: "states", required: true },
    { name: "city", label: "City / district", type: "text" },
    { name: "type", label: "Type", type: "select", required: true, options: ["City Association", "District Association", "Retail", "Distribution", "Services", "Solutions", "Manufacturing"] },
    { name: "memberCount", label: "Members", type: "number" },
    { name: "foundedYear", label: "Founded", type: "number" },
    { name: "description", label: "About", type: "textarea" },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "website", label: "Website", type: "text" },
    { name: "presidentName", label: "President", type: "text" },
    { name: "contactEmail", label: "Email", type: "text" },
    { name: "contactPhone", label: "President's phone", type: "text" },
    { name: "secretaryPhone", label: "Secretary's phone", type: "text" },
    { name: "isDemo", label: "Placeholder listing", type: "boolean" },
  ],
};

const LEADERS: Resource = {
  key: "leadership",
  model: "leader",
  label: "Leadership",
  singular: "leader",
  labelField: "name",
  listFields: ["name", "role", "term", "isCurrent", "order"],
  orderBy: { order: "asc" },
  softDelete: true,
  revalidate: ["/about/leadership"],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Position", type: "text", required: true, help: "e.g. President, Secretary General, Governing Body Member." },
    { name: "order", label: "Position in the list", type: "number", help: "Lower numbers appear first. Office bearers come before Governing Body members." },
    { name: "category", label: "Level", type: "select", required: true, options: ["national", "state"] },
    { name: "term", label: "Term", type: "text", help: "e.g. 2024–2026." },
    { name: "isCurrent", label: "Currently serving", type: "boolean" },
    { name: "imageUrl", label: "Photograph", type: "image" },
    { name: "bio", label: "Biography", type: "textarea" },
    { name: "associationName", label: "Association", type: "text" },
    { name: "stateName", label: "State", type: "text" },
    { name: "location", label: "City", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "linkedIn", label: "LinkedIn", type: "text" },
    { name: "website", label: "Website", type: "text" },
    { name: "focusAreas", label: "Focus areas", type: "text", help: "Comma separated. Only shown on the spotlight card." },
    { name: "journey", label: "Journey", type: "lines", keys: ["text", "url"], help: "One milestone per line. Add a link with a vertical bar: President, FAIITA | https://faiita.co.in" },
    { name: "companies", label: "Businesses", type: "lines", keys: ["name", "url"], help: "One business per line, optionally  name | https://…" },
  ],
};

const NEWSLETTERS: Resource = {
  key: "newsletter",
  model: "newsletter",
  label: "Patrika issues",
  singular: "issue",
  labelField: "title",
  listFields: ["title", "issueNumber", "issueDate"],
  orderBy: { issueDate: "desc" },
  slugFrom: "title",
  softDelete: true,
  revalidate: ["/resources", "/resources/newsletter", "/resources/newsletter/[slug]", "/sitemap.xml"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    SLUG,
    { name: "issueNumber", label: "Issue number", type: "number", required: true },
    { name: "issueDate", label: "Issue date", type: "date", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "fileUrl", label: "Flip-book or PDF URL", type: "text", help: "A Heyzine link, or a path like /newsletters/issue-4.pdf." },
    { name: "isDemo", label: "Placeholder issue", type: "boolean" },
  ],
};

const TESTIMONIALS: Resource = {
  key: "testimonials",
  model: "testimonial",
  label: "Testimonials",
  singular: "testimonial",
  labelField: "name",
  listFields: ["name", "association", "order"],
  orderBy: { order: "asc" },
  softDelete: true,
  revalidate: ["/"],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Position", type: "text", required: true },
    { name: "association", label: "Association", type: "text", required: true },
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "imageUrl", label: "Photograph", type: "image" },
    { name: "order", label: "Position", type: "number" },
  ],
};

export const RESOURCES: Resource[] = [
  NEWS,
  EVENTS,
  GALLERY_ALBUMS,
  GALLERY_PHOTOS,
  STATES,
  MEMBERS,
  LEADERS,
  NEWSLETTERS,
  TESTIMONIALS,
];

/** The order they appear in the admin nav. Gallery photos are reached through their album. */
export const NAV_RESOURCES = RESOURCES.filter((r) => !r.parent || r.key === "member-associations");

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((r) => r.key === key);
}

export function fieldOf(resource: Resource, name: string): Field | undefined {
  return resource.fields.find((f) => f.name === name);
}

// The site already had one — /about/state-associations slugs come from it, so
// a slug the CMS generates has to be produced the same way.
export { slugify } from "../utils";
