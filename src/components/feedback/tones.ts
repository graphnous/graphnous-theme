import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export type Tone = "neutral" | "info" | "success" | "warning" | "error";

/**
 * The icon that goes with a tone, so messages look alike across the app.
 */
export const toneIcons: Record<Tone, PhosphorIcon> = {
  neutral: InfoIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: XCircleIcon,
};

/**
 * A soft surface with a border and text in the tone, for messages.
 */
export const toneSurfaces: Record<Tone, string> = {
  neutral: "border-border bg-surface-elevated text-foreground",
  info: "border-info/40 bg-info-soft text-info-soft-foreground",
  success: "border-success/40 bg-success-soft text-success-soft-foreground",
  warning: "border-warning/40 bg-warning-soft text-warning-soft-foreground",
  error: "border-error/40 bg-error-soft text-error-soft-foreground",
};

