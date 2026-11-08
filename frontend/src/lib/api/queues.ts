import { apiRequest, apiRequestBlob } from "./client";
import type { Queue, QueueCreate } from "./types";

export async function getQueues(token: string): Promise<Queue[]> {
  return apiRequest<Queue[]>("/queue", { token });
}

export async function getQueue(token: string, queueId: string): Promise<Queue> {
  return apiRequest<Queue>(`/queue/${queueId}`, { token });
}

export async function createQueue(
  token: string,
  data: QueueCreate,
): Promise<Queue> {
  return apiRequest<Queue>("/queue", {
    method: "POST",
    token,
    body: data,
  });
}

/** GET /queue/{queue_id}/qr — returns PNG image bytes */
export async function getQueueQr(
  token: string,
  queueId: string,
): Promise<Blob> {
  return apiRequestBlob(`/queue/${queueId}/qr`, { token });
}
