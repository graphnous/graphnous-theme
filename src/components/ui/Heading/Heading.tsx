import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<HeadingSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl tracking-tight",
};

const defaultSizes: Record<HeadingLevel, HeadingSize> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
};

export type HeadingProps = {
  /**
   * The heading's place in the page's outline: h1 to h4.
   */
  level: HeadingLevel;
  /**
   * How large it looks, when that differs from what its level suggests.
   */
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
};

export function Heading({ level, size, className, children }: HeadingProps) {
  const Element = `h${level}` as const;

  return (
    <Element className={cn("font-semibold text-foreground", sizes[size ?? defaultSizes[level]], className)}>
      {children}
    </Element>
  );
}
