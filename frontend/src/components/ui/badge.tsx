import { cn } from "@/lib/utils/queue-progress";
import type { ReactNode } from "react";

type Tone =
  | "navy"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "sky";

const tones: Record<Tone, string> = {
  navy: "bg-navy/10 text-navy",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-[#b45309]",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-slate-200/80 text-slate-600",
  sky: "bg-accent-soft/15 text-accent-soft",
};

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
