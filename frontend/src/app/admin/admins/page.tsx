import { requireSession } from "@/lib/auth/guards";
import { getAdmins } from "@/lib/api/admins";
import { AppShell } from "@/components/layout/app-shell";
import { AdminNav } from "@/components/layout/nav";
import { CreateAdminForm } from "@/components/forms/create-forms";
import { EmptyState } from "@/components/ui/states";
import { ApiError } from "@/lib/api/client";
import type { Admin } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const { token } = await requireSession("admin", "/admin/login");
  let admins: Admin[] = [];
  let error: string | null = null;
  try {
    admins = await getAdmins(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Could not load admins.";
  }

  return (
    <AppShell title="Admins" nav={<AdminNav pathname="/admin/admins" />}>
      <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-navy">Create admin</h2>
        <CreateAdminForm />
      </div>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {admins.length === 0 && !error ? (
        <EmptyState title="No admins returned" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="min-w-full text-left">
            <thead className="bg-surface-muted text-xs text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{a.username}</td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {new Date(a.created_at).toLocaleString()}
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
