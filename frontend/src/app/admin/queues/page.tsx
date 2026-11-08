import { requireSession } from "@/lib/auth/guards";
import { getQueues } from "@/lib/api/queues";
import { AppShell } from "@/components/layout/app-shell";
import { AdminNav } from "@/components/layout/nav";
import { QueueCard } from "@/components/queue/queue-card";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Queue } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function AdminQueuesPage() {
  const { token } = await requireSession("admin", "/admin/login");
  let queues: Queue[] = [];
  let error: string | null = null;
  try {
    queues = await getQueues(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load queues.";
  }

  return (
    <AppShell title="Queues" nav={<AdminNav pathname="/admin/queues" />}>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {queues.length === 0 && !error ? (
        <EmptyState title="No queues" />
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
