"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Staff-assisted add customer → POST /clients + POST /queue_entry */
export function AddCustomerForm({ queueId }: { queueId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId, name, phone }),
      });
      const data = (await res.json()) as {
        error?: string;
        ticketNumber?: string;
        queueEntryId?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not add customer.");
        return;
      }
      setSuccess(
        data.ticketNumber
          ? `Ticket ${data.ticketNumber} created.`
          : "Customer added.",
      );
      setName("");
      setPhone("");
      router.refresh();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
    >
      <h3 className="text-sm font-semibold text-navy">Add customer</h3>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add to queue"}
      </Button>
      <p className="text-xs text-muted">
        {/* TODO(backend): Call next / skip / complete / reorder — no mutation endpoints in OpenAPI yet */}
        Queue actions like Call next, Skip, and Complete are disabled until the API supports them.
      </p>
    </form>
  );
}
