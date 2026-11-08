import { Badge } from "@/components/ui/badge";
import {
  QUEUE_ENTRY_STATUS_UI,
  QUEUE_STATUS_UI,
} from "@/lib/utils/queue-progress";
import type { QueueEntryStatus, QueueStatus } from "@/lib/api/types";

const entryTone = {
  ready: "sky",
  waiting: "warning",
  active: "success",
  warning: "danger",
  done: "neutral",
} as const;

export function QueueEntryStatusBadge({
  status,
}: {
  status: QueueEntryStatus;
}) {
  const ui = QUEUE_ENTRY_STATUS_UI[status];
  return <Badge tone={entryTone[ui.tone]}>{ui.label}</Badge>;
}

export function QueueStatusBadge({ status }: { status: QueueStatus }) {
  const ui = QUEUE_STATUS_UI[status];
  const tone =
    status === "IN_PROGRESS"
      ? "success"
      : status === "INACTIVE"
        ? "neutral"
        : "accent";
  return <Badge tone={tone}>{ui.label}</Badge>;
}
