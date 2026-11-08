import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { ADMIN_TOKEN_COOKIE, cookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
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

    const token = await loginAdmin(body.username, body.password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      ADMIN_TOKEN_COOKIE,
      token.access_token,
      cookieOptions(),
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
