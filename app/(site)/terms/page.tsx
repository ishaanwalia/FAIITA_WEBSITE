import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-navy-800">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            This website is operated by the Federation of All India
            Information Technology Associations (FAIITA). By using this
            site, you agree to use its content for lawful, informational
            purposes only.
          </p>
          <p>
            Content on this site — including text, graphics, and data about
            member associations — is provided for general information and
            may be updated without notice. FAIITA is not liable for
            decisions made solely on the basis of this website&apos;s content.
          </p>
          <p className="text-xs text-muted-foreground/70">
            This is placeholder legal text — replace with FAIITA&apos;s reviewed
            terms of use before launch.
          </p>
        </div>
      </div>
    </article>
  );
}
