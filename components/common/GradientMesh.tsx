import { cn } from "@/lib/utils";

export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-float-slow rounded-full bg-saffron-500/20 blur-[100px]" />
      <div
        className="absolute -right-24 top-1/3 h-80 w-80 animate-float-slow rounded-full bg-navy-500/30 blur-[100px]"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-72 w-72 animate-float-slow rounded-full bg-federal-green/15 blur-[100px]"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
}
