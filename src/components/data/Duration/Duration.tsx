import { cn } from "../../../lib/cn";
import { formatDuration } from "../../../lib/format";

export type DurationProps = {
  start: Date | string | null | undefined;
  /**
   * Missing while it is still running.
   */
  end: Date | string | null | undefined;
  className?: string;
};

const toDate = (value: Date | string) => (typeof value === "string" ? new Date(value) : value);

/**
 * How long something took, such as "2 min 13 s", or "Still running" when it
 * has no end yet. Nothing is shown when it has not started.
 */
export function Duration({ start, end, className }: DurationProps) {
  if (!start) {
    return null;
  }

  if (!end) {
    return <span className={cn("text-foreground-secondary", className)}>Still running</span>;
  }

  const milliseconds = toDate(end).getTime() - toDate(start).getTime();

  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>{formatDuration(milliseconds)}</span>
  );
}
