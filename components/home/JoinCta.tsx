import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JoinCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffron-500 to-saffron-600 py-16">
      <div className="absolute inset-0 bg-network-grid opacity-[0.15]" aria-hidden />
      <div className="container-page relative flex flex-col items-center gap-6 text-center">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/70">
          For State IT Associations
        </span>
        <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
          Bring your state association into India&apos;s largest <span className="gradient-text-navy">IT trade</span> network
        </h2>
        <p className="max-w-xl text-balance text-navy-900/70">
          Membership takes minutes to start and connects your members to
          national advocacy, training, and a federation of 100+ associations.
        </p>
        <Button asChild size="lg" className="mt-2 bg-navy-800 text-white hover:bg-navy-700">
          <Link href="/contact">
            Start Your Membership Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
