import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

export function PhotoAvatar({
  initials,
  imageUrl,
  size = "md",
  hoverZoom = false,
  className,
}: {
  initials: string;
  imageUrl?: string | null;
  size?: keyof typeof SIZES;
  /** Scales the avatar 2x on hover of the nearest `group` ancestor (e.g. a card). */
  hoverZoom?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative z-10 shrink-0 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 ease-out",
        SIZES[size],
        hoverZoom && "group-hover:z-20 group-hover:scale-[2]",
        className
      )}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron-400 to-saffron-600">
          <span className="font-display font-bold text-navy-900">{initials}</span>
        </div>
      )}
    </div>
  );
}
