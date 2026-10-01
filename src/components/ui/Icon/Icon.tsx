import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";

import { cn } from "../../../lib/cn";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export type IconProps = {
  /**
   * A Phosphor icon; import it from "@phosphor-icons/react/ssr", which works
   * in server and client components.
   */
  icon: PhosphorIcon;
  size?: IconSize;
  weight?: IconWeight;
  /**
   * What the icon means, for screen readers. Leave it out for an icon next
   * to text that already says it.
   */
  label?: string;
  className?: string;
};

/**
 * A Phosphor icon in one of the app's sizes. It takes the colour of the
 * text around it, and is hidden from screen readers unless it has a label.
 */
export function Icon({ icon: Glyph, size = "md", weight = "regular", label, className }: IconProps) {
  return (
    <Glyph
      size={sizes[size]}
      weight={weight}
      className={cn("shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
