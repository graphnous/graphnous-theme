"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowDownIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";
import { formatTime } from "../../../lib/format";

import { Button } from "../../ui/Button/Button";

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR";

export type LogLine = {
  /**
   * An ISO date-time.
   */
  timestamp?: string;
  level: LogLevel;
  message: string;
};

export type LogViewerProps = {
  lines: LogLine[];
  /**
   * What the logs are of, such as "Scan logs".
   */
  label: string;
  /**
   * The height of the viewer, as a CSS length.
   */
  height?: string;
  className?: string;
};

/**
 * The height of a line in pixels; every line is one, so only the lines in
 * view need to be in the page.
 */
const lineHeight = 20;

/**
 * Lines above and below the view that are in the page too, so fast
 * scrolling does not show gaps.
 */
const overscan = 20;

const levels: Record<LogLevel, { text: string; row?: string }> = {
  TRACE: { text: "text-foreground-muted" },
  DEBUG: { text: "text-foreground-muted" },
  INFO: { text: "text-info-soft-foreground" },
  WARN: { text: "text-warning-soft-foreground", row: "bg-warning-soft" },
  ERROR: { text: "text-error-soft-foreground", row: "bg-error-soft" },
};

/**
 * Log lines with their time and level, such as a scan's logs. Only the
 * lines in view are rendered, so it handles long logs. While scrolled to
 * the bottom it follows new lines; scrolling up stops that, and a button
 * goes back to the latest.
 */
export function LogViewer({ lines, label, height = "24rem", className }: LogViewerProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const [following, setFollowing] = useState(true);

  // Keeps the newest line in view while following
  useLayoutEffect(() => {
    const element = viewport.current;

    if (element && following) {
      element.scrollTop = element.scrollHeight;
    }
  }, [lines.length, following]);

  useLayoutEffect(() => {
    const element = viewport.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => setViewHeight(element.clientHeight));
    observer.observe(element);
    setViewHeight(element.clientHeight);

    return () => observer.disconnect();
  }, []);

  const first = Math.max(0, Math.floor(scrollTop / lineHeight) - overscan);
  const last = Math.min(lines.length, Math.ceil((scrollTop + viewHeight) / lineHeight) + overscan);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewport}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={(event) => {
          const element = event.currentTarget;
          setScrollTop(element.scrollTop);
          // At the bottom, give or take a pixel: follow new lines
          setFollowing(element.scrollHeight - element.scrollTop - element.clientHeight < lineHeight / 2);
        }}
        style={{ height }}
        className="overflow-auto rounded-card border border-border bg-surface font-mono text-xs"
      >
        {lines.length === 0 ? (
          <p className="p-3 font-sans text-sm text-foreground-muted">No logs yet</p>
        ) : (
          <div role="list" className="relative min-w-max" style={{ height: lines.length * lineHeight }}>
            {lines.slice(first, last).map((line, offset) => {
              const index = first + offset;
              const level = levels[line.level];

              return (
                <div
                  key={index}
                  role="listitem"
                  aria-posinset={index + 1}
                  aria-setsize={lines.length}
                  style={{ top: index * lineHeight, height: lineHeight, lineHeight: `${lineHeight}px` }}
                  className={cn("absolute inset-x-0 flex gap-3 px-3 whitespace-pre", level.row)}
                >
                  <span aria-hidden className="w-10 shrink-0 text-right text-foreground-secondary select-none">
                    {index + 1}
                  </span>
                  {line.timestamp && (
                    <time dateTime={line.timestamp} className="shrink-0 text-foreground-secondary">
                      {formatTime(new Date(line.timestamp))}
                    </time>
                  )}
                  <span className={cn("w-10 shrink-0 font-semibold", level.text)}>{line.level}</span>
                  <span className="text-foreground">{line.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {!following && (
        <Button
          size="sm"
          variant="secondary"
          icon={ArrowDownIcon}
          onClick={() => setFollowing(true)}
          className="absolute right-4 bottom-3 shadow-md"
        >
          Follow new lines
        </Button>
      )}
    </div>
  );
}
