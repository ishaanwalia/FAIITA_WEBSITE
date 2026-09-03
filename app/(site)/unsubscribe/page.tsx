import type { Metadata } from "next";
import { UnsubscribeForm } from "@/components/common/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  alternates: { canonical: "/unsubscribe" },
  // Indexable on purpose. A withdrawal route nobody can find is not a
  // withdrawal route, and the DPDP Rules expect a specific, reachable link
  // rather than an instruction to write to somebody.
  robots: { index: true, follow: true },
};

export default function UnsubscribePage() {
  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-xl">
        <h1 className="font-display text-3xl font-bold text-navy-800">
          Unsubscribe
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Enter the email address you subscribed with and we will remove it from
          the FAIITA mailing list. No sign-in, no reason needed.
        </p>

        <div className="mt-8">
          <UnsubscribeForm />
        </div>

        <p className="mt-10 text-xs leading-relaxed text-muted-foreground/80">
          This removes you from the newsletter list. If you have also sent us a
          message through the contact form and want that removed, or you want a
          copy of what we hold about you, write to us and say so — those rights
          are separate from this one and are handled by a person.
        </p>
      </div>
    </article>
  );
}
