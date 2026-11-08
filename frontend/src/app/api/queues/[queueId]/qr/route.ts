import { getToken } from "@/lib/auth/session";
import { getQueueQr } from "@/lib/api/queues";
import { ApiError } from "@/lib/api/client";

type Params = { params: Promise<{ queueId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { queueId } = await params;
  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));
  if (!token) {
    return new Response(JSON.stringify({ detail: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const blob = await getQueueQr(token, queueId);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ detail: error.message }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ detail: "QR unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
