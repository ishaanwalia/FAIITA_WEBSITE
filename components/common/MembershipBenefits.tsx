import Image from "next/image";
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
    image: "/images/gallery/faiita-election-highlight.jpg",
  },
  {
    icon: Network,
    title: "Strategic Networking",
    description: "Connect with 50,000+ IT entrepreneurs, vendors, and government stakeholders across India.",
    image: "/images/gallery/faiita-election-2022-chandigarh-02.jpeg",
  },
  {
    icon: BookOpenText,
    title: "Knowledge & Insights",
    description: "Access exclusive industry reports, market trends, and expert-led training programs.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
  },
  {
    icon: Megaphone,
    title: "Branding & Visibility",
    description: "Showcase your association and members on a national platform with media coverage.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Advocacy Support",
    description: "FAIITA represents your interests before government bodies, the GST Council, and regulators.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Partner with fellow state associations for joint initiatives, events, and business opportunities.",
    image: "/images/gallery/faiita-election-2022-chandigarh-01.jpeg",
  },
];

export function MembershipBenefits({ eyebrow = "Why FAIITA" }: { eyebrow?: string }) {
  return (
    <section className="bg-background py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow={eyebrow}
          title="Membership Benefits"
          description="State IT associations that join FAIITA gain access to a powerful national network and exclusive resources."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} direction="up" delay={i * 0.06} className="h-full">
              <TiltCard maxTilt={6} className="h-full">
                <GlassCard variant="light" className="flex h-full flex-col overflow-hidden !p-0">
                  <div className="relative h-40 w-full shrink-0 overflow-hidden">
                    <Image
                      src={b.image}
                      alt=""
                      fill
                      quality={68}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-xl bg-saffron-500 text-navy-900">
                      <b.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-navy-800">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  </div>
                </GlassCard>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
