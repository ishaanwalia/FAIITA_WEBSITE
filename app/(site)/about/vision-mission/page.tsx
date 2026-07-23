import type { Metadata } from "next";
import {
  Compass,
  Target,
  Sparkles,
  Truck,
  Newspaper,
  Landmark,
  Video,
  Scale,
  Handshake,
  GraduationCap,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "Team FAIITA '25–27 — Empowering IT dealers and strengthening the industry across 26 states.",
  alternates: { canonical: "/about/vision-mission" },
};

export const revalidate = 3600;

const pillars = [
  {
    icon: Compass,
    title: "Our Vision",
    body: "To strengthen and empower the IT channel ecosystem across India by fostering collaboration, transparency, and growth among dealers, distributors, and industry stakeholders.",
  },
  {
    icon: Target,
    title: "Our Mission",
    body: "To build a strong, unified, and future-ready IT dealer community through innovation, ethical business practices, and mutual support. By advocating fair trade policies and embracing digital transformation, FAIITA aims to become the most influential voice in the IT retail and distribution sector.",
  },
  {
    icon: Sparkles,
    title: "Our Values",
    body: "Integrity in advocacy, inclusivity across states and business sizes, and a relentless focus on practical outcomes for the members who make up the federation.",
  },
];

const initiatives = [
  {
    icon: Truck,
    title: "Support Channel to the Last Mile",
    points: [
      "Strengthen distribution networks for seamless supply chain management.",
      "Provide strategic support for Tier-2, Tier-3, and rural dealers.",
      "Ensure fair competition and equal growth opportunities.",
    ],
  },
  {
    icon: Newspaper,
    title: "Quarterly E-Bulletin for Members",
    points: [
      "Deliver insights on industry trends, policies, and market strategies.",
      "Share member success stories and expert opinions.",
    ],
  },
  {
    icon: Landmark,
    title: "State-Wise Leadership Meetings",
    points: [
      "Facilitate discussions between FAIITA and State IT Associations.",
      "Address regional challenges and advocate for dealer-centric policies.",
    ],
  },
  {
    icon: Video,
    title: "Monthly OB Meetings on Zoom",
    points: [
      "Enable real-time communication and action plans for market challenges.",
      "Promote transparency by sharing updates with all stakeholders.",
    ],
  },
  {
    icon: Scale,
    title: "Advocacy & Policy Representation",
    points: [
      "Engage with government bodies and policymakers to push for fair trade policies.",
      "Establish legal support frameworks to protect dealers from unfair practices.",
    ],
  },
  {
    icon: Handshake,
    title: "Strengthening Vendor-Partner Relations",
    points: [
      "Improve trade margins, warranty claims, and after-sales support.",
      "Build long-term vendor collaborations to enhance profitability.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Skill Development & Training Programs",
    points: [
      "Offer training on AI, cloud computing, cybersecurity, and digital marketing.",
      "Provide mentorship and support for young entrepreneurs.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Digital Transformation",
    points: [
      "Educate dealers on data protection laws and cybersecurity best practices.",
      "Encourage adoption of e-commerce, automation, and digital payments.",
    ],
  },
  {
    icon: Globe2,
    title: "Networking & Business Growth",
    points: [
      "Organize expos, B2B networking events, and industry conferences.",
      "Facilitate cross-region partnerships to expand market reach.",
    ],
  },
];

export default function VisionMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="About / Vision & Mission"
        title="Vision, Mission & Goals"
        description="Team FAIITA '25–27 — Empowering IT Dealers, Strengthening the Industry."
      />

      <section className="bg-background py-24">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} direction="up" delay={i * 0.08}>
                <TiltCard maxTilt={6} className="h-full">
                  <GlassCard variant="light" className="h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700">
                      <p.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 font-display text-xl font-bold text-navy-800">{p.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </GlassCard>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-24">
            <SectionHeading
              eyebrow="Team FAIITA '25–27"
              title="Key Objectives & Initiatives"
              description="The programs and commitments driving the federation forward over the current term."
              align="center"
              className="mx-auto"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {initiatives.map((item, i) => (
                <ScrollReveal key={item.title} direction="up" delay={(i % 3) * 0.08}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-saffron-500/40 hover:shadow-xl">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700 transition-colors group-hover:bg-saffron-500 group-hover:text-navy-900">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-navy-800">{item.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {item.points.map((pt) => (
                        <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal direction="scale">
            <div className="relative mt-24 overflow-hidden rounded-3xl bg-navy-800 p-10 text-center sm:p-14">
              <div aria-hidden className="animated-gradient absolute inset-0" />
              <div className="absolute inset-0 bg-network-grid opacity-10" />
              <div aria-hidden className="aurora-orb -left-10 top-0 h-56 w-56 bg-saffron-500/15" />
              <div aria-hidden className="aurora-orb -right-10 bottom-0 h-56 w-56 bg-federal-green/15 [animation-delay:-6s]" />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl">
                  Together, We <span className="gradient-text">Grow Stronger!</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-balance text-white/65">
                  Join us in shaping the future of IT retail and distribution.
                  FAIITA: a united front for IT dealers nationwide.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="mt-24 flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-10 text-center sm:p-14">
              <SectionHeading
                eyebrow="Our Reach"
                title="A Vision Realized Across 26 States"
                description="Explore the full interactive map of FAIITA's member associations on our About page."
                align="center"
              />
              <MagneticButton asChild variant="accent" size="lg">
                <Link href="/about#map">View the State Map</Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
