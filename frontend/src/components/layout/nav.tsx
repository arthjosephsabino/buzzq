import Link from "next/link";
import {
  AppShell,
  NavLink,
} from "@/components/layout/app-shell";
import { LogoutButton } from "@/components/layout/logout-button";

export function PersonnelNav({
  pathname,
}: {
  pathname: string;
}) {
  return (
    <>
      <NavLink href="/dashboard" active={pathname.startsWith("/dashboard")}>
        Dashboard
      </NavLink>
      <NavLink href="/queues" active={pathname.startsWith("/queues")}>
        Queues
      </NavLink>
      <NavLink
        href="/organizations"
        active={pathname.startsWith("/organizations")}
      >
        Organizations
      </NavLink>
      <NavLink href="/clients" active={pathname.startsWith("/clients")}>
        Customers
      </NavLink>
      <NavLink href="/personnel" active={pathname.startsWith("/personnel")}>
        Personnel
      </NavLink>
      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </>
  );
}

export function AdminNav({ pathname }: { pathname: string }) {
  return (
    <>
      <NavLink href="/admin" active={pathname === "/admin"}>
        Dashboard
      </NavLink>
      <NavLink
        href="/admin/organizations"
        active={pathname.startsWith("/admin/organizations")}
      >
        Organizations
      </NavLink>
      <NavLink
        href="/admin/personnel"
        active={pathname.startsWith("/admin/personnel")}
      >
        Personnel
      </NavLink>
      <NavLink
        href="/admin/clients"
        active={pathname.startsWith("/admin/clients")}
      >
        Customers
      </NavLink>
      <NavLink
        href="/admin/queues"
        active={pathname.startsWith("/admin/queues")}
      >
        Queues
      </NavLink>
      <NavLink
        href="/admin/admins"
        active={pathname.startsWith("/admin/admins")}
      >
        Admins
      </NavLink>
      <div className="mt-auto pt-6">
        <LogoutButton redirectTo="/admin/login" />
      </div>
      <Link
        href="/"
        className="mt-2 px-3 text-xs text-white/50 hover:text-white/80"
      >
        Main app
      </Link>
    </>
  );
}

export { AppShell };
