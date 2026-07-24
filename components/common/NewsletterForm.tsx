"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      <p className="flex items-center gap-2 text-sm text-federal-green">
        <CheckCircle2 className="h-4 w-4" /> Subscribed — thank you!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
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
  );
}
