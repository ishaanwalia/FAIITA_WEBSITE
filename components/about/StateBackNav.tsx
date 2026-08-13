"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

// The zone tab a visitor filtered by lives in the listing page's URL (see
// StateAssociationsGrid). Reading it back here via plain window.location —
// not useSearchParams — because a useSearchParams() consumer on this
// statically-generated page forces its Suspense boundary into
// BAILOUT_TO_CLIENT_SIDE_RENDERING, which never resolved on a hard
// navigation and left the section blank. window.location sidesteps that.
export function StateBackNav({ stateName }: { stateName: string }) {
  const [href, setHref] = useState("/about/state-associations");

  useEffect(() => {
    const zone = new URLSearchParams(window.location.search).get("zone");
    if (zone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHref(`/about/state-associations?zone=${zone}`);
    }
  }, []);

  return (
    <>
      <Breadcrumbs light items={[{ label: "State Associations", href }, { label: stateName }]} />
      <Link href={href} className="mt-4 flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> All state associations
      </Link>
    </>
  );
}
