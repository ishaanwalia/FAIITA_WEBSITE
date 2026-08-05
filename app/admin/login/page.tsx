import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-sm">
        <p className="section-eyebrow text-saffron-400">FAIITA</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Content admin</h1>
        <p className="mt-2 text-sm text-white/50">
          Sign in with the address the federation issued you.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
