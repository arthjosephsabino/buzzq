import { requireSession } from "@/lib/auth/guards";
import { getOrganizations } from "@/lib/api/organizations";
import { getQueues } from "@/lib/api/queues";
import { getClients } from "@/lib/api/clients";
import { getAdmins } from "@/lib/api/admins";
import { AppShell } from "@/components/layout/app-shell";
import { AdminNav } from "@/components/layout/nav";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Admin cookie from POST /auth/admins/token. JWT role=admin also authorizes
  // get_current_active_admin_or_personnel routes used by org/queue/client APIs.
  const { token } = await requireSession("admin", "/admin/login");

  let stats = { orgs: 0, queues: 0, clients: 0, admins: 0 };
  let error: string | null = null;

  try {
    const [orgs, queues, clients, admins] = await Promise.all([
      getOrganizations(token),
      getQueues(token),
      getClients(token),
      getAdmins(token),
    ]);
    stats = {
      orgs: orgs.length,
      queues: queues.length,
      clients: clients.length,
      admins: admins.length,
    };
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load admin data.";
  }

  return (
    <AppShell title="Admin" nav={<AdminNav pathname="/admin" />}>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["Organizations", stats.orgs],
            ["Queues", stats.queues],
            ["Customers", stats.clients],
            ["Admins", stats.admins],
          ] as const
        ).map(([label, value]) => (
          <Card key={label} padding="md">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-navy">{value}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Platform monitoring uses existing list endpoints only. Queue mutation
        and notification features are documented as backend gaps.
      </p>
    </AppShell>
  );
}
