"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../../../lib/cn";

import { Tooltip } from "../../feedback/Tooltip/Tooltip";

export type TruncateProps = {
  children: string;
  /**
   * Where it is cut off: end keeps the start, for names; start keeps the
   * end, for qualified names and paths, where the end says the most.
   */
  from?: "end" | "start";
  className?: string;
};

/**
 * Text on one line, cut off with an ellipsis when it does not fit; then the
 * full text shows in a tooltip, and the text can be focused to show it.
 */
export function Truncate({ children, from = "end", className }: TruncateProps) {
  const element = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const span = element.current;

    if (!span) {
      return;
    }

    const measure = () => setTruncated(span.scrollWidth > span.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(span);
    measure();

    return () => observer.disconnect();
  }, [children]);

  return (
    <Tooltip content={children} disabled={!truncated}>
      <span
        ref={element}
        tabIndex={truncated ? 0 : undefined}
        // Right to left puts the ellipsis at the start; bdi keeps the text
        // itself left to right
        dir={from === "start" ? "rtl" : undefined}
        className={cn("block min-w-0 truncate", from === "start" && "text-left", className)}
      >
        {from === "start" ? <bdi>{children}</bdi> : children}
      </span>
    </Tooltip>
  );
}
