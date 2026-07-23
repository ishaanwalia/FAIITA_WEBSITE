import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-navy-800">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            FAIITA collects only the information you choose to share through
            our contact and newsletter forms — name, email, phone, and
            message content — solely to respond to your enquiry and send
            federation updates you&apos;ve opted into.
          </p>
          <p>
            We do not sell or share your personal data with third parties.
            You may request removal from our mailing list at any time by
            contacting <a href="mailto:secretary@faiita.co.in" className="text-navy-700 underline">secretary@faiita.co.in</a>.
          </p>
          <p className="text-xs text-muted-foreground/70">
            This is placeholder policy text — replace with FAIITA&apos;s reviewed
            privacy policy before launch.
          </p>
        </div>
      </div>
    </article>
  );
}
