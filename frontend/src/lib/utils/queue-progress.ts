import type { QueueEntry, QueueEntryStatus, QueueStatus } from "@/lib/api/types";

/** Central UI mapping for queue entry statuses (backend enums stay technical). */
export const QUEUE_ENTRY_STATUS_UI: Record<
  QueueEntryStatus,
  { label: string; description: string; tone: "ready" | "waiting" | "active" | "warning" | "done" }
> = {
  NEW: {
    label: "Getting ready",
    description: "Your ticket is being prepared.",
    tone: "ready",
  },
  IN_QUEUE: {
    label: "Waiting",
    description: "You're in line. Wait somewhere comfortable.",
    tone: "waiting",
  },
  CURRENT: {
    label: "It's your turn",
    description: "Please head to the service desk.",
    tone: "active",
  },
  CUT_OFF: {
    label: "Waiting to be called again",
    description: "You were skipped — stay nearby.",
    tone: "warning",
  },
  DONE: {
    label: "Completed",
    description: "You're all set.",
    tone: "done",
  },
};

export const QUEUE_STATUS_UI: Record<
  QueueStatus,
  { label: string; description: string }
> = {
  NEW: { label: "Not yet active", description: "Queue has not started." },
  IN_PROGRESS: {
    label: "Currently operating",
    description: "This queue is live.",
  },
  INACTIVE: {
    label: "Not currently active",
    description: "Queue is paused or closed.",
  },
};

export type QueueProgress = {
  yourTicket: string;
  yourStatus: QueueEntryStatus;
  yourOrder: number;
  nowServing: string | null;
  peopleAhead: number;
  waitingCount: number;
  entries: QueueEntry[];
};

const AHEAD_STATUSES: QueueEntryStatus[] = ["NEW", "IN_QUEUE", "CURRENT"];

/**
 * Derive customer-facing progress from GET /queue_entry/{id}/progress-all.
 * People ahead = entries with lower ticket_order still waiting/serving.
 */
export function calculateQueueProgress(
  yourEntry: QueueEntry,
  allEntries: QueueEntry[],
): QueueProgress {
  const sorted = [...allEntries].sort(
    (a, b) => a.ticket_order - b.ticket_order,
  );

  const current = sorted.find((e) => e.status === "CURRENT") ?? null;

  const peopleAhead = sorted.filter(
    (e) =>
      e.id !== yourEntry.id &&
      e.ticket_order < yourEntry.ticket_order &&
      AHEAD_STATUSES.includes(e.status),
  ).length;

  const waitingCount = sorted.filter((e) =>
    e.status === "NEW" || e.status === "IN_QUEUE" || e.status === "CUT_OFF",
  ).length;

  return {
    yourTicket: yourEntry.ticket_number,
    yourStatus: yourEntry.status,
    yourOrder: yourEntry.ticket_order,
    nowServing: current?.ticket_number ?? null,
    peopleAhead,
    waitingCount,
    entries: sorted,
  };
}

export function formatTicketLabel(ticketNumber: string): string {
  return ticketNumber;
}

export function formatJoinedTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
