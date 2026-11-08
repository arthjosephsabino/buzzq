import type { Client, QueueEntry } from "@/lib/api/types";
import { QueueEntryStatusBadge } from "@/components/queue/status-badges";

export function QueueEntryRow({
  entry,
  client,
}: {
  entry: QueueEntry;
  client?: Client | null;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 font-semibold text-navy">{entry.ticket_number}</td>
      <td className="px-4 py-3 text-sm text-navy">
        {client?.name ?? "—"}
        {client?.phone ? (
          <span className="mt-0.5 block text-xs text-muted">{client.phone}</span>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <QueueEntryStatusBadge status={entry.status} />
      </td>
      <td className="px-4 py-3 text-sm text-muted">{entry.ticket_order}</td>
      <td className="px-4 py-3 text-sm text-muted">
        {new Date(entry.created_at).toLocaleString()}
      </td>
    </tr>
  );
}

export function QueueEntriesTable({
  entries,
  clientsById,
}: {
  entries: QueueEntry[];
  clientsById: Map<string, Client>;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        No customers in this queue yet.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => a.ticket_order - b.ticket_order);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="min-w-full text-left">
        <thead className="bg-surface-muted text-xs tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Ticket</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <QueueEntryRow
              key={entry.id}
              entry={entry}
              client={clientsById.get(entry.client_id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
