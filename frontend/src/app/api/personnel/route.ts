import { NextResponse } from "next/server";
import { createPersonnel } from "@/lib/api/personnel";
import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type { PersonnelRole } from "@/lib/api/types";

export async function POST(request: Request) {
  const token =
    (await getToken("personnel")) ?? (await getToken("admin"));
  if (!token) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const body = (await request.json()) as {
    organization_id?: string;
    name?: string;
    username?: string;
    password?: string;
    role?: PersonnelRole;
  };
  if (
    !body.organization_id ||
    !body.name ||
    !body.username ||
    !body.password
  ) {
    return NextResponse.json(
      { error: "All personnel fields are required." },
      { status: 400 },
    );
  }
  try {
    const person = await createPersonnel(token, {
      organization_id: body.organization_id,
      name: body.name,
      username: body.username,
      password: body.password,
      role: body.role ?? "STAFF",
    });
    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Create failed." }, { status: 500 });
  }
}
