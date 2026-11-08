import Link from "next/link";
import type { Queue } from "@/lib/api/types";
import { QueueStatusBadge } from "@/components/queue/status-badges";
import { Card } from "@/components/ui/card";

export function QueueCard({
  queue,
  href,
  meta,
}: {
  queue: Queue;
  href: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="block transition-transform hover:-translate-y-0.5">
      <Card padding="md" className="h-full hover:border-accent/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              {queue.ticket_prefix}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-navy">{queue.name}</h3>
          </div>
          <QueueStatusBadge status={queue.status} />
        </div>
        {meta ? <p className="mt-4 text-sm text-muted">{meta}</p> : null}
      </Card>
    </Link>
  );
}
