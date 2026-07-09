import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

const HEX_CLIP = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

export function MaskedAvatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div className={cn("group relative shrink-0", SIZES[size], className)}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-saffron-400 to-saffron-600 transition-transform duration-500 group-hover:rotate-[18deg]"
        style={{ clipPath: HEX_CLIP }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-navy-900">{initials}</span>
      </div>
    </div>
  );
}
