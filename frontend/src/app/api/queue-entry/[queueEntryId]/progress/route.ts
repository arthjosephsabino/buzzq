import { getQueueEntry, getQueueEntryProgress } from "@/lib/api/queue-entries";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";

type Params = { params: Promise<{ queueEntryId: string }> };

/** Browser-facing proxy for public progress polling (API_URL stays server-only). */
export async function GET(_request: Request, { params }: Params) {
  const { queueEntryId } = await params;
  try {
    const [entry, entries] = await Promise.all([
      getQueueEntry(queueEntryId),
      getQueueEntryProgress(queueEntryId),
    ]);
    return NextResponse.json({ entry, entries });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unable to load progress." }, { status: 500 });
  }
}
