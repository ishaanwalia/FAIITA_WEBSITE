import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Leadership } from "@/components/about/Leadership";
import { extraCurrentLeaders, withLeaderProfile } from "@/lib/leader-profiles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet FAIITA's current and past national governing bodies.",
};

export const revalidate = 3600;

export default async function LeadershipPage() {
  const allLeaders = (
    await prisma.leader.findMany({
      where: { category: "national" },
      orderBy: { order: "asc" },
    })
  ).map(withLeaderProfile);

  // Members not yet in the DB are appended from the code-side profile file.
  const current = [...allLeaders.filter((l) => l.isCurrent), ...extraCurrentLeaders];
  const past = allLeaders.filter((l) => !l.isCurrent);

  return (
    <>
      <PageHero
        eyebrow="About / Leadership"
        title="National Leadership"
        description="FAIITA's Governing Body (GB) serves a two-year term. Browse the current GB, or look back at the previous term below."
      />

      <section className="bg-background py-24">
        <div className="container-page">
          <Leadership current={current} past={past} />
        </div>
      </section>
    </>
  );
}
