import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * The gate. Everything under app/admin/(dash) is behind it; /admin/login sits
 * outside the group precisely so it isn't.
 *
 * getAdmin() re-reads the user from the database on every request, so an admin
 * whose account is deleted, or who still owes us a password change, is caught
 * here rather than at the next login.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-navy-900 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="font-display text-sm font-bold">
            FAIITA <span className="text-saffron-400">admin</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="hidden sm:inline">{admin.email}</span>
            <Link href="/admin/password" className="hover:text-white">
              Password
            </Link>
            <form action={logout}>
              <button type="submit" className="hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
