import { notFound } from "next/navigation";
import { BrandMark } from "@/components/layout/app-shell";
import { QueueLiveUpdates } from "@/components/queue/queue-live-updates";
import {
  getQueueEntry,
  getQueueEntryProgress,
} from "@/lib/api/queue-entries";
import { ApiError } from "@/lib/api/client";
import { calculateQueueProgress } from "@/lib/utils/queue-progress";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ queueEntryId: string }> };

export default async function TicketPage({ params }: Props) {
  const { queueEntryId } = await params;

  let entry;
  let entries;
  try {
    [entry, entries] = await Promise.all([
      getQueueEntry(queueEntryId),
      getQueueEntryProgress(queueEntryId),
    ]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const progress = calculateQueueProgress(entry, entries);

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <BrandMark href="/" />
        </div>

        <p className="mb-4 text-center text-sm text-muted">
          You&apos;re in line. Wait somewhere comfortable — this page updates
          automatically.
        </p>

        {/* Server-rendered initial ticket; client polls for updates */}
        <QueueLiveUpdates
          queueEntryId={queueEntryId}
          initialEntry={entry}
          initialEntries={entries}
        />

        {progress.yourStatus === "CURRENT" ? (
          <p className="mt-6 text-center text-base font-medium text-success">
            Please proceed to the service desk.
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">
            Estimated wait times and push/SMS alerts need backend support —
            they aren&apos;t available yet.
          </p>
        )}
      </div>
    </div>
  );
}
