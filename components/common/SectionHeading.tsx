import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  /** The page's true title (rendered inside PageHero) must be an h1 — every
   *  other section heading on the page stays h2. Defaults to h2. */
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className={cn("section-eyebrow", light ? "text-saffron-400" : "text-saffron-700")}>{eyebrow}</span>
      )}
      <Tag
        className={cn(
          "mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-navy-800"
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-4 text-balance leading-relaxed", light ? "text-white/65" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
