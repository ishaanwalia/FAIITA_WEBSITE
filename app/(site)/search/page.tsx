import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { SearchClient } from "@/components/search/SearchClient";
import { getSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across FAIITA's state associations, news, events and resources.",
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

export default async function SearchPage() {
  const index = await getSearchIndex();

  return (
    <>
      <PageHero eyebrow="Search" title="Search FAIITA" description="Find state associations, news, events and more." />
      <section className="bg-background py-20">
        <div className="container-page">
          <SearchClient index={index} />
        </div>
      </section>
    </>
  );
}
