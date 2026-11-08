import { cn } from "@/lib/utils/queue-progress";
import type { QueueEntryStatus } from "@/lib/api/types";
import { QUEUE_ENTRY_STATUS_UI } from "@/lib/utils/queue-progress";

type Props = {
  ticketNumber: string;
  nowServing?: string | null;
  peopleAhead?: number;
  status: QueueEntryStatus;
  joinedAt?: string;
  className?: string;
};

export function QueueTicket({
  ticketNumber,
  nowServing,
  peopleAhead,
  status,
  joinedAt,
  className,
}: Props) {
  const ui = QUEUE_ENTRY_STATUS_UI[status];
  const isYourTurn = status === "CURRENT";

  return (
    <section
      className={cn(
        "animate-fade-up rounded-2xl border bg-surface px-6 py-10 text-center sm:px-10",
        isYourTurn
          ? "animate-your-turn border-success/40 bg-success/5"
          : "border-border",
        className,
      )}
      aria-live="polite"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
        {isYourTurn ? "It's your turn" : "Your number"}
      </p>
      <p
        className={cn(
          "mt-3 font-semibold tracking-tight text-navy",
          "text-6xl sm:text-7xl md:text-8xl",
        )}
      >
        {ticketNumber}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Now serving</p>
          <p className="mt-1 text-3xl font-semibold text-accent-soft">
            {nowServing ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Ahead of you</p>
          <p className="mt-1 text-3xl font-semibold text-navy">
            {typeof peopleAhead === "number" ? peopleAhead : "—"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold",
            isYourTurn
              ? "bg-success/15 text-success"
              : status === "CUT_OFF"
                ? "bg-danger/15 text-danger"
                : status === "DONE"
                  ? "bg-slate-200 text-slate-600"
                  : "bg-warning/15 text-[#b45309]",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              isYourTurn
                ? "bg-success"
                : status === "CUT_OFF"
                  ? "bg-danger"
                  : status === "DONE"
                    ? "bg-neutral"
                    : "bg-warning",
            )}
          />
          {ui.label}
        </span>
        <p className="max-w-xs text-sm text-muted">{ui.description}</p>
        {joinedAt ? (
          <p className="text-xs text-muted">Joined {joinedAt}</p>
        ) : null}
      </div>
    </section>
  );
}
