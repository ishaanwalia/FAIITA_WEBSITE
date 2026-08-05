"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, type FormState } from "@/app/admin/actions";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-saffron-400 focus:outline-none focus:ring-1 focus:ring-saffron-400";
const label = "text-xs font-semibold uppercase tracking-wide text-white/50";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-saffron-400 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save password"}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changePassword, {});

  return (
    <form action={action} className="mt-8">
      <label className={label} htmlFor="current">
        Current password
      </label>
      <input
        id="current"
        name="current"
        type="password"
        autoComplete="current-password"
        required
        className={field}
      />

      <label className={`${label} mt-4 block`} htmlFor="next">
        New password
      </label>
      <input
        id="next"
        name="next"
        type="password"
        autoComplete="new-password"
        required
        minLength={12}
        className={field}
      />
      <p className="mt-1.5 text-xs text-white/30">At least 12 characters.</p>

      <label className={`${label} mt-4 block`} htmlFor="confirm">
        Repeat new password
      </label>
      <input
        id="confirm"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        className={field}
      />

      {state.error && (
        <p role="alert" className="mt-4 text-sm text-saffron-300">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
