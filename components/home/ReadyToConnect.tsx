import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotlightSection } from "@/components/common/SpotlightSection";

export function ReadyToConnect() {
  return (
    <SpotlightSection className="overflow-hidden bg-navy-800 py-24">
      <div className="absolute inset-0 bg-network-grid opacity-20" aria-hidden />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron-500/10 blur-3xl" aria-hidden />
      <div className="container-page relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Connect with India&apos;s 100+ <span className="gradient-text">Member Associations</span>?
        </h2>
        <p className="max-w-xl text-balance text-white/60">
          Whether you represent a state association or a channel partner
          business, FAIITA&apos;s member associations are ready to collaborate on
          policy, trade, and growth.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="accent" size="lg">
            <Link href="/contact">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about/member-associations">View Member Associations</Link>
          </Button>
        </div>
      </div>
    </SpotlightSection>
  );
}
