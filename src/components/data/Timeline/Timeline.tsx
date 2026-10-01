import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { CheckIcon, MinusIcon, XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../../ui/Icon/Icon";
import { Spinner } from "../../ui/Spinner/Spinner";
import { VisuallyHidden } from "../../ui/VisuallyHidden/VisuallyHidden";

export type TimelineStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type TimelineStep = {
  id: string;
  title: ReactNode;
  status: TimelineStatus;
  /**
   * Beside the title, such as how long it took.
   */
  meta?: ReactNode;
  /**
   * Below the title, such as the error of a failed step.
   */
  children?: ReactNode;
};

export type TimelineProps = {
  /**
   * What the steps are of, such as "Scan steps".
   */
  label: string;
  steps: TimelineStep[];
  className?: string;
};

const statuses: Record<TimelineStatus, { label: string; icon?: PhosphorIcon; marker: string }> = {
  pending: { label: "Pending", marker: "border-border-strong bg-surface" },
  running: { label: "Running", marker: "border-info bg-info-soft text-info-soft-foreground" },
  completed: { label: "Completed", icon: CheckIcon, marker: "border-success bg-success text-success-foreground" },
  failed: { label: "Failed", icon: XIcon, marker: "border-error bg-error text-error-foreground" },
  skipped: { label: "Skipped", icon: MinusIcon, marker: "border-border-strong bg-surface-elevated text-foreground-muted" },
};

/**
 * Steps in order, each with its state, such as the steps of a scan.
 */
export function Timeline({ label, steps, className }: TimelineProps) {
  return (
    <ol aria-label={label} className={cn("flex flex-col", className)}>
      {steps.map((step, index) => {
        const status = statuses[step.status];
        const last = index === steps.length - 1;

        return (
          <li
            key={step.id}
            aria-current={step.status === "running" ? "step" : undefined}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {!last && <span aria-hidden className="absolute top-7 bottom-1 left-3 w-px -translate-x-1/2 bg-border" />}
            <span
              aria-hidden
              className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border-2", status.marker)}
            >
              {step.status === "running" ? (
                <Spinner size="xs" />
              ) : (
                status.icon && <Icon icon={status.icon} size="xs" weight="bold" />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "pending" || step.status === "skipped"
                      ? "text-foreground-secondary"
                      : "text-foreground",
                  )}
                >
                  {step.title}
                  <VisuallyHidden>{`: ${status.label}`}</VisuallyHidden>
                </p>
                {step.meta && <div className="text-xs text-foreground-secondary">{step.meta}</div>}
              </div>
              {step.children && <div className="text-sm text-foreground-secondary">{step.children}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
