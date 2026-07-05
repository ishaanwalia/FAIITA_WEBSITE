import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Leadership } from "@/components/about/Leadership";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet FAIITA's current and past national governing bodies.",
};

export const revalidate = 3600;

export default async function LeadershipPage() {
  const allLeaders = await prisma.leader.findMany({
    where: { category: "national" },
    orderBy: { order: "asc" },
  });

  const current = allLeaders.filter((l) => l.isCurrent);
  const past = allLeaders.filter((l) => !l.isCurrent);

  return (
    <>
      <section className="bg-navy-800 py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="About / Leadership"
            title="National Leadership"
            description="FAIITA's Governing Body (GB) serves a two-year term. Browse the current GB, or look back at the previous term below."
            light
          />
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container-page">
          <Leadership current={current} past={past} />
        </div>
      </section>
    </>
  );
}
