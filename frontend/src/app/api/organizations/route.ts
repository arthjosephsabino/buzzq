import { NextResponse } from "next/server";
import { createOrganization } from "@/lib/api/organizations";
import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));
  if (!token) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = (await request.json()) as { name?: string };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  try {
    const org = await createOrganization(token, { name: body.name.trim() });
    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Create failed." }, { status: 500 });
  }
}
