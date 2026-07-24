import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ContactForm } from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with FAIITA — office address, phone, and emails of the President and Secretary.",
  alternates: { canonical: "/contact" },
};

const INTENT_COPY: Record<string, { eyebrow: string; description: string; subject: string }> = {
  membership: {
    eyebrow: "State Association Membership",
    description:
      "Tell us about your state association and the office-bearer we should be talking to — we'll walk you through affiliation, member benefits, and next steps.",
    subject: "State Association Membership Inquiry",
  },
  sponsorship: {
    eyebrow: "Partner With FAIITA",
    description:
      "Reach 50,000+ IT channel partners across 26 states. Tell us about your brand and what kind of partnership you have in mind — event sponsorship, a channel program, or something else.",
    subject: "Sponsorship / Brand Partnership Inquiry",
  },
  press: {
    eyebrow: "Press & Media",
    description: "Working on a story about FAIITA or the IT channel trade? Tell us what you need and our team will get back to you.",
    subject: "Press Inquiry",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const copy = intent ? INTENT_COPY[intent] : undefined;

  return (
    <>
      <PageHero
        eyebrow={copy?.eyebrow ?? "Get in Touch"}
        title="Contact FAIITA"
        description={
          copy?.description ??
          "Whether you're a state association looking to affiliate, a channel partner with a query, or a member of the press — we'd love to hear from you."
        }
      />

      <section className="bg-background py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-7">
              <h2 className="font-display text-lg font-bold text-navy-800">President Office</h2>
              <p className="mt-1 text-sm font-medium text-saffron-700">Navin Gupta — President</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                  <span className="text-muted-foreground">01, Boring Road, Patna 800001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-navy-700" />
                  <span>
                    <a href="tel:+919334715522" className="text-navy-700 hover:underline">9334715522</a>
                    <span className="text-muted-foreground">, </span>
                    <a href="tel:+919709401552" className="text-navy-700 hover:underline">9709401552</a>
                  </span>
                </li>
                <li>
                  <a href="mailto:president@faiita.co.in" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> president@faiita.co.in
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7">
              <h2 className="font-display text-lg font-bold text-navy-800">Secretary Office</h2>
              <p className="mt-1 text-sm font-medium text-saffron-700">Sanjeev Walia — Secretary</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                  <span className="text-muted-foreground">SCO-12, 1st Floor, Sector-17/E, Chandigarh 160017 (U.T.)</span>
                </li>
                <li>
                  <a href="tel:+919814958290" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> 9814958290
                  </a>
                </li>
                <li>
                  <a href="mailto:secretary@faiita.co.in" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> secretary@faiita.co.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-display text-xl font-bold text-navy-800">Send Us a Message</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill out the form and our team will respond within 2 business days.
            </p>
            <div className="mt-6">
              <ContactForm defaultSubject={copy?.subject} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
