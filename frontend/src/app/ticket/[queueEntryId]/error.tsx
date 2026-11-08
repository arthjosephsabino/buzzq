"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TicketError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-4 text-center">
      <h2 className="text-xl font-semibold text-navy">
        We couldn&apos;t load this queue.
      </h2>
      <p className="text-sm text-muted">Try again in a moment.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
