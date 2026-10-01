import type { ElementType, ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "default" | "secondary" | "muted";
export type TextWeight = "normal" | "medium" | "semibold";

const sizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const tones: Record<TextTone, string> = {
  default: "text-foreground",
  secondary: "text-foreground-secondary",
  muted: "text-foreground-muted",
};

const weights: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

export type TextProps = {
  as?: "p" | "span" | "div" | "label" | "dt" | "dd";
  size?: TextSize;
  /**
   * secondary for supporting text; muted for details a reader can do
   * without, such as timestamps.
   */
  tone?: TextTone;
  weight?: TextWeight;
  /**
   * Cuts off text that does not fit on one line with an ellipsis.
   */
  truncate?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Body text in the app's type scale, so pages do not pick sizes and colours
 * themselves.
 */
export function Text({
  as = "p",
  size = "md",
  tone = "default",
  weight = "normal",
  truncate = false,
  className,
  children,
}: TextProps) {
  const Element: ElementType = as;

  return (
    <Element className={cn(sizes[size], tones[tone], weights[weight], truncate && "truncate", className)}>
      {children}
    </Element>
  );
}
