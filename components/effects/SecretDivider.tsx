"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ElasticStrings } from "./ElasticStrings";

/**
 * The homepage's pluckable string divider, wired with an unadvertised CMS
 * entry: click the strings (not hover) top-to-bottom in this order. No
 * on-screen hint — /admin/login always works too, this is just a shortcut.
 * A wrong click doesn't lock you out, it just restarts the sequence.
 */
const ORDER = [3, 1, 2];

export function SecretDivider({ className }: { className?: string }) {
  const router = useRouter();
  const progress = useRef(0);

  const onStringClick = (position: number) => {
    progress.current = position === ORDER[progress.current] ? progress.current + 1 : Number(position === ORDER[0]);
    if (progress.current === ORDER.length) {
      progress.current = 0;
      router.push("/admin/login");
    }
  };

  return <ElasticStrings strings={3} tone="light" className={className} onStringClick={onStringClick} />;
}
