/**
 * Password hashing, kept apart from lib/auth.ts on purpose.
 *
 * auth.ts is marked "server-only", which throws outside the Next bundler —
 * and scripts/create-admins.ts is a plain Node script that needs to hash a
 * password without any of the cookie/session machinery. These functions touch
 * no request context, so they belong on their own.
 */

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const KEYLEN = 64;

// ------------------------------------------------------------------ password

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  // Length check first: timingSafeEqual throws on mismatched lengths.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** A password strong enough that showing it once is survivable. */
export function generatePassword(): string {
  // Base64url over 15 bytes — 120 bits, no ambiguous-character problem, and
  // nothing for a human to mistype when reading it off a screen once.
  return randomBytes(15).toString("base64url");
}
