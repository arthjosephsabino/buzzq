import { redirect } from "next/navigation";
import { getToken, peekJwtPayload, type SessionKind } from "@/lib/auth/session";

export async function requireSession(kind: SessionKind, loginPath: string) {
  const token = await getToken(kind);
  if (!token) {
    redirect(loginPath);
  }
  const payload = peekJwtPayload(token);
  return { token, username: payload?.sub ?? null, role: payload?.role ?? null };
}

/** Accept either personnel or admin httpOnly session for shared management pages. */
export async function requireAnyStaffSession(
  loginPath = "/login",
) {
  const personnel = await getToken("personnel");
  if (personnel) {
    const payload = peekJwtPayload(personnel);
    return {
      token: personnel,
      kind: "personnel" as const,
      username: payload?.sub ?? null,
      role: payload?.role ?? null,
    };
  }
  const admin = await getToken("admin");
  if (admin) {
    const payload = peekJwtPayload(admin);
    return {
      token: admin,
      kind: "admin" as const,
      username: payload?.sub ?? null,
      role: payload?.role ?? null,
    };
  }
  redirect(loginPath);
}
