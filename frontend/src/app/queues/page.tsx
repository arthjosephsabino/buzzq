import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getQueues } from "@/lib/api/queues";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { QueueCard } from "@/components/queue/queue-card";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Queue } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function QueuesPage() {
  const { token } = await requireAnyStaffSession("/login");
  let queues: Queue[] = [];
  let error: string | null = null;
  try {
    queues = await getQueues(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load queues.";
  }

  return (
    <AppShell title="Queues" nav={<PersonnelNav pathname="/queues" />}>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {queues.length === 0 && !error ? (
        <EmptyState
          title="No queues"
          description="Create a queue from an organization page."
          action={
            <Link href="/organizations">
              <Button>Organizations</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              href={`/queues/${queue.id}`}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
