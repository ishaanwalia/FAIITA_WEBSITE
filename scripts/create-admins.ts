/**
 * Creates (or resets) the three CMS admin accounts and prints their passwords
 * ONCE. Run with: npm run admin:create
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
 * Re-running resets the password of an existing account (and re-arms the
 * forced change). It never deletes anything.
 */

import { generatePassword, hashPassword } from "../lib/password";
import { prisma } from "../lib/prisma";

const ADMINS = [
  { email: "president@faiita.co.in", name: "President, FAIITA" },
  { email: "secretary@faiita.co.in", name: "Secretary, FAIITA" },
  { email: "ishaan.walia.148@gmail.com", name: "Ishaan Walia" },
];

async function main() {
  const created: { email: string; password: string }[] = [];

  for (const admin of ADMINS) {
    const password = generatePassword();
    const passwordHash = await hashPassword(password);
    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: { passwordHash, mustChangePassword: true, name: admin.name },
      create: { ...admin, passwordHash, mustChangePassword: true },
    });
    created.push({ email: admin.email, password });
  }

  console.log("\n  Admin accounts ready. Sign in at /admin/login.\n");
  for (const { email, password } of created) {
    console.log(`  ${email}`);
    console.log(`  ${password}\n`);
  }
  console.log("  Each account must change its password on first sign-in.\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
