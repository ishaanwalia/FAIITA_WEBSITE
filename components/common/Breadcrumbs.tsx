import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD. The last
 * crumb has no href (it's the current page) and is not a link.
 */
export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" className={light ? "text-white/50" : "text-muted-foreground"}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs">
          {all.map((item, i) => {
            const isLast = i === all.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" aria-hidden />}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined} className={light ? "text-white/80" : "text-navy-700"}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
