import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Badge, type BadgeTone } from "../../ui/Badge/Badge";

export type StatusIndicatorProps = {
  tone: BadgeTone;
  children: ReactNode;
  /**
   * Shown instead of the dot, such as a check mark for completed.
   */
  icon?: PhosphorIcon;
  /**
   * For work in progress, such as a running scan: the dot pulses, unless
   * the reader prefers less motion.
   */
  active?: boolean;
  className?: string;
};

/**
 * A state, such as a scan's status: a Badge with a dot or an icon.
 */
export function StatusIndicator({ tone, children, icon, active = false, className }: StatusIndicatorProps) {
  if (icon) {
    return (
      <Badge tone={tone} icon={icon} className={className}>
        {children}
      </Badge>
    );
  }

  return (
    <Badge tone={tone} className={cn("gap-1.5", className)}>
      <span aria-hidden className="relative flex size-2">
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
        )}
        <span className="relative size-2 rounded-full bg-current" />
      </span>
      {children}
    </Badge>
  );
}
