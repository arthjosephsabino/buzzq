import Link from "next/link";
import { requireAnyStaffSession } from "@/lib/auth/guards";
import { getOrganizations } from "@/lib/api/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { PersonnelNav } from "@/components/layout/nav";
import { CreateOrganizationForm } from "@/components/forms/create-forms";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Organization } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const { token } = await requireAnyStaffSession("/login");
  let orgs: Organization[] = [];
  let error: string | null = null;
  try {
    orgs = await getOrganizations(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load organizations.";
  }

  return (
    <AppShell title="Organizations" nav={<PersonnelNav pathname="/organizations" />}>
      <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-navy">New organization</h2>
        <CreateOrganizationForm />
      </div>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {orgs.length === 0 && !error ? (
        <EmptyState
          title="No organizations"
          description="Create one to add personnel and queues."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`}>
              <Card padding="md" className="transition hover:border-accent/40">
                <h3 className="text-lg font-semibold text-navy">{org.name}</h3>
                <p className="mt-2 text-xs text-muted">
                  Created {new Date(org.created_at).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
