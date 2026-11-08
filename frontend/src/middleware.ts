import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Single Next.js app serves both main and admin experiences.
 *
 * Production intent:
 * - app.buzzq.com → main application
 * - admin.app.buzzq.com → admin application (paths under /admin)
 *
 * Local:
 * - localhost:3000 → main (+ /admin paths also available)
 * - localhost:3001 → rewrite bare paths into /admin/* for convenience
 *
 * Tradeoff: one codebase and shared design system vs two deployables.
 * Host detection keeps routing simple without duplicating the project.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  const isAdminHost =
    host.startsWith("admin.") ||
    host.startsWith("localhost:3001") ||
    host.startsWith("127.0.0.1:3001");

  if (!isAdminHost) {
    return NextResponse.next();
  }

  // Already under /admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // Allow Next internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (pathname === "/" || pathname === "") {
    url.pathname = "/admin";
  } else if (pathname === "/login") {
    url.pathname = "/admin/login";
  } else {
    url.pathname = `/admin${pathname}`;
  }
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
