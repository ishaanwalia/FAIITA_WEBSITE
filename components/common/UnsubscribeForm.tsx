"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Withdrawal of newsletter consent — DPDP Sec. 6(4).
 *
 * Deliberately the same shape as `NewsletterForm`: one email field, one
 * button, no account. The legal test is that withdrawing consent is as easy as
 * giving it, and the most reliable way to satisfy that is to mirror the form
 * that gave it.
 */
export function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="flex items-start gap-2 text-sm text-federal-green-dark">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        {/* Worded so it says nothing about whether that address was on the
            list. The route answers identically either way, and a message
            saying "you were not subscribed" would undo that on the screen. */}
        <span>
          If that address was on our mailing list, it has been removed. You will
          not receive further FAIITA updates at it.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="unsubscribe-email" className="sr-only">
        Your email address
      </label>
      <input
        id="unsubscribe-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full min-w-0 rounded-full border border-navy-800/15 bg-white px-4 py-3 text-base text-navy-800 placeholder:text-muted-foreground focus:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
      />
      <MagneticButton
        type="submit"
        variant="accent"
        size="sm"
        disabled={status === "loading"}
        className="shrink-0"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Unsubscribe"
        )}
      </MagneticButton>

      {status === "error" ? (
        <p role="alert" className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
