"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  queueId: string;
  queueName: string;
};

export function QRCodeDisplay({ queueId, queueName }: Props) {
  const src = `/api/queues/${queueId}/qr`;
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-navy">{queueName}</p>
        <p className="text-xs text-muted">Customers scan this to join</p>
      </div>
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`QR code for ${queueName}`}
          className="size-56 rounded-xl border border-border bg-white p-3"
          onError={() => setError("Could not load QR code.")}
        />
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <a href={src} download={`${queueName}-qr.png`}>
          <Button variant="secondary">Download QR</Button>
        </a>
        <Button
          variant="ghost"
          onClick={() => {
            const w = window.open(src, "_blank");
            w?.focus();
            setTimeout(() => w?.print(), 400);
          }}
        >
          Print QR
        </Button>
      </div>
    </div>
  );
}
