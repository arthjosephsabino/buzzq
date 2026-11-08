import { cn } from "@/lib/utils/queue-progress";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "md" | "lg";
};

export function Card({ children, className, padding = "lg" }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface",
        padding === "lg" ? "p-6 sm:p-8" : "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
