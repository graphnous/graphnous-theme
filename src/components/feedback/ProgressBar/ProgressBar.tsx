import { useId } from "react";

import { cn } from "../../../lib/cn";

export type ProgressBarProps = {
  /**
   * What is progressing, such as "Uploading results"; required, as screen
   * readers announce it with the value.
   */
  label: string;
  /**
   * Leave it out while the progress is not known.
   */
  value?: number;
  max?: number;
  /**
   * Shows the percentage next to the label.
   */
  showValue?: boolean;
  tone?: "primary" | "success" | "error";
  className?: string;
};

const fills = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
} as const;

/**
 * How far something has come, such as an upload.
 */
export function ProgressBar({ label, value, max = 100, showValue = false, tone = "primary", className }: ProgressBarProps) {
  const labelId = useId();
  const known = value !== undefined;
  const percent = known ? Math.round((Math.min(Math.max(value, 0), max) / max) * 100) : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span id={labelId} className="text-foreground-secondary">
          {label}
        </span>
        {showValue && known && <span className="font-medium tabular-nums">{percent}%</span>}
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? value : undefined}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            fills[tone],
            !known && "w-1/3 animate-pulse motion-reduce:animate-none",
          )}
          style={known ? { width: `${percent}%` } : undefined}
        />
      </div>
    </div>
  );
}
