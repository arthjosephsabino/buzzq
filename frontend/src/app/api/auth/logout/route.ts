import { NextResponse } from "next/server";
import {
  ADMIN_TOKEN_COOKIE,
  PERSONNEL_TOKEN_COOKIE,
} from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PERSONNEL_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(ADMIN_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
