import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getOrganizations } from "@/lib/api/organizations";
import { getQueues } from "@/lib/api/queues";
import { getClients } from "@/lib/api/clients";
import { getQueueEntries } from "@/lib/api/queue-entries";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { Card } from "@/components/ui/card";
import { QueueCard } from "@/components/queue/queue-card";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Queue } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { token } = await requireAnyStaffSession("/login");

  let orgsCount = 0;
  let queues: Queue[] = [];
  let clientsCount = 0;
  let entriesCount = 0;
  let error: string | null = null;

  try {
    const [orgs, qs, clients, entries] = await Promise.all([
      getOrganizations(token),
      getQueues(token),
      getClients(token),
      getQueueEntries(token),
    ]);
    orgsCount = orgs.length;
    queues = qs;
    clientsCount = clients.length;
    entriesCount = entries.filter(
      (e) => e.status === "IN_QUEUE" || e.status === "NEW" || e.status === "CURRENT",
    ).length;
  } catch (e) {
    error =
      e instanceof ApiError
        ? e.message
        : "Could not load dashboard data.";
  }

  return (
    <AppShell
      title="Dashboard"
      nav={<PersonnelNav pathname="/dashboard" />}
    >
      {error ? (
        <p className="mb-6 text-sm text-danger">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="md">
          <p className="text-sm text-muted">Organizations</p>
          <p className="mt-2 text-3xl font-semibold text-navy">{orgsCount}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-muted">Queues</p>
          <p className="mt-2 text-3xl font-semibold text-navy">{queues.length}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-muted">Active tickets</p>
          <p className="mt-2 text-3xl font-semibold text-accent">{entriesCount}</p>
          <p className="mt-1 text-xs text-muted">{clientsCount} customers total</p>
        </Card>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-navy">Your queues</h2>
        <Link href="/organizations">
          <Button variant="secondary">Manage organizations</Button>
        </Link>
      </div>

      {queues.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No queues yet"
            description="Create an organization, then add a queue to start serving customers."
            action={
              <Link href="/organizations">
                <Button>Go to organizations</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
