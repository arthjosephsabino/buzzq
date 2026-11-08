import Link from "next/link";
import { requireSession } from "@/lib/auth/guards";
import { getOrganizations } from "@/lib/api/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { AdminNav } from "@/components/layout/nav";
import { CreateOrganizationForm } from "@/components/forms/create-forms";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Organization } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const { token } = await requireSession("admin", "/admin/login");
  let orgs: Organization[] = [];
  let error: string | null = null;
  try {
    orgs = await getOrganizations(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load organizations.";
  }

  return (
    <AppShell
      title="Organizations"
      nav={<AdminNav pathname="/admin/organizations" />}
    >
      <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
        <CreateOrganizationForm />
      </div>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {orgs.length === 0 && !error ? (
        <EmptyState title="No organizations" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`}>
              <Card padding="md" className="hover:border-accent/40">
                <h3 className="text-lg font-semibold text-navy">{org.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
