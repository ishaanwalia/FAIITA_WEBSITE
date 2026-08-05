/**
 * Creates any missing CMS admin accounts and prints their passwords ONCE.
 * Run with: npm run admin:create
 *
 * The passwords are generated here with crypto.randomBytes — 120 bits each —
 * and only their scrypt hash is stored. This output is the only time they
 * exist in readable form, so copy them straight into whatever you use to hand
 * them over, and don't paste this terminal into anything that keeps history.
 *
 * Every account is created with mustChangePassword: true, so each person is
 * forced to replace the generated password the first time they sign in. That
 * is what makes printing them here survivable.
 *
 * **Existing accounts are left alone.** This used to reset every password on
 * every run, so adding one person to the list below and running it would have
 * silently locked out everyone who had already chosen their own. To reset
 * somebody who is genuinely locked out, name them:
 *
 *   npm run admin:create -- --reset president@faiita.co.in
 *
 * It never deletes anything.
 */

import { generatePassword, hashPassword } from "../lib/password";
import { prisma } from "../lib/prisma";

const ADMINS = [
  { email: "president@faiita.co.in", name: "President, FAIITA" },
  { email: "secretary@faiita.co.in", name: "Secretary, FAIITA" },
  { email: "jt.secy@faiita.co.in", name: "Joint Secretary, FAIITA" },
  { email: "ishaan.walia.148@gmail.com", name: "Ishaan Walia" },
];

async function main() {
  const resetIndex = process.argv.indexOf("--reset");
  const resetting =
    resetIndex === -1 ? [] : process.argv.slice(resetIndex + 1).map((e) => e.trim().toLowerCase());

  const issued: { email: string; password: string; why: string }[] = [];
  const untouched: string[] = [];

  for (const admin of ADMINS) {
    const existing = await prisma.adminUser.findUnique({ where: { email: admin.email } });

    if (existing && !resetting.includes(admin.email)) {
      untouched.push(admin.email);
      continue;
    }

    const password = generatePassword();
    const passwordHash = await hashPassword(password);
    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: { passwordHash, mustChangePassword: true, name: admin.name },
      create: { ...admin, passwordHash, mustChangePassword: true },
    });
    issued.push({ email: admin.email, password, why: existing ? "password reset" : "new account" });
  }

  if (issued.length === 0) {
    console.log("\n  Every account already exists — nothing changed.");
    console.log("  To reset one: npm run admin:create -- --reset <email>\n");
  } else {
    console.log("\n  Sign in at /admin/login. Each of these must be changed on first sign-in.\n");
    for (const { email, password, why } of issued) {
      console.log(`  ${email}  (${why})`);
      console.log(`  ${password}\n`);
    }
  }

  if (untouched.length > 0) {
    console.log(`  Left alone, already set up: ${untouched.join(", ")}\n`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
