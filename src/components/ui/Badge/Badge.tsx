import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

import { Icon } from "../Icon/Icon";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error";
export type BadgeVariant = "soft" | "solid";

const styles: Record<BadgeVariant, Record<BadgeTone, string>> = {
  soft: {
    neutral: "bg-neutral-soft text-neutral-soft-foreground",
    info: "bg-info-soft text-info-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    error: "bg-error-soft text-error-soft-foreground",
  },
  solid: {
    neutral: "bg-neutral text-neutral-foreground",
    info: "bg-info text-info-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    error: "bg-error text-error-foreground",
  },
};

export type BadgeProps = {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  icon?: PhosphorIcon;
  className?: string;
  children: ReactNode;
};

/**
 * A short label in one of the theme's tones, the base of every status the
 * app shows.
 */
export function Badge({ tone = "neutral", variant = "soft", icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-control px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[variant][tone],
        className,
      )}
    >
      {icon && <Icon icon={icon} size="xs" weight="bold" />}
      {children}
    </span>
  );
}
