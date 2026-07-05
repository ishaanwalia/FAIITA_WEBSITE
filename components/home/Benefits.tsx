import {
  Landmark,
  Network,
  BookOpenText,
  Megaphone,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";

const benefits = [
  {
    icon: Landmark,
    title: "Shape the Future",
    description: "Influence national IT policies and be part of decisions that shape India's technology landscape.",
  },
  {
    icon: Network,
    title: "Strategic Networking",
    description: "Connect with 50,000+ IT entrepreneurs, vendors, and government stakeholders across India.",
  },
  {
    icon: BookOpenText,
    title: "Knowledge & Insights",
    description: "Access exclusive industry reports, market trends, and expert-led training programs.",
  },
  {
    icon: Megaphone,
    title: "Branding & Visibility",
    description: "Showcase your association and members on a national platform with media coverage.",
  },
  {
    icon: ShieldCheck,
    title: "Advocacy Support",
    description: "FAIITA represents your interests before government bodies, the GST Council, and regulators.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Partner with fellow state associations for joint initiatives, events, and business opportunities.",
  },
];

export function Benefits() {
  return (
    <section className="bg-background py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why FAIITA"
          title="Membership Benefits"
          description="State IT associations that join FAIITA gain access to a powerful national network and exclusive resources."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} direction="up" delay={i * 0.06}>
              <TiltCard maxTilt={6}>
                <GlassCard variant="light">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700 transition-colors group-hover:bg-saffron-500 group-hover:text-navy-900">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-navy-800">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </GlassCard>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
