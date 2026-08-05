/**
 * Self-check for the CMS form layer. Run: npm run admin:forms
 *
 * Same reasoning as scripts/check-auth.ts — there is no test runner here and
 * this doesn't justify adding one, but every CMS save goes through parseForm
 * and every audit entry through diff, so "probably fine" isn't good enough.
 * These are the assertions that fail loudly if either stops doing its job.
 */

import assert from "node:assert/strict";
import { diff, initialValues, parseForm, toInput, type FormLike } from "../lib/admin/form";
import { getResource, RESOURCES, slugify, type Field, type Resource } from "../lib/admin/resources";

/** FormData, minus the parts this layer never touches. */
const form = (values: Record<string, string>): FormLike => ({
  get: (name) => (name in values ? values[name] : null),
});

const news = getResource("news") as Resource;
const leadership = getResource("leadership") as Resource;
assert.ok(news && leadership, "the news and leadership resources exist");

// --- slugs ----------------------------------------------------------------

assert.equal(slugify("Dr. Devesh Rastogi & Co."), "dr-devesh-rastogi-co");
assert.equal(slugify("  FAIITA — AGM 2026  "), "faiita-agm-2026");
assert.equal(slugify("!!!"), "");

// An empty slug box is filled from the title; a typed one is left alone.
const generated = parseForm(
  news,
  form({ title: "FAIITA Meets MeitY", excerpt: "x", content: "y", category: "Policy", publishedAt: "2026-08-05" }),
);
assert.equal(generated.slug, "faiita-meets-meity");

const chosen = parseForm(
  news,
  form({ title: "FAIITA Meets MeitY", slug: "meity-meeting", excerpt: "x", content: "y", category: "Policy", publishedAt: "2026-08-05" }),
);
assert.equal(chosen.slug, "meity-meeting");

// --- required fields ------------------------------------------------------

assert.throws(
  () => parseForm(news, form({ title: "", excerpt: "x", content: "y", category: "Policy", publishedAt: "2026-08-05" })),
  /Headline is required/,
  "a blank required field is rejected by name",
);

// An optional field left blank stores null rather than an empty string, so the
// site's `?? fallback` branches behave.
assert.equal(generated.sourceUrl, null);

// --- checkboxes -----------------------------------------------------------

// An unchecked box submits nothing at all — absence must read as false, not as
// "leave it alone", or a feature flag could never be turned off again.
assert.equal(generated.featured, false);
assert.equal(
  parseForm(news, form({ title: "t", excerpt: "x", content: "y", category: "Policy", publishedAt: "2026-08-05", featured: "on" })).featured,
  true,
);

// --- dates round-trip -----------------------------------------------------

const publishedAt = generated.publishedAt as Date;
assert.ok(publishedAt instanceof Date);
const dateField = news.fields.find((f) => f.name === "publishedAt") as Field;
assert.equal(toInput(dateField, publishedAt), "2026-08-05", "a date survives the trip back to its input");

assert.throws(
  () => parseForm(news, form({ title: "t", excerpt: "x", content: "y", category: "Policy", publishedAt: "not a date" })),
  /valid date/,
);

// --- "lines" fields round-trip -------------------------------------------

const journeyField = leadership.fields.find((f) => f.name === "journey") as Field;
const typed = "President, FAIITA | https://faiita.co.in\nSecretary, AITDA\nTreasurer |   ";
const parsed = parseForm(leadership, form({ name: "A", role: "R", category: "national", journey: typed }));

assert.deepEqual(parsed.journey, [
  { text: "President, FAIITA", url: "https://faiita.co.in" },
  { text: "Secretary, AITDA" },
  { text: "Treasurer" }, // a trailing bar with nothing after it is not a link
]);
assert.equal(
  toInput(journeyField, parsed.journey),
  "President, FAIITA | https://faiita.co.in\nSecretary, AITDA\nTreasurer",
);
assert.equal(parsed.companies, null, "an empty lines field stores null, not []");

// --- initialValues --------------------------------------------------------

const blank = initialValues(news, null);
assert.equal(blank.title, "");
assert.equal(blank.featured, false, "a new record's checkbox starts unchecked");

// --- the audit diff -------------------------------------------------------

const before = { title: "Old", featured: false, publishedAt: new Date("2026-01-01"), journey: [{ text: "A" }] };

assert.equal(diff(before, { ...before }), null, "an unchanged save writes nothing");
assert.equal(
  diff(before, { ...before, publishedAt: new Date("2026-01-01") }),
  null,
  "two equal Dates are not a change — object identity would report one every save",
);
assert.equal(
  diff(before, { ...before, journey: [{ text: "A" }] }),
  null,
  "two equal JSON values are not a change either",
);

assert.deepEqual(diff(before, { ...before, title: "New" }), { title: { from: "Old", to: "New" } });
assert.deepEqual(diff(before, { ...before, journey: [{ text: "B" }] }), {
  journey: { from: '[{"text":"A"}]', to: '[{"text":"B"}]' },
});

// diff only reports fields the form actually submitted, so untouched columns
// (createdAt, deletedAt, id) never show up in the log.
assert.equal(diff({ ...before, id: "abc" }, { title: "Old" }), null);

// --- every resource is coherent -------------------------------------------

for (const resource of RESOURCES) {
  for (const name of resource.listFields) {
    assert.ok(
      resource.fields.some((f) => f.name === name),
      `${resource.key}: list column "${name}" has a matching field`,
    );
  }
  assert.ok(
    resource.fields.some((f) => f.name === resource.labelField),
    `${resource.key}: labelField "${resource.labelField}" is a real field`,
  );
}

console.log("admin form layer: all checks passed");
