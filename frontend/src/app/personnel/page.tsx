import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getOrganizations, getOrganizationPersonnel } from "@/lib/api/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Personnel } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function PersonnelListPage() {
  const { token } = await requireAnyStaffSession("/login");
  let rows: Array<Personnel & { organizationName: string }> = [];
  let error: string | null = null;

  try {
    const orgs = await getOrganizations(token);
    const nested = await Promise.all(
      orgs.map(async (org) => {
        const people = await getOrganizationPersonnel(token, org.id);
        return people.map((p) => ({ ...p, organizationName: org.name }));
      }),
    );
    rows = nested.flat();
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load personnel.";
  }

  return (
    <AppShell title="Personnel" nav={<PersonnelNav pathname="/personnel" />}>
      <p className="mb-6 text-sm text-muted">
        Roles are limited to <strong>OWNER</strong> and <strong>STAFF</strong>{" "}
        as defined by the API.
      </p>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {rows.length === 0 && !error ? (
        <EmptyState
          title="No personnel"
          description="Add staff from an organization detail page."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="min-w-full text-left">
            <thead className="bg-surface-muted text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Organization</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{p.username}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.role === "OWNER" ? "accent" : "neutral"}>
                      {p.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {p.organizationName}
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
