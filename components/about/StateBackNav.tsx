"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

// The zone tab a visitor filtered by lives in the listing page's URL, not in
// component state (see StateAssociationsGrid). Reading it back here — client
// side, so the [slug] page itself can stay statically generated — means the
// breadcrumb and "back" link return to that same filtered view instead of
// always landing on the unfiltered list.
function BackNavInner({ stateName }: { stateName: string }) {
  const zone = useSearchParams().get("zone");
  const href = zone ? `/about/state-associations?zone=${zone}` : "/about/state-associations";
  return <BackNav href={href} stateName={stateName} />;
}

function BackNav({ href, stateName }: { href: string; stateName: string }) {
  return (
    <>
      <Breadcrumbs light items={[{ label: "State Associations", href }, { label: stateName }]} />
      <Link href={href} className="mt-4 flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> All state associations
      </Link>
    </>
  );
}

export function StateBackNav({ stateName }: { stateName: string }) {
  return (
    <Suspense fallback={<BackNav href="/about/state-associations" stateName={stateName} />}>
      <BackNavInner stateName={stateName} />
    </Suspense>
  );
}
