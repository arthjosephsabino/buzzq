import { apiRequest } from "./client";
import type { QueueEntry, QueueEntryCreate } from "./types";

export async function getQueueEntries(token: string): Promise<QueueEntry[]> {
  return apiRequest<QueueEntry[]>("/queue_entry", { token });
}

/** Public — no auth required per OpenAPI */
export async function getQueueEntry(
  queueEntryId: string,
): Promise<QueueEntry> {
  return apiRequest<QueueEntry>(`/queue_entry/${queueEntryId}`, {
    cache: "no-store",
  });
}

export async function createQueueEntry(
  token: string,
  data: QueueEntryCreate,
): Promise<QueueEntry> {
  return apiRequest<QueueEntry>("/queue_entry", {
    method: "POST",
    token,
    body: data,
  });
}

/** Public — no auth required per OpenAPI */
export async function getQueueEntryProgress(
  queueEntryId: string,
): Promise<QueueEntry[]> {
  return apiRequest<QueueEntry[]>(
    `/queue_entry/${queueEntryId}/progress-all`,
    { cache: "no-store" },
  );
}
