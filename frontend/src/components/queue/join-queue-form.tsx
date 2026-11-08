"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  queueId: string;
};

/**
 * Join flow uses POST /clients then POST /queue_entry.
 * Both currently require admin/personnel auth in the OpenAPI contract.
 * This form posts to a BFF route that uses the signed-in personnel session
 * when available; public anonymous join is documented as a backend gap.
 */
export function JoinQueueForm({ queueId }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId, name, phone }),
      });
      const data = (await res.json()) as {
        error?: string;
        queueEntryId?: string;
        backendGap?: boolean;
      };
      if (!res.ok) {
        setError(
          data.error ??
            "Unable to join this queue right now.",
        );
        return;
      }
      if (data.queueEntryId) {
        router.push(`/ticket/${data.queueEntryId}`);
      }
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
      <Input
        label="Your name"
        name="name"
        autoComplete="name"
        placeholder="Maria Santos"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="09XXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        hint="Used to identify your ticket — no account required."
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Joining…" : "Join queue"}
      </Button>
    </form>
  );
}
