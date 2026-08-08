"use server";

import { redirect } from "next/navigation";
import { endSession, getAdmin, startSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type FormState = { error?: string };

// After this many wrong passwords in a row, the account is locked out rather
// than scrypt's per-attempt cost being the only thing slowing a guesser down.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await prisma.adminUser.findUnique({ where: { email } });

  // One message for "no such account" and "wrong password" alike — telling
  // them apart is a free list of which addresses are admins.
  const invalid = { error: "Those details don't match an admin account." };
  if (!user) return invalid;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const attempts = user.failedLoginAttempts + 1;
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : user.lockedUntil,
      },
    });
    return invalid;
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
  });
  await startSession(user.id);
  redirect(user.mustChangePassword ? "/admin/password" : "/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next !== confirm) return { error: "The two new passwords don't match." };
  if (next.length < 12) return { error: "Use at least 12 characters." };
  if (next === current) return { error: "That's your current password." };

  const user = await prisma.adminUser.findUnique({ where: { id: admin.id } });
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return { error: "Your current password is wrong." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next), mustChangePassword: false },
  });
  redirect("/admin");
}
