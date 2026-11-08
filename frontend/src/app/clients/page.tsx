import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getClients } from "@/lib/api/clients";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Client } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { token } = await requireAnyStaffSession("/login");
  let clients: Client[] = [];
  let error: string | null = null;
  try {
    clients = await getClients(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load customers.";
  }

  return (
    <AppShell title="Customers" nav={<PersonnelNav pathname="/clients" />}>
      <p className="mb-6 text-sm text-muted">
        Backend entity: <span className="font-medium text-navy">Client</span>.
        Shown here as customers.
      </p>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {clients.length === 0 && !error ? (
        <EmptyState
          title="No customers yet"
          description="Customers appear when someone joins a queue."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="min-w-full text-left">
            <thead className="bg-surface-muted text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Tickets</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {c.queue_entries?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
