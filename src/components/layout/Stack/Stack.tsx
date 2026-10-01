import type { ElementType, ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;

const gaps: Record<Gap, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
};

const aligns = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifies = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

type FlexProps = {
  as?: "div" | "section" | "ul" | "ol" | "li" | "header" | "footer" | "nav";
  gap?: Gap;
  align?: keyof typeof aligns;
  justify?: keyof typeof justifies;
  className?: string;
  children: ReactNode;
};

/**
 * Children below each other, with a gap from the spacing scale.
 */
export function Stack({ as = "div", gap = 4, align = "stretch", justify = "start", className, children }: FlexProps) {
  const Element: ElementType = as;

  return (
    <Element className={cn("flex flex-col", gaps[gap], aligns[align], justifies[justify], className)}>
      {children}
    </Element>
  );
}

export type InlineProps = FlexProps & {
  /**
   * Lets children move to a next line when they do not fit.
   */
  wrap?: boolean;
};

/**
 * Children next to each other, with a gap from the spacing scale.
 */
export function Inline({
  as = "div",
  gap = 2,
  align = "center",
  justify = "start",
  wrap = false,
  className,
  children,
}: InlineProps) {
  const Element: ElementType = as;

  return (
    <Element
      className={cn("flex flex-row", gaps[gap], aligns[align], justifies[justify], wrap && "flex-wrap", className)}
    >
      {children}
    </Element>
  );
}

export type StackProps = FlexProps;
