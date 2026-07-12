import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ContactForm } from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with FAIITA — office address, phone, and emails of the President and Secretary.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact FAIITA"
        description="Whether you're a state association looking to affiliate, a channel partner with a query, or a member of the press — we'd love to hear from you."
      />

      <section className="bg-background py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-7">
              <h2 className="font-display text-lg font-bold text-navy-800">Federation Office</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                  <span className="text-muted-foreground">404/95, Nehru Place, New Delhi — 110019, India</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                  <span className="text-muted-foreground">Monday – Saturday, 10:00 AM – 6:00 PM IST</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7">
              <h2 className="font-display text-lg font-bold text-navy-800">Secretary</h2>
              <p className="mt-1 text-sm font-medium text-saffron-600">Sanjeev Walia</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="mailto:secretary@faiita.co.in" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> secretary@faiita.co.in
                  </a>
                </li>
                <li>
                  <a href="tel:+911141620001" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> +91 11 4162 0001
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/60 p-7">
              <h2 className="font-display text-lg font-bold text-navy-800">President&apos;s Office</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="mailto:president@faiita.co.in" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> president@faiita.co.in
                  </a>
                </li>
                <li>
                  <a href="tel:+911141620000" className="flex items-center gap-3 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> +91 11 4162 0000
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
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
