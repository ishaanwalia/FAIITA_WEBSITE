"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NEWSLETTER_PURPOSE } from "@/lib/dpdp";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_url: companyUrl }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-sm text-federal-green-dark">
          <CheckCircle2 className="h-4 w-4" /> Subscribed — thank you!
        </p>
        <p className="text-xs text-white/60">
          Changed your mind?{" "}
          <Link href="/unsubscribe" className="underline hover:text-white">
            Unsubscribe
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={companyUrl}
        onChange={(e) => setCompanyUrl(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <label htmlFor="newsletter-email" className="sr-only">
        Your email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/60 focus:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
      />
      <MagneticButton
        type="submit"
        variant="accent"
        size="sm"
        disabled={status === "loading"}
        className="shrink-0"
        aria-label="Subscribe to newsletter"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </MagneticButton>
    </form>

    {/* Notice at the point of collection — DPDP Sec. 5.
        Typing an address into a box labelled "subscribe" is already a clear
        affirmative action for that purpose, so a separate checkbox is not what
        was missing. What was missing is telling the person what the address is
        used for and how to stop — and, under Sec. 6(4), a way out that is as
        easy as the way in. `/unsubscribe` mirrors this form exactly. */}
    <p className="mt-3 text-xs leading-relaxed text-white/60">
      {NEWSLETTER_PURPOSE}{" "}
      <Link href="/unsubscribe" className="underline hover:text-white">
        Unsubscribe
      </Link>{" "}
      or read our{" "}
      <Link href="/privacy" className="underline hover:text-white">
        privacy policy
      </Link>
      .
    </p>
    </>
  );
}
