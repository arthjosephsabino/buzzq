import { cookies } from "next/headers";
import type { AuthRole } from "@/lib/api/types";

export const PERSONNEL_TOKEN_COOKIE = "buzzq_personnel_token";
export const ADMIN_TOKEN_COOKIE = "buzzq_admin_token";

const COOKIE_MAX_AGE = 60 * 60 * 36; // matches backend JWT default (36h)

export type SessionKind = "personnel" | "admin";

/**
 * Auth tokens are stored in httpOnly cookies via Next.js route handlers (BFF).
 * Tokens are never exposed to Client Components. Server Components and Server
 * Actions read cookies and attach Bearer headers when calling FastAPI.
 *
 * Security note: the FastAPI JWT is still a bearer token. Cookie storage reduces
 * XSS exposure versus localStorage, but does not replace proper CSRF protection
 * for cookie-authenticated browser mutations. Prefer SameSite=Lax and keep API_URL
 * server-only.
 */
export async function getToken(kind: SessionKind): Promise<string | null> {
  const jar = await cookies();
  const name =
    kind === "admin" ? ADMIN_TOKEN_COOKIE : PERSONNEL_TOKEN_COOKIE;
  return jar.get(name)?.value ?? null;
}

export async function requireToken(kind: SessionKind): Promise<string> {
  const token = await getToken(kind);
  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }
  return token;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/** Decode JWT payload without verifying signature (UI hints only). */
export function peekJwtPayload(
  token: string,
): { sub?: string; role?: AuthRole; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(json) as { sub?: string; role?: AuthRole; exp?: number };
  } catch {
    return null;
  }
}
