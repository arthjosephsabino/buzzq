"use client";

import { useEffect, useState, useTransition } from "react";
import type { QueueEntry } from "@/lib/api/types";
import { calculateQueueProgress } from "@/lib/utils/queue-progress";
import { QueueTicket } from "@/components/queue/queue-ticket";
import { formatJoinedTime } from "@/lib/utils/queue-progress";

type Props = {
  queueEntryId: string;
  initialEntry: QueueEntry;
  initialEntries: QueueEntry[];
};

async function fetchProgress(queueEntryId: string) {
  const res = await fetch(`/api/queue-entry/${queueEntryId}/progress`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to refresh");
  return res.json() as Promise<{
    entry: QueueEntry;
    entries: QueueEntry[];
  }>;
}

export function QueueLiveUpdates({
  queueEntryId,
  initialEntry,
  initialEntries,
}: Props) {
  const [entry, setEntry] = useState(initialEntry);
  const [entries, setEntries] = useState(initialEntries);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const id = window.setInterval(() => {
      startTransition(async () => {
        try {
          const data = await fetchProgress(queueEntryId);
          setEntry(data.entry);
          setEntries(data.entries);
        } catch {
          // Keep last known good state; polling resumes next tick.
        }
      });
    }, 8000);
    return () => window.clearInterval(id);
  }, [queueEntryId]);

  const progress = calculateQueueProgress(entry, entries);

  return (
    <QueueTicket
      ticketNumber={progress.yourTicket}
      nowServing={progress.nowServing}
      peopleAhead={progress.peopleAhead}
      status={progress.yourStatus}
      joinedAt={formatJoinedTime(entry.created_at)}
    />
  );
}
