import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-6 text-center">
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-saffron-600">404</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-navy-800 sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button asChild variant="default" size="lg" className="mt-8">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
