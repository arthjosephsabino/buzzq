"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton({ redirectTo = "/login" }: { redirectTo?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-white/80 hover:bg-white/10 hover:text-white md:justify-start"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(redirectTo);
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
