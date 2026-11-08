import { NextResponse } from "next/server";
import { createClient } from "@/lib/api/clients";
import { createQueueEntry } from "@/lib/api/queue-entries";
import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

/**
 * BFF join endpoint.
 *
 * OpenAPI reality:
 * - POST /clients requires OAuth2
 * - POST /queue_entry requires OAuth2
 * - GET /queue/{id} requires OAuth2
 *
 * Therefore anonymous customer join cannot succeed until the backend adds
 * public join (or scoped public) endpoints. If a personnel session cookie
 * exists, this route can create the client + entry on their behalf (staff-
 * assisted / kiosk-style join).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    queueId?: string;
    name?: string;
    phone?: string;
  };

  if (!body.queueId || !body.name?.trim() || !body.phone?.trim()) {
    return NextResponse.json(
      { error: "Name, phone, and queue are required." },
      { status: 400 },
    );
  }

  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));

  if (!token) {
    return NextResponse.json(
      {
        backendGap: true,
        error:
          "Public join isn’t available yet. Creating a customer and ticket currently requires staff authentication on the API. Ask the front desk to add you, or sign in as staff.",
      },
      { status: 401 },
    );
  }

  try {
    const client = await createClient(token, {
      name: body.name.trim(),
      phone: body.phone.trim(),
    });
    const entry = await createQueueEntry(token, {
      client_id: client.id,
      queue_id: body.queueId,
    });
    return NextResponse.json({ queueEntryId: entry.id, ticketNumber: entry.ticket_number });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Could not create your ticket." },
      { status: 500 },
    );
  }
}
