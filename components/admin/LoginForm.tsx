"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type FormState } from "@/app/admin/actions";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-saffron-400 focus:outline-none focus:ring-1 focus:ring-saffron-400";
const label = "text-xs font-semibold uppercase tracking-wide text-white/50";

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-saffron-400 disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(login, {});

  return (
    <form action={action} className="mt-8">
      <label className={label} htmlFor="email">
        Email
      </label>
      <input id="email" name="email" type="email" autoComplete="username" required className={field} />

      <label className={`${label} mt-4 block`} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className={field}
      />

      {state.error && (
        <p role="alert" className="mt-4 text-sm text-saffron-300">
          {state.error}
        </p>
      )}

      <Submit>Sign in</Submit>
    </form>
  );
}
