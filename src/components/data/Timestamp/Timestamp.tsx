"use client";

import { useEffect, useState } from "react";

import { cn } from "../../../lib/cn";
import { formatDateTime, formatRelative } from "../../../lib/format";

import { Tooltip } from "../../feedback/Tooltip/Tooltip";

export type TimestampProps = {
  /**
   * A Date or an ISO date-time from the API; nothing is shown when it is
   * null or missing.
   */
  value: Date | string | null | undefined;
  className?: string;
};

/**
 * How long ago something happened, such as "5 minutes ago", with the exact
 * time in a tooltip. Stays up to date while the page is open.
 */
export function Timestamp({ value, className }: TimestampProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  if (value === null || value === undefined) {
    return null;
  }

  const date = typeof value === "string" ? new Date(value) : value;

  return (
    <Tooltip content={formatDateTime(date)}>
      <time
        dateTime={date.toISOString()}
        tabIndex={0}
        // The relative time on the server and in the browser can differ
        suppressHydrationWarning
        className={cn("whitespace-nowrap underline decoration-dotted decoration-foreground-muted underline-offset-4", className)}
      >
        {formatRelative(date, now)}
      </time>
    </Tooltip>
  );
}
