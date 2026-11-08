import { NextResponse } from "next/server";
import { createAdmin } from "@/lib/api/admins";
import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getToken("admin");
  if (!token) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };
  if (!body.username || !body.password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }
  try {
    const admin = await createAdmin(token, {
      username: body.username,
      password: body.password,
    });
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Create failed." }, { status: 500 });
  }
}
