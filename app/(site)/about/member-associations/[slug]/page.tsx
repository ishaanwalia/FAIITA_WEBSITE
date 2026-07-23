import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Globe, Mail, Phone, Users } from "lucide-react";
import { memberAssociations } from "@/lib/member-associations";
import { LogoImage } from "@/components/common/LogoImage";
import { DemoBadge } from "@/components/ui/DemoBadge";

export function generateStaticParams() {
  return memberAssociations.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = memberAssociations.find((m) => m.slug === slug);
  if (!member) return { title: "Member Association" };
  return {
    title: member.name,
    description: `${member.name} — FAIITA-affiliated IT association in ${member.city}, ${member.stateName}.`,
    alternates: { canonical: `/about/member-associations/${slug}` },
    openGraph: { images: [`/api/og?eyebrow=Member+Association&title=${encodeURIComponent(member.name)}`] },
  };
}

export default async function MemberDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = memberAssociations.find((m) => m.slug === slug);
  if (!member) notFound();

  return (
    <>
      <section className="bg-navy-800 py-20">
        <div className="container-page">
          <Link href="/about/member-associations" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> All member associations
          </Link>
          <div className="mt-6 flex items-center gap-2">
            <span className="inline-block rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-400">
              {member.city}, {member.stateName}
            </span>
            {member.isDemo && <DemoBadge />}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <LogoImage logoUrl={member.logoUrl} alt={member.name} size="lg" className="border-white/10 bg-white" />
            <div>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{member.name}</h1>
              <p className="mt-2 text-lg text-white/60">{member.type} · {member.stateName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-800">About the Association</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{member.description}</p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Users className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">
                    {member.memberCount > 0 ? member.memberCount.toLocaleString("en-IN") : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <Calendar className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">{member.foundedYear ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Founded</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                {member.contactEmail && (
                  <a href={`mailto:${member.contactEmail}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> {member.contactEmail}
                  </a>
                )}
                {member.contactPhone && (
                  <a href={`tel:${member.contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> {member.contactPhone}
                    {member.secretaryPhone && <span className="text-xs text-muted-foreground">(President)</span>}
                  </a>
                )}
                {member.secretaryPhone && (
                  <a href={`tel:${member.secretaryPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> {member.secretaryPhone}
                    <span className="text-xs text-muted-foreground">(Secretary)</span>
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-navy-700 hover:underline"
                  >
                    <Globe className="h-4 w-4" /> {member.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
            <a
              href={`mailto:${member.contactEmail ?? "secretary@faiita.co.in"}`}
              className="flex items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-saffron-400"
            >
              <Building2 className="h-4 w-4" /> Partner with this association
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
