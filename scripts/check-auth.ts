/**
 * Self-check for the hand-rolled auth crypto. Run: npm run admin:check
 *
 * There is no test runner in this project and this does not justify adding
 * one, but hand-rolled password and signature code is exactly the kind of
 * thing that must not be "probably fine". These are the assertions that fail
 * loudly if the primitives ever stop doing their job.
 */

import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { generatePassword, hashPassword, verifyPassword } from "../lib/password";
import { prisma } from "../lib/prisma";

// The session signing in lib/auth.ts is server-only (it reads cookies), so its
// logic is mirrored here to assert the signature scheme itself.
const SECRET = "test-secret-that-is-certainly-long-enough";
const sign = (data: string) => createHmac("sha256", SECRET).update(data).digest("base64url");
const serialize = (payload: object) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
};
const deserialize = (token: string) => {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  return payload.exp > Date.now() ? payload : null;
};

async function main() {
  // --- password hashing
  const password = generatePassword();
  assert.ok(password.length >= 20, "generated password is too short to be worth 120 bits");

  const stored = await hashPassword(password);
  assert.match(stored, /^[0-9a-f]{32}:[0-9a-f]{128}$/, "hash is not salt:hash hex");
  assert.equal(await verifyPassword(password, stored), true, "correct password must verify");
  assert.equal(await verifyPassword(password + "x", stored), false, "wrong password must not verify");
  assert.equal(await verifyPassword(password, "garbage"), false, "malformed hash must not verify");

  // Same password, different salt — two admins with the same password must not
  // end up with the same row in the database.
  assert.notEqual(await hashPassword(password), stored, "hashes must be salted per call");

  // --- session signature
  const token = serialize({ id: "abc", exp: Date.now() + 60_000 });
  assert.equal(deserialize(token)?.id, "abc", "a token we signed must round-trip");

  const [body] = token.split(".");
  assert.equal(deserialize(`${body}.forged`), null, "a forged signature must be rejected");

  const swapped = Buffer.from(JSON.stringify({ id: "someone-else", exp: Date.now() + 60_000 })).toString("base64url");
  assert.equal(deserialize(`${swapped}.${sign(body)}`), null, "a swapped body must be rejected");
  assert.equal(deserialize(serialize({ id: "abc", exp: Date.now() - 1 })), null, "an expired token must be rejected");

  // --- the real accounts
  const admins = await prisma.adminUser.findMany({ select: { email: true, mustChangePassword: true } });
  assert.equal(admins.length, 3, `expected 3 admin accounts, found ${admins.length}`);
  assert.ok(
    admins.every((a) => a.mustChangePassword),
    "every seeded account must be forced to change its password"
  );

  console.log(`\n  auth self-check passed — ${admins.length} accounts, all pending a password change.\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
