type DividerType = "wave" | "diagonal" | "curve";

const PATHS: Record<DividerType, string> = {
  wave: "M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,40 L1440,100 L0,100 Z",
  diagonal: "M0,100 L1440,0 L1440,100 Z",
  curve: "M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z",
};

export function SectionDivider({
  type = "wave",
  flip = false,
  className = "",
}: {
  type?: DividerType;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative h-20 w-full overflow-hidden sm:h-28 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`divider-gradient-${type}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B2A4A" />
            <stop offset="50%" stopColor="#123A61" />
            <stop offset="100%" stopColor="#F2921D" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path d={PATHS[type]} fill={`url(#divider-gradient-${type})`} opacity="0.9" />
      </svg>
    </div>
  );
}
