"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await res.json()) as { error?: string; id?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not create organization.");
      return;
    }
    setName("");
    router.refresh();
    if (data.id) router.push(`/organizations/${data.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Input
        label="Organization name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="sm:min-w-64"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create"}
      </Button>
      {error ? <p className="w-full text-sm text-danger">{error}</p> : null}
    </form>
  );
}

export function CreateQueueForm({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ticketPrefix, setTicketPrefix] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/queues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        ticket_prefix: ticketPrefix,
        organization_id: organizationId,
      }),
    });
    const data = (await res.json()) as { error?: string; id?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not create queue.");
      return;
    }
    setName("");
    setTicketPrefix("");
    router.refresh();
    if (data.id) router.push(`/queues/${data.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
      <Input
        label="Queue name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Ticket prefix"
        value={ticketPrefix}
        onChange={(e) => setTicketPrefix(e.target.value)}
        placeholder="A"
        required
      />
      <div className="flex items-end">
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Creating…" : "Create queue"}
        </Button>
      </div>
      {error ? <p className="sm:col-span-3 text-sm text-danger">{error}</p> : null}
    </form>
  );
}

export function CreatePersonnelForm({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"OWNER" | "STAFF">("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/personnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organization_id: organizationId,
        name,
        username,
        password,
        role,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not create personnel.");
      return;
    }
    setName("");
    setUsername("");
    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
        Role
        <select
          className="rounded-xl border border-border bg-surface px-4 py-3"
          value={role}
          onChange={(e) => setRole(e.target.value as "OWNER" | "STAFF")}
        >
          <option value="STAFF">STAFF</option>
          <option value="OWNER">OWNER</option>
        </select>
      </label>
      {error ? <p className="sm:col-span-2 text-sm text-danger">{error}</p> : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Add personnel"}
        </Button>
      </div>
    </form>
  );
}

export function CreateAdminForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not create admin.");
      return;
    }
    setUsername("");
    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-lg gap-3 sm:grid-cols-2">
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error ? <p className="sm:col-span-2 text-sm text-danger">{error}</p> : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create admin"}
        </Button>
      </div>
    </form>
  );
}
