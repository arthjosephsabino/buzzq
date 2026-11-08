import { notFound } from "next/navigation";
import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getQueue } from "@/lib/api/queues";
import { getQueueEntries } from "@/lib/api/queue-entries";
import { getClients } from "@/lib/api/clients";
import { getOrganization } from "@/lib/api/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { QueueStatusBadge } from "@/components/queue/status-badges";
import { QueueEntriesTable } from "@/components/queue/queue-entries-table";
import { QRCodeDisplay } from "@/components/queue/qr-code-display";
import { AddCustomerForm } from "@/components/queue/add-customer-form";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { getAppUrl } from "@/lib/api/client";
import type { Client, Queue, QueueEntry } from "@/lib/api/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ queueId: string }> };

export default async function QueueDetailPage({ params }: Props) {
  const { queueId } = await params;
  const { token } = await requireAnyStaffSession("/login");

  let queue: Queue;
  let orgName = "Organization";
  let entries: QueueEntry[] = [];
  let clientsById = new Map<string, Client>();

  try {
    queue = await getQueue(token, queueId);
    const [entriesAll, clients, org] = await Promise.all([
      getQueueEntries(token),
      getClients(token),
      getOrganization(token, queue.organization_id).catch(() => null),
    ]);
    entries = entriesAll.filter((e) => e.queue_id === queueId);
    clientsById = new Map(clients.map((c) => [c.id, c]));
    if (org) orgName = org.name;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const current = entries.find((e) => e.status === "CURRENT");
  const waiting = entries.filter(
    (e) => e.status === "IN_QUEUE" || e.status === "NEW" || e.status === "CUT_OFF",
  ).length;
  const joinUrl = `${getAppUrl()}/${queueId}/join`;

  return (
    <AppShell title={queue.name} nav={<PersonnelNav pathname="/queues" />}>
      <div className="flex flex-wrap items-center gap-3">
        <QueueStatusBadge status={queue.status} />
        <span className="text-sm text-muted">{orgName}</span>
        <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">
          Prefix {queue.ticket_prefix}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">Now serving</p>
            <p className="mt-2 text-5xl font-semibold text-accent-soft">
              {current?.ticket_number ?? "—"}
            </p>
            <p className="mt-4 text-sm text-muted">
              {waiting} waiting · {entries.length} total tickets
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {/* TODO(backend): no POST /queue/{id}/next or entry status mutations in OpenAPI */}
              <Button disabled title="Requires backend mutation endpoint">
                Call next
              </Button>
              <Button
                variant="secondary"
                disabled
                title="Requires backend mutation endpoint"
              >
                Skip
              </Button>
              <Button
                variant="secondary"
                disabled
                title="Requires backend mutation endpoint"
              >
                Complete
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-navy">Main queue</h2>
            <QueueEntriesTable entries={entries} clientsById={clientsById} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <QRCodeDisplay queueId={queueId} queueName={queue.name} />
          <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
            Join URL:{" "}
            <a className="break-all text-accent hover:underline" href={joinUrl}>
              {joinUrl}
            </a>
          </div>
          <AddCustomerForm queueId={queueId} />
        </div>
      </div>
    </AppShell>
  );
}
