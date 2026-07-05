import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2
        className={cn(
          "mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-navy-800"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-balance leading-relaxed", light ? "text-white/65" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
