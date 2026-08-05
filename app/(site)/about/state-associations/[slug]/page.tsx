import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Globe, Mail, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { jsonLd, normalizeZone } from "@/lib/utils";
import { LogoImage } from "@/components/common/LogoImage";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const revalidate = 3600;

const findState = (slug: string) =>
  prisma.stateAssociation.findFirst({ where: { slug, deletedAt: null } });

export async function generateStaticParams() {
  const states = await prisma.stateAssociation.findMany({
    where: { deletedAt: null },
    select: { slug: true },
  });
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = await findState(slug);
  if (!state) return { title: "State Association" };
  return {
    title: state.stateName,
    description: `${state.associationName} — FAIITA's IT trade association in ${state.stateName}.`,
    alternates: { canonical: `/about/state-associations/${slug}` },
    openGraph: { images: [`/api/og?eyebrow=State+Association&title=${encodeURIComponent(state.stateName)}`] },
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

export default async function StateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = await findState(slug);
  if (!state) notFound();

  // Each state chapter is a real organisation, not just a page about one.
  // memberOf points at the same @id the root layout publishes, so a crawler
  // reads 33 associations belonging to one federation rather than 33
  // unconnected bodies. Optional fields are omitted rather than sent empty —
  // an Organization asserting `email: ""` is worse than one that stays quiet.
  const associationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/about/state-associations/${slug}#organization`,
    name: state.associationName,
    url: `${siteUrl}/about/state-associations/${slug}`,
    description: state.description ?? `${state.associationName} — FAIITA's IT trade association in ${state.stateName}.`,
    memberOf: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "State", name: state.stateName },
    ...(state.logoUrl && { logo: state.logoUrl.startsWith("http") ? state.logoUrl : `${siteUrl}${state.logoUrl}` }),
    ...(state.foundedYear && { foundingDate: String(state.foundedYear) }),
    ...(state.contactEmail && { email: state.contactEmail }),
    ...(state.contactPhone && { telephone: state.contactPhone }),
    ...(state.websiteUrl && { sameAs: [state.websiteUrl] }),
    ...(state.address && {
      address: { "@type": "PostalAddress", streetAddress: state.address, addressRegion: state.stateName, addressCountry: "IN" },
    }),
    // Deliberately no office bearers here. The page itself withholds president
    // names and phone numbers because they rotate per association on different
    // cycles (see the note further down) — publishing them in structured data
    // would leak exactly what the page is choosing not to say.
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(associationSchema) }} />
      <section className="bg-navy-800 py-20">
        <div className="container-page">
          <Breadcrumbs
            light
            items={[{ label: "State Associations", href: "/about/state-associations" }, { label: state.stateName }]}
          />
          <Link href="/about/state-associations" className="mt-4 flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> All state associations
          </Link>
          <span className="mt-6 inline-block rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-400">
            {normalizeZone(state.region)} Zone
          </span>
          <div className="mt-4 flex items-center gap-4">
            <LogoImage logoUrl={state.logoUrl} alt={state.associationName} size="lg" className="border-white/10 bg-white" />
            <div>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{state.stateName}</h1>
              <p className="mt-2 text-lg text-white/60">{state.associationName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-800">About the Association</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{state.description}</p>

          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Users className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">
                    {state.memberCount > 0 ? state.memberCount.toLocaleString("en-IN") : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <Calendar className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">{state.foundedYear ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Founded</p>
                </div>
              </div>
              {/* Only the long-lived facts are shown here (about text, member
                  count, founding year, emails, website, logo, state name).
                  President names, phone numbers and city were removed on
                  purpose — office bearers rotate per association on different
                  cycles, so that info is added back only when each
                  association confirms its current details. */}
              <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                {state.contactEmail && (
                  <a href={`mailto:${state.contactEmail}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> {state.contactEmail}
                  </a>
                )}
                {state.secretaryEmail && (
                  <a href={`mailto:${state.secretaryEmail}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> {state.secretaryEmail}
                  </a>
                )}
                {state.websiteUrl && (
                  <a
                    href={state.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-navy-700 hover:underline"
                  >
                    <Globe className="h-4 w-4" /> {state.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
            {/* NOTE (partnership CTA): this should reach the association's own
                secretary. Only FITAG's secretary email (secretary@fitag.in) is
                verified so far — as each association confirms theirs, set
                `secretaryEmail` in prisma/seed.ts and reseed; pages without one
                fall back to FAIITA's national secretary inbox. */}
            <a
              href={`mailto:${state.secretaryEmail ?? "secretary@faiita.co.in"}`}
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
