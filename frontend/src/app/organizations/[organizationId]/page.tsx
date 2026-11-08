import { notFound } from "next/navigation";
import { requireAnyStaffSession } from "@/lib/auth/guards";
import {
  getOrganization,
  getOrganizationPersonnel,
} from "@/lib/api/organizations";
import { getQueues } from "@/lib/api/queues";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import {
  CreatePersonnelForm,
  CreateQueueForm,
} from "@/components/forms/create-forms";
import { QueueCard } from "@/components/queue/queue-card";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import type { Organization, Personnel, Queue } from "@/lib/api/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ organizationId: string }> };

export default async function OrganizationDetailPage({ params }: Props) {
  const { organizationId } = await params;
  const { token } = await requireAnyStaffSession("/login");

  let org: Organization;
  let personnel: Personnel[] = [];
  let queues: Queue[] = [];

  try {
    org = await getOrganization(token, organizationId);
    [personnel, queues] = await Promise.all([
      getOrganizationPersonnel(token, organizationId),
      getQueues(token),
    ]);
    queues = queues.filter((q) => q.organization_id === organizationId);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <AppShell
      title={org.name}
      nav={<PersonnelNav pathname="/organizations" />}
    >
      <p className="text-sm text-muted">
        Organization ID · <span className="font-mono text-xs">{org.id}</span>
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Queues</h2>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <CreateQueueForm organizationId={organizationId} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              href={`/queues/${queue.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-navy">Personnel</h2>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <CreatePersonnelForm organizationId={organizationId} />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="min-w-full text-left">
            <thead className="bg-surface-muted text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{p.username}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.role === "OWNER" ? "accent" : "neutral"}>
                      {p.role}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {personnel.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              No personnel yet.
            </p>
          ) : null}
        </div>
      </section>

      <Card padding="md" className="mt-8 bg-surface-muted">
        <p className="text-sm text-muted">
          Role-aware navigation is a frontend UX choice. The FastAPI backend
          remains responsible for authorization.
        </p>
      </Card>
    </AppShell>
  );
}
