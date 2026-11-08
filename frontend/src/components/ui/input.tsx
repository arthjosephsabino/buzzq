import { cn } from "@/lib/utils/queue-progress";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: Props) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex w-full flex-col gap-1.5 text-left" htmlFor={inputId}>
      <span className="text-sm font-medium text-navy">{label}</span>
      <input
        id={inputId}
        className={cn(
          "rounded-xl border border-border bg-surface px-4 py-3 text-base text-navy outline-none transition-shadow placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/15",
          error && "border-danger focus:border-danger focus:ring-danger/15",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="text-sm text-danger">{error}</span>
      ) : hint ? (
        <span className="text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
