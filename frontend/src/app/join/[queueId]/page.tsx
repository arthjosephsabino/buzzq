import { BrandMark } from "@/components/layout/app-shell";
import { JoinQueueForm } from "@/components/queue/join-queue-form";
import { getToken } from "@/lib/auth/session";
import { getQueue } from "@/lib/api/queues";
import { getOrganization } from "@/lib/api/organizations";
import { ApiError } from "@/lib/api/client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ queueId: string }> };

export default async function JoinQueuePage({ params }: Props) {
  const { queueId } = await params;
  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));

  let queueName: string | null = null;
  let orgName: string | null = null;
  let queueError: string | null = null;

  if (token) {
    try {
      const queue = await getQueue(token, queueId);
      queueName = queue.name;
      const org = await getOrganization(token, queue.organization_id).catch(
        () => null,
      );
      orgName = org?.name ?? null;
    } catch (e) {
      queueError =
        e instanceof ApiError
          ? e.message
          : "Could not load queue details.";
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <BrandMark href="/" size="lg" />
        </div>

        <div className="animate-fade-up rounded-2xl border border-border bg-surface px-6 py-8 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.16em] text-muted uppercase">
              Join queue
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-navy">
              {orgName ?? "Welcome"}
            </h1>
            <p className="mt-1 text-muted">
              {queueName ?? "Scan-to-join queue"}
            </p>
          </div>

          {!token ? (
            <p className="mt-6 rounded-xl bg-warning/10 px-4 py-3 text-sm text-[#92400e]">
              Public join needs a backend endpoint that doesn&apos;t require
              staff auth. Until then, a signed-in staff session on this device
              can add you (kiosk / front-desk mode).
            </p>
          ) : null}

          {queueError ? (
            <p className="mt-4 text-sm text-danger">{queueError}</p>
          ) : null}

          <JoinQueueForm queueId={queueId} />

          <p className="mt-6 text-center text-sm text-muted">
            You&apos;re joining the line — no account needed. We&apos;ll show
            your ticket and how many people are ahead.
          </p>
        </div>
      </div>
    </div>
  );
}
