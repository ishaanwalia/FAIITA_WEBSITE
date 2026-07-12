import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Building2, Network, Users, Vote } from "lucide-react";

export const metadata: Metadata = {
  title: "About FAIITA",
  description: "The history and organizational structure of the Federation of All India Information Technology Associations.",
};

const structure = [
  { icon: Building2, title: "National Governing Body", subtitle: "FAIITA Executive Committee", detail: "President, Senior Vice President, Secretary & Treasurer set national policy and represent the federation to government bodies." },
  { icon: Network, title: "State Associations", subtitle: "28 States Covered", detail: "Each state operates its own registered IT association, electing its own leadership and running local programs." },
  { icon: Building2, title: "Member Associations", subtitle: "100+ Associations", detail: "City and regional associations affiliate with their state body, focused on Retail, Distribution, Services & Solutions." },
  { icon: Users, title: "Channel Partners", subtitle: "50,000+ Individuals & Businesses", detail: "The IT retailers, resellers, system integrators, and service providers who form the federation's grassroots base." },
];

const gbComposition = [
  { role: "President", note: "Chief spokesperson and signatory for the federation" },
  { role: "Senior Vice President", note: "The President's right hand — second-in-command, ready to lead in his stead" },
  { role: "Secretary", note: "Day-to-day administration and correspondence" },
  { role: "Joint Secretary", note: "Supports the Secretary across administration and member coordination" },
  { role: "Treasurer", note: "Financial planning and membership dues" },
  { role: "Joint Treasurer", note: "Assists the Treasurer with accounts and financial record-keeping" },
  { role: "Advisor", note: "Past leadership guiding the Governing Body with institutional wisdom" },
  { role: "State Representatives", note: "One delegate nominated per affiliated state association" },
];

export default function AboutFaiitaPage() {
  return (
    <>
      <PageHero
        eyebrow="About / About FAIITA"
        title="About FAIITA"
        description="Formed to give India's IT trade ecosystem a single, powerful national voice."
      />

      <section className="bg-background py-24">
        <div className="container-page grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-800">Our Story</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                FAIITA — the Federation of All India Information Technology
                Associations — was formally established in 2014 to unite the
                many independent state-level IT trade associations that had
                been advocating individually for their members since the
                early 1990s.
              </p>
              <p>
                By federating under one umbrella, these associations gained a
                combined voice strong enough to engage directly with the GST
                Council, the Ministry of Electronics & IT, and state
                governments — turning fragmented, local advocacy into
                coordinated national impact.
              </p>
              <p>
                Today, FAIITA represents state associations across 28 states, 100+ member
                associations, and over 50,000 channel partners spanning
                retail, distribution, services, and solutions businesses
                across India.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy-800">Federation Structure</h2>
            <p className="mt-2 text-sm text-muted-foreground">How FAIITA is organized, from national leadership to grassroots channel partners.</p>

            <div className="relative mt-8 space-y-6">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-border" aria-hidden />
              {structure.map((tier) => (
                <div key={tier.title} className="relative flex gap-5 pl-0">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-navy-700 text-white">
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-card p-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-saffron-600">
                      {tier.subtitle}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold text-navy-800">{tier.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tier.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Governance"
            title="The Governing Body"
            description="FAIITA's national affairs are steered by an elected Governing Body (GB) serving a fixed two-year term, ensuring regular renewal of leadership and equal opportunity for every state association to be represented nationally."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <ScrollReveal direction="left">
              <div className="rounded-3xl border border-border bg-card p-8">
                <h3 className="font-display text-lg font-bold text-navy-800">Composition</h3>
                <ul className="mt-5 space-y-4">
                  {gbComposition.map((c) => (
                    <li key={c.role} className="flex gap-4">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron-500" />
                      <div>
                        <p className="text-sm font-semibold text-navy-800">{c.role}</p>
                        <p className="text-xs text-muted-foreground">{c.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-3xl border border-border bg-card p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700">
                  <Vote className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-800">Term & Election</h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    The Governing Body serves a <strong className="text-navy-800">two-year term</strong>,
                    after which elections are held among nominated representatives
                    of all affiliated state associations.
                  </p>
                  <p>
                    This rotation keeps FAIITA's leadership responsive to
                    changing regional priorities while preserving institutional
                    continuity through overlapping outgoing and incoming members.
                  </p>
                  <p>
                    See the <a href="/about/leadership" className="text-navy-700 underline">Leadership page</a> for
                    the current Governing Body and a record of past terms.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
