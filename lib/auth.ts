import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Admin authentication.
 *
 * No auth library and no new dependencies: this guards three hand-created
 * accounts on one dashboard, with no OAuth, no sign-up, no password reset by
 * email and no third-party identity provider. Everything below is Node's own
 * crypto — scrypt for the password hash (a memory-hard KDF, which is the part
 * that actually matters) and an HMAC-signed cookie for the session. Auth.js
 * would be more configuration than this is code.
 *
 * If any of those assumptions change — public sign-up, SSO, more than a
 * handful of users — replace this wholesale rather than growing it.
 */

const SESSION_COOKIE = "faiita_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h — an editing session, not a login that lives forever

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  // Failing loudly beats falling back to a default: a predictable signing key
  // means anyone can mint a session cookie for any admin.
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is missing or shorter than 32 characters");
  }
  return value;
}

// ------------------------------------------------------------------- session

type SessionPayload = { id: string; exp: number };

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function serialize(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function deserialize(token: string): SessionPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  // Compare the signature in constant time, and only then trust the body.
  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export async function startSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, serialize({ id: userId, exp: Date.now() + SESSION_TTL_MS }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  mustChangePassword: boolean;
};

/**
 * The signed-in admin, or null. Re-reads the user each call rather than
 * trusting the cookie's contents, so deleting an account or flipping
 * mustChangePassword takes effect on the next request instead of in 12 hours.
 */
export async function getAdmin(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = deserialize(token);
  if (!payload) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, mustChangePassword: true },
  });
  return user;
}
