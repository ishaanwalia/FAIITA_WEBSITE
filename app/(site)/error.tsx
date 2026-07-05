"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-navy-800">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <Button onClick={reset} size="lg" className="mt-8">
        <RefreshCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
