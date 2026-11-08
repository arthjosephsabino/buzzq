import Link from "next/link";
import { cn } from "@/lib/utils/queue-progress";

export function BrandMark({
  href = "/",
  light = false,
  size = "md",
}: {
  href?: string;
  light?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-semibold tracking-tight",
        light ? "text-white" : "text-navy",
        size === "lg" && "text-3xl",
        size === "md" && "text-xl",
        size === "sm" && "text-lg",
      )}
    >
      BuzzQ
    </Link>
  );
}

export function AppShell({
  nav,
  children,
  title,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-navy px-4 py-6 text-white md:flex md:flex-col">
          <BrandMark href="/dashboard" light />
          <nav className="mt-10 flex flex-1 flex-col gap-1">{nav}</nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 md:px-8">
            <div>
              <p className="md:hidden">
                <BrandMark href="/dashboard" size="sm" />
              </p>
              {title ? (
                <h1 className="text-xl font-semibold text-navy md:text-2xl">
                  {title}
                </h1>
              ) : null}
            </div>
            <div className="md:hidden">{nav}</div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white/15 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
