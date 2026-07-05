import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={light ? "text-white/50 hover:text-white" : "text-muted-foreground hover:text-navy-700"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={light ? "text-white/80" : "text-navy-800"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className={light ? "h-3 w-3 text-white/30" : "h-3 w-3 text-muted-foreground/50"} />}
          </span>
        );
      })}
    </nav>
  );
}
