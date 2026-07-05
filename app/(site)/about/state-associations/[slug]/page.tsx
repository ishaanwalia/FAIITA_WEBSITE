import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Mail, MapPin, Phone, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function generateStaticParams() {
  const states = await prisma.stateAssociation.findMany({ select: { slug: true } });
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = await prisma.stateAssociation.findUnique({ where: { slug } });
  if (!state) return { title: "State Association" };
  return {
    title: state.stateName,
    description: `${state.associationName} — FAIITA's IT trade association in ${state.stateName}.`,
  };
}

export default async function StateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = await prisma.stateAssociation.findUnique({
    where: { slug },
    include: { memberAssociations: true },
  });

  if (!state) notFound();

  return (
    <>
      <section className="bg-navy-800 py-20">
        <div className="container-page">
          <Link href="/about/state-associations" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> All state associations
          </Link>
          <span className="mt-6 inline-block rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-400">
            {state.region} Zone
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">{state.stateName}</h1>
          <p className="mt-2 text-lg text-white/60">{state.associationName}</p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-800">About the Association</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{state.description}</p>

            {state.memberAssociations.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-bold text-navy-800">Member Chapters</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {state.memberAssociations.map((m) => (
                    <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                      <h3 className="font-display text-sm font-bold text-navy-800">{m.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{m.city} · {m.type}</p>
                      <p className="mt-2 text-xs text-saffron-600">{m.memberCount.toLocaleString("en-IN")} members</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Users className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">{state.memberCount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <Calendar className="h-4 w-4 text-navy-700" />
                  <p className="mt-2 font-mono text-lg font-bold text-navy-800">{state.foundedYear ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Founded</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                {state.address && (
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" /> {state.address}
                  </p>
                )}
                {state.contactEmail && (
                  <a href={`mailto:${state.contactEmail}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Mail className="h-4 w-4" /> {state.contactEmail}
                  </a>
                )}
                {state.contactPhone && (
                  <a href={`tel:${state.contactPhone}`} className="flex items-center gap-2 text-navy-700 hover:underline">
                    <Phone className="h-4 w-4" /> {state.contactPhone}
                  </a>
                )}
              </div>
            </div>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-saffron-400"
            >
              <Building2 className="h-4 w-4" /> Partner with this association
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
