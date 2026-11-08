import { NextResponse } from "next/server";
import { createQueue } from "@/lib/api/queues";
import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));
  if (!token) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = (await request.json()) as {
    name?: string;
    ticket_prefix?: string;
    organization_id?: string;
  };
  if (!body.name || !body.ticket_prefix || !body.organization_id) {
    return NextResponse.json(
      { error: "Name, ticket prefix, and organization are required." },
      { status: 400 },
    );
  }
  try {
    const queue = await createQueue(token, {
      name: body.name,
      ticket_prefix: body.ticket_prefix,
      organization_id: body.organization_id,
    });
    return NextResponse.json(queue, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Create failed." }, { status: 500 });
  }
}
