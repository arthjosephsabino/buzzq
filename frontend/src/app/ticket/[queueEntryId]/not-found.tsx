import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TicketNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-4 text-center">
      <h2 className="text-xl font-semibold text-navy">Ticket not found.</h2>
      <p className="text-sm text-muted">
        This queue ticket may have expired or the link is incorrect.
      </p>
      <Link href="/">
        <Button variant="secondary">Back home</Button>
      </Link>
    </div>
  );
}
